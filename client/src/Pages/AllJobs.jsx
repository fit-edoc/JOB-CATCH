import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Banknote, MapPin, Search, Briefcase, Bookmark, BookmarkCheck, ExternalLink, Clock, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import toast from "react-hot-toast";
import { hostUrl } from "../api/api";
import { useLocation } from "react-router-dom";

// Memoized JobCard Component to avoid rendering all cards on keyword filter input keystrokes
const JobCard = React.memo(({ item, index, isSaved, isApplied, user, handleSaveJob, handleQuickApply }) => {
  const isVerifiedHR = item.createdBy?.recruiterVerification?.isVerified;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),_0_4px_16px_rgba(0,0,0,0.03)] hover:border-emerald-500/30 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),_0_8px_24px_rgba(0,0,0,0.05)] transition-all group flex flex-col justify-between text-left"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-xl font-bold text-slate-800 group-hover:scale-105 transition-transform shrink-0">
              {item.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{item.position}</h3>
              <p className="text-slate-655 text-sm flex items-center gap-1.5 flex-wrap">
                {item.company}
                {isVerifiedHR && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-150 text-[9px] font-bold uppercase tracking-wider shrink-0" title="Verified HR Recruiter">
                    Verified HR
                  </span>
                )}
              </p>
            </div>
          </div>
          <button 
            onClick={() => handleSaveJob(item._id)}
            className={`p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition-all ${isSaved ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'text-slate-400 hover:text-slate-900'}`}
          >
            {isSaved ? <BookmarkCheck size={20} className="text-emerald-600" /> : <Bookmark size={20} />}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-slate-50 border border-slate-200/50 text-slate-655 rounded-lg text-[11px] font-medium flex items-center gap-1.5 capitalize">
            <Briefcase size={12} /> {item.workType}
          </span>
          <span className="px-3 py-1 bg-slate-50 border border-slate-200/50 text-slate-655 rounded-lg text-[11px] font-medium flex items-center gap-1.5">
            <MapPin size={12} /> {item.workLocation}
          </span>
          {item.salary?.disclosed && (
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-[11px] font-medium flex items-center gap-1.5">
              <Banknote size={12} /> ₹{item.salary.min} - ₹{item.salary.max}
            </span>
          )}
        </div>

        {item.scamAnalysis?.isScam && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-655 rounded-xl text-[10px] leading-relaxed flex gap-2">
            <span className="shrink-0 text-xs">⚠️</span>
            <div>
              <p className="font-bold uppercase tracking-wider">AI Scam Warning ({item.scamAnalysis.score}% risk)</p>
              <p className="text-slate-600 mt-0.5">{item.scamAnalysis.reason}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-150/60">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock size={12} />
          <span>Posted recently</span>
        </div>
        <div className="flex gap-2">
          {user?.role === "seeker" && (
            <button
              onClick={() => {
                const refLink = `${window.location.origin}/alljobs?refJobId=${item._id}&referredBy=${user._id}`;
                navigator.clipboard.writeText(refLink);
                toast.success("Referral link copied to clipboard! Share it with your friends.");
              }}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95 shrink-0"
            >
              🔗 Refer
            </button>
          )}
          {user?.role === "seeker" && (
            isApplied ? (
              <button
                disabled
                className="bg-slate-100 text-slate-400 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-not-allowed border border-slate-200"
              >
                Applied
              </button>
            ) : (
              <button
                onClick={() => handleQuickApply(item._id)}
                className="bg-gradient-to-r from-emerald-600 to-[#316c50] hover:from-emerald-700 hover:to-[#224b37] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                Quick Apply
              </button>
            )
          )}
          <a 
            href={item.applyLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 border border-transparent"
          >
            Apply Now
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  );
});
  

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
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const token = localStorage.getItem("token");

  // Sync saved jobs if user context updates
  useEffect(() => {
    if (user?.savedJobs) {
      setSavedJobs(user.savedJobs);
    }
  }, [user]);

  // Fetch applied jobs to check application status
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (token && user?.role === 'seeker') {
        try {
          const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://job-catch.onrender.com';
          const res = await axios.get(`${apiBase}/api/application/my-applications`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success) {
            setAppliedJobIds(res.data.applications.map(app => app.jobId?._id || app.jobId));
          }
        } catch (error) {
          console.error("Error fetching applied jobs", error);
        }
      }
    };
    fetchAppliedJobs();
  }, [token, user]);

  const handleQuickApply = useCallback(async (jobId) => {
    if (!token) {
      toast.error("Please login to apply");
      return;
    }
    const applyPromise = new Promise(async (resolve, reject) => {
      try {
        const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://job-catch.onrender.com';
        const queryParams = new URLSearchParams(locationParam.search);
        const refJob = queryParams.get("refJobId");
        const refBy = queryParams.get("referredBy");
        const postData = { jobId };
        if (refJob === jobId && refBy) {
          postData.referredBy = refBy;
        }

        const res = await axios.post(`${apiBase}/api/application/apply`, postData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setAppliedJobIds(prev => [...prev, jobId]);
          resolve(res.data.message || "Applied successfully!");
        } else {
          reject(res.data.message || "Failed to apply");
        }
      } catch (err) {
        reject(err.response?.data?.message || "Something went wrong while applying");
      }
    });

    toast.promise(applyPromise, {
      loading: "Analyzing your profile and matching...",
      success: (msg) => msg,
      error: (err) => err
    });
  }, [token, locationParam.search]);

  const filteredJobs = useMemo(() => {
    return job?.filter(j => {
      return (
        (filters.workType === "" || j.workType === filters.workType) &&
        (filters.location === "" || j.workLocation.toLowerCase().includes(filters.location.toLowerCase())) &&
        (filters.keyword === "" || 
          j.position.toLowerCase().includes(filters.keyword.toLowerCase()) || 
          j.company.toLowerCase().includes(filters.keyword.toLowerCase())
        )
      );
    }) || [];
  }, [job, filters]);

  const handleSaveJob = useCallback(async (jobId) => {
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
  }, [token]);
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-emerald-50/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header section */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-tall font-bold text-slate-900 mb-2 uppercase tracking-wider">Find your next role</h1>
          <p className="text-slate-500 text-sm">Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),_0_2px_12px_rgba(0,0,0,0.03)] sticky top-28 text-left">
              <h2 className="text-xs font-bold font-tall text-slate-500 uppercase tracking-widest mb-6">Filters</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all text-sm placeholder:text-slate-400"
                      placeholder="Title or company"
                      value={filters.keyword}
                      onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all text-sm placeholder:text-slate-400"
                      placeholder="City or 'Remote'"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Work Type</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                    <select
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all text-sm appearance-none"
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
                  className="w-full py-3 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 rounded-xl transition-all flex items-center justify-center gap-1.5"
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
                <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {filteredJobs.map((item, index) => (
                    <JobCard
                      key={item._id}
                      item={item}
                      index={index}
                      isSaved={savedJobs.includes(item._id)}
                      isApplied={appliedJobIds.includes(item._id)}
                      user={user}
                      handleSaveJob={handleSaveJob}
                      handleQuickApply={handleQuickApply}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center flex flex-col items-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),_0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <Search size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No jobs found</h3>
                <p className="text-slate-500 max-w-sm text-sm">We couldn't find any jobs matching your current filters. Try adjusting your search criteria.</p>
                <button 
                  onClick={() => setFilters({ keyword: "", workType: "", location: "" })}
                  className="mt-6 text-emerald-600 font-semibold hover:text-emerald-700 text-sm"
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
