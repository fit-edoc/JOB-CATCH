import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Building, MapPin, Briefcase, IndianRupee, Clock, ExternalLink } from "lucide-react";

const SingleJob = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://job-catch.onrender.com';
        const res = await axios.get(`${apiBase}/api/job/getjob/${id}`);
        if (res.data.success) {
          setJob(res.data.job);
        }
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-[#00a151]/20 border-t-[#00a151] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">Job not found</h2>
          <Link to="/alljobs" className="text-xs font-medium text-[#00a151] hover:underline">Return to listings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 relative text-slate-900 text-left">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Link to="/alljobs" className="inline-flex items-center text-xs font-medium text-[#00a151] hover:text-[#008c46] transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to jobs
        </Link>
        
        <div className="bg-white rounded-[8px] border border-slate-200 p-6 md:p-8 shadow-sm mb-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-[6px] bg-[#e6f6ee] border border-[#00a151]/20 flex items-center justify-center text-xl font-semibold text-[#00a151] shrink-0 uppercase">
                {job.company.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-950 mb-1 tracking-[-0.02em]">{job.position}</h1>
                <h2 className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mb-3">
                  <Building size={14} className="text-slate-400" /> {job.company}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-[2px] text-xs font-medium flex items-center gap-1.5">
                    <Briefcase size={11} /> {job.workType}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-[2px] text-xs font-medium flex items-center gap-1.5">
                    <MapPin size={11} /> {job.workLocation}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-[2px] text-xs font-medium flex items-center gap-1.5">
                    <Clock size={11} /> {job.experience || "Not specified"}
                  </span>
                  {job.salary?.disclosed && (
                    <span className="px-2 py-0.5 bg-[#e6f6ee] border border-[#00a151]/20 text-[#00a151] rounded-[2px] text-xs font-medium flex items-center gap-1">
                      <IndianRupee size={11} /> ₹{job.salary.min} - ₹{job.salary.max}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <a 
              href={job.applyLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#00a151] hover:bg-[#008c46] text-white px-5 py-2.5 rounded-[4px] font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
            >
              Apply Now
              <ExternalLink size={13} />
            </a>
          </div>

          {job.scamAnalysis?.isScam && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-[6px] flex gap-3 items-start shadow-xs">
              <span className="text-lg leading-none">⚠️</span>
              <div>
                <p className="font-semibold uppercase tracking-wider text-[11px] mb-0.5">AI Scam Warning ({job.scamAnalysis.score}% risk)</p>
                <p className="text-xs">{job.scamAnalysis.reason}</p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {job.description && (
              <section className="space-y-3">
                <h3 className="text-base font-semibold text-slate-950 tracking-[-0.02em]">About the Role</h3>
                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </div>
              </section>
            )}

            {job.skills && job.skills.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-base font-semibold text-slate-950 tracking-[-0.02em]">Required Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-[2px] text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {job.jobField && (
              <section className="space-y-1">
                <h3 className="text-base font-semibold text-slate-950 tracking-[-0.02em]">Job Category</h3>
                <p className="text-slate-600 text-xs font-medium">{job.jobField}</p>
              </section>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SingleJob;
