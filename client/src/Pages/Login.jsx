import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Mail } from "lucide-react";
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
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-xl border border-slate-200 ${disabled ? 'bg-slate-100 text-slate-500' : 'bg-slate-50/50 focus:bg-white text-slate-900'} focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all placeholder:text-slate-400 text-sm`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  </div>
);

const OtpInput = ({ otp, onChange }) => {
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    let newOtp = otp.split("").concat(Array(6).fill("")).slice(0, 6);
    newOtp[index] = value;
    onChange(newOtp.join("").trim());

    // Focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const otpArray = otp.split("").concat(Array(6).fill("")).slice(0, 6);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-700 mb-3">
        Enter 6-digit OTP
      </label>
      <div className="flex gap-2 justify-between">
        {otpArray.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all"
          />
        ))}
      </div>
    </div>
  );
};

const LoginForm = () => {
  const Navigate = useNavigate();
  const [form, setForm] = useState({ email: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const { sendOtp, verifyOtp } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (otpValue) => {
    setForm({ ...form, otp: otpValue });
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
    <div className="min-h-screen w-full flex items-start mt-20 justify-center bg-slate-50 p-4 sm:p-8">
      <div className="w-full max-w-5xl flex bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[500px] border border-slate-100/60">
        {/* Left Column - Visual/Brand */}
        <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-purple-500 via-purple-700 to-black text-white overflow-hidden">
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

            <div className="mb-8">
              <h2 className="text-3xl font-mukta font-bold text-slate-900 mb-3">Welcome back</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Access your tasks, notes, and projects anytime, anywhere - and keep everything flowing in one place.
              </p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleSendOtp}>
                <FormInput label="Your email" id="email" type="email" value={form.email} onChange={handleChange} icon={Mail} />
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 border border-transparent"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Get Started</>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <FormInput label="Your email" id="email" type="email" value={form.email} onChange={handleChange} icon={Mail} disabled={true} />
                
                <OtpInput otp={form.otp} onChange={handleOtpChange} />
                
                <div className="flex items-center justify-between mb-8">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Change Email
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSendOtp} 
                    disabled={loading}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || form.otp.length < 6}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 border border-transparent"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Verify & Sign In <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            )}
        
            <div className="mt-10 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-purple-600 hover:text-purple-700">
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;