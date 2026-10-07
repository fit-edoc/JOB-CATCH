import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Users, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 pt-28 pb-20 relative">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#e6f6ee] text-[#00a151] border border-[#00a151]/20 text-xs font-medium">
            About Wayhyre
          </span>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-[-0.03em] text-slate-950 max-w-2xl mx-auto leading-tight">
            We are redefining the recruitment experience.
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            Wayhyre is built for top-tier professionals and forward-thinking companies who value efficiency, transparency, and verified talent.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-[8px] bg-white border border-slate-200 shadow-sm space-y-3.5 hover:border-slate-300 transition-all"
          >
            <div className="w-10 h-10 rounded-[6px] bg-[#e6f6ee] border border-[#00a151]/20 flex items-center justify-center text-[#00a151]">
              <Sparkles size={20} />
            </div>
            <h3 className="text-base font-semibold text-slate-950">Our Vision</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              To be the global benchmark for high-velocity, high-signal hiring through verified skill benchmarking.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-[8px] bg-white border border-slate-200 shadow-sm space-y-3.5 hover:border-slate-300 transition-all"
          >
            <div className="w-10 h-10 rounded-[6px] bg-[#e6f6ee] border border-[#00a151]/20 flex items-center justify-center text-[#00a151]">
              <Target size={20} />
            </div>
            <h3 className="text-base font-semibold text-slate-950">Our Mission</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Empowering engineers and hiring teams to skip noisy applications and connect directly on objective talent signals.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-[8px] bg-white border border-slate-200 shadow-sm space-y-3.5 hover:border-slate-300 transition-all"
          >
            <div className="w-10 h-10 rounded-[6px] bg-[#e6f6ee] border border-[#00a151]/20 flex items-center justify-center text-[#00a151]">
              <Users size={20} />
            </div>
            <h3 className="text-base font-semibold text-slate-950">Our Community</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              A curated network of verified builders, engineers, and tier-one tech organizations worldwide.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-[8px] bg-slate-50 border border-slate-200 text-center space-y-4"
        >
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">Ready to build your next team?</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Join thousands of professionals finding meaningful work and companies hiring without the friction.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/alljobs"
              className="bg-[#00a151] hover:bg-[#008c46] text-white px-4 py-2 rounded-[4px] text-xs font-medium transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              Browse Open Positions <ArrowRight size={13} />
            </Link>
            <Link
              to="/postjob"
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-4 py-2 rounded-[4px] text-xs font-medium transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              Post a Role
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
