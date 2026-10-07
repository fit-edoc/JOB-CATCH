import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

const FormInput = ({ label, id, type = 'text', value, onChange, icon: Icon }) => (
  <div className="mb-4 text-left">
    <label htmlFor={id} className="block text-xs font-medium text-slate-700 mb-1.5">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required
        className={`w-full ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2 rounded-[4px] border border-slate-200 bg-white text-slate-900 focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all placeholder:text-slate-400 text-xs`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seeker' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await register(form); 
      if (response.success) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error(response.message || "Failed to create account");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 sm:p-6 pt-24 pb-16">
      <div className="w-full max-w-4xl flex bg-white rounded-[8px] shadow-sm overflow-hidden border border-slate-200 min-h-[550px]">
        
        {/* Left Column - Visual/Editorial Brand */}
        <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-10 bg-slate-950 text-white border-r border-slate-900 text-left">
          <div className="flex items-center gap-2.5">
            <img src="/images/logo.png" alt="WayHyre Logo" className="w-9 h-9 rounded-[4px] object-cover bg-white/10 border border-white/10" />
            <span className="font-semibold text-lg text-white tracking-tight">Wayhyre</span>
          </div>

          <div className="max-w-sm flex flex-col gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#e6f6ee]/10 text-[#00a151] border border-[#00a151]/20 text-[11px] font-medium w-fit">
              Talent & Hiring Platform
            </span>
            <h1 className="text-2xl font-semibold tracking-[-0.03em] leading-tight text-white">
              Create an account to benchmark skills and access curated tech roles.
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed">
              Join thousands of engineers, designers, and tech leaders hiring with precision.
            </p>
          </div>

          <div className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Wayhyre Inc. All rights reserved.
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-10 relative z-10">
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="w-full max-w-sm"
           >
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <img src="/images/logo.png" alt="WayHyre Logo" className="w-8 h-8 rounded-[4px] object-cover bg-slate-900 border border-slate-800" />
              <span className="font-semibold text-base text-slate-950 tracking-tight">Wayhyre</span>
            </div>

            <div className="mb-6 text-left">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-slate-950 mb-1">Create an account</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                Choose your profile type to customize your onboarding experience.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <FormInput label="Full Name" id="name" value={form.name} onChange={handleChange} icon={User} />
              <FormInput label="Email address" id="email" type="email" value={form.email} onChange={handleChange} icon={Mail} />
              <FormInput label="Password" id="password" type="password" value={form.password} onChange={handleChange} icon={Lock} />
              
              <div className="mb-5 text-left">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  I want to register as:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, role: 'seeker' }))}
                    className={`py-2 px-3 rounded-[4px] border text-xs font-medium transition-all ${form.role === 'seeker' ? 'border-[#00a151] bg-[#e6f6ee] text-[#00a151] ring-1 ring-[#00a151]/20' : 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50'}`}
                  >
                     Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, role: 'employer' }))}
                    className={`py-2 px-3 rounded-[4px] border text-xs font-medium transition-all ${form.role === 'employer' ? 'border-[#00a151] bg-[#e6f6ee] text-[#00a151] ring-1 ring-[#00a151]/20' : 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50'}`}
                  >
                     HR / Employer
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#00a151] hover:bg-[#008c46] text-white font-medium py-2 rounded-[4px] transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70 text-xs"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Create Account <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-[#00a151] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;