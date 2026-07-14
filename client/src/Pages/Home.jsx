import React, { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Briefcase, MapPin, ArrowRight, Sparkles, Building, Star, Award, Zap } from "lucide-react";
import BentoGrid from "./BentoGrid";
import Platform from "./Platform";
import Testimonial from "./Testinomial";

const Home = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to all jobs passing search params
    navigate(`/alljobs?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffefe] via-[#ebfe9d] to-[#ffffff] text-slate-900 overflow-x-hidden">
      
      
      {/* Hero Section with Soft Glowing Radial Gradient */}
      <section className="relative pt-32 pb-24 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#52b788]/15 blur-[140px] opacity-75 animate-pulse" />
          <div className="absolute top-[-10%] right-[20%] w-[500px] h-[500px] rounded-full bg-lime-200/10 blur-[120px] opacity-60" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          {/* Heading with Accent Colors */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.1] mb-6 text-black"
          >
            The smarter way to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#52b788] to-[#285942]">hire & get hired</span> <br />
            with WayHyre
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            A premium role-based platform designed for elite developers and forward-thinking recruiters. Discover fully verified positions and hire top talent seamlessly.
          </motion.p>

          {/* Search bar styled to look cohesive */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto bg-white border border-slate-200 p-2 rounded-2xl md:rounded-full shadow-lg flex flex-col md:flex-row gap-2 relative z-20 mb-16"
          >
            <div className="flex-1 flex items-center px-4 py-3 md:py-0 md:border-r border-slate-200">
              <Search className="text-slate-400 w-4 h-4 mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Job title, keyword, or company" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full outline-none text-slate-900 bg-transparent placeholder:text-slate-450 text-sm" 
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3 md:py-0">
              <MapPin className="text-slate-400 w-4 h-4 mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Location or 'Remote'" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full outline-none text-slate-900 bg-transparent placeholder:text-slate-450 text-sm" 
              />
            </div>
            <button 
              type="submit" 
              className="bg-[#316c50] hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl md:rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              Search Jobs
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>

          {/* 3-Column layout */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto w-full px-4">
            
            {/* Left Card: Light Featured Job Card */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),_0_4px_16px_rgba(0,0,0,0.03)] text-left hover:bg-slate-50/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#52b788]/5 rounded-full blur-2xl group-hover:bg-[#52b788]/10 transition-all pointer-events-none" />
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                  Wh
                </div>
                <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-full text-xs font-medium">
                  Full-time
                </span>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-1 group-hover:text-[#316c50] transition-colors">Senior React Developer</h3>
              <p className="text-slate-500 text-sm mb-4">WayHyre • Remote</p>
              
              <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200/60 rounded-xl p-3 mb-5 leading-relaxed">
                Build premium user interfaces, iterate on high-end design assets, and drive standard frontend architectures.
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#52b788] text-sm font-semibold">₹15 - ₹22 LPA</span>
                <Link 
                  to="/alljobs" 
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            </motion.div>

            {/* Middle: Orbiting Cards around JC logo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full h-[280px] flex items-center justify-center mx-auto"
            >
              {/* Central JC logo square */}
              <div className="z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-200 text-slate-900 font-bold text-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] animate-pulse">
                Wh
              </div>

              {/* Orbiting Card 1 (Top Left) */}
              <div className="absolute top-2 left-6 w-[125px] h-[95px] bg-white border border-slate-200 rounded-2xl p-2.5 -rotate-6 flex flex-col justify-between hover:rotate-0 hover:scale-105 transition-all shadow-md text-left">
                <div className="text-[#52b788]"><Briefcase size={16} /></div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Active Jobs</p>
                  <p className="text-xs font-bold text-slate-900">12,000+</p>
                </div>
              </div>

              {/* Orbiting Card 2 (Top Right) */}
              <div className="absolute top-2 right-6 w-[125px] h-[95px] bg-white border border-slate-200 rounded-2xl p-2.5 rotate-6 flex flex-col justify-between hover:rotate-0 hover:scale-105 transition-all shadow-md text-left">
                <div className="text-[#52b788]"><Building size={16} /></div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Companies</p>
                  <p className="text-xs font-bold text-slate-900">500+</p>
                </div>
              </div>

              {/* Orbiting Card 3 (Bottom Left) */}
              <div className="absolute bottom-2 left-6 w-[125px] h-[95px] bg-white border border-slate-200 rounded-2xl p-2.5 rotate-3 flex flex-col justify-between hover:rotate-0 hover:scale-105 transition-all shadow-md text-left">
                <div className="text-[#52b788]"><Award size={16} /></div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Placed</p>
                  <p className="text-xs font-bold text-slate-900">15,000+</p>
                </div>
              </div>

              {/* Orbiting Card 4 (Bottom Right) */}
              <div className="absolute bottom-2 right-6 w-[125px] h-[95px] bg-white border border-slate-200 rounded-2xl p-2.5 -rotate-3 flex flex-col justify-between hover:rotate-0 hover:scale-105 transition-all shadow-md text-left">
                <div className="text-[352b788]"><Zap size={16} /></div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Success Rate</p>
                  <p className="text-xs font-bold text-slate-900">98%</p>
                </div>
              </div>
            </motion.div>

            {/* Right Card: Light Testimonial Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),_0_4px_16px_rgba(0,0,0,0.03)] text-left hover:bg-slate-50/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#52b788]/5 rounded-full blur-2xl group-hover:bg-[#52b788]/10 transition-all pointer-events-none" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-650">
                  PS
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Priya Sharma</h4>
                  <p className="text-[11px] text-slate-500">Frontend Dev @ Google</p>
                </div>
              </div>
              
              <p className="text-slate-600 text-sm italic mb-5 leading-relaxed">
                "I found my dream job within a week! The platform's clean UI and quick filters made the process super easy."
              </p>
              
              <div className="flex gap-1 text-[#52b788]">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Trusted By / Company Logos */}
      <section className="border-y border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold font-tall text-slate-500 uppercase tracking-widest mb-6">Trusted by innovative companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 hover:opacity-100 transition-all duration-300">
            <div className="text-xl font-bold font-display text-slate-800">Acme Corp</div>
            <div className="text-xl font-bold font-display text-slate-800">GlobalTech</div>
            <div className="text-xl font-bold font-display text-slate-800">Innovate AI</div>
            <div className="text-xl font-bold font-display text-slate-800">FutureSoft</div>
            <div className="text-xl font-bold font-display text-slate-800">Nexus Systems</div>
          </div>
        </div>
      </section>

      {/* Additional landing page content sections styled cohesively */}
      <div className="py-20 bg-slate-50">
        <BentoGrid />
      </div>

      <div className="bg-white">
        <Platform />
      </div>

      <div className="bg-slate-50">
        <Testimonial />
      </div>

    </div>
  );
};

export default Home;
