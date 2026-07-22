import { ArrowLeft, ArrowRight, Star, Quote } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
  
const Testimonial = () => {
  const [current, setCurrent] = useState(0);

  const data = [
    {
      name: "Priya Sharma",
      role: "Frontend Developer",
      feedback:
        "I found my dream job within a week! The platform’s clean UI and quick filters made the process super easy.",
      rating: 5,
    },
    {
      name: "Priya Verma",
      role: "HR Manager, SoftTech Co.",
      feedback:
        "Posting jobs and managing applications has never been smoother. The dashboard saved us so much time.",
      rating: 5,
    },
    {
      name: "Rahul Nair",
      role: "UI/UX Designer",
      feedback:
        "The platform’s personalized job recommendations helped me discover opportunities I hadn’t even considered.",
      rating: 4,
    },
    {
      name: "Shivani Singh",
      role: "Talent Acquisition Lead",
      feedback:
        "We hired multiple candidates through this portal. The applicant tracking system is incredibly intuitive.",
      rating: 5,
    },
  ];

  const nextClick = () => {
    setCurrent((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  const prevClick = () => {
    setCurrent((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 text-slate-900 flex flex-col items-center justify-center">
      {/* Background ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-100/10 blur-[120px] pointer-events-none" />

      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-slate-900">
          What Our Users Say
        </h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Hear feedback directly from successfully placed candidates and verified company HRs.
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative h-[320px] w-full max-w-[550px] px-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {data.map((item, index) => index === current && (
            <motion.div
              key={index}
              initial={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="w-full bg-white border border-slate-200 p-8 rounded-3xl shadow-lg relative flex flex-col justify-between"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-8 text-slate-100">
                <Quote size={48} className="rotate-180" />
              </div>

              <div>
                {/* Rating stars */}
                <div className="flex gap-1 mb-4 text-emerald-600">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < item.rating ? "currentColor" : "none"} 
                      className={i < item.rating ? "text-emerald-600" : "text-slate-200"} 
                    />
                  ))}
                </div>

                <p className="text-slate-650 text-base md:text-lg italic leading-relaxed mb-6 text-left">
                  "{item.feedback}"
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-600 text-sm">
                  {item.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Slider Controls */}
      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={prevClick}
          className="p-3 bg-[#ffffff] border-b-4 border-black hover:bg-slate-50  text-slate-600 hover:text-slate-900 rounded-full transition-all active:scale-95 shadow-md"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Indicators */}
        <div className="flex gap-2">
          {data.map((_, idx) => (
            <motion.div
              key={idx}
              className="rounded-full"
              initial={false}
              animate={{
                width: idx === current ? 24 : 8,
                height: 8,
                backgroundColor: idx === current ? "#53ffaf" : "#cbd5e1"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          ))}
        </div>

        <button
          onClick={nextClick}
          className="p-3 bg-white border-b-4 border-black hover:bg-slate-50   text-slate-600 hover:text-slate-900 rounded-full transition-all active:scale-95 shadow-md"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default React.memo(Testimonial);
