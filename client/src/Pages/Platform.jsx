import React from 'react';
import { ShieldCheck, Zap, Briefcase, Smile, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const Platform = () => {
  const gridItems = [
    {
      id: 1,
      title: "Verified & Trusted Jobs",
      icon: <ShieldCheck className="w-8 h-8 text-orange-600" />,
      description: "Access authentic job postings from verified companies — no spam, no fake listings.",
      points: [
        "100% verified employers",
        "Transparent job details",
        "Safe application process"
      ]
    },
    {
      id: 2,
      title: "Smart Job Matching",
      icon: <Zap className="w-8 h-8 text-orange-600" />,
      description: "Get job recommendations that match your skills, experience, and preferences.",
      points: [
        "Personalized job suggestions",
        "Skill-based matching",
        "Better visibility to recruiters"
      ]
    },
    {
      id: 3,
      title: "Seamless Hiring for Companies",
      icon: <Briefcase className="w-8 h-8 text-orange-600" />,
      description: "Post jobs and manage applications through an intuitive recruitment dashboard.",
      points: [
        "Quick job posting",
        "Applicant tracking",
        "Easy candidate management"
      ]
    },
    {
      id: 4,
      title: "Designed for Speed & Simplicity",
      icon: <Smile className="w-8 h-8 text-orange-600" />,
      description: "Enjoy a smooth, fast, and modern user experience across all devices.",
      points: [
        "Clean modern interface",
        "Fast application process",
        "Mobile-friendly experience"
      ]
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-white text-slate-900">
      {/* Ambient background glow */}
      <div className="absolute right-0 top-1/4 w-[400px] h-[400px] rounded-full bg-orange-100/10 blur-[100px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-[350px] h-[350px] rounded-full bg-amber-100/10 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-slate-900">
            Platform Benefits
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Why job seekers and HR managers trust JobCatch as their core hiring platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gridItems.map((item, index) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white border border-slate-200 p-8 rounded-3xl flex flex-col justify-between hover:border-orange-500/30 transition-all shadow-md hover:shadow-lg group"
            >
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                </div>
                
                <p className="text-slate-650 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Point checklist */}
              <div className="border-t border-slate-100 pt-5 mt-auto">
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {item.points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Platform;
