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
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800">Job not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 relative overflow-hidden text-slate-900">
      {/* Background glow */}
      <div className="absolute top-[5%] right-[-5%] w-[600px] h-[600px] rounded-full bg-purple-100/30 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-5%] w-[600px] h-[600px] rounded-full bg-fuchsia-100/30 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Link to="/alljobs" className="inline-flex items-center text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to jobs
        </Link>
        
        <div className="bg-white rounded-3xl border border-slate-200/80 p-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),_0_8px_24px_rgba(0,0,0,0.04)] mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
            <div className="flex gap-6">
              <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-3xl font-bold text-slate-800 shrink-0">
                {job.company.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display">{job.position}</h1>
                <h2 className="text-xl text-purple-700 font-semibold flex items-center gap-2 mb-4">
                  <Building size={20} /> {job.company}
                </h2>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1.5 bg-slate-50 border border-slate-200/50 text-slate-655 rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <Briefcase size={14} /> {job.workType}
                  </span>
                  <span className="px-3 py-1.5 bg-slate-50 border border-slate-200/50 text-slate-655 rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <MapPin size={14} /> {job.workLocation}
                  </span>
                  <span className="px-3 py-1.5 bg-slate-50 border border-slate-200/50 text-slate-655 rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <Clock size={14} /> {job.experience || "Not specified"}
                  </span>
                  {job.salary?.disclosed && (
                    <span className="px-3 py-1.5 bg-purple-50 border border-purple-100 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1.5">
                      <IndianRupee size={14} /> ₹{job.salary.min} - ₹{job.salary.max}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <a 
              href={job.applyLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-sm shrink-0 hover:-translate-y-0.5"
            >
              Apply Now
              <ExternalLink size={16} />
            </a>
          </div>

          {job.scamAnalysis?.isScam && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex gap-3 items-start shadow-sm">
              <span className="text-xl leading-none">⚠️</span>
              <div>
                <p className="font-bold uppercase tracking-wider text-xs mb-1">AI Scam Warning ({job.scamAnalysis.score}% risk)</p>
                <p className="text-sm font-medium">{job.scamAnalysis.reason}</p>
              </div>
            </div>
          )}

          <div className="space-y-10">
            {job.description && (
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-display">About the Role</h3>
                <div className="text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap">
                  {job.description}
                </div>
              </section>
            )}

            {job.skills && job.skills.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-display">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {job.jobField && (
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-display">Job Category</h3>
                <p className="text-slate-600 font-medium">{job.jobField}</p>
              </section>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SingleJob;
