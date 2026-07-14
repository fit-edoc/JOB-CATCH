import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, User, LogOut, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    if (user.role === 'seeker') {
      toast.error("Only Company HR / Employers can post jobs.");
      return;
    }
    navigate("/postjob");
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-5 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo matching the image */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md border border-slate-800 group-hover:scale-105 transition-transform">
            Wh
          </div>
          <div className="flex leading-none text-slate-900 select-none">
            <span className="font-display font-bold text-lg tracking-tight">WAYHYRE</span>
          </div>
        </Link>

        {/* Desktop Nav - Translucent Glassmorphic Capsule */}
        <div className="hidden md:flex items-center bg-slate-100/80 backdrop-blur-md border border-slate-200/60 px-6 py-2 rounded-full shadow-sm">
          <nav className="flex items-center gap-8 mr-6">
            <Link
              to="/alljobs"
              className={`text-sm font-medium transition-colors hover:text-slate-900 ${
                location.pathname === "/alljobs" ? "text-slate-900 font-semibold" : "text-slate-600"
              }`}
            >
              Find jobs
            </Link>
            <a
              href="#companies"
              className="text-sm font-medium transition-colors hover:text-slate-900 text-slate-600"
            >
              companies
            </a>
          </nav>

          {/* Create Job Capsule Button */}
          {(!user || user.role !== 'seeker') && (
            <button
              onClick={handleCreateJobClick}
              className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
            >
              <Briefcase size={12} />
              create job
            </button>
          )}
        </div>

        {/* Right Action Button - Light theme Capsule */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-100/80 backdrop-blur-md border border-slate-200/60 p-1.5 rounded-full shadow-sm">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-full transition-all shadow-sm"
              >
                <User size={13} />
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="flex items-center justify-center p-2 text-red-650 hover:text-red-550 hover:bg-slate-200 rounded-full transition-all"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-slate-650 hover:text-slate-900 text-sm font-semibold transition-colors px-3 py-2"
              >
                log in
              </Link>
              <Link
                to="/register"
                className="bg-slate-900 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-sm border border-transparent"
              >
                sign up 
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-slate-900 bg-slate-150 p-2 rounded-full border border-slate-200 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-200 overflow-hidden absolute top-full left-0 right-0 shadow-xl"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              <Link
                to="/alljobs"
                className="text-slate-650 font-medium py-2 hover:text-slate-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Find Jobs
              </Link>
              <a
                href="#companies"
                className="text-slate-650 font-medium py-2 hover:text-slate-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Companies
              </a>
              {(!user || user.role !== 'seeker') && (
                <button
                  onClick={(e) => {
                     handleCreateJobClick(e);
                     setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-slate-650 font-medium py-2 hover:text-slate-900 flex items-center gap-2"
                >
                  <Briefcase size={16} /> Create Job
                </button>
              )}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-slate-650 font-medium py-2 hover:text-slate-900 flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={16} /> Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-red-600 font-medium py-2 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-slate-200">
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-2.5 rounded-xl bg-slate-900 text-white font-semibold shadow-sm hover:bg-slate-800 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
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
