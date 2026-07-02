import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Banknote, MapPin, Search, Briefcase, Bookmark, BookmarkCheck, ExternalLink, Clock, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import toast from "react-hot-toast";
import { hostUrl } from "../api/api";
import { useLocation } from "react-router-dom";

const AllJobs = () => {
  const { job, user } = useAuth();
  const locationParam = useLocation();
  
  // Read query params from home search
  const query = new URLSearchParams(locationParam.search);
  const queryKeyword = query.get("keyword") || "";
  const queryLocation = query.get("location") || "";

  const [filters, setFilters] = useState({
    keyword: queryKeyword,
    workType: "",
    location: queryLocation,
  });

  // Keep filters sync'd if query parameters change
  useEffect(() => {
    setFilters({
      keyword: queryKeyword,
      workType: "",
      location: queryLocation,
    });
  }, [queryKeyword, queryLocation]);
  
  const [savedJobs, setSavedJobs] = useState(user?.savedJobs || []);
  const token = localStorage.getItem("token");

  // Sync saved jobs if user context updates
  useEffect(() => {
    if (user?.savedJobs) {
      setSavedJobs(user.savedJobs);
    }
  }, [user]);

  const filteredJobs = job?.filter(j => {
    return (
      (filters.workType === "" || j.workType === filters.workType) &&
      (filters.location === "" || j.workLocation.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.keyword === "" || 
        j.position.toLowerCase().includes(filters.keyword.toLowerCase()) || 
        j.company.toLowerCase().includes(filters.keyword.toLowerCase())
      )
    );
  }) || [];

  const handleSaveJob = async (jobId) => {
    if (!token) {
      toast.error("Please login to save jobs");
      return;
    }
    try {
      const { data } = await axios.post(`${hostUrl}/save-job`, { jobId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobs(data.savedJobs);
      if (data.savedJobs.includes(jobId)) {
         toast.success("Job saved successfully!");
      } else {
         toast.success("Job removed from saved list");
      }
      
      // Update local storage user data to keep it sync'd
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        u.savedJobs = data.savedJobs;
        localStorage.setItem("user", JSON.stringify(u));
      }
    } catch (error) {
      toast.error("Failed to update saved jobs");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-orange-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header section */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Find your next role</h1>
          <p className="text-neutral-400 text-sm">Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4">
            <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-850 shadow-2xl sticky top-28 text-left">
              <h2 className="text-lg font-semibold text-white mb-6">Filters</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3.5 text-neutral-500 w-4 h-4" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-white focus:bg-neutral-900 focus:border-orange-500 outline-none transition-all text-sm placeholder:text-neutral-600"
                      placeholder="Title or company"
                      value={filters.keyword}
                      onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-neutral-500 w-4 h-4" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-white focus:bg-neutral-900 focus:border-orange-500 outline-none transition-all text-sm placeholder:text-neutral-600"
                      placeholder="City or 'Remote'"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Work Type</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3.5 text-neutral-500 w-4 h-4" />
                    <select
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-white focus:bg-neutral-900 focus:border-orange-500 outline-none transition-all text-sm appearance-none"
                      value={filters.workType}
                      onChange={(e) => setFilters({ ...filters, workType: e.target.value })}
                    >
                      <option value="">All Types</option>
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="internship">Internship</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={() => setFilters({ keyword: "", workType: "", location: "" })}
                  className="w-full py-3 text-sm font-semibold text-neutral-400 bg-neutral-900 hover:bg-neutral-850 hover:text-white border border-neutral-800 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw size={13} />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="w-full lg:w-3/4">
            {!job ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-550 rounded-full animate-spin"></div>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {filteredJobs.map((item, index) => {
                    const isSaved = savedJobs.includes(item._id);
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        key={item._id}
                        className="bg-neutral-950 rounded-3xl p-6 border border-neutral-850 shadow-2xl hover:border-orange-500/30 transition-all group flex flex-col justify-between text-left"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-black border border-neutral-850 flex items-center justify-center text-xl font-bold text-orange-400 group-hover:scale-105 transition-transform">
                                {item.company.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-white group-hover:text-orange-400 transition-colors line-clamp-1">{item.position}</h3>
                                <p className="text-neutral-400 text-sm">{item.company}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleSaveJob(item._id)}
                              className={`p-2 rounded-full border border-neutral-850 hover:bg-neutral-900 transition-all ${isSaved ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'text-neutral-500 hover:text-white'}`}
                            >
                              {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 text-neutral-300 rounded-lg text-[11px] font-medium flex items-center gap-1.5 capitalize">
                              <Briefcase size={12} /> {item.workType}
                            </span>
                            <span className="px-3 py-1 bg-white/5 border border-white/10 text-neutral-300 rounded-lg text-[11px] font-medium flex items-center gap-1.5">
                              <MapPin size={12} /> {item.workLocation}
                            </span>
                            {item.salary?.disclosed && (
                              <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg text-[11px] font-medium flex items-center gap-1.5">
                                <Banknote size={12} /> ₹{item.salary.min} - ₹{item.salary.max}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-neutral-900">
                          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <Clock size={12} />
                            <span>Posted recently</span>
                          </div>
                          <a 
                            href={item.applyLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white hover:bg-neutral-100 text-black px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                          >
                            Apply Now
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-neutral-950 rounded-3xl p-12 border border-neutral-850 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-500 mb-4">
                  <Search size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No jobs found</h3>
                <p className="text-neutral-400 max-w-sm text-sm">We couldn't find any jobs matching your current filters. Try adjusting your search criteria.</p>
                <button 
                  onClick={() => setFilters({ keyword: "", workType: "", location: "" })}
                  className="mt-6 text-orange-400 font-semibold hover:text-orange-300 text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllJobs;
