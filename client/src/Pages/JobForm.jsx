import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Briefcase, Building, MapPin, Link as LinkIcon, IndianRupee, Send, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const JobForm = () => {
  const token = localStorage.getItem("token");
  const Navigate = useNavigate();
  const { createJob, user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'seeker') {
      toast.error("Job seekers are not authorized to post jobs.");
      Navigate("/dashboard");
    }
  }, [user, Navigate]);

  const [generatingJD, setGeneratingJD] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "pending",
    workType: "full-time",
    salary: {
      min: "",
      max: "",
      currency: "INR",
      disclosed: true,
    },
    workLocation: "",
    applyLink: "",
    description: "",
    jobField: "Engineering",
    experience: "0-1 Years",
    skills: "",
    createdBy: user?._id || ""
  });

  const generateJobDescription = async () => {
    if (!formData.position) {
      toast.error("Please enter a Job Title / Position first");
      return;
    }
    setGeneratingJD(true);
    try {
      const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://job-catch.onrender.com';
      const response = await axios.post(`${apiBase}/api/job/generate-description`, {
        company: formData.company,
        position: formData.position,
        workType: formData.workType,
        workLocation: formData.workLocation
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setFormData(prev => ({ ...prev, description: response.data.description }));
        toast.success("Job description generated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error generating job description");
    } finally {
      setGeneratingJD(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("salary.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        salary: { ...prev.salary, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDisclosedToggle = () => {
    setFormData((prev) => ({
      ...prev,
      salary: { ...prev.salary, disclosed: !prev.salary.disclosed },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("You must be logged in to post a job");
      return;
    }
    
    try {
      const submissionData = {
        ...formData,
        skills: typeof formData.skills === 'string' 
          ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) 
          : formData.skills
      };
      await createJob(submissionData);
      Navigate("/alljobs");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-20 relative">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[8px] border border-slate-200 overflow-hidden shadow-sm"
        >
          {/* Header */}
          <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-6 text-left">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-950 mb-1">Post a New Job</h2>
            <p className="text-slate-500 text-xs">Publish your open role to thousands of verified engineering and design candidates.</p>
          </div>

          <div className="p-6 md:p-8 text-left">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Job Details Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-950 border-b border-slate-100 pb-2">Basic Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Job Title / Position</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        name="position"
                        placeholder="e.g. Senior Frontend Engineer"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3.5 py-2 rounded-[4px] border border-slate-200 bg-white text-slate-900 focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all placeholder:text-slate-400 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Company Name</label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        name="company"
                        placeholder="e.g. Stripe, Linear"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3.5 py-2 rounded-[4px] border border-slate-200 bg-white text-slate-900 focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all placeholder:text-slate-400 text-xs"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Work Type</label>
                    <select
                      name="workType"
                      value={formData.workType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 rounded-[4px] border border-slate-200 bg-white text-slate-900 focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all text-xs"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="internship">Internship</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        name="workLocation"
                        placeholder="e.g. San Francisco or Remote"
                        value={formData.workLocation}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3.5 py-2 rounded-[4px] border border-slate-200 bg-white text-slate-900 focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all placeholder:text-slate-400 text-xs"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements Section */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-semibold text-slate-950 border-b border-slate-100 pb-2">Requirements</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Job Field</label>
                    <select
                      name="jobField"
                      value={formData.jobField}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 rounded-[4px] border border-slate-200 bg-white text-slate-900 focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all text-xs"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Finance">Finance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Experience</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 rounded-[4px] border border-slate-200 bg-white text-slate-900 focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all text-xs"
                    >
                      <option value="Fresher">Fresher (0 Years)</option>
                      <option value="0-1 Years">0-1 Years</option>
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Skills (Comma Separated)</label>
                  <input
                    type="text"
                    name="skills"
                    placeholder="e.g. React, Node.js, TypeScript"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-[4px] border border-slate-200 bg-white text-slate-900 focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all placeholder:text-slate-400 text-xs"
                  />
                </div>
              </div>

              {/* Salary Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-semibold text-slate-950">Compensation</h3>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-xs text-slate-500 font-medium">Disclose Salary</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={formData.salary.disclosed}
                        onChange={handleDisclosedToggle}
                      />
                      <div className={`block w-9 h-5 rounded-full transition-colors ${formData.salary.disclosed ? 'bg-[#00a151]' : 'bg-slate-200'}`}></div>
                      <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${formData.salary.disclosed ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                </div>

                {formData.salary.disclosed && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-[6px] border border-slate-200">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Minimum Salary (INR)</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3.5 top-2.5 text-slate-400 w-3.5 h-3.5" />
                        <input
                          type="number"
                          name="salary.min"
                          placeholder="e.g. 500000"
                          value={formData.salary.min}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3.5 py-2 rounded-[4px] border border-slate-200 bg-white text-slate-900 focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all placeholder:text-slate-400 text-xs"
                          required={formData.salary.disclosed}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Maximum Salary (INR)</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3.5 top-2.5 text-slate-400 w-3.5 h-3.5" />
                        <input
                          type="number"
                          name="salary.max"
                          placeholder="e.g. 1200000"
                          value={formData.salary.max}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3.5 py-2 rounded-[4px] border border-slate-200 bg-white text-slate-900 focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all placeholder:text-slate-400 text-xs"
                          required={formData.salary.disclosed}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Job Description Generator Section */}
              <div className="space-y-6 pt-2">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="text-base font-semibold text-slate-900">Job Description</h3>
                  <button
                    type="button"
                    onClick={generateJobDescription}
                    disabled={generatingJD}
                    className="px-3 py-1.5 bg-[#e6f6ee] border border-[#00a151]/30 text-[#00a151] hover:bg-[#00a151]/20 rounded-[4px] text-xs font-medium transition-all flex items-center gap-1"
                  >
                    {generatingJD ? 'Generating...' : '⚡ Generate with AI'}
                  </button>
                </div>
                <textarea
                  name="description"
                  placeholder="Generate or write the job responsibilities and candidate expectations..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-2.5 rounded-[4px] border border-slate-200 bg-white text-slate-900 focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151]/20 outline-none transition-all resize-none placeholder:text-slate-400 text-sm font-sans"
                />
              </div>

              {/* Application Section */}
              <div className="space-y-6 pt-2">
                <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">Application Details</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Application Link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                    <input
                      type="url"
                      name="applyLink"
                      placeholder="https://yourcompany.com/careers/..."
                      value={formData.applyLink}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-[4px] border border-slate-200 bg-white text-slate-900 focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151]/20 outline-none transition-all placeholder:text-slate-400 text-sm"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">Candidates will be redirected to this link to apply for the job.</p>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => Navigate('/dashboard')}
                  className="w-1/3 border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-[4px] transition-all flex items-center justify-center gap-1.5 text-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-[#00a151] hover:bg-[#008c46] text-white font-medium py-2.5 rounded-[4px] transition-colors shadow-sm flex items-center justify-center gap-2 text-xs"
                >
                  <Send className="w-4 h-4" />
                  Publish Job Posting
                </button>
              </div>

            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobForm;
