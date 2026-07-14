import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

const FormInput = ({ label, id, type = 'text', value, onChange, icon: Icon }) => (
  <div className="mb-5">
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-450 outline-none transition-all placeholder:text-slate-400 text-sm`}
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#52b788]/5 blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-lime-200/5 blur-[120px] opacity-60 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-xl border border-slate-200/80 shadow-[inset_0_1px_rgba(255,255,255,0.8),_0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden relative z-10"
      >
        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-tall font-bold uppercase tracking-wider text-slate-900 mb-2">Create an Account</h2>
            <p className="text-slate-500">Join WayHyre and take the next step in your career.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <FormInput label="Full Name" id="name" value={form.name} onChange={handleChange} icon={User} />
            <FormInput label="Email" id="email" type="email" value={form.email} onChange={handleChange} icon={Mail} />
            <FormInput label="Password" id="password" type="password" value={form.password} onChange={handleChange} icon={Lock} />
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                I want to register as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, role: 'seeker' }))}
                  className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${form.role === 'seeker' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-slate-50 text-slate-650 hover:bg-slate-100'}`}
                >
                  💼 Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, role: 'employer' }))}
                  className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${form.role === 'employer' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-slate-50 text-slate-650 hover:bg-slate-100'}`}
                >
                  🏢 HR / Employer
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 border border-transparent"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign Up <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;