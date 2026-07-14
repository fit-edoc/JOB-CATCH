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
      {Icon && <Icon className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 rounded-lg border border-slate-200 ${disabled ? 'bg-slate-100 text-slate-500' : 'bg-slate-50/50 focus:bg-white text-slate-900'} focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-450 outline-none transition-all placeholder:text-slate-400 text-sm`}
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#52b788]/5 blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-lime-200/5 blur-[120px] opacity-60 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-xl border border-slate-200/80 shadow-[inset_0_1px_rgba(255,255,255,0.8),_0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden relative z-10"
      >
        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-tall font-bold uppercase tracking-wider text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Sign in securely using an Email OTP.</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <FormInput label="Email" id="email" type="email" value={form.email} onChange={handleChange} icon={Mail} />
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 border border-transparent mt-8"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
                  className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || form.otp.length < 6}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 border border-transparent"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Verify & Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4">
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