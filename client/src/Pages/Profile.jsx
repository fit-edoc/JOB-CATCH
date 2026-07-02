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
  });

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
    <div className="min-h-screen bg-black text-white pt-28 pb-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-orange-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-950 rounded-3xl border border-neutral-850 overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-neutral-900 border-b border-neutral-850 px-8 py-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Edit Profile</h2>
              <p className="text-neutral-400">Update your personal and professional details.</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 text-2xl font-bold">
              {formData.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
            
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-neutral-900 pb-2">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-neutral-500 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-white focus:bg-neutral-900 focus:border-orange-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-neutral-500 w-5 h-5" />
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-white focus:bg-neutral-900 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-neutral-500 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-white focus:bg-neutral-900 focus:border-orange-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 text-neutral-500 w-5 h-5" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-white focus:bg-neutral-900 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-neutral-900 pb-2">Account Type</h3>
              <div className="flex gap-4">
                <label className={`flex-1 flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.role === 'seeker' ? 'border-orange-500 bg-orange-500/10' : 'border-neutral-800 bg-neutral-900/20 hover:border-neutral-700'}`}>
                  <div className="flex items-center gap-3">
                    <Briefcase className={`w-5 h-5 ${formData.role === 'seeker' ? 'text-orange-400' : 'text-neutral-500'}`} />
                    <span className={`font-semibold ${formData.role === 'seeker' ? 'text-white' : 'text-neutral-400'}`}>Job Seeker</span>
                  </div>
                  <input type="radio" name="role" value="seeker" checked={formData.role === 'seeker'} onChange={handleChange} className="sr-only" />
                  {formData.role === 'seeker' && <Check className="w-5 h-5 text-orange-400" />}
                </label>
                
                <label className={`flex-1 flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.role === 'employer' ? 'border-orange-500 bg-orange-500/10' : 'border-neutral-800 bg-neutral-900/20 hover:border-neutral-700'}`}>
                  <div className="flex items-center gap-3">
                    <Building className={`w-5 h-5 ${formData.role === 'employer' ? 'text-orange-400' : 'text-neutral-500'}`} />
                    <span className={`font-semibold ${formData.role === 'employer' ? 'text-white' : 'text-neutral-400'}`}>Employer / HR</span>
                  </div>
                  <input type="radio" name="role" value="employer" checked={formData.role === 'employer'} onChange={handleChange} className="sr-only" />
                  {formData.role === 'employer' && <Check className="w-5 h-5 text-orange-400" />}
                </label>
              </div>
            </div>

            {/* Role Specific Info */}
            <div className="space-y-6">
              {formData.role === 'seeker' ? (
                <>
                  <h3 className="text-lg font-semibold text-white border-b border-neutral-900 pb-2">Professional Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us a bit about yourself..."
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-white focus:bg-neutral-900 focus:border-orange-500 outline-none transition-all resize-none placeholder:text-neutral-600"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Skills (comma separated)</label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="React, Node.js, Python..."
                        className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-white focus:bg-neutral-900 focus:border-orange-500 outline-none transition-all placeholder:text-neutral-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Resume URL</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-3.5 text-neutral-500 w-5 h-5" />
                        <input
                          type="url"
                          name="resumeLink"
                          value={formData.resumeLink}
                          onChange={handleChange}
                          placeholder="https://..."
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-white focus:bg-neutral-900 focus:border-orange-500 outline-none transition-all placeholder:text-neutral-600"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-white border-b border-neutral-900 pb-2">Company Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Company Name</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-3.5 text-neutral-500 w-5 h-5" />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Acme Corp"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-white focus:bg-neutral-900 focus:border-orange-500 outline-none transition-all placeholder:text-neutral-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Company Description</label>
                    <textarea
                      name="companyDescription"
                      value={formData.companyDescription}
                      onChange={handleChange}
                      placeholder="What does your company do?"
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-white focus:bg-neutral-900 focus:border-orange-500 outline-none transition-all resize-none placeholder:text-neutral-600"
                    ></textarea>
                  </div>
                </>
              )}
            </div>

            <div className="pt-6 flex justify-end gap-4 border-t border-neutral-900">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={16} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-white hover:bg-neutral-100 text-black font-semibold px-8 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-70"
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
