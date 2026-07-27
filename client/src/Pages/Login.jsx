import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Mail, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

const FormInput = ({ label, id, type = 'text', value, onChange, icon: Icon, disabled = false }) => (
  <div className="mb-5">
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">
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
        disabled={disabled}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 rounded-full border border-slate-200 ${disabled ? 'bg-slate-100 text-slate-500' : 'bg-slate-50/50 focus:bg-white text-slate-900'} focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all placeholder:text-slate-400 text-sm`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  </div>
);

const LoginForm = () => {
  const Navigate = useNavigate();
  const [form, setForm] = useState({ email: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const { sendOtp, verifyOtp } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await sendOtp(form.email);
      
      if (result.success) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await verifyOtp(form.email, form.otp);
      
      if (result.success) {
        toast.success("Welcome back!");
        Navigate("/");
      } else {
        toast.error(result.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white text-slate-900 relative overflow-hidden">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10">
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="w-full max-w-md"
         >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-mukta font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Sign in securely using an Email OTP.</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <FormInput label="Email" id="email" type="email" value={form.email} onChange={handleChange} icon={Mail} />
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 border border-transparent mt-8"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Send Login OTP <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <FormInput label="Email" id="email" type="email" value={form.email} onChange={handleChange} icon={Mail} disabled={true} />
              <FormInput label="Enter 6-digit OTP" id="otp" type="text" value={form.otp} onChange={handleChange} icon={KeyRound} />
              
              <div className="flex items-center justify-between mb-8 mt-2">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="text-sm font-medium text-slate-500 hover:text-slate-700"
                >
                  Change Email
                </button>
                <button 
                  type="button" 
                  onClick={handleSendOtp} 
                  disabled={loading}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || form.otp.length < 6}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 border border-transparent"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Verify & Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-purple-600 hover:text-purple-700 underline underline-offset-4">
                Sign up for free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Visual */}
      <div className="hidden lg:flex w-1/2 bg-purple-50 relative items-center justify-center overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/10 via-purple-500/5 to-fuchsia-500/10"></div>
         <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-400/20 blur-[100px] opacity-60 pointer-events-none" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-fuchsia-300/20 blur-[120px] opacity-60 pointer-events-none" />
         
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2 }}
           className="z-10 bg-white/40 backdrop-blur-md p-10 rounded-3xl border border-white/60 shadow-xl max-w-md text-center"
         >
           <h3 className="text-3xl font-mukta font-bold text-purple-900 mb-4">Elevate Your Career</h3>
           <p className="text-purple-800/80 leading-relaxed text-sm">Join the most exclusive network of elite professionals and top-tier companies. Your next big opportunity is just a sign-in away.</p>
         </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;