import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Users, Target } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 pt-32 pb-24 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-fuchsia-300/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-mukta font-bold mb-6 uppercase tracking-tight text-slate-900"
        >
          About Wayhyre
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-slate-600 mb-16 leading-relaxed max-w-2xl mx-auto font-medium"
        >
          We are redefining the recruitment experience. Wayhyre is built for top-tier professionals and forward-thinking companies who value efficiency, transparency, and quality.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-[inset_0_1px_rgba(255,255,255,0.8),_0_2px_12px_rgba(0,0,0,0.03)]"
          >
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mx-auto mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">To be the global standard for premium hiring, creating seamless connections.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-[inset_0_1px_rgba(255,255,255,0.8),_0_2px_12px_rgba(0,0,0,0.03)]"
          >
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mx-auto mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Empowering careers and accelerating business growth through smart matching.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-[inset_0_1px_rgba(255,255,255,0.8),_0_2px_12px_rgba(0,0,0,0.03)]"
          >
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mx-auto mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Our Community</h3>
            <p className="text-slate-600 text-sm leading-relaxed">A curated network of verified professionals and trusted companies.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
