import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Mail } from "lucide-react";
import toast from "react-hot-toast";

const FormInput = ({ label, id, type = 'text', value, onChange, icon: Icon, disabled = false }) => (
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
        disabled={disabled}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2 rounded-[4px] border border-slate-200 ${disabled ? 'bg-slate-100 text-slate-500' : 'bg-white focus:bg-white text-slate-900'} focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all placeholder:text-slate-400 text-xs`}
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
    <div className="mb-5 text-left">
      <label className="block text-xs font-medium text-slate-700 mb-2">
        Enter 6-digit verification code
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
            className="w-10 h-11 text-center text-lg font-semibold rounded-[4px] border border-slate-200 bg-white text-slate-900 focus:border-[#00a151] focus:ring-1 focus:ring-[#00a151] outline-none transition-all"
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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 sm:p-6 pt-24 pb-16">
      <div className="w-full max-w-4xl flex bg-white rounded-[8px] shadow-sm overflow-hidden border border-slate-200 min-h-[500px]">
        {/* Left Column - Visual/Editorial Brand */}
        <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-10 bg-slate-950 text-white border-r border-slate-900 text-left">
          <div className="flex items-center gap-2.5">
            <img src="/images/logo.png" alt="WayHyre Logo" className="w-9 h-9 rounded-[4px] object-cover bg-white/10 border border-white/10" />
            <span className="font-semibold text-lg text-white tracking-tight">Wayhyre</span>
          </div>

          <div className="max-w-sm flex flex-col gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#e6f6ee]/10 text-[#00a151] border border-[#00a151]/20 text-[11px] font-medium w-fit">
              Verified Candidate Matching
            </span>
            <h1 className="text-2xl font-semibold tracking-[-0.03em] leading-tight text-white">
              Connect directly with high-growth technology organizations.
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed">
              Objective skill benchmarking, transparent compensation packages, and zero recruiting noise.
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
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-slate-950 mb-1">Welcome back</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                Sign in to manage your active listings, mock interviews, and applicant pipelines.
              </p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleSendOtp}>
                <FormInput label="Email address" id="email" type="email" value={form.email} onChange={handleChange} icon={Mail} />
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-[#00a151] hover:bg-[#008c46] text-white font-medium py-2 rounded-[4px] transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70 text-xs"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Send Verification Code</>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <FormInput label="Email address" id="email" type="email" value={form.email} onChange={handleChange} icon={Mail} disabled={true} />
                
                <OtpInput otp={form.otp} onChange={handleOtpChange} />
                
                <div className="flex items-center justify-between mb-5">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Change Email
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSendOtp} 
                    disabled={loading}
                    className="text-xs font-medium text-[#00a151] hover:text-[#008c46] transition-colors"
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || form.otp.length < 6}
                  className="w-full bg-[#00a151] hover:bg-[#008c46] text-white font-medium py-2 rounded-[4px] transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70 text-xs"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Verify & Sign In <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </form>
            )}
        
            <div className="mt-6 text-center border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-[#00a151] hover:underline">
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