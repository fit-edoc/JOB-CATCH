import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, 
  User as UserIcon, 
  SignOut, 
  List, 
  X,
  Plus
} from "@phosphor-icons/react";
import toast from "react-hot-toast";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCreateJobClick = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to post a job");
      navigate("/login");
      return;
    }
    if (user.role === "seeker") {
      toast.error("Only Company HR / Employers can post jobs.");
      return;
    }
    navigate("/postjob");
  };

  return (
    <header 
      className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled 
          ? "top-3 sm:top-4 w-[92%] sm:w-[84%] lg:w-[78%] rounded-[8px] bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm" 
          : "top-0 w-full rounded-none bg-white/80 backdrop-blur-sm border-b border-slate-200/60 border-t-transparent border-x-transparent shadow-none"
      }`}
    >
      <div className={`w-full max-w-[1200px] mx-auto px-5 sm:px-6 flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled ? "h-14 sm:h-15" : "h-16"
      }`}>
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-[6px] bg-slate-950 flex items-center justify-center p-1 border border-slate-900 shadow-sm group-hover:bg-slate-900 transition-colors">
            <img 
              src="/images/logo.png" 
              alt="WayHyre" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[17px] tracking-[-0.02em] text-slate-950 leading-none">
              WayHyre
            </span>
            <span className="text-[10px] tracking-normal text-slate-500 font-normal leading-none mt-0.5">
              Verified Hiring Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            to="/alljobs"
            className={`text-sm font-medium transition-colors tracking-[-0.01em] ${
              location.pathname === "/alljobs" 
                ? "text-slate-950" 
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            Find Jobs
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors tracking-[-0.01em] ${
              location.pathname === "/about" 
                ? "text-slate-950" 
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            About
          </Link>
          {(!user || user.role !== "seeker") && (
            <button
              onClick={handleCreateJobClick}
              className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors flex items-center gap-1.5"
            >
              Post a Role
            </button>
          )}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-[2px] bg-slate-100 px-2 py-[2px] text-xs font-medium text-slate-700 capitalize">
                {user.role || "Member"}
              </span>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-[4px] transition-colors shadow-sm"
              >
                <UserIcon size={14} weight="regular" />
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-[4px] transition-colors"
                title="Sign out"
              >
                <SignOut size={16} weight="regular" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="text-xs font-medium text-slate-700 hover:text-slate-950 px-3 py-1.5 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#00a151] hover:bg-[#008c46] text-white px-3.5 py-1.5 text-xs font-medium transition-colors shadow-sm"
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-700 hover:text-slate-950 rounded-[4px] border border-slate-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={18} /> : <List size={18} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 overflow-hidden rounded-b-[8px]"
          >
            <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-3">
              <Link
                to="/alljobs"
                className="text-sm font-medium text-slate-700 py-1.5 hover:text-slate-950"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Find Jobs
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium text-slate-700 py-1.5 hover:text-slate-950"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              {(!user || user.role !== "seeker") && (
                <button
                  onClick={(e) => {
                    handleCreateJobClick(e);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-sm font-medium text-slate-700 py-1.5 hover:text-slate-950 flex items-center gap-2"
                >
                  <Briefcase size={16} /> Post a Role
                </button>
              )}
              {user ? (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserIcon size={16} /> Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs font-medium text-rose-600 flex items-center gap-1.5"
                  >
                    <SignOut size={14} /> Sign out
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                  <Link
                    to="/login"
                    className="flex-1 text-center py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-[4px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center py-2 text-xs font-medium text-white bg-[#00a151] hover:bg-[#008c46] rounded-[4px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Nav;
