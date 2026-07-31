import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

const FormInput = ({ label, id, type = 'text', value, onChange, icon: Icon }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-2.5 text-slate-400 w-4 h-4" />}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all placeholder:text-slate-400 text-sm`}
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
    <div className="min-h-screen w-full flex items-start mt-20 justify-center bg-slate-50 p-4 sm:p-8">
      <div className="w-full max-w-5xl flex bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[650px] border border-slate-100/60">
        
        {/* Left Column - Visual/Brand */}
        <div className="hidden lg:flex w-1/2 relative flex-col justify-between  p-12 bg-gradient-to-br from-purple-500 via-purple-700 to-black text-white overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-400/30 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
          
          <div className="z-10 mt-auto max-w-sm flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" alt="WayHyre Logo" className="w-12 h-12 rounded-xl object-cover bg-white/10 backdrop-blur-md border border-white/20" />
              <h1 className="font-medium text-2xl text-white uppercase tracking-tight">WAYHYRE</h1>
            </div>
            <div>
              <p className="text-purple-100 text-sm mb-3 font-medium tracking-wide">Unlock your potential</p>
              <h1 className="text-4xl font-medium font-bold leading-tight mb-4 text-white">
                Discover top opportunities and connect with world-class companies
              </h1>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="w-full max-w-sm"
           >
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <img src="/images/logo.png" alt="WayHyre Logo" className="w-10 h-10 rounded-xl object-cover bg-slate-900 border border-slate-800" />
            </div>

            <div className="mb-6">
              <h2 className="text-3xl font-mukta font-bold text-slate-900 mb-2">Create an account</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Access your tasks, notes, and projects anytime, anywhere - and keep everything flowing in one place.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <FormInput label="Full Name" id="name" value={form.name} onChange={handleChange} icon={User} />
              <FormInput label="Your email" id="email" type="email" value={form.email} onChange={handleChange} icon={Mail} />
              <FormInput label="Password" id="password" type="password" value={form.password} onChange={handleChange} icon={Lock} />
              
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  I want to register as:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, role: 'seeker' }))}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${form.role === 'seeker' ? 'border-purple-500 bg-purple-50 text-purple-700 ring-1 ring-purple-500/20' : 'border-slate-200 bg-slate-50 text-slate-650 hover:bg-slate-100'}`}
                  >
                     Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, role: 'employer' }))}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${form.role === 'employer' ? 'border-purple-500 bg-purple-50 text-purple-700 ring-1 ring-purple-500/20' : 'border-slate-200 bg-slate-50 text-slate-650 hover:bg-slate-100'}`}
                  >
                     HR / Employer
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 border border-transparent"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Get Started</>
                )}
              </button>
            </form>

            
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700">
                  Log in
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