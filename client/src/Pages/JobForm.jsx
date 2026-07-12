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
      await createJob(formData);
      Navigate("/alljobs");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[10%] right-[10%] w-[450px] h-[450px] rounded-full bg-orange-100/10 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg"
        >
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-200 px-8 py-10">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Post a New Job</h2>
            <p className="text-slate-500">Connect with thousands of talented professionals looking for their next big opportunity.</p>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Job Details Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Basic Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Job Title / Position</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="position"
                        placeholder="e.g. Senior Frontend Developer"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="company"
                        placeholder="e.g. Acme Corp"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Work Type</label>
                    <select
                      name="workType"
                      value={formData.workType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all appearance-none text-sm"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="internship">Internship</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="workLocation"
                        placeholder="e.g. New York or 'Remote'"
                        value={formData.workLocation}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Section */}
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-lg font-semibold text-slate-900">Compensation</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm text-slate-500 font-medium">Disclose Salary</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={formData.salary.disclosed}
                        onChange={handleDisclosedToggle}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${formData.salary.disclosed ? 'bg-orange-500' : 'bg-slate-200'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.salary.disclosed ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                </div>

                {formData.salary.disclosed && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Salary</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
                        <input
                          type="number"
                          name="salary.min"
                          placeholder="e.g. 500000"
                          value={formData.salary.min}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 text-sm"
                          required={formData.salary.disclosed}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Maximum Salary</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
                        <input
                          type="number"
                          name="salary.max"
                          placeholder="e.g. 1000000"
                          value={formData.salary.max}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 text-sm"
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
                  <h3 className="text-lg font-semibold text-slate-900">Job Description</h3>
                  <button
                    type="button"
                    onClick={generateJobDescription}
                    disabled={generatingJD}
                    className="px-3 py-1.5 bg-orange-50 border border-orange-100 text-orange-600 hover:bg-orange-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all resize-none placeholder:text-slate-400 text-sm font-sans"
                />
              </div>

              {/* Application Section */}
              <div className="space-y-6 pt-2">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Application Details</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Application Link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                    <input
                      type="url"
                      name="applyLink"
                      placeholder="https://yourcompany.com/careers/..."
                      value={formData.applyLink}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 text-sm"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Candidates will be redirected to this link to apply for the job.</p>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => Navigate('/dashboard')}
                  className="w-1/3 border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-medium py-4 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 border border-transparent"
                >
                  <Send className="w-5 h-5" />
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
