import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Briefcase, Bookmark, User, Settings, ExternalLink, Activity, PlusCircle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { hostUrl } from '../api/api';

const Dashboard = () => {
  const { user, job } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (token && user?.role === 'seeker') {
        try {
          const res = await axios.get(`${hostUrl}/saved-jobs`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSavedJobs(res.data.savedJobs || []);
        } catch (error) {
          console.error("Error fetching saved jobs", error);
        }
      }
    };
    fetchSavedJobs();
  }, [token, user]);

  const userPostedJobs = job?.filter(j => j.createdBy === user?._id) || [];

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-orange-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-neutral-950 rounded-3xl p-6 border border-neutral-850 shadow-2xl sticky top-28">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-display font-bold text-4xl mb-4 uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <h2 className="text-xl font-bold text-white">{user?.name} {user?.lastname}</h2>
                <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider mt-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full">
                  {user?.role === 'employer' ? 'HR / Employer' : 'Job Seeker'}
                </p>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60 border border-transparent'}`}
                >
                  <Activity size={18} /> Overview
                </button>
                {user?.role === 'seeker' && (
                  <button 
                    onClick={() => setActiveTab('saved')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'saved' ? 'bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60 border border-transparent'}`}
                  >
                    <Bookmark size={18} /> Saved Jobs
                  </button>
                )}
                {user?.role === 'employer' && (
                  <button 
                    onClick={() => setActiveTab('posted')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'posted' ? 'bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60 border border-transparent'}`}
                  >
                    <Briefcase size={18} /> Posted Jobs
                  </button>
                )}
                <Link to="/profile" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900/60 border border-transparent transition-all">
                  <User size={18} /> Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {user?.role === 'employer' ? (
                    <>
                      <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 shadow-2xl flex items-center gap-4 hover:border-neutral-800 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                          <Briefcase size={24} />
                        </div>
                        <div>
                          <p className="text-neutral-450 text-sm font-semibold">Active Jobs Posted</p>
                          <h3 className="text-2xl font-bold text-white mt-0.5">{userPostedJobs.length}</h3>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 shadow-2xl flex items-center gap-4 hover:border-neutral-800 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                          <Bookmark size={24} />
                        </div>
                        <div>
                          <p className="text-neutral-455 text-sm font-semibold">Saved Jobs</p>
                          <h3 className="text-2xl font-bold text-white mt-0.5">{savedJobs.length}</h3>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'saved' && user?.role === 'seeker' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h1 className="text-2xl font-bold text-white mb-6">Saved Jobs</h1>
                {savedJobs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {savedJobs.map(job => (
                      <div key={job._id} className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-neutral-800 hover:shadow-xl transition-all group">
                        <div>
                          <h3 className="font-semibold text-lg text-white group-hover:text-orange-450 transition-colors">{job.position}</h3>
                          <p className="text-neutral-400 text-sm mt-0.5">{job.company}</p>
                        </div>
                        <a 
                          href={job.applyLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-white hover:bg-neutral-100 text-black px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                        >
                          Apply Now <ExternalLink size={12} />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-neutral-950 rounded-2xl p-12 border border-neutral-850 text-center">
                    <Bookmark size={48} className="mx-auto text-neutral-700 mb-4" />
                    <h3 className="text-lg font-semibold text-white">No saved jobs yet</h3>
                    <p className="text-neutral-400 mb-6 text-sm">Jobs you save will appear here.</p>
                    <Link to="/alljobs" className="text-orange-405 font-medium hover:underline text-sm">Browse Jobs</Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'posted' && user?.role === 'employer' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-white">Your Posted Jobs</h1>
                  <Link 
                    to="/postjob" 
                    className="bg-white hover:bg-neutral-100 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-md active:scale-95"
                  >
                    <PlusCircle size={13} />
                    Post New
                  </Link>
                </div>
                {userPostedJobs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {userPostedJobs.map(job => (
                      <div key={job._id} className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-neutral-800 transition-all">
                        <div>
                          <h3 className="font-semibold text-lg text-white">{job.position}</h3>
                          <div className="flex gap-4 mt-2 items-center">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-md capitalize flex items-center gap-1">
                              <Clock size={10} />
                              {job.status}
                            </span>
                            <span className="text-xs text-neutral-400 flex items-center gap-1">{job.workLocation}</span>
                          </div>
                        </div>
                        <button className="text-neutral-500 hover:text-white p-2 rounded-lg hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all">
                          <Settings size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-neutral-950 rounded-2xl p-12 border border-neutral-850 text-center">
                    <Briefcase size={48} className="mx-auto text-neutral-700 mb-4" />
                    <h3 className="text-lg font-semibold text-white">No jobs posted</h3>
                    <p className="text-neutral-400 mb-6 text-sm">Start growing your team by posting a job.</p>
                    <Link to="/postjob" className="bg-white hover:bg-neutral-100 text-black px-6 py-3 rounded-xl font-bold transition-all text-sm shadow-lg">Post a Job</Link>
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
