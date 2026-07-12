import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { User, Mail, MapPin, Briefcase, FileText, Building, Check, X, ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { hostUrl } from '../api/api';

const Profile = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    location: user?.location || '',
    role: user?.role || 'seeker',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    resumeLink: user?.resumeLink || '',
    companyName: user?.companyName || '',
    companyDescription: user?.companyDescription || '',
    desiredSalary: user?.desiredSalary || '',
    experience: user?.experience || [],
    projects: user?.projects || [],
    education: user?.education || [],
    certifications: user?.certifications || [],
    resumeText: user?.resumeText || '',
    videoIntroUrl: user?.videoIntroUrl || '',
  });

  const [newExp, setNewExp] = useState({ role: '', company: '', duration: '', description: '' });
  const [newProj, setNewProj] = useState({ title: '', description: '', technologies: '', link: '' });
  const [newEdu, setNewEdu] = useState({ school: '', degree: '', fieldOfStudy: '', year: '' });
  const [newCert, setNewCert] = useState({ name: '', issuingOrganization: '', issueDate: '' });

  const [githubUsername, setGithubUsername] = useState(user?.portfolioVerification?.githubUsername || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioVerification?.portfolioUrl || '');
  const [verificationData, setVerificationData] = useState(user?.portfolioVerification || { githubVerified: false, websiteVerified: false });
  const [verifyingPortfolios, setVerifyingPortfolios] = useState(false);

  const [recruiterWebsite, setRecruiterWebsite] = useState(user?.recruiterVerification?.website || '');
  const [recruiterRegNo, setRecruiterRegNo] = useState(user?.recruiterVerification?.registrationNumber || '');
  const [recruiterVerificationData, setRecruiterVerificationData] = useState(user?.recruiterVerification || { isVerified: false });
  const [verifyingRecruiter, setVerifyingRecruiter] = useState(false);

  const handleVerifyRecruiter = async () => {
    if (!formData.companyName || !recruiterWebsite || !recruiterRegNo) {
      toast.error("Please enter Company Name, Website, and Registration Number");
      return;
    }
    setVerifyingRecruiter(true);
    try {
      const response = await axios.post(`${hostUrl}/verify-recruiter`, {
        companyName: formData.companyName,
        website: recruiterWebsite,
        registrationNumber: recruiterRegNo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setRecruiterVerificationData(response.data.recruiterVerification);
        toast.success("Employer verification successful!");
        const updatedUser = { ...user, recruiterVerification: response.data.recruiterVerification };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error verifying business registration");
    } finally {
      setVerifyingRecruiter(false);
    }
  };

  const handleVerifyPortfolios = async () => {
    if (!githubUsername && !portfolioUrl) {
      toast.error("Please enter a GitHub username or portfolio URL to verify");
      return;
    }
    setVerifyingPortfolios(true);
    try {
      const response = await axios.post(`${hostUrl}/verify-portfolio`, { githubUsername, portfolioUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setVerificationData(response.data.portfolioVerification);
        toast.success("Portfolio verification processed successfully!");
        const updatedUser = { ...user, portfolioVerification: response.data.portfolioVerification };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error running portfolio verification");
    } finally {
      setVerifyingPortfolios(false);
    }
  };

  const [extractingSkills, setExtractingSkills] = useState(false);

  const handleExtractSkills = async () => {
    if (!formData.resumeText) {
      toast.error("Please paste your raw resume text in the field below first");
      return;
    }
    setExtractingSkills(true);
    try {
      const response = await axios.post(`${hostUrl}/extract-skills`, { resumeText: formData.resumeText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          skills: response.data.skills.join(', ')
        }));
        toast.success("Skills extracted successfully! Verify and save your changes.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to extract skills using AI");
    } finally {
      setExtractingSkills(false);
    }
  };

  // Skill verification states
  const [assessmentSkill, setAssessmentSkill] = useState(null);
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [submittingAssessment, setSubmittingAssessment] = useState(false);

  const handleStartAssessment = async (skill) => {
    setAssessmentSkill(skill);
    setLoadingAssessment(true);
    setAssessmentQuestions([]);
    setSelectedAnswers({});
    setAssessmentResult(null);
    try {
      const response = await axios.post(`${hostUrl}/skill-assessment/generate`, { skillName: skill }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setAssessmentQuestions(response.data.questions);
      } else {
        toast.error("Failed to generate test questions");
        setAssessmentSkill(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading assessment");
      setAssessmentSkill(null);
    } finally {
      setLoadingAssessment(false);
    }
  };

  const handleSubmitAssessment = async () => {
    if (Object.keys(selectedAnswers).length < assessmentQuestions.length) {
      toast.error("Please answer all the questions first");
      return;
    }

    let correct = 0;
    assessmentQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    const calculatedScore = Math.round((correct / assessmentQuestions.length) * 100);

    setSubmittingAssessment(true);
    try {
      const response = await axios.post(`${hostUrl}/skill-assessment/submit`, {
        skillName: assessmentSkill,
        score: calculatedScore
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setAssessmentResult({
          score: calculatedScore,
          passed: response.data.verified,
          message: response.data.message
        });

        if (response.data.verified) {
          const updatedUser = {
            ...user,
            verifiedSkills: response.data.verifiedSkills
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          toast.success(`Skill ${assessmentSkill} Verified!`);
        } else {
          toast.error("Did not pass this time");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting assessment");
    } finally {
      setSubmittingAssessment(false);
    }
  };

  const addExperience = () => {
    if (newExp.role && newExp.company) {
      setFormData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
      setNewExp({ role: '', company: '', duration: '', description: '' });
    }
  };
  const removeExperience = (index) => {
    setFormData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  };

  const addProject = () => {
    if (newProj.title) {
      const formattedProj = {
        ...newProj,
        technologies: typeof newProj.technologies === 'string' ? newProj.technologies.split(',').map(t => t.trim()).filter(Boolean) : newProj.technologies
      };
      setFormData(prev => ({ ...prev, projects: [...prev.projects, formattedProj] }));
      setNewProj({ title: '', description: '', technologies: '', link: '' });
    }
  };
  const removeProject = (index) => {
    setFormData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
  };

  const addEducation = () => {
    if (newEdu.school && newEdu.degree) {
      setFormData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
      setNewEdu({ school: '', degree: '', fieldOfStudy: '', year: '' });
    }
  };
  const removeEducation = (index) => {
    setFormData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  };

  const addCertification = () => {
    if (newCert.name) {
      setFormData(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
      setNewCert({ name: '', issuingOrganization: '', issueDate: '' });
    }
  };
  const removeCertification = (index) => {
    setFormData(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== index) }));
  };

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };

      const res = await axios.put(`${hostUrl}/update`, dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Profile updated successfully!");
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      // Update user details in localStorage
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        // Force refresh to update header profile details
        window.location.reload();
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-orange-100/10 blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg"
        >
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-200 px-8 py-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2 text-slate-900">Edit Profile</h2>
              <p className="text-slate-500">Update your personal and professional details.</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 text-2xl font-bold">
              {formData.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
            
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Account Type</h3>
              <div className="flex gap-4">
                <label className={`flex-1 flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.role === 'seeker' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'}`}>
                  <div className="flex items-center gap-3">
                    <Briefcase className={`w-5 h-5 ${formData.role === 'seeker' ? 'text-orange-600' : 'text-slate-400'}`} />
                    <span className={`font-semibold ${formData.role === 'seeker' ? 'text-slate-900' : 'text-slate-500'}`}>Job Seeker</span>
                  </div>
                  <input type="radio" name="role" value="seeker" checked={formData.role === 'seeker'} onChange={handleChange} className="sr-only" />
                  {formData.role === 'seeker' && <Check className="w-5 h-5 text-orange-600" />}
                </label>
                
                <label className={`flex-1 flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.role === 'employer' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'}`}>
                  <div className="flex items-center gap-3">
                    <Building className={`w-5 h-5 ${formData.role === 'employer' ? 'text-orange-600' : 'text-slate-400'}`} />
                    <span className={`font-semibold ${formData.role === 'employer' ? 'text-slate-900' : 'text-slate-500'}`}>Employer / HR</span>
                  </div>
                  <input type="radio" name="role" value="employer" checked={formData.role === 'employer'} onChange={handleChange} className="sr-only" />
                  {formData.role === 'employer' && <Check className="w-5 h-5 text-orange-600" />}
                </label>
              </div>
            </div>

            {/* Role Specific Info */}
            <div className="space-y-6">
              {formData.role === 'seeker' ? (
                <>
                  <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Professional Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us a bit about yourself..."
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all resize-none placeholder:text-slate-400 text-sm font-sans"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-slate-700">Skills (comma separated)</label>
                        <button
                          type="button"
                          onClick={handleExtractSkills}
                          disabled={extractingSkills}
                          className="text-[10px] font-bold text-orange-655 hover:underline"
                        >
                          {extractingSkills ? 'Extracting...' : '⚡ AI Extract'}
                        </button>
                      </div>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="React, Node.js, Python..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Resume URL</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                        <input
                          type="url"
                          name="resumeLink"
                          value={formData.resumeLink}
                          onChange={handleChange}
                          placeholder="https://..."
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Desired Salary (INR / LPA)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-slate-500 font-semibold">₹</span>
                        <input
                          type="number"
                          name="desiredSalary"
                          value={formData.desiredSalary}
                          onChange={handleChange}
                          placeholder="e.g. 12"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Video Introduction URL</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                        <input
                          type="url"
                          name="videoIntroUrl"
                          value={formData.videoIntroUrl}
                          onChange={handleChange}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Raw Resume Text (for ATS & AI Analysis)</label>
                    <textarea
                      name="resumeText"
                      value={formData.resumeText}
                      onChange={handleChange}
                      placeholder="Paste the raw text of your resume here to let our AI scan for ATS compliance..."
                      rows="6"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all resize-none placeholder:text-slate-400 text-sm font-sans"
                    ></textarea>
                  </div>

                  {/* Portfolio Verification Section */}
                  <div className="space-y-4 pt-4 border-t border-slate-200 text-left">
                    <h4 className="font-semibold text-slate-900 text-md">Portfolio Verification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">GitHub Username</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. octocat"
                            value={githubUsername}
                            onChange={(e) => setGithubUsername(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none focus:border-orange-500"
                          />
                          {verificationData?.githubVerified ? (
                            <span className="px-2.5 py-2 bg-green-50 border border-green-200 text-green-700 font-bold rounded-lg text-[10px] flex items-center gap-1 shrink-0">
                              <Check size={12} /> Verified
                            </span>
                          ) : (
                            <span className="px-2.5 py-2 bg-red-50 border border-red-200 text-red-650 font-bold rounded-lg text-[10px] flex items-center gap-1 shrink-0">
                              <X size={12} /> Unverified
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Portfolio URL (HTTPS required)</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="https://myportfolio.com"
                            value={portfolioUrl}
                            onChange={(e) => setPortfolioUrl(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none focus:border-orange-500"
                          />
                          {verificationData?.websiteVerified ? (
                            <span className="px-2.5 py-2 bg-green-50 border border-green-200 text-green-700 font-bold rounded-lg text-[10px] flex items-center gap-1 shrink-0">
                              <Check size={12} /> Verified
                            </span>
                          ) : (
                            <span className="px-2.5 py-2 bg-red-50 border border-red-200 text-red-650 font-bold rounded-lg text-[10px] flex items-center gap-1 shrink-0">
                              <X size={12} /> Unverified
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleVerifyPortfolios}
                          disabled={verifyingPortfolios}
                          className="bg-slate-950 hover:bg-slate-900 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1 disabled:opacity-70 text-xs"
                        >
                          {verifyingPortfolios ? 'Verifying...' : 'Verify Portfolios'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Skill Verification Section */}
                  <div className="space-y-4 pt-4 border-t border-slate-200 text-left">
                    <h4 className="font-semibold text-slate-900 text-md">Skill Verification Tests</h4>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                      {/* Already Verified Skills */}
                      <div>
                        <span className="block text-xs font-semibold text-slate-500 mb-2">Verified Skills</span>
                        {user?.verifiedSkills && user.verifiedSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {user.verifiedSkills.map((vs, idx) => (
                              <span key={idx} className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 font-bold rounded-lg text-xs flex items-center gap-1.5">
                                <Check size={12} className="text-green-600" />
                                {vs.skillName} ({vs.score}%)
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No verified skills yet. Take an assessment to verify your skills.</p>
                        )}
                      </div>

                      {/* Available Skills to Verify */}
                      <div>
                        <span className="block text-xs font-semibold text-slate-500 mb-2">Available for Verification</span>
                        {formData.skills ? (
                          <div className="flex flex-wrap gap-2">
                            {formData.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, idx) => {
                              const isVerified = user?.verifiedSkills?.some(vs => vs.skillName.toLowerCase() === skill.toLowerCase());
                              if (isVerified) return null;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleStartAssessment(skill)}
                                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:border-orange-500 hover:text-orange-600 rounded-lg text-xs font-medium transition-all"
                                >
                                  ⚡ Verify {skill}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">Add some skills above to unlock verification tests.</p>
                        )}
                      </div>
                    </div>

                    {/* Skill Assessment Active Modal Panel */}
                    {assessmentSkill && (
                      <div className="mt-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <h5 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <span>Assessment: {assessmentSkill}</span>
                            <span className="text-[10px] bg-orange-50 border border-orange-100 text-orange-600 px-2 py-0.5 rounded font-normal">AI Powered</span>
                          </h5>
                          <button
                            type="button"
                            onClick={() => setAssessmentSkill(null)}
                            className="text-slate-400 hover:text-slate-600 text-xs"
                          >
                            Cancel
                          </button>
                        </div>

                        {loadingAssessment ? (
                          <div className="py-8 text-center text-xs text-slate-500">
                            Generating custom AI questions... please wait.
                          </div>
                        ) : assessmentResult ? (
                          <div className="p-4 rounded-xl border text-center space-y-3 bg-slate-50 border-slate-200">
                            {assessmentResult.passed ? (
                              <>
                                <span className="inline-block text-3xl">🎉</span>
                                <h6 className="font-bold text-green-700 text-sm">Congratulations! You Passed!</h6>
                                <p className="text-xs text-slate-600">You scored {assessmentResult.score}%. This skill has been successfully verified on your profile badge.</p>
                              </>
                            ) : (
                              <>
                                <span className="inline-block text-3xl">😢</span>
                                <h6 className="font-bold text-red-650 text-sm">Assessment Not Passed</h6>
                                <p className="text-xs text-slate-600">You scored {assessmentResult.score}%. The pass mark is 70%. Feel free to study and retake the test anytime!</p>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setAssessmentSkill(null);
                                window.location.reload();
                              }}
                              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
                            >
                              Close Assessment
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {assessmentQuestions.map((q, qIdx) => (
                              <div key={qIdx} className="space-y-2 text-xs">
                                <p className="font-semibold text-slate-800">{qIdx + 1}. {q.question}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {q.options.map((opt, optIdx) => (
                                    <label
                                      key={optIdx}
                                      className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-left transition-all ${
                                        selectedAnswers[qIdx] === optIdx
                                          ? 'border-orange-500 bg-orange-50/50'
                                          : 'border-slate-200 hover:bg-slate-50'
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`q-${qIdx}`}
                                        checked={selectedAnswers[qIdx] === optIdx}
                                        onChange={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                                        className="sr-only"
                                      />
                                      <span className="font-medium text-slate-700">{opt}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}

                            <div className="flex justify-end pt-2 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={handleSubmitAssessment}
                                disabled={submittingAssessment}
                                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm"
                              >
                                {submittingAssessment ? 'Submitting Answers...' : 'Submit Answers'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Experience List Manager */}
                  <div className="space-y-4 pt-4 border-t border-slate-200 text-left">
                    <h4 className="font-semibold text-slate-900 text-md">Experience</h4>
                    <div className="space-y-2">
                      {formData.experience.map((exp, idx) => (
                        <div key={idx} className="flex justify-between items-start bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{exp.role} at {exp.company}</p>
                            <p className="text-xs text-slate-550">{exp.duration}</p>
                            {exp.description && <p className="text-xs text-slate-600 mt-1">{exp.description}</p>}
                          </div>
                          <button type="button" onClick={() => removeExperience(idx)} className="text-red-650 hover:text-red-750 text-xs font-semibold">Remove</button>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <input
                        type="text"
                        placeholder="Role / Position"
                        value={newExp.role}
                        onChange={(e) => setNewExp(prev => ({ ...prev, role: e.target.value }))}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={newExp.company}
                        onChange={(e) => setNewExp(prev => ({ ...prev, company: e.target.value }))}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 2022 - Present)"
                        value={newExp.duration}
                        onChange={(e) => setNewExp(prev => ({ ...prev, duration: e.target.value }))}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none"
                      />
                      <textarea
                        placeholder="Description (Optional)"
                        value={newExp.description}
                        onChange={(e) => setNewExp(prev => ({ ...prev, description: e.target.value }))}
                        className="sm:col-span-3 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none resize-none"
                        rows="2"
                      />
                      <button
                        type="button"
                        onClick={addExperience}
                        className="sm:col-span-3 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-semibold transition-all"
                      >
                        Add Experience
                      </button>
                    </div>
                  </div>

                  {/* Projects List Manager */}
                  <div className="space-y-4 pt-4 border-t border-slate-200 text-left">
                    <h4 className="font-semibold text-slate-900 text-md">Projects</h4>
                    <div className="space-y-2">
                      {formData.projects.map((proj, idx) => (
                        <div key={idx} className="flex justify-between items-start bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{proj.title}</p>
                            <p className="text-xs text-slate-550">{proj.technologies ? proj.technologies.join(', ') : ''}</p>
                            {proj.description && <p className="text-xs text-slate-600 mt-1">{proj.description}</p>}
                            {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-[10px] text-orange-600 hover:underline flex items-center gap-1 mt-1">{proj.link}</a>}
                          </div>
                          <button type="button" onClick={() => removeProject(idx)} className="text-red-655 hover:text-red-755 text-xs font-semibold">Remove</button>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={newProj.title}
                        onChange={(e) => setNewProj(prev => ({ ...prev, title: e.target.value }))}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Technologies (comma separated)"
                        value={newProj.technologies}
                        onChange={(e) => setNewProj(prev => ({ ...prev, technologies: e.target.value }))}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none"
                      />
                      <input
                        type="url"
                        placeholder="Project Link (Optional)"
                        value={newProj.link}
                        onChange={(e) => setNewProj(prev => ({ ...prev, link: e.target.value }))}
                        className="sm:col-span-2 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none"
                      />
                      <textarea
                        placeholder="Description (Optional)"
                        value={newProj.description}
                        onChange={(e) => setNewProj(prev => ({ ...prev, description: e.target.value }))}
                        className="sm:col-span-2 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none resize-none"
                        rows="2"
                      />
                      <button
                        type="button"
                        onClick={addProject}
                        className="sm:col-span-2 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-semibold transition-all"
                      >
                        Add Project
                      </button>
                    </div>
                  </div>

                  {/* Education List Manager */}
                  <div className="space-y-4 pt-4 border-t border-slate-200 text-left">
                    <h4 className="font-semibold text-slate-900 text-md">Education</h4>
                    <div className="space-y-2">
                      {formData.education.map((edu, idx) => (
                        <div key={idx} className="flex justify-between items-start bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{edu.degree} in {edu.fieldOfStudy}</p>
                            <p className="text-xs text-slate-550">{edu.school} ({edu.year})</p>
                          </div>
                          <button type="button" onClick={() => removeEducation(idx)} className="text-red-655 hover:text-red-755 text-xs font-semibold">Remove</button>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <input
                        type="text"
                        placeholder="School / University"
                        value={newEdu.school}
                        onChange={(e) => setNewEdu(prev => ({ ...prev, school: e.target.value }))}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Degree (e.g. B.Tech)"
                        value={newEdu.degree}
                        onChange={(e) => setNewEdu(prev => ({ ...prev, degree: e.target.value }))}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study (e.g. Computer Science)"
                        value={newEdu.fieldOfStudy}
                        onChange={(e) => setNewEdu(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Graduation Year"
                        value={newEdu.year}
                        onChange={(e) => setNewEdu(prev => ({ ...prev, year: e.target.value }))}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={addEducation}
                        className="sm:col-span-2 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-semibold transition-all"
                      >
                        Add Education
                      </button>
                    </div>
                  </div>

                  {/* Certifications List Manager */}
                  <div className="space-y-4 pt-4 border-t border-slate-200 text-left">
                    <h4 className="font-semibold text-slate-900 text-md">Certifications</h4>
                    <div className="space-y-2">
                      {formData.certifications.map((cert, idx) => (
                        <div key={idx} className="flex justify-between items-start bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{cert.name}</p>
                            <p className="text-xs text-slate-550">{cert.issuingOrganization} ({cert.issueDate})</p>
                          </div>
                          <button type="button" onClick={() => removeCertification(idx)} className="text-red-655 hover:text-red-755 text-xs font-semibold">Remove</button>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <input
                        type="text"
                        placeholder="Certification Name"
                        value={newCert.name}
                        onChange={(e) => setNewCert(prev => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Issuing Organization"
                        value={newCert.issuingOrganization}
                        onChange={(e) => setNewCert(prev => ({ ...prev, issuingOrganization: e.target.value }))}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Date (e.g. July 2025)"
                        value={newCert.issueDate}
                        onChange={(e) => setNewCert(prev => ({ ...prev, issueDate: e.target.value }))}
                        className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={addCertification}
                        className="sm:col-span-3 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-semibold transition-all"
                      >
                        Add Certification
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Company Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Acme Corp"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Company Description</label>
                    <textarea
                      name="companyDescription"
                      value={formData.companyDescription}
                      onChange={handleChange}
                      placeholder="What does your company do?"
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all resize-none placeholder:text-slate-400"
                    ></textarea>
                  </div>

                  {/* Recruiter / Business Verification Section */}
                  <div className="space-y-4 pt-4 border-t border-slate-200 text-left">
                    <h4 className="font-semibold text-slate-900 text-md">Corporate Recruiter Verification</h4>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                      {recruiterVerificationData?.isVerified ? (
                        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2.5">
                          <Check size={18} className="bg-green-600 text-white rounded-full p-0.5 animate-pulse" />
                          <div>
                            <p className="font-bold text-xs">Verified Recruiter Status Active</p>
                            <p className="text-[10px] text-green-650 mt-0.5">Your posted jobs will display a Verified HR checkmark badge.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 text-xs">
                          <p className="text-slate-550 leading-relaxed text-[11px]">Submit corporate credentials to verify hiring legitimacy and secure candidate trust.</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Corporate Website Domain</label>
                              <input
                                type="url"
                                placeholder="https://acme.com"
                                value={recruiterWebsite}
                                onChange={(e) => setRecruiterWebsite(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Business Registration Number (CIN/CRN)</label>
                              <input
                                type="text"
                                placeholder="e.g. U72200DL2021PTC123456"
                                value={recruiterRegNo}
                                onChange={(e) => setRecruiterRegNo(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500 bg-white"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={handleVerifyRecruiter}
                              disabled={verifyingRecruiter}
                              className="bg-slate-950 hover:bg-slate-900 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1 disabled:opacity-70 text-xs"
                            >
                              {verifyingRecruiter ? 'Verifying Business...' : '⚡ Verify Employer Status'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="pt-6 flex justify-end gap-4 border-t border-slate-250">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={16} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70 border border-transparent"
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
