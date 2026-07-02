import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

const FormInput = ({ label, id, type = 'text', value, onChange, icon: Icon }) => (
  <div className="mb-5">
    <label htmlFor={id} className="block text-sm font-medium text-neutral-300 mb-2">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-3.5 text-neutral-500 w-5 h-5" />}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 focus:bg-neutral-900 text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-neutral-600`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  </div>
);

const LoginForm = () => {
  const Navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await login(form);
      
      if (result.success) {
        toast.success("Welcome back!");
        Navigate("/");
      } else {
        toast.error(result.message || "Failed to sign in");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px] opacity-60 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-neutral-950 rounded-3xl border border-neutral-850 shadow-2xl overflow-hidden relative z-10"
      >
        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-neutral-400">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <FormInput label="Email" id="email" type="email" value={form.email} onChange={handleChange} icon={Mail} />
            <FormInput label="Password" id="password" type="password" value={form.password} onChange={handleChange} icon={Lock} />
            
            <div className="flex items-center justify-between mb-8 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-neutral-800 bg-neutral-900 checked:bg-orange-500 text-orange-500 focus:ring-orange-500 w-4 h-4" />
                <span className="text-sm text-neutral-400">Remember me</span>
              </label>
              <Link to="#" className="text-sm font-medium text-orange-400 hover:text-orange-350">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-neutral-100 text-black font-semibold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-450">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-orange-400 hover:text-orange-350 underline underline-offset-4">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;