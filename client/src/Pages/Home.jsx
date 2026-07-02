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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* Hero Section with Glowing Orange/Gold Radial Gradient */}
      <section className="relative pt-32 pb-24 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-orange-600/30 blur-[140px] opacity-75 animate-pulse" />
          <div className="absolute top-[-10%] right-[20%] w-[500px] h-[500px] rounded-full bg-amber-500/20 blur-[120px] opacity-60" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          {/* Subheading Badge */}
         

          {/* Heading with Cyberpunk/Square Font Styling */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.1] mb-6 text-white"
          >
            Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">dream job</span> <br />
            with JobCatch
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-neutral-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            A premium role-based platform designed for developers and HR managers. Discover fully verified positions and hire candidates seamlessly.
          </motion.p>

          {/* Search bar styled to look cohesive */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-2 relative z-20 mb-16"
          >
            <div className="flex-1 flex items-center px-4 py-3 md:py-0 md:border-r border-white/10">
              <Search className="text-neutral-400 w-4 h-4 mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Job title, keyword, or company" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full outline-none text-white bg-transparent placeholder:text-neutral-500 text-sm" 
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3 md:py-0">
              <MapPin className="text-neutral-400 w-4 h-4 mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Location or 'Remote'" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full outline-none text-white bg-transparent placeholder:text-neutral-500 text-sm" 
              />
            </div>
            <button 
              type="submit" 
              className="bg-white hover:bg-neutral-100 text-black px-6 py-3.5 rounded-xl md:rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              Search Jobs
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>

          {/* 3-Column layout representing the mockup layout with filled details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto w-full px-4">
            
            {/* Left Card: Glassmorphic Featured Job Card */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl text-left hover:bg-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all pointer-events-none" />
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-black border border-neutral-800 text-white flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                  JC
                </div>
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-neutral-300 rounded-full text-xs font-medium">
                  Full-time
                </span>
              </div>
              <h3 className="font-semibold text-lg text-white mb-1 group-hover:text-orange-400 transition-colors">Senior React Developer</h3>
              <p className="text-neutral-400 text-sm mb-4">JobCatch • Remote</p>
              
              <div className="text-xs text-neutral-300 bg-white/5 border border-white/10 rounded-xl p-3 mb-5 leading-relaxed">
                Build premium user interfaces, iterate on high-end design assets, and drive standard frontend architectures.
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-orange-400 text-sm font-semibold">₹15 - ₹22 LPA</span>
                <Link 
                  to="/alljobs" 
                  className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-neutral-100 transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            </motion.div>

            {/* Middle: 4 Tilted Orbiting Cards around JC logo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full h-[280px] flex items-center justify-center mx-auto"
            >
              {/* Central JC logo square */}
              <div className="z-10 w-16 h-16 bg-black rounded-2xl flex items-center justify-center border-2 border-neutral-800 text-white font-bold text-xl shadow-[0_0_40px_rgba(249,115,22,0.3)] animate-pulse">
                JC
              </div>

              {/* Orbiting Card 1 (Top Left) */}
              <div className="absolute top-2 left-6 w-[125px] h-[95px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 -rotate-6 flex flex-col justify-between hover:rotate-0 hover:scale-105 hover:bg-white/10 transition-all shadow-xl text-left">
                <div className="text-orange-400"><Briefcase size={16} /></div>
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium">Active Jobs</p>
                  <p className="text-xs font-bold text-white">12,000+</p>
                </div>
              </div>

              {/* Orbiting Card 2 (Top Right) */}
              <div className="absolute top-2 right-6 w-[125px] h-[95px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 rotate-6 flex flex-col justify-between hover:rotate-0 hover:scale-105 hover:bg-white/10 transition-all shadow-xl text-left">
                <div className="text-orange-400"><Building size={16} /></div>
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium">Companies</p>
                  <p className="text-xs font-bold text-white">500+</p>
                </div>
              </div>

              {/* Orbiting Card 3 (Bottom Left) */}
              <div className="absolute bottom-2 left-6 w-[125px] h-[95px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 rotate-3 flex flex-col justify-between hover:rotate-0 hover:scale-105 hover:bg-white/10 transition-all shadow-xl text-left">
                <div className="text-orange-400"><Award size={16} /></div>
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium">Placed</p>
                  <p className="text-xs font-bold text-white">15,000+</p>
                </div>
              </div>

              {/* Orbiting Card 4 (Bottom Right) */}
              <div className="absolute bottom-2 right-6 w-[125px] h-[95px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 -rotate-3 flex flex-col justify-between hover:rotate-0 hover:scale-105 hover:bg-white/10 transition-all shadow-xl text-left">
                <div className="text-orange-400"><Zap size={16} /></div>
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium">Success Rate</p>
                  <p className="text-xs font-bold text-white">98%</p>
                </div>
              </div>
            </motion.div>

            {/* Right Card: Glassmorphic Testimonial Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl text-left hover:bg-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-neutral-300">
                  PS
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Priya Sharma</h4>
                  <p className="text-[11px] text-neutral-400">Frontend Dev @ Google</p>
                </div>
              </div>
              
              <p className="text-neutral-300 text-sm italic mb-5 leading-relaxed">
                "I found my dream job within a week! The platform's clean UI and quick filters made the process super easy."
              </p>
              
              <div className="flex gap-1 text-orange-400">
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
      <section className="border-y border-neutral-900 bg-neutral-950/50 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-6">Trusted by innovative companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 hover:opacity-75 transition-all duration-300">
            <div className="text-xl font-bold font-display text-white">Acme Corp</div>
            <div className="text-xl font-bold font-display text-white">GlobalTech</div>
            <div className="text-xl font-bold font-display text-white">Innovate AI</div>
            <div className="text-xl font-bold font-display text-white">FutureSoft</div>
            <div className="text-xl font-bold font-display text-white">Nexus Systems</div>
          </div>
        </div>
      </section>

      {/* Additional landing page content sections styled cohesively */}
      <div className="py-20 bg-neutral-950">
        <BentoGrid />
      </div>

      <div className="bg-black">
        <Platform />
      </div>

      <div className="bg-neutral-950">
        <Testimonial />
      </div>

    </div>
  );
};

export default Home;
