import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Briefcase, Bookmark, User, Settings, ExternalLink, Activity, PlusCircle, CheckCircle, Clock, ArrowLeft, Sparkles, MessageSquare, Check, X, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { hostUrl, API_BASE_URL, uploadResumeApi } from '../api/api';

const formatDaysAgo = (date) => {
  if (!date) return 'Recently';
  const diffMs = Date.now() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

const InterviewSimulator = React.memo(() => {
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
    <div className="bg-white p-6 rounded-[8px] border border-slate-200 shadow-sm space-y-6">
      {!questions.length && !evaluationResult && (
        <div className="space-y-4 max-w-md text-left">
          <p className="text-slate-600 text-xs leading-relaxed">Practice technical & behavioral interviews with our real-time AI Interviewer. Choose your target role to begin:</p>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Target Job Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-[4px] border border-slate-200 bg-white text-slate-800 text-xs outline-none focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151]/20 transition-all"
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
            className="w-full bg-[#00a151] hover:bg-[#008c46] text-white font-medium py-2 rounded-[4px] transition-colors shadow-sm flex items-center justify-center gap-1.5 text-xs disabled:opacity-70"
          >
            {loadingQuestions ? 'Preparing Interview...' : '⚡ Start Mock Interview'}
          </button>
        </div>
      )}

      {loadingQuestions && (
        <div className="py-12 text-center text-xs text-slate-500">
          Generating custom AI questions for {role} role... please wait.
        </div>
      )}

      {questions.length > 0 && !evaluationResult && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-900 text-xs">AI Questions for {role}</h3>
            <button onClick={() => setQuestions([])} className="text-xs text-slate-400 hover:text-slate-600">Reset</button>
          </div>
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={idx} className="space-y-1.5">
                <p className="font-medium text-xs text-slate-800">Q{idx + 1}: {q}</p>
                <textarea
                  placeholder="Type your detailed answer here..."
                  rows="3"
                  value={answers[idx] || ""}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-[4px] border border-slate-200 bg-white text-slate-900 outline-none focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151]/20 text-xs font-sans resize-none transition-all"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={submitInterview}
              disabled={evaluating}
              className="bg-[#00a151] hover:bg-[#008c46] text-white font-medium px-5 py-2 rounded-[4px] shadow-sm text-xs flex items-center gap-1.5 disabled:opacity-70 transition-colors"
            >
              {evaluating ? 'Analyzing Answers...' : 'Submit Answers for AI Evaluation'}
            </button>
          </div>
        </div>
      )}

      {evaluationResult && (
        <div className="space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-900 text-xs">AI Interview Feedback ({role})</h3>
            <button onClick={() => { setQuestions([]); setEvaluationResult(null); }} className="text-xs text-[#00a151] font-medium hover:underline">Start New Test</button>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-[6px] border border-slate-200">
            <div className="w-14 h-14 rounded-[4px] bg-[#e6f6ee] border border-[#00a151]/20 flex items-center justify-center text-[#00a151] font-semibold text-xl shrink-0">
              {evaluationResult.score}%
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">Evaluation Score</p>
              <p className="text-slate-600 text-xs leading-relaxed mt-0.5">{evaluationResult.feedback}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-[6px] border border-slate-200 text-xs">
              <span className="font-semibold text-emerald-700 block mb-2 flex items-center gap-1">Key Strengths</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {evaluationResult.strengths?.map((str, i) => <li key={i}>{str}</li>) || <li>Good clarity.</li>}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-[6px] border border-slate-200 text-xs">
              <span className="font-semibold text-rose-600 block mb-2 flex items-center gap-1">Areas of Improvement</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {evaluationResult.weaknesses?.map((wk, i) => <li key={i}>{wk}</li>) || <li>Add more concrete technical details.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

const Dashboard = () => {
  const { user, job, deleteJob } = useAuth();
  const token = localStorage.getItem("token");
  const apiBase = API_BASE_URL;

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
  const [uploadingResume, setUploadingResume] = useState(false);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      toast.error('Only PDF and Word documents are allowed');
      return;
    }

    setUploadingResume(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(uploadResumeApi, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Resume uploaded successfully!');
        
        // If there was an AI extraction error, show it
        if (response.data.extractionError) {
          toast.error('AI Extraction failed: ' + response.data.extractionError);
        }
        
        console.log("Upload response:", response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setUploadingResume(false);
    }
  };
  const handleResumeSearch = useCallback(async (e) => {
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
  }, [searchQuery, token]);

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

  const handleGenerateEmail = useCallback(async () => {
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
  }, [emailTargetCandidate, selectedJob, selectedEmailType, token]);

  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [salaryTargetJob, setSalaryTargetJob] = useState(null);
  const [salaryAnalysisData, setSalaryAnalysisData] = useState(null);
  const [loadingSalaryAnalysis, setLoadingSalaryAnalysis] = useState(false);

  const handleFetchSalaryAnalysis = useCallback(async (jobRecord) => {
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
  }, [apiBase, token]);

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

  const fetchApplicants = useCallback(async (jobId) => {
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
  }, [apiBase, token]);

  const handleUpdateStatus = useCallback(async (appId, newStatus) => {
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
  }, [apiBase, token]);

  const userPostedJobs = useMemo(() => {
    return job?.filter(j => {
      const creatorId = j.createdBy?._id || j.createdBy;
      return creatorId === user?._id;
    }) || [];
  }, [job, user?._id]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-[8px] p-5 border border-slate-200 shadow-sm sticky top-24">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-[6px] bg-[#e6f6ee] border border-[#00a151]/20 flex items-center justify-center text-[#00a151] font-semibold text-xl mb-3 uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <h2 className="text-base font-semibold text-slate-950">{user?.name} {user?.lastname}</h2>
                <span className="inline-flex items-center rounded-[2px] bg-slate-100 px-2 py-[2px] text-xs font-medium text-slate-700 mt-2">
                  {user?.role === 'employer' ? 'HR / Employer' : 'Job Seeker'}
                </span>
              </div>

              <div className="space-y-1">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs transition-colors ${activeTab === 'overview' ? 'bg-[#e6f6ee] text-[#00a151] font-medium border border-[#00a151]/20' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-transparent'}`}
                >
                  <Activity size={15} /> Overview
                </button>
                {user?.role === 'seeker' && (
                  <>
                    <button 
                      onClick={() => setActiveTab('saved')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs transition-colors ${activeTab === 'saved' ? 'bg-[#e6f6ee] text-[#00a151] font-medium border border-[#00a151]/20' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-transparent'}`}
                    >
                      <Bookmark size={15} /> Saved Jobs
                    </button>
                    <button 
                      onClick={() => setActiveTab('applications')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs transition-colors ${activeTab === 'applications' ? 'bg-[#e6f6ee] text-[#00a151] font-medium border border-[#00a151]/20' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-transparent'}`}
                    >
                      <Briefcase size={15} /> My Applications
                    </button>
                    <button 
                      onClick={() => setActiveTab('interview')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs transition-colors ${activeTab === 'interview' ? 'bg-[#e6f6ee] text-[#00a151] font-medium border border-[#00a151]/20' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-transparent'}`}
                    >
                      <Sparkles size={15} /> AI Mock Interview
                    </button>
                    <button 
                      onClick={() => setActiveTab('referrals')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs transition-colors ${activeTab === 'referrals' ? 'bg-[#e6f6ee] text-[#00a151] font-medium border border-[#00a151]/20' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-transparent'}`}
                    >
                      <User size={15} /> Referral Program
                    </button>
                  </>
                )}
                {user?.role === 'employer' && (
                  <>
                    <button 
                      onClick={() => { setActiveTab('posted'); setSelectedJob(null); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs transition-colors ${activeTab === 'posted' ? 'bg-[#e6f6ee] text-[#00a151] font-medium border border-[#00a151]/20' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-transparent'}`}
                    >
                      <Briefcase size={15} /> Posted Jobs
                    </button>
                    <button 
                      onClick={() => setActiveTab('resumesearch')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs transition-colors ${activeTab === 'resumesearch' ? 'bg-[#e6f6ee] text-[#00a151] font-medium border border-[#00a151]/20' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-transparent'}`}
                    >
                      <Search size={15} /> AI Resume Search
                    </button>
                  </>
                )}
                <Link to="/profile" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-transparent transition-colors">
                  <User size={15} /> Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-left mb-6">
                  <span className="inline-flex items-center rounded-[2px] bg-slate-100 px-2 py-[2px] text-xs font-medium text-slate-700 mb-2">
                    Dashboard
                  </span>
                  <h1 className="text-2xl font-semibold tracking-[-0.02em] text-slate-950">Overview & Activity</h1>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user?.role === 'employer' ? (
                    <>
                      <div className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm flex flex-col gap-2 hover:border-[#00a151]/40 transition-colors text-left">
                        <div className="flex justify-between items-center w-full">
                          <p className="text-slate-500 text-xs font-medium">Active Jobs Posted</p>
                          <Briefcase size={16} className="text-[#00a151]" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{userPostedJobs.length}</h3>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm flex flex-col gap-2 hover:border-[#00a151]/40 transition-colors text-left">
                        <div className="flex justify-between items-center w-full">
                          <p className="text-slate-500 text-xs font-medium">Saved Jobs</p>
                          <Bookmark size={16} className="text-[#00a151]" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{savedJobs.length}</h3>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {user?.role === 'seeker' && (
                  <div className="space-y-6 text-left">
                    {/* Resume Upload Section */}
                    <div className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm space-y-3">
                      <div>
                        <h3 className="font-semibold text-slate-950 text-sm flex items-center gap-1.5">
                          <span>Resume Document</span>
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">Upload your latest resume (PDF or DOC) to stand out to employers.</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-[6px]">
                        {user.resumeLink ? (
                          <div className="flex-1 w-full text-xs font-medium text-[#00a151] underline truncate">
                            <a href={user.resumeLink} target="_blank" rel="noopener noreferrer">
                              View Current Resume
                            </a>
                          </div>
                        ) : (
                          <div className="flex-1 w-full text-xs text-slate-400">No resume uploaded yet.</div>
                        )}
                        <label className="shrink-0 bg-[#00a151] hover:bg-[#008c46] text-white font-medium px-3.5 py-1.5 rounded-[4px] cursor-pointer transition-colors shadow-sm flex items-center gap-2 text-xs">
                          {uploadingResume ? 'Uploading...' : 'Upload New Resume'}
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                            className="hidden" 
                            onChange={handleResumeUpload}
                            disabled={uploadingResume}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Bio & Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm space-y-2">
                        <h3 className="font-semibold text-slate-950 text-sm">Bio</h3>
                        <p className="text-slate-600 text-xs leading-relaxed">{user.bio || 'No bio provided yet. Update your profile to add a professional summary.'}</p>
                      </div>
                      <div className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm space-y-2">
                        <h3 className="font-semibold text-slate-950 text-sm">Skills</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {user.skills?.length > 0 ? (
                            user.skills.map((skill, idx) => {
                              const isVerified = user.verifiedSkills?.some(vs => vs.skillName.toLowerCase() === skill.toLowerCase());
                              return (
                                <span key={idx} className={`px-2 py-0.5 rounded-[2px] text-xs font-medium flex items-center gap-1 ${isVerified ? 'bg-[#e6f6ee] text-[#00a151] border border-[#00a151]/20' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                  {skill} {isVerified && '✓'}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-xs text-slate-400">No skills added.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Experience Section */}
                    <div className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm space-y-4">
                      <h3 className="font-semibold text-slate-950 text-sm">Professional Experience</h3>
                      <div className="space-y-4">
                        {user.experience?.length > 0 ? (
                          user.experience.map((exp, idx) => (
                            <div key={idx} className="border-l-2 border-[#00a151] pl-3.5 py-0.5">
                              <h4 className="text-sm font-semibold text-slate-900">{exp.role || 'Role Title'}</h4>
                              <p className="text-xs font-medium text-[#00a151] mt-0.5">{exp.company || 'Company'} • <span className="text-slate-500 font-normal">{exp.duration || 'Duration'}</span></p>
                              {exp.description && <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{exp.description}</p>}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400">No experience listed.</div>
                        )}
                      </div>
                    </div>

                    {/* Projects Section */}
                    <div className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm space-y-4">
                      <h3 className="font-semibold text-slate-950 text-sm">Projects</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {user.projects?.length > 0 ? (
                          user.projects.map((proj, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-[6px] p-4 border border-slate-200">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-sm font-semibold text-slate-900">{proj.title || 'Project Title'}</h4>
                                {proj.link && (
                                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#00a151] hover:underline">View</a>
                                )}
                              </div>
                              {proj.description && <p className="text-xs text-slate-600 leading-relaxed mb-3">{proj.description}</p>}
                              {proj.technologies?.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {proj.technologies.map((tech, tIdx) => (
                                    <span key={tIdx} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-[2px] font-medium">{tech}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400 col-span-2">No projects listed.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'resumesearch' && user?.role === 'employer' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                <div>
                  <h1 className="text-xl font-semibold tracking-[-0.02em] text-slate-950 mb-1 flex items-center gap-2">
                    <Sparkles className="text-[#00a151]" size={20} />
                    Semantic AI Resume Search
                  </h1>
                  <p className="text-slate-500 text-xs">Search for matching candidates using natural language queries (e.g. "React developers with SQL experience"). Our AI ranks candidates by match score instantly.</p>
                </div>

                <form onSubmit={handleResumeSearch} className="flex gap-2.5 bg-white p-3 rounded-[8px] border border-slate-200 shadow-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search profiles semantically..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-[6px] border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all placeholder:text-slate-400 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={searching}
                    className="bg-[#00a151] hover:bg-[#008c46] text-white font-medium px-5 py-2 rounded-[4px] transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70 text-xs shrink-0"
                  >
                    {searching ? 'Searching...' : 'Search'}
                  </button>
                </form>

                {searching && (
                  <div className="py-12 text-center text-xs text-slate-500">
                    AI is scanning resume texts and ranking matches...
                  </div>
                )}

                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {searchResults.map((res, index) => {
                      const cand = res.candidate;
                      return (
                        <div key={index} className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm space-y-3.5 hover:border-slate-300 transition-all">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-[6px] bg-[#e6f6ee] border border-[#00a151]/20 flex items-center justify-center text-[#00a151] font-semibold text-sm uppercase shrink-0">
                                {cand.name?.charAt(0) || 'C'}
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-950 text-sm">{cand.name} {cand.lastname || ''}</h3>
                                <p className="text-slate-500 text-xs">{cand.email} • {cand.location || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">AI Match</span>
                              <span className="text-lg font-semibold text-[#00a151] tracking-[-0.02em]">{res.score}%</span>
                            </div>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 p-3 rounded-[6px] text-xs text-slate-600 leading-relaxed text-left">
                            <span className="font-medium text-[#00a151] block mb-0.5">Match Explanation:</span>
                            {res.explanation}
                          </div>

                          {cand.skills && cand.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {cand.skills.map((s, idx) => {
                                const verifiedObj = cand.verifiedSkills?.find(vs => vs.skillName.toLowerCase() === s.toLowerCase());
                                return (
                                  <span key={idx} className={`px-2 py-0.5 border rounded-[2px] text-[10px] flex items-center gap-1 ${
                                    verifiedObj
                                      ? 'bg-[#e6f6ee] border-[#00a151]/30 text-[#00a151] font-medium'
                                      : 'bg-slate-100 border-slate-200 text-slate-600'
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
                  <div className="bg-white rounded-[8px] p-10 border border-slate-200 text-center text-slate-500 text-xs">
                    No matching profiles found for the query. Try broadening your keywords.
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'interview' && user?.role === 'seeker' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                <h1 className="text-xl font-semibold tracking-[-0.02em] text-slate-950 mb-4 flex items-center gap-2">
                  <Sparkles className="text-[#00a151]" size={20} />
                  AI Mock Interview Simulator
                </h1>
                <InterviewSimulator />
              </motion.div>
            )}

            {activeTab === 'referrals' && user?.role === 'seeker' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                <div>
                  <h1 className="text-xl font-semibold tracking-[-0.02em] text-slate-950 mb-1 flex items-center gap-2">
                    <User className="text-[#00a151]" size={20} />
                    Referral Rewards Center
                  </h1>
                  <p className="text-slate-500 text-xs">Earn rewards by referring talented professionals. Copy referral links from any job details page, share them, and track your cash bonuses here when they are hired!</p>
                </div>

                <div className="bg-[#e6f6ee]/40 border border-[#00a151]/20 rounded-[8px] p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-950 text-sm">How does the referral bonus work?</h3>
                    <p className="text-slate-600 text-xs mt-1 max-w-xl leading-relaxed">When candidates apply using your link, they are linked to your profile. Once the hiring manager marks their status as "Hired", your cash rewards are unlocked instantly!</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-[6px] px-5 py-2.5 text-center shrink-0 shadow-sm">
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Total Earned</span>
                    <h2 className="text-2xl font-semibold text-[#00a151] tracking-[-0.02em] mt-0.5">
                      ₹{myReferrals.filter(r => r.status === 'Hired').length * 5000}
                    </h2>
                  </div>
                </div>

                {myReferrals.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {myReferrals.map((ref, idx) => {
                      const job = ref.jobId;
                      const candidate = ref.candidateId;
                      if (!job || !candidate) return null;
                      return (
                        <div key={idx} className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm space-y-3.5 hover:border-slate-300 transition-all">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h3 className="font-semibold text-slate-950 text-sm">{candidate.name} {candidate.lastname || ''}</h3>
                              <p className="text-slate-500 text-xs mt-0.5">Referred for: <span className="font-medium text-slate-800">{job.position}</span> at {job.company}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Hiring Status</span>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-[2px] mt-0.5 ${
                                ref.status === 'Hired'
                                  ? 'bg-[#e6f6ee] text-[#00a151] border border-[#00a151]/20'
                                  : ref.status === 'Rejected'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {ref.status}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                            <span className="text-xs text-slate-500">Referred: {formatDaysAgo(ref.createdAt)}</span>
                            <span className="text-xs font-semibold text-slate-900">
                              {ref.status === 'Hired' ? '🎉 Bonus Earned: ₹5,000' : 'Bonus Pending'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-[8px] p-10 border border-slate-200 text-center text-slate-500 text-xs">
                    <User size={36} className="mx-auto text-slate-300 mb-3" />
                    <h3 className="font-semibold text-slate-900 text-sm">No referrals generated yet</h3>
                    <p className="text-slate-500 mt-1 max-w-sm mx-auto">Browse active job postings to generate unique referral links and send them to friends!</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'saved' && user?.role === 'seeker' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h1 className="text-xl font-semibold tracking-[-0.02em] text-slate-950 mb-4 text-left">Saved Jobs</h1>
                {savedJobs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3.5">
                    {savedJobs.map(job => (
                      <div key={job._id} className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-all group">
                        <div className="text-left">
                          <h3 className="font-semibold text-base text-slate-950 group-hover:text-[#00a151] transition-colors">{job.position}</h3>
                          <p className="text-slate-500 text-xs mt-0.5">{job.company}</p>
                        </div>
                        <a 
                          href={job.applyLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-[#00a151] hover:bg-[#008c46] text-white px-3.5 py-1.5 rounded-[4px] text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
                        >
                          Apply Now <ExternalLink size={12} />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-[8px] p-10 border border-slate-200 text-center shadow-sm">
                    <Bookmark size={36} className="mx-auto text-slate-300 mb-3" />
                    <h3 className="text-sm font-semibold text-slate-950">No saved jobs yet</h3>
                    <p className="text-slate-500 mb-4 text-xs">Jobs you save will appear here.</p>
                    <Link to="/alljobs" className="text-[#00a151] font-medium hover:underline text-xs">Browse Jobs</Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'applications' && user?.role === 'seeker' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h1 className="text-xl font-semibold tracking-[-0.02em] text-slate-950 mb-4 text-left">My Applications</h1>
                {applications.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {applications.map(app => {
                      const j = app.jobId;
                      if (!j) return null;
                      return (
                        <div key={app._id} className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:border-slate-300 transition-all text-left">
                          <div className="space-y-1.5">
                            <h3 className="font-semibold text-base text-slate-950">{j.position}</h3>
                            <p className="text-slate-500 text-xs">{j.company} • {j.workLocation}</p>
                            <div className="flex gap-3 items-center pt-1">
                              <span className="text-[11px] font-medium px-2 py-0.5 bg-[#e6f6ee] border border-[#00a151]/20 text-[#00a151] rounded-[2px] capitalize">
                                Status: {app.status}
                              </span>
                              <span className="text-xs text-slate-400">Applied {formatDaysAgo(app.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-1.5 w-full md:w-auto">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">Match Score:</span>
                              <span className={`text-lg font-semibold tracking-[-0.02em] ${app.matchScore >= 80 ? 'text-[#00a151]' : app.matchScore >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                                {app.matchScore}%
                              </span>
                            </div>
                            {app.matchExplanation && (
                              <p className="text-xs text-slate-600 max-w-md md:text-right leading-relaxed bg-slate-50 p-2.5 rounded-[6px] border border-slate-200 text-left">
                                {app.matchExplanation}
                              </p>
                            )}
                          </div>

                          {/* Visual Timeline Tracker */}
                          {app.status === 'Rejected' ? (
                            <div className="w-full pt-3.5 border-t border-slate-100 mt-2 text-left">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-[4px] text-xs font-medium">
                                ✕ Status: Not Selected (The hiring team decided not to move forward with this application)
                              </span>
                            </div>
                          ) : (
                            <div className="w-full pt-3.5 border-t border-slate-100 mt-2">
                              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block mb-2.5">Application Pipeline Status:</span>
                              <div className="flex items-center justify-between relative max-w-xl mx-auto px-4 py-2">
                                <div className="absolute top-[20px] left-8 right-8 h-1 bg-slate-200 -z-10 rounded" />
                                <div 
                                  className="absolute top-[20px] left-8 h-1 bg-[#00a151] -z-10 rounded transition-all duration-500" 
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
                                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-semibold transition-all duration-300 ${
                                        stage === app.status
                                          ? 'bg-[#00a151] border-[#00a151] text-white shadow-sm'
                                          : isCompletedOrActive
                                          ? 'bg-[#e6f6ee] border-[#00a151]/50 text-[#00a151]'
                                          : 'bg-white border-slate-300 text-slate-400'
                                      }`}>
                                        {idx + 1}
                                      </div>
                                      <span className={`text-[10px] font-medium transition-all duration-300 ${
                                        stage === app.status ? 'text-[#00a151] font-semibold' : 'text-slate-500'
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
                  <div className="bg-white rounded-[8px] border border-slate-200 p-10 text-center shadow-sm">
                    <Briefcase size={36} className="mx-auto text-slate-300 mb-3" />
                    <h3 className="text-sm font-semibold text-slate-950">No applications yet</h3>
                    <p className="text-slate-500 mb-4 text-xs">Quick apply to jobs from the list to get AI matching scores.</p>
                    <Link to="/alljobs" className="text-[#00a151] font-medium hover:underline text-xs">Browse Jobs</Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'posted' && user?.role === 'employer' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                {selectedJob ? (
                  <div>
                    {/* Header with back button */}
                    <div className="flex items-center gap-3.5 mb-6">
                      <button
                        onClick={() => setSelectedJob(null)}
                        className="p-1.5 bg-white border border-slate-200 rounded-[4px] text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h1 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">Applicants for {selectedJob.position}</h1>
                        <p className="text-slate-500 text-xs mt-0.5">{selectedJob.company} • {applicants.length} {applicants.length === 1 ? 'candidate' : 'candidates'}</p>
                      </div>
                    </div>

                    {applicants.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-[6px] border border-slate-200">
                          <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-[#00a151]" />
                            Smart Ranked by AI Match Score
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{applicants.length} Total Applicants</span>
                        </div>
                        {[...applicants].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).map(app => {
                          const cand = app.candidateId;
                          if (!cand) return null;
                          return (
                            <div key={app._id} className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm space-y-3.5 hover:border-slate-300 transition-all text-left">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3.5">
                                  <div className="w-10 h-10 rounded-[6px] bg-[#e6f6ee] border border-[#00a151]/20 flex items-center justify-center text-[#00a151] font-semibold text-sm uppercase shrink-0">
                                    {cand.name?.charAt(0) || 'C'}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-slate-950 text-base flex items-center gap-3">
                                      {cand.name} {cand.lastname || ''}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-0.5">
                                      <p className="text-slate-500 text-xs">{cand.email} • {cand.location || 'N/A'}</p>
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
                                          className="rounded-[2px] border-slate-300 text-[#00a151] focus:ring-[#00a151] w-3.5 h-3.5"
                                        />
                                        <span className="font-medium hover:text-slate-700">Add to Compare</span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3.5">
                                  <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">AI Match</span>
                                    <span className={`text-lg font-semibold tracking-[-0.02em] ${app.matchScore >= 80 ? 'text-[#00a151]' : app.matchScore >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                                      {app.matchScore}%
                                    </span>
                                  </div>
                                  {/* CRM Stage Dropdown */}
                                  <div>
                                    <select
                                      value={app.status}
                                      onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                                      className="bg-white border border-slate-200 text-slate-800 rounded-[4px] px-2.5 py-1.5 text-xs font-medium focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all cursor-pointer shadow-sm"
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
                                      className="px-3 py-1.5 bg-[#e6f6ee] border border-[#00a151]/30 hover:bg-[#00a151] hover:text-white text-[#00a151] rounded-[4px] text-xs font-medium transition-all flex items-center gap-1 shadow-sm"
                                    >
                                      ⚡ AI Email
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Skills */}
                              {cand.skills && cand.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {cand.skills.map((s, idx) => {
                                    const verifiedObj = cand.verifiedSkills?.find(vs => vs.skillName.toLowerCase() === s.toLowerCase());
                                    return (
                                      <span key={idx} className={`px-2 py-0.5 border rounded-[2px] text-[10px] flex items-center gap-1 ${
                                        verifiedObj
                                          ? 'bg-[#e6f6ee] border-[#00a151]/30 text-[#00a151] font-medium'
                                          : 'bg-slate-100 border-slate-200 text-slate-600'
                                      }`}>
                                        {verifiedObj && <Check size={10} />}
                                        {s} {verifiedObj ? `(${verifiedObj.score}%)` : ''}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}

                              {cand.videoIntroUrl && (
                                <div className="pt-1">
                                  <button
                                    onClick={() => {
                                      setPlayingVideoUrl(cand.videoIntroUrl);
                                      setIsVideoModalOpen(true);
                                    }}
                                    className="bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-[4px] text-[11px] font-medium flex items-center gap-1 transition-all"
                                  >
                                    🎥 Play Video Introduction
                                  </button>
                                </div>
                              )}

                              {/* Explanation */}
                              {app.matchExplanation && (
                                <div className="bg-slate-50 border border-slate-200 p-3 rounded-[6px] text-xs text-slate-600 leading-relaxed text-left">
                                  <span className="font-medium text-[#00a151] block mb-0.5">AI Match Summary:</span>
                                  {app.matchExplanation}
                                </div>
                              )}

                              {app.redFlags && app.redFlags.length > 0 && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-[6px] text-xs space-y-1">
                                  <span className="font-semibold uppercase tracking-wider block text-[10px] text-red-700">⚠️ AI Resume Red Flags:</span>
                                  <ul className="list-disc pl-4 space-y-0.5">
                                    {app.redFlags.map((flag, idx) => (
                                      <li key={idx} className="text-slate-700 text-xs">{flag}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Resume Analysis collapsible */}
                              {app.resumeAnalysis && (
                                <details className="group border border-slate-200 bg-white rounded-[6px] overflow-hidden transition-all duration-300">
                                  <summary className="list-none flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50 select-none">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-semibold text-slate-800">ATS Resume Report</span>
                                      <span className={`text-xs font-medium px-2 py-0.5 rounded-[2px] ${app.resumeAnalysis.atsScore >= 80 ? 'bg-[#e6f6ee] text-[#00a151] border border-[#00a151]/20' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                                        {app.resumeAnalysis.atsScore || 0}/100 Score
                                      </span>
                                    </div>
                                    <span className="text-xs text-slate-500 transition-transform group-open:rotate-180">▼</span>
                                  </summary>
                                  
                                  <div className="p-4 border-t border-slate-200 space-y-3.5 bg-slate-50/50 text-left">
                                    {app.resumeAnalysis.summary && (
                                      <div className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-[6px] border border-slate-200">
                                        <span className="font-semibold text-slate-900 block mb-0.5">Resume Summary:</span>
                                        "{app.resumeAnalysis.summary}"
                                      </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                      {app.resumeAnalysis.strengths && app.resumeAnalysis.strengths.length > 0 && (
                                        <div className="bg-white p-3 rounded-[6px] border border-slate-200 text-xs">
                                          <span className="font-semibold text-[#00a151] block mb-1">Strengths</span>
                                          <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                                            {app.resumeAnalysis.strengths.map((str, i) => <li key={i}>{str}</li>)}
                                          </ul>
                                        </div>
                                      )}

                                      {app.resumeAnalysis.weaknesses && app.resumeAnalysis.weaknesses.length > 0 && (
                                        <div className="bg-white p-3 rounded-[6px] border border-slate-200 text-xs">
                                          <span className="font-semibold text-rose-600 block mb-1">Weaknesses</span>
                                          <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                                            {app.resumeAnalysis.weaknesses.map((wk, i) => <li key={i}>{wk}</li>)}
                                          </ul>
                                        </div>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                      {app.resumeAnalysis.missingSkills && app.resumeAnalysis.missingSkills.length > 0 && (
                                        <div className="bg-white p-3 rounded-[6px] border border-slate-200 text-xs">
                                          <span className="font-semibold text-amber-600 block mb-1">Missing Skills</span>
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {app.resumeAnalysis.missingSkills.map((sk, i) => (
                                              <span key={i} className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-[2px] text-[10px] font-medium">
                                                {sk}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {app.resumeAnalysis.improvementSuggestions && app.resumeAnalysis.improvementSuggestions.length > 0 && (
                                        <div className="bg-white p-3 rounded-[6px] border border-slate-200 text-xs">
                                          <span className="font-semibold text-blue-600 block mb-1">Suggestions</span>
                                          <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
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
                      <div className="bg-white rounded-[8px] p-10 border border-slate-200 text-center shadow-sm">
                        <Briefcase size={36} className="mx-auto text-slate-300 mb-3" />
                        <h3 className="text-sm font-semibold text-slate-950">No applicants yet</h3>
                        <p className="text-slate-500 text-xs">Once candidates quick apply, they will appear here with AI Match scores.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">Your Posted Jobs</h1>
                      <Link 
                        to="/postjob" 
                        className="bg-[#00a151] hover:bg-[#008c46] text-white px-3.5 py-1.5 rounded-[4px] text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <PlusCircle size={14} />
                        Post New
                      </Link>
                    </div>
        
                    {userPostedJobs.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3.5">
                        {userPostedJobs.map(job => (
                          <div key={job._id} className="bg-white p-5 rounded-[8px] border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-all">
                            <div>
                              <h3 className="font-semibold text-base text-slate-950">{job.position}</h3>
                              <div className="flex gap-3 mt-1.5 items-center">
                                <span className="text-[11px] font-medium px-2 py-0.5 bg-[#e6f6ee] border border-[#00a151]/20 text-[#00a151] rounded-[2px] capitalize flex items-center gap-1">
                                  <Clock size={11} />
                                  {job.status}
                                </span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">{job.workLocation}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button 
                                onClick={() => handleFetchSalaryAnalysis(job)}
                                className="bg-[#e6f6ee] border border-[#00a151]/30 hover:bg-[#00a151] hover:text-white text-[#00a151] px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all shadow-sm"
                              >
                                📊 Salary Intel
                              </button>
                              <button 
                                onClick={() => { setSelectedJob(job); fetchApplicants(job._id); }}
                                className="bg-slate-950 hover:bg-slate-900 text-white px-3 py-1.5 rounded-[4px] text-xs font-medium transition-colors shadow-sm"
                              >
                                View Applicants
                              </button>
                              <button 
                                onClick={() => {
                                  if(window.confirm("Are you sure you want to delete this job?")) {
                                    deleteJob(job._id);
                                  }
                                }}
                                className="bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 px-2.5 py-1.5 rounded-[4px] text-xs font-medium transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-[8px] border border-slate-200 p-10 text-center shadow-sm">
                        <Briefcase size={36} className="mx-auto text-slate-300 mb-3" />
                        <h3 className="text-sm font-semibold text-slate-950">No jobs posted</h3>
                        <p className="text-slate-500 mb-4 text-xs">Start growing your team by posting a job.</p>
                        <Link to="/postjob" className="bg-[#00a151] hover:bg-[#008c46] text-white px-4 py-2 rounded-[4px] font-medium transition-colors text-xs shadow-sm">Post a Job</Link>
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
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-slate-200 rounded-[8px] p-3 shadow-lg flex items-center gap-3">
          <span className="text-xs font-medium text-slate-700">{compareCandidates.length} Selected</span>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="bg-[#00a151] hover:bg-[#008c46] text-white text-xs font-medium px-3.5 py-1.5 rounded-[4px] transition-colors shadow-sm"
          >
            Compare Candidates
          </button>
          <button
            onClick={() => setCompareCandidates([])}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium"
          >
            Clear
          </button>
        </div>
      )}

      {/* Comparison Modal Overlay */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[8px] border border-slate-200 shadow-2xl w-full max-w-4xl p-6 relative flex flex-col max-h-[85vh] overflow-hidden text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 mb-4">
              <h3 className="font-semibold text-slate-950 text-base flex items-center gap-2">
                <Sparkles className="text-[#00a151]" size={18} />
                Candidate Comparison Matrix
              </h3>
              <button onClick={() => setIsCompareModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-semibold text-lg leading-none">×</button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700">Criteria</th>
                    {compareCandidates.map(c => (
                      <th key={c._id} className="p-3 bg-slate-50 font-semibold text-slate-900 text-xs">{c.candidateId?.name} {c.candidateId?.lastname || ''}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-medium text-slate-500">AI Match Score</td>
                    {compareCandidates.map(c => (
                      <td key={c._id} className="p-3"><span className="text-sm font-semibold text-[#00a151] tracking-[-0.02em]">{c.matchScore}%</span></td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-medium text-slate-500">ATS Score</td>
                    {compareCandidates.map(c => (
                      <td key={c._id} className="p-3"><span className="font-semibold text-slate-900">{c.resumeAnalysis?.atsScore || 'N/A'}/100</span></td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-medium text-slate-500">Verified Skills</td>
                    {compareCandidates.map(c => (
                      <td key={c._id} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {c.candidateId?.verifiedSkills?.map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-[#e6f6ee] border border-[#00a151]/20 text-[#00a151] rounded-[2px] text-[10px] font-medium">{s.skillName} ({s.score}%)</span>
                          )) || 'None'}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-medium text-slate-500">Key Skills</td>
                    {compareCandidates.map(c => (
                      <td key={c._id} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {c.candidateId?.skills?.map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-[2px] text-[10px]">{s}</span>
                          )) || 'None'}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-medium text-slate-500">Location</td>
                    {compareCandidates.map(c => (
                      <td key={c._id} className="p-3 text-slate-700">{c.candidateId?.location || 'N/A'}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-medium text-slate-500">Desired Salary</td>
                    {compareCandidates.map(c => (
                      <td key={c._id} className="p-3 text-slate-700">₹{c.candidateId?.desiredSalary || 'N/A'} LPA</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-medium text-slate-500">Experience</td>
                    {compareCandidates.map(c => (
                      <td key={c._id} className="p-3 text-slate-700">
                        {c.candidateId?.experience?.map((exp, i) => (
                          <div key={i} className="mb-1">
                            <span className="font-semibold">{exp.role}</span> at {exp.company} ({exp.duration})
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 text-left">
          <div className="bg-white rounded-[8px] border border-slate-200 shadow-2xl w-full max-w-xl p-6 relative flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-semibold text-slate-950 text-sm flex items-center gap-1.5">
                <span>⚡ AI Candidate Email Generator</span>
              </h3>
              <button 
                onClick={() => {
                  setIsEmailModalOpen(false);
                  setEmailTargetCandidate(null);
                  setGeneratedEmail("");
                }} 
                className="text-slate-400 hover:text-slate-600 font-semibold text-lg leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wider">Select Template Type</label>
                <select
                  value={selectedEmailType}
                  onChange={(e) => setSelectedEmailType(e.target.value)}
                  className="w-full px-3 py-2 rounded-[4px] border border-slate-200 bg-white text-slate-900 focus:bg-white focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all text-xs font-medium"
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
                className="w-full bg-[#00a151] hover:bg-[#008c46] text-white font-medium py-2 rounded-[4px] transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70 text-xs"
              >
                {generatingEmail ? 'Generating Template...' : '⚡ Generate Email Template'}
              </button>

              {generatedEmail && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1 uppercase tracking-wider">Preview Template</label>
                    <textarea
                      readOnly
                      value={generatedEmail}
                      rows="8"
                      className="w-full px-3 py-2 rounded-[4px] border border-slate-200 bg-slate-50 text-slate-800 text-xs outline-none transition-all resize-none font-sans leading-relaxed"
                    />
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedEmail);
                      toast.success("Email template copied to clipboard!");
                    }}
                    className="w-full bg-slate-950 hover:bg-slate-900 text-white font-medium py-2 rounded-[4px] text-xs transition-colors shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 text-left">
          <div className="bg-white rounded-[8px] border border-slate-200 shadow-2xl w-full max-w-xl p-6 relative flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-semibold text-slate-950 text-sm flex items-center gap-1.5">
                <span>📊 AI Salary & Compensation Analyst</span>
              </h3>
              <button 
                onClick={() => {
                  setIsSalaryModalOpen(false);
                  setSalaryTargetJob(null);
                  setSalaryAnalysisData(null);
                }} 
                className="text-slate-400 hover:text-slate-600 font-semibold text-lg leading-none"
              >
                ×
              </button>
            </div>

            {loadingSalaryAnalysis ? (
              <div className="py-12 text-center text-xs text-slate-500">
                AI is compiling salary trends and market data...
              </div>
            ) : salaryAnalysisData ? (
              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-slate-950 text-sm">{salaryTargetJob.position}</h4>
                  <p className="text-slate-500 text-xs mt-0.5">{salaryTargetJob.workLocation} • {salaryTargetJob.workType}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-[6px] text-center">
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Market Min</span>
                    <h3 className="text-base font-semibold text-slate-900 mt-0.5">₹{salaryAnalysisData.marketMin} LPA</h3>
                  </div>
                  <div className="bg-[#e6f6ee] border border-[#00a151]/20 p-3 rounded-[6px] text-center">
                    <span className="text-[10px] text-[#00a151] font-medium uppercase tracking-wider">Market Avg</span>
                    <h3 className="text-base font-semibold text-[#00a151] mt-0.5">₹{salaryAnalysisData.marketAvg} LPA</h3>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-[6px] text-center">
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Market Max</span>
                    <h3 className="text-base font-semibold text-slate-900 mt-0.5">₹{salaryAnalysisData.marketMax} LPA</h3>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-[6px] text-xs text-slate-600 leading-relaxed">
                  <span className="font-medium text-slate-900 block mb-1">Market Compensation Summary:</span>
                  {salaryAnalysisData.analysis}
                </div>

                {salaryAnalysisData.skillsPremium && salaryAnalysisData.skillsPremium.length > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block mb-2">Premium Skills Boosting Salary</span>
                    <div className="flex flex-wrap gap-1.5">
                      {salaryAnalysisData.skillsPremium.map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#e6f6ee] border border-[#00a151]/20 text-[#00a151] rounded-[2px] text-[10px] font-medium">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 text-left">
          <div className="bg-white rounded-[8px] border border-slate-200 shadow-2xl w-full max-w-2xl p-6 relative flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-semibold text-slate-950 text-sm flex items-center gap-1.5">
                <span>Candidate Video Introduction</span>
              </h3>
              <button 
                onClick={() => {
                  setIsVideoModalOpen(false);
                  setPlayingVideoUrl(null);
                }} 
                className="text-slate-400 hover:text-slate-600 font-semibold text-lg leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="aspect-video w-full rounded-[6px] overflow-hidden bg-slate-950 border border-slate-200">
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
