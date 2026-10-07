import React from "react";
import { Briefcase, Users, Bot, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const BentoGrid = () => {
  const bentoData = [
    {
      id: 1,
      title: "Precision Role Matching",
      description: "Discover curated engineering roles based on proven skill benchmarks, not generic keyword scraping.",
      icon: <Briefcase className="w-5 h-5 text-[#00a151]" />,
      colSpan: "md:col-span-1",
      img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      title: "Verified Talent Network",
      description: "Direct access to top 5% talent pre-assessed across algorithmic depth and system design.",
      icon: <Users className="w-5 h-5 text-[#00a151]" />,
      colSpan: "md:col-span-2",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Semantic ATS & AI Matching",
      description: "Proprietary natural language vector models evaluate resume depth, project relevance, and role fit in seconds.",
      icon: <Bot className="w-5 h-5 text-[#00a151]" />,
      colSpan: "md:col-span-2",
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Market Compensation Intel",
      description: "Real-time market salary benchmarks, skill wage premiums, and data-backed compensation ranges.",
      icon: <TrendingUp className="w-5 h-5 text-[#00a151]" />,
      colSpan: "md:col-span-1",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12 space-y-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] bg-[#e6f6ee] text-[#00a151] border border-[#00a151]/20 text-xs font-medium">
          Modern Infrastructure
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-950 tracking-[-0.03em]">
          Engineered for Modern Engineering Teams
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto text-xs leading-relaxed">
          High-fidelity tooling built to make sourcing, vetting, and interviewing fast, objective, and transparent.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {bentoData.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className={`rounded-[8px] p-5 flex flex-col md:flex-row gap-5 justify-between bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all ${item.colSpan}`}
          >
            {/* Left/Image wrapper */}
            <div className="relative h-[160px] w-full md:w-[170px] overflow-hidden rounded-[6px] border border-slate-200 shrink-0 bg-slate-100">
              <img
                src={item.img}
                className="w-full h-full object-cover"
                alt={item.title}
              />
            </div>

            {/* Content info wrapper */}
            <div className="flex flex-col justify-between py-1 text-left">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-[6px] bg-[#e6f6ee] border border-[#00a151]/20 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-950">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-medium text-[#00a151] hover:text-[#008c46] cursor-pointer inline-flex items-center gap-1 transition-colors">
                  Learn more <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(BentoGrid);
