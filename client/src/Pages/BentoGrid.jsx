import React from "react";
import { Briefcase, Users, Bot, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const BentoGrid = () => {
  const bentoData = [
    {
      id: 1,
      title: "Dream Job",
      description: "Discover your perfect role with personalized recommendations.",
      icon: <Briefcase className="w-6 h-6 text-orange-600" />,
      gradient: "from-white to-slate-50 border-slate-200 hover:border-orange-500/30",
      colSpan: "md:col-span-1",
      img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      title: "Top Talent",
      description: "Connect with the best professionals in your industry.",
      icon: <Users className="w-6 h-6 text-orange-600" />,
      gradient: "from-white to-slate-50 border-slate-200 hover:border-orange-500/30",
      colSpan: "md:col-span-2",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Smart Matching AI",
      description: "Advanced AI algorithms to match you with perfect opportunities.",
      icon: <Bot className="w-6 h-6 text-orange-600" />,
      gradient: "from-white to-slate-50 border-slate-200 hover:border-orange-500/30",
      colSpan: "md:col-span-2",
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Career Growth",
      description: "Plan your career path with our growth tools and resources.",
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      gradient: "from-white to-slate-50 border-slate-200 hover:border-orange-500/30",
      colSpan: "md:col-span-1",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
          Experience Next-Gen Hiring
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto">
          Explore powerful features designed to make finding work and hiring candidates faster, safer, and smarter.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
        {bentoData.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`rounded-3xl p-6 flex flex-col md:flex-row gap-6 justify-between bg-gradient-to-br ${item.gradient} border shadow-md hover:shadow-lg transition-all group ${item.colSpan}`}
          >
            {/* Left/Image wrapper */}
            <div className="relative h-[180px] w-full md:w-[180px] overflow-hidden rounded-2xl border border-slate-200 shrink-0">
              <img
                src={item.img}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt={item.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
            </div>

            {/* Content info wrapper */}
            <div className="flex flex-col justify-between py-2 text-left">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 hover:text-slate-950 transition-colors cursor-pointer flex items-center gap-1">
                  Learn more <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BentoGrid;
