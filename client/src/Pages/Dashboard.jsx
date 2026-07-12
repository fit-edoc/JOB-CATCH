import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Briefcase, Bookmark, User, Settings, ExternalLink, Activity, PlusCircle, CheckCircle, Clock, ArrowLeft, Sparkles, MessageSquare, Check, X, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { hostUrl } from '../api/api';

const InterviewSimulator = () => {
  const [role, setRole] = useState("Frontend Developer");
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [answers, setAnswers] = useState({});
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const startInterview = async () => {
    setLoadingQuestions(true);
    setQuestions([]);
    setAnswers({});
    setEvaluationResult(null);
    try {
      const response = await axios.post(`${hostUrl}/ai-interview/start`, { role }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.data.success) {
        setQuestions(response.data.questions);
      } else {
        toast.error("Failed to fetch questions");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error starting interview");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const submitInterview = async () => {
    const unanswered = questions.some((_, idx) => !answers[idx]?.trim());
    if (unanswered) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    setEvaluating(true);
    const answersPayload = questions.map((q, idx) => ({
      question: q,
      answer: answers[idx]
    }));

    try {
      const response = await axios.post(`${hostUrl}/ai-interview/evaluate`, { role, answers: answersPayload }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.data.success) {
        setEvaluationResult(response.data.evaluation);
        toast.success("AI interview evaluation completed!");
      } else {
        toast.error("Evaluation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error evaluating interview");
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
      {!questions.length && !evaluationResult && (
        <div className="space-y-4 max-w-md">
          <p className="text-slate-650 text-sm">Practice technical & behavioral interviews with our real-time AI Interviewer. Choose your target role to begin:</p>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Target Job Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm outline-none focus:border-orange-500"
            >
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Mobile Developer">Mobile Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Product Manager">Product Manager</option>
            </select>
          </div>
          <button
            onClick={startInterview}
            disabled={loadingQuestions}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 text-sm"
          >
            {loadingQuestions ? 'Preparing Interview...' : '⚡ Start Mock Interview'}
          </button>
        </div>
      )}

      {loadingQuestions && (
        <div className="py-12 text-center text-sm text-slate-500">
          Generating custom AI questions for {role} role... please wait.
        </div>
      )}

      {questions.length > 0 && !evaluationResult && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-850 text-sm">AI Questions for {role}</h3>
            <button onClick={() => setQuestions([])} className="text-xs text-slate-400 hover:text-slate-600">Reset</button>
          </div>
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={idx} className="space-y-2">
                <p className="font-semibold text-xs text-slate-800">Q{idx + 1}: {q}</p>
                <textarea
                  placeholder="Type your detailed answer here..."
                  rows="3"
                  value={answers[idx] || ""}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 outline-none focus:border-orange-500 text-xs font-sans resize-none"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={submitInterview}
              disabled={evaluating}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm text-xs flex items-center gap-1.5"
            >
              {evaluating ? 'Analyzing Answers...' : 'Submit Answers for AI Evaluation'}
            </button>
          </div>
        </div>
      )}

      {evaluationResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-855 text-sm">AI Interview Feedback ({role})</h3>
            <button onClick={() => { setQuestions([]); setEvaluationResult(null); }} className="text-xs text-orange-600 hover:underline">Start New Test</button>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-extrabold text-2xl">
              {evaluationResult.score}%
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Evaluation Score</p>
              <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{evaluationResult.feedback}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-green-700 block mb-2 flex items-center gap-1">🎉 Key Strengths</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {evaluationResult.strengths?.map((str, i) => <li key={i}>{str}</li>) || <li>Good clarity.</li>}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-red-650 block mb-2 flex items-center gap-1">💡 Areas of Improvement</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {evaluationResult.weaknesses?.map((wk, i) => <li key={i}>{wk}</li>) || <li>Add more concrete technical details.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user, job, deleteJob } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]); // Seeker applications
  const [selectedJob, setSelectedJob] = useState(null); // Recruiter selected job
  const [applicants, setApplicants] = useState([]); // Recruiter applicants for selected job
  const [activeTab, setActiveTab] = useState('overview');
  const [compareCandidates, setCompareCandidates] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [playingVideoUrl, setPlayingVideoUrl] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleResumeSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    setSearching(true);
    setSearchResults([]);
    try {
      const response = await axios.post(`${hostUrl}/recruiter/resume-search`, { query: searchQuery }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSearchResults(response.data.results);
        toast.success(`Found ${response.data.results.length} matching candidates!`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error searching resumes");
    } finally {
      setSearching(false);
    }
  };
  const token = localStorage.getItem("token");

  const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://job-catch.onrender.com';

  const [myReferrals, setMyReferrals] = useState([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (token && user?.role === 'seeker') {
        try {
          const res = await axios.get(`${hostUrl}/my-referrals`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMyReferrals(res.data.referrals || []);
        } catch (error) {
          console.error("Error fetching referrals", error);
        }
      }
    };
    fetchReferrals();
  }, [token, user, activeTab]);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTargetCandidate, setEmailTargetCandidate] = useState(null);
  const [selectedEmailType, setSelectedEmailType] = useState("Interview Invitation");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [generatingEmail, setGeneratingEmail] = useState(false);

  const handleGenerateEmail = async () => {
    if (!emailTargetCandidate) return;
    setGeneratingEmail(true);
    setGeneratedEmail("");
    try {
      const res = await axios.post(`${hostUrl}/recruiter/generate-email`, {
        candidateName: `${emailTargetCandidate.candidateId?.name || ''} ${emailTargetCandidate.candidateId?.lastname || ''}`,
        position: selectedJob?.position,
        company: selectedJob?.company,
        emailType: selectedEmailType,
        matchScore: emailTargetCandidate.matchScore
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setGeneratedEmail(res.data.emailTemplate);
        toast.success("AI email generated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate email template using AI");
    } finally {
      setGeneratingEmail(false);
    }
  };

  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [salaryTargetJob, setSalaryTargetJob] = useState(null);
  const [salaryAnalysisData, setSalaryAnalysisData] = useState(null);
  const [loadingSalaryAnalysis, setLoadingSalaryAnalysis] = useState(false);

  const handleFetchSalaryAnalysis = async (jobRecord) => {
    setSalaryTargetJob(jobRecord);
    setLoadingSalaryAnalysis(true);
    setSalaryAnalysisData(null);
    setIsSalaryModalOpen(true);
    try {
      const res = await axios.post(`${apiBase}/api/job/salary-intelligence`, {
        position: jobRecord.position,
        workLocation: jobRecord.workLocation,
        workType: jobRecord.workType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setSalaryAnalysisData(res.data.analysis);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load salary market intelligence");
    } finally {
      setLoadingSalaryAnalysis(false);
    }
  };

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
    
    const fetchSeekerApplications = async () => {
      if (token && user?.role === 'seeker') {
        try {
          const res = await axios.get(`${apiBase}/api/application/my-applications`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success) {
            setApplications(res.data.applications || []);
          }
        } catch (error) {
          console.error("Error fetching applications", error);
        }
      }
    };

    fetchSavedJobs();
    fetchSeekerApplications();
  }, [token, user]);

  const fetchApplicants = async (jobId) => {
    try {
      const res = await axios.get(`${apiBase}/api/application/job-applicants/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setApplicants(res.data.applications || []);
      }
    } catch (error) {
      console.error("Error fetching applicants", error);
      toast.error("Failed to load applicants");
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await axios.patch(`${apiBase}/api/application/status/${appId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success(`Candidate status updated to ${newStatus}`);
        setApplicants(prev => prev.map(app => app._id === appId ? { ...app, status: newStatus } : app));
      }
    } catch (error) {
      console.error("Error updating status", error);
      toast.error("Failed to update candidate status");
    }
  };

  const userPostedJobs = job?.filter(j => {
    const creatorId = j.createdBy?._id || j.createdBy;
    return creatorId === user?._id;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-orange-100/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md sticky top-28">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-display font-bold text-4xl mb-4 uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{user?.name} {user?.lastname}</h2>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1 px-2.5 py-1 bg-slate-100 border border-slate-200/50 rounded-full">
                  {user?.role === 'employer' ? 'HR / Employer' : 'Job Seeker'}
                </p>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-orange-550/10 text-orange-600 font-semibold border border-orange-100' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-transparent'}`}
                >
                  <Activity size={18} /> Overview
                </button>
                {user?.role === 'seeker' && (
                  <>
                    <button 
                      onClick={() => setActiveTab('saved')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'saved' ? 'bg-orange-550/10 text-orange-600 font-semibold border border-orange-100' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-transparent'}`}
                    >
                      <Bookmark size={18} /> Saved Jobs
                    </button>
                    <button 
                      onClick={() => setActiveTab('applications')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'applications' ? 'bg-orange-555/10 text-orange-600 font-semibold border border-orange-100' : 'text-slate-600 hover:text-slate-955 hover:bg-slate-100 border border-transparent'}`}
                    >
                      <Briefcase size={18} /> My Applications
                    </button>
                    <button 
                      onClick={() => setActiveTab('interview')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'interview' ? 'bg-orange-555/10 text-orange-600 font-semibold border border-orange-100' : 'text-slate-600 hover:text-slate-955 hover:bg-slate-100 border border-transparent'}`}
                    >
                      <Sparkles size={18} /> AI Mock Interview
                    </button>
                    <button 
                      onClick={() => setActiveTab('referrals')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'referrals' ? 'bg-orange-555/10 text-orange-600 font-semibold border border-orange-100' : 'text-slate-600 hover:text-slate-955 hover:bg-slate-100 border border-transparent'}`}
                    >
                      <User size={18} /> Referral Program
                    </button>
                  </>
                )}
                {user?.role === 'employer' && (
                  <>
                    <button 
                      onClick={() => { setActiveTab('posted'); setSelectedJob(null); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'posted' ? 'bg-orange-555/10 text-orange-600 font-semibold border border-orange-100' : 'text-slate-600 hover:text-slate-955 hover:bg-slate-100 border border-transparent'}`}
                    >
                      <Briefcase size={18} /> Posted Jobs
                    </button>
                    <button 
                      onClick={() => setActiveTab('resumesearch')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'resumesearch' ? 'bg-orange-555/10 text-orange-600 font-semibold border border-orange-100' : 'text-slate-600 hover:text-slate-955 hover:bg-slate-100 border border-transparent'}`}
                    >
                      <Search size={18} /> AI Resume Search
                    </button>
                  </>
                )}
                <Link to="/profile" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-transparent transition-all">
                  <User size={18} /> Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {user?.role === 'employer' ? (
                    <>
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex items-center gap-4 hover:border-orange-550/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                          <Briefcase size={24} />
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm font-semibold">Active Jobs Posted</p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{userPostedJobs.length}</h3>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex items-center gap-4 hover:border-orange-550/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                          <Bookmark size={24} />
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm font-semibold">Saved Jobs</p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{savedJobs.length}</h3>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {user?.role === 'seeker' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md text-left space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span>✨ Share Your Profile (Embeddable Badge)</span>
                      </h3>
                      <p className="text-slate-500 text-xs mt-0.5">Embed a live, interactive profile card showing your verified skills and certifications directly on your portfolio website or personal blog.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-full md:w-[360px] aspect-[360/220] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 shrink-0">
                        <iframe
                          title="Your Profile Badge Preview"
                          src={`${apiBase}/api/auth/portfolio-badge/${user._id}`}
                          className="w-full h-full border-none"
                        />
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Embed HTML Snippet</label>
                        <textarea
                          readOnly
                          value={`<iframe src="${apiBase}/api/auth/portfolio-badge/${user._id}" width="360" height="220" style="border:none; border-radius:16px;"></iframe>`}
                          rows="3"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-650 rounded-xl text-xs outline-none focus:border-orange-500 transition-all font-mono"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`<iframe src="${apiBase}/api/auth/portfolio-badge/${user._id}" width="360" height="220" style="border:none; border-radius:16px;"></iframe>`);
                            toast.success("Embed snippet copied to clipboard!");
                          }}
                          className="bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                        >
                          📋 Copy Embed Code
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'resumesearch' && user?.role === 'employer' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                <h1 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Sparkles className="text-orange-500" />
                  Semantic AI Resume Search
                </h1>
                <p className="text-slate-500 text-xs">Search for matching candidates using natural language queries (e.g. "React developers with SQL experience"). Our AI ranks candidates by match score instantly.</p>

                <form onSubmit={handleResumeSearch} className="flex gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search profiles semantically..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={searching}
                    className="bg-slate-950 hover:bg-slate-900 text-white font-semibold px-6 py-3 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70 text-sm shrink-0"
                  >
                    {searching ? 'Searching...' : 'Search'}
                  </button>
                </form>

                {searching && (
                  <div className="py-12 text-center text-sm text-slate-500">
                    AI is scanning resume texts and ranking matches...
                  </div>
                )}

                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {searchResults.map((res, index) => {
                      const cand = res.candidate;
                      return (
                        <div key={index} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 hover:border-orange-555/30 transition-all">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg uppercase shrink-0">
                                {cand.name?.charAt(0) || 'C'}
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-900 text-md">{cand.name} {cand.lastname || ''}</h3>
                                <p className="text-slate-500 text-xs">{cand.email} • {cand.location || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Relevance Score</span>
                              <span className="text-xl font-extrabold text-orange-600">{res.score}%</span>
                            </div>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-600 leading-relaxed text-left">
                            <span className="font-semibold text-orange-600 block mb-1">Match Explanation:</span>
                            {res.explanation}
                          </div>

                          {cand.skills && cand.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {cand.skills.map((s, idx) => {
                                const verifiedObj = cand.verifiedSkills?.find(vs => vs.skillName.toLowerCase() === s.toLowerCase());
                                return (
                                  <span key={idx} className={`px-2.5 py-0.5 border rounded-md text-[10px] flex items-center gap-1 ${
                                    verifiedObj
                                      ? 'bg-green-50 border-green-200 text-green-700 font-semibold'
                                      : 'bg-slate-100 border-slate-200/50 text-slate-600'
                                  }`}>
                                    {verifiedObj && <Check size={10} />}
                                    {s} {verifiedObj ? `(${verifiedObj.score}%)` : ''}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : !searching && searchQuery && (
                  <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-md text-slate-500 text-xs">
                    No matching profiles found for the query. Try broadening your keywords.
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'interview' && user?.role === 'seeker' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Sparkles className="text-orange-500" />
                  AI Mock Interview Simulator
                </h1>
                <InterviewSimulator />
              </motion.div>
            )}

            {activeTab === 'referrals' && user?.role === 'seeker' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <User className="text-orange-500" />
                    Referral Rewards Center
                  </h1>
                  <p className="text-slate-500 text-xs">Earn rewards by referring talented professionals. Copy referral links from any job details page, share them, and track your cash bonuses here when they are hired!</p>
                </div>

                <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">How does the referral bonus work?</h3>
                    <p className="text-slate-600 text-xs mt-1 max-w-xl">When candidates apply using your link, they are linked to your profile. Once the hiring manager marks their status as "Hired", your cash rewards are unlocked instantly!</p>
                  </div>
                  <div className="bg-white border border-orange-100 rounded-2xl px-5 py-3 text-center shrink-0">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Earned</span>
                    <h2 className="text-2xl font-extrabold text-orange-600 mt-0.5">
                      ₹{myReferrals.filter(r => r.status === 'Hired').length * 5000}
                    </h2>
                  </div>
                </div>

                {myReferrals.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {myReferrals.map((ref, idx) => {
                      const job = ref.jobId;
                      const candidate = ref.candidateId;
                      if (!job || !candidate) return null;
                      return (
                        <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 hover:border-orange-555/30 transition-all">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h3 className="font-bold text-slate-900 text-sm">{candidate.name} {candidate.lastname || ''}</h3>
                              <p className="text-slate-500 text-xs">Referred for: <span className="font-semibold text-slate-800">{job.position}</span> at {job.company}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hiring Status</span>
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                ref.status === 'Hired'
                                  ? 'bg-green-50 text-green-700 border border-green-150'
                                  : ref.status === 'Rejected'
                                  ? 'bg-red-50 text-red-700 border border-red-150'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {ref.status}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                            <span className="text-xs text-slate-500">Referred on: {new Date(ref.createdAt).toLocaleDateString()}</span>
                            <span className="text-xs font-bold text-slate-800">
                              {ref.status === 'Hired' ? '🎉 Bonus Earned: ₹5,000' : 'Bonus Pending'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-md text-slate-550 text-xs">
                    <User size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="font-bold text-slate-900 text-sm">No referrals generated yet</h3>
                    <p className="text-slate-550 mt-1 max-w-sm mx-auto">Browse active job postings to generate unique referral links and send them to friends!</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'saved' && user?.role === 'seeker' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Saved Jobs</h1>
                {savedJobs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {savedJobs.map(job => (
                      <div key={job._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-orange-550/30 hover:shadow-lg transition-all group">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900 group-hover:text-orange-600 transition-colors">{job.position}</h3>
                          <p className="text-slate-550 text-sm mt-0.5">{job.company}</p>
                        </div>
                        <a 
                          href={job.applyLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 border border-transparent"
                        >
                          Apply Now <ExternalLink size={12} />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-md">
                    <Bookmark size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">No saved jobs yet</h3>
                    <p className="text-slate-500 mb-6 text-sm">Jobs you save will appear here.</p>
                    <Link to="/alljobs" className="text-orange-600 font-medium hover:underline text-sm">Browse Jobs</Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'applications' && user?.role === 'seeker' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">My Applications</h1>
                {applications.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {applications.map(app => {
                      const j = app.jobId;
                      if (!j) return null;
                      return (
                        <div key={app._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-orange-550/30 transition-all text-left">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg text-slate-900">{j.position}</h3>
                            <p className="text-slate-500 text-sm">{j.company} • {j.workLocation}</p>
                            <div className="flex gap-4 items-center">
                              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-orange-50 border border-orange-100 text-orange-600 rounded-md capitalize">
                                Status: {app.status}
                              </span>
                              <span className="text-xs text-slate-400">Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">Match Score:</span>
                              <span className={`text-xl font-extrabold ${app.matchScore >= 80 ? 'text-green-400' : app.matchScore >= 50 ? 'text-orange-400' : 'text-red-400'}`}>
                                {app.matchScore}%
                              </span>
                            </div>
                            {app.matchExplanation && (
                              <p className="text-xs text-slate-600 max-w-md md:text-right leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 text-left">
                                {app.matchExplanation}
                              </p>
                            )}
                          </div>

                          {/* Visual Timeline Tracker */}
                          {app.status === 'Rejected' ? (
                            <div className="w-full pt-4 border-t border-slate-100 mt-4 text-left">
                              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold">
                                ❌ Status: Not Selected (The hiring team decided not to move forward with this application)
                              </span>
                            </div>
                          ) : (
                            <div className="w-full pt-4 border-t border-slate-100 mt-4">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-3">Application Pipeline Status:</span>
                              <div className="flex items-center justify-between relative max-w-xl mx-auto px-4 py-2">
                                <div className="absolute top-[20px] left-8 right-8 h-1 bg-slate-200 -z-10 rounded" />
                                <div 
                                  className="absolute top-[20px] left-8 h-1 bg-orange-500 -z-10 rounded transition-all duration-500" 
                                  style={{
                                    width: `${
                                      app.status === 'Applied' ? '0%' :
                                      app.status === 'Reviewed' ? '25%' :
                                      app.status === 'Interview' ? '50%' :
                                      app.status === 'Offer' ? '75%' :
                                      app.status === 'Hired' ? '100%' : '0%'
                                    }`
                                  }}
                                />

                                {["Applied", "Reviewed", "Interview", "Offer", "Hired"].map((stage, idx) => {
                                  const isCompletedOrActive = 
                                    stage === app.status || 
                                    (app.status === 'Reviewed' && ["Applied", "Reviewed"].includes(stage)) ||
                                    (app.status === 'Interview' && ["Applied", "Reviewed", "Interview"].includes(stage)) ||
                                    (app.status === 'Offer' && ["Applied", "Reviewed", "Interview", "Offer"].includes(stage)) ||
                                    (app.status === 'Hired' && ["Applied", "Reviewed", "Interview", "Offer", "Hired"].includes(stage));
                                  
                                  return (
                                    <div key={idx} className="flex flex-col items-center gap-1.5 z-10">
                                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                                        stage === app.status
                                          ? 'bg-orange-500 border-orange-500 text-white scale-110 shadow-md shadow-orange-500/30'
                                          : isCompletedOrActive
                                          ? 'bg-orange-50 border-orange-500 text-orange-600'
                                          : 'bg-white border-slate-300 text-slate-400'
                                      }`}>
                                        {idx + 1}
                                      </div>
                                      <span className={`text-[10px] font-semibold transition-all duration-300 ${
                                        stage === app.status ? 'text-orange-600 font-extrabold' : 'text-slate-500'
                                      }`}>
                                        {stage}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-md">
                    <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">No applications yet</h3>
                    <p className="text-slate-500 mb-6 text-sm">Quick apply to jobs from the list to get AI matching scores.</p>
                    <Link to="/alljobs" className="text-orange-600 font-medium hover:underline text-sm">Browse Jobs</Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'posted' && user?.role === 'employer' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                {selectedJob ? (
                  <div>
                    {/* Header with back button */}
                    <div className="flex items-center gap-4 mb-8">
                      <button
                        onClick={() => setSelectedJob(null)}
                        className="p-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h1 className="text-2xl font-bold text-slate-900">Applicants for {selectedJob.position}</h1>
                        <p className="text-slate-500 text-sm">{selectedJob.company} • {applicants.length} {applicants.length === 1 ? 'candidate' : 'candidates'}</p>
                      </div>
                    </div>

                    {applicants.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        <div className="flex justify-between items-center bg-slate-100 p-3 rounded-2xl border border-slate-200">
                          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-orange-500" />
                            Smart Ranked by AI Match Score
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">{applicants.length} Total Applicants</span>
                        </div>
                        {[...applicants].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).map(app => {
                          const cand = app.candidateId;
                          if (!cand) return null;
                          return (
                            <div key={app._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 hover:border-orange-555/30 transition-all text-left">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg uppercase shrink-0">
                                    {cand.name?.charAt(0) || 'C'}
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-3">
                                      {cand.name} {cand.lastname || ''}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-1">
                                      <p className="text-slate-500 text-xs">{cand.email} • {cand.location}</p>
                                      <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer select-none">
                                        <input
                                          type="checkbox"
                                          checked={compareCandidates.some(c => c._id === app._id)}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              if (compareCandidates.length >= 3) {
                                                toast.error("You can compare up to 3 candidates at a time");
                                                return;
                                              }
                                              setCompareCandidates(prev => [...prev, app]);
                                            } else {
                                              setCompareCandidates(prev => prev.filter(c => c._id !== app._id));
                                            }
                                          }}
                                          className="rounded border-slate-250 text-orange-500 focus:ring-orange-500 w-3.5 h-3.5"
                                        />
                                        <span className="font-medium hover:text-slate-700">Add to Compare</span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="flex flex-col items-end">
                                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">AI Match Score</span>
                                    <span className={`text-2xl font-extrabold ${app.matchScore >= 80 ? 'text-green-400' : app.matchScore >= 50 ? 'text-orange-400' : 'text-red-400'}`}>
                                      {app.matchScore}%
                                    </span>
                                  </div>
                                  {/* CRM Stage Dropdown */}
                                  <div>
                                    <select
                                      value={app.status}
                                      onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                                      className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs font-semibold focus:border-orange-500 outline-none transition-all cursor-pointer"
                                    >
                                      <option value="Applied">Applied</option>
                                      <option value="Reviewed">Reviewed</option>
                                      <option value="Interview">Interview</option>
                                      <option value="Offer">Offer</option>
                                      <option value="Rejected">Rejected</option>
                                      <option value="Hired">Hired</option>
                                    </select>
                                  </div>
                                  <div>
                                    <button
                                      onClick={() => {
                                        setEmailTargetCandidate(app);
                                        setGeneratedEmail("");
                                        setIsEmailModalOpen(true);
                                      }}
                                      className="px-3 py-2 bg-orange-50 border border-orange-100 hover:bg-orange-100 text-orange-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                                    >
                                      ⚡ AI Email
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Skills */}
                              {cand.skills && cand.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                  {cand.skills.map((s, idx) => {
                                    const verifiedObj = cand.verifiedSkills?.find(vs => vs.skillName.toLowerCase() === s.toLowerCase());
                                    return (
                                      <span key={idx} className={`px-2.5 py-0.5 border rounded-md text-[10px] flex items-center gap-1 ${
                                        verifiedObj
                                          ? 'bg-green-50 border-green-200 text-green-700 font-semibold'
                                          : 'bg-slate-100 border-slate-200/50 text-slate-600'
                                      }`}>
                                        {verifiedObj && <Check size={10} />}
                                        {s} {verifiedObj ? `(${verifiedObj.score}%)` : ''}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}

                              {cand.videoIntroUrl && (
                                <div className="pt-2">
                                  <button
                                    onClick={() => {
                                      setPlayingVideoUrl(cand.videoIntroUrl);
                                      setIsVideoModalOpen(true);
                                    }}
                                    className="bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                                  >
                                    🎥 Play Video Introduction
                                  </button>
                                </div>
                              )}

                              {/* Explanation */}
                              {app.matchExplanation && (
                                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-600 leading-relaxed text-left">
                                  <span className="font-semibold text-orange-600 block mb-1">AI Match Summary:</span>
                                  {app.matchExplanation}
                                </div>
                              )}

                              {app.redFlags && app.redFlags.length > 0 && (
                                <div className="p-4 bg-red-50 border border-red-200 text-red-650 rounded-2xl text-xs space-y-1.5">
                                  <span className="font-bold uppercase tracking-wider block text-[10px] text-red-700">⚠️ AI Resume Red Flags:</span>
                                  <ul className="list-disc pl-4 space-y-1">
                                    {app.redFlags.map((flag, idx) => (
                                      <li key={idx} className="text-slate-650 text-[11px]">{flag}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Resume Analysis collapsible */}
                              {app.resumeAnalysis && (
                                <details className="group border border-slate-200 bg-white rounded-2xl overflow-hidden transition-all duration-300">
                                  <summary className="list-none flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 select-none">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-semibold text-slate-650">ATS Resume report</span>
                                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${app.resumeAnalysis.atsScore >= 80 ? 'bg-green-50 text-green-700 border border-green-150' : 'bg-orange-50 text-orange-600 border border-orange-150'}`}>
                                        {app.resumeAnalysis.atsScore || 0}/100 Score
                                      </span>
                                    </div>
                                    <span className="text-xs text-orange-600 transition-transform group-open:rotate-180">▼</span>
                                  </summary>
                                  
                                  <div className="p-4 border-t border-slate-200 space-y-4 bg-slate-50/30 text-left">
                                    {app.resumeAnalysis.summary && (
                                      <div className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                                        <span className="font-bold text-slate-900 block mb-1">Resume Summary:</span>
                                        "{app.resumeAnalysis.summary}"
                                      </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {app.resumeAnalysis.strengths && app.resumeAnalysis.strengths.length > 0 && (
                                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                                          <span className="font-bold text-green-600 block mb-1">Strengths</span>
                                          <ul className="list-disc pl-4 space-y-1 text-slate-600">
                                            {app.resumeAnalysis.strengths.map((str, i) => <li key={i}>{str}</li>)}
                                          </ul>
                                        </div>
                                      )}

                                      {app.resumeAnalysis.weaknesses && app.resumeAnalysis.weaknesses.length > 0 && (
                                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                                          <span className="font-bold text-red-600 block mb-1">Weaknesses</span>
                                          <ul className="list-disc pl-4 space-y-1 text-slate-600">
                                            {app.resumeAnalysis.weaknesses.map((wk, i) => <li key={i}>{wk}</li>)}
                                          </ul>
                                        </div>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {app.resumeAnalysis.missingSkills && app.resumeAnalysis.missingSkills.length > 0 && (
                                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                                          <span className="font-bold text-amber-600 block mb-1">Missing Skills</span>
                                          <div className="flex flex-wrap gap-1 mt-1.5">
                                            {app.resumeAnalysis.missingSkills.map((sk, i) => (
                                              <span key={i} className="px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 rounded text-[9px] font-bold">
                                                {sk}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {app.resumeAnalysis.improvementSuggestions && app.resumeAnalysis.improvementSuggestions.length > 0 && (
                                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                                          <span className="font-bold text-blue-600 block mb-1">Suggestions</span>
                                          <ul className="list-disc pl-4 space-y-1 text-slate-600">
                                            {app.resumeAnalysis.improvementSuggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </details>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-md">
                        <Briefcase size={48} className="mx-auto text-slate-350 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900">No applicants yet</h3>
                        <p className="text-slate-500 text-sm">Once candidates quick apply, they will appear here with AI Match scores.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h1 className="text-2xl font-bold text-slate-900">Your Posted Jobs</h1>
                      <Link 
                        to="/postjob" 
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95 border border-transparent"
                      >
                        <PlusCircle size={13} />
                        Post New
                      </Link>
                    </div>
                    {userPostedJobs.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {userPostedJobs.map(job => (
                          <div key={job._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-orange-550/30 transition-all">
                            <div>
                              <h3 className="font-semibold text-lg text-slate-900">{job.position}</h3>
                              <div className="flex gap-4 mt-2 items-center">
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 border border-orange-100 text-orange-600 rounded-md capitalize flex items-center gap-1">
                                  <Clock size={10} />
                                  {job.status}
                                </span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">{job.workLocation}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleFetchSalaryAnalysis(job)}
                                className="bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                              >
                                📊 Salary Intel
                              </button>
                              <button 
                                onClick={() => { setSelectedJob(job); fetchApplicants(job._id); }}
                                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-102 border border-transparent"
                              >
                                View Applicants
                              </button>
                              <button 
                                onClick={() => {
                                  if(window.confirm("Are you sure you want to delete this job?")) {
                                    deleteJob(job._id);
                                  }
                                }}
                                className="bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-md">
                        <Briefcase size={48} className="mx-auto text-slate-350 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900">No jobs posted</h3>
                        <p className="text-slate-500 mb-6 text-sm">Start growing your team by posting a job.</p>
                        <Link to="/postjob" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all text-sm shadow-md border border-transparent">Post a Job</Link>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating compare notification bar */}
      {compareCandidates.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl flex items-center gap-4 animate-bounce">
          <span className="text-xs font-semibold text-slate-700">{compareCandidates.length} Selected</span>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
          >
            Compare Candidates
          </button>
          <button
            onClick={() => setCompareCandidates([])}
            className="text-xs text-slate-400 hover:text-slate-655"
          >
            Clear
          </button>
        </div>
      )}

      {/* Comparison Modal Overlay */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl p-6 relative flex flex-col max-h-[85vh] overflow-hidden text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Sparkles className="text-orange-500" />
                Candidate Comparison Matrix
              </h3>
              <button onClick={() => setIsCompareModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 bg-slate-50 font-bold text-slate-700">Criteria</th>
                    {compareCandidates.map(c => (
                      <th key={c._id} className="p-3 bg-slate-50 font-bold text-slate-900 text-sm">{c.candidateId?.name} {c.candidateId?.lastname || ''}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-semibold text-slate-500">AI Match Score</td>
                    {compareCandidates.map(c => (
                      <td key={c._id} className="p-3"><span className="text-sm font-extrabold text-orange-600">{c.matchScore}%</span></td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-semibold text-slate-500">ATS Score</td>
                    {compareCandidates.map(c => (
                      <td key={c._id} className="p-3"><span className="font-bold text-green-600">{c.resumeAnalysis?.atsScore || 'N/A'}/100</span></td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-semibold text-slate-500">Verified Skills</td>
                    {compareCandidates.map(c => (
                      <td key={c._id} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {c.candidateId?.verifiedSkills?.map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded text-[9px]">{s.skillName} ({s.score}%)</span>
                          )) || 'None'}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-semibold text-slate-500">Key Skills</td>
                    {compareCandidates.map(c => (
                      <td key={c._id} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {c.candidateId?.skills?.map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px]">{s}</span>
                          )) || 'None'}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-semibold text-slate-500">Location</td>
                    {compareCandidates.map(c => (
                      <td key={c._id} className="p-3 text-slate-700">{c.candidateId?.location || 'N/A'}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-semibold text-slate-500">Desired Salary</td>
                    {compareCandidates.map(c => (
                      <td key={c._id} className="p-3 text-slate-700">₹{c.candidateId?.desiredSalary || 'N/A'} LPA</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-semibold text-slate-500">Experience</td>
                    {compareCandidates.map(c => (
                      <td key={c._id} className="p-3 text-slate-700">
                        {c.candidateId?.experience?.map((exp, i) => (
                          <div key={i} className="mb-1">
                            <span className="font-bold">{exp.role}</span> at {exp.company} ({exp.duration})
                          </div>
                        )) || 'None'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* AI Email Template Generator Modal Overlay */}
      {isEmailModalOpen && emailTargetCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl p-6 relative flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>⚡ AI Candidate Email Generator</span>
              </h3>
              <button 
                onClick={() => {
                  setIsEmailModalOpen(false);
                  setEmailTargetCandidate(null);
                  setGeneratedEmail("");
                }} 
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Select Template Type</label>
                <select
                  value={selectedEmailType}
                  onChange={(e) => setSelectedEmailType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all text-xs font-semibold"
                >
                  <option value="Interview Invitation">Interview Invitation</option>
                  <option value="Job Offer">Job Offer</option>
                  <option value="Rejection Notice">Rejection Notice</option>
                  <option value="Follow Up / Feedback">Follow Up / Feedback</option>
                </select>
              </div>

              <button
                onClick={handleGenerateEmail}
                disabled={generatingEmail}
                className="w-full bg-slate-950 hover:bg-slate-900 text-white font-semibold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70 text-xs"
              >
                {generatingEmail ? 'Generating Template...' : '⚡ Generate Email Template'}
              </button>

              {generatedEmail && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Preview Template</label>
                    <textarea
                      readOnly
                      value={generatedEmail}
                      rows="8"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 text-xs outline-none transition-all resize-none font-sans leading-relaxed"
                    />
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedEmail);
                      toast.success("Email template copied to clipboard!");
                    }}
                    className="w-full bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-600 font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs"
                  >
                    📋 Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* AI Salary Intelligence Modal Overlay */}
      {isSalaryModalOpen && salaryTargetJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl p-6 relative flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>📊 AI Salary & Compensation Analyst</span>
              </h3>
              <button 
                onClick={() => {
                  setIsSalaryModalOpen(false);
                  setSalaryTargetJob(null);
                  setSalaryAnalysisData(null);
                }} 
                className="text-slate-400 hover:text-slate-655 font-bold text-lg"
              >
                ×
              </button>
            </div>

            {loadingSalaryAnalysis ? (
              <div className="py-12 text-center text-xs text-slate-500">
                AI is compiling salary trends and market data...
              </div>
            ) : salaryAnalysisData ? (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{salaryTargetJob.position}</h4>
                  <p className="text-slate-500 text-xs mt-0.5">{salaryTargetJob.workLocation} • {salaryTargetJob.workType}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Market Min</span>
                    <h3 className="text-lg font-bold text-slate-805 mt-0.5">₹{salaryAnalysisData.marketMin} LPA</h3>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 p-3 rounded-2xl text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Market Avg</span>
                    <h3 className="text-lg font-extrabold text-orange-600 mt-0.5">₹{salaryAnalysisData.marketAvg} LPA</h3>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Market Max</span>
                    <h3 className="text-lg font-bold text-slate-805 mt-0.5">₹{salaryAnalysisData.marketMax} LPA</h3>
                  </div>
                </div>

                <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-orange-600 block mb-1">Market Compensation Summary:</span>
                  {salaryAnalysisData.analysis}
                </div>

                {salaryAnalysisData.skillsPremium && salaryAnalysisData.skillsPremium.length > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Premium Skills Boosting Salary</span>
                    <div className="flex flex-wrap gap-1.5">
                      {salaryAnalysisData.skillsPremium.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 rounded-lg text-[10px] font-bold">
                          🔥 {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                Failed to fetch salary analysis data. Please try again.
              </div>
            )}
          </div>
        </div>
      )}
      {/* Video Playback Modal Overlay */}
      {isVideoModalOpen && playingVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl p-6 relative flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>Candidate Video Introduction</span>
              </h3>
              <button 
                onClick={() => {
                  setIsVideoModalOpen(false);
                  setPlayingVideoUrl(null);
                }} 
                className="text-slate-400 hover:text-slate-655 font-bold text-lg"
              >
                ×
              </button>
            </div>
            
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200">
              <iframe
                title="Video Introduction"
                src={
                  playingVideoUrl.includes("watch?v=")
                    ? playingVideoUrl.replace("watch?v=", "embed/")
                    : playingVideoUrl
                }
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
