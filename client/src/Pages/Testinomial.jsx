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
    <section className="py-24 relative overflow-hidden bg-neutral-950 text-white flex flex-col items-center justify-center">
      {/* Background ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-600/5 blur-[120px] pointer-events-none" />

      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          What Our Users Say
        </h2>
        <p className="text-neutral-400 max-w-md mx-auto">
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
              className="w-full bg-neutral-900 border border-neutral-850 p-8 rounded-3xl shadow-2xl relative flex flex-col justify-between"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-8 text-neutral-800">
                <Quote size={48} className="rotate-180" />
              </div>

              <div>
                {/* Rating stars */}
                <div className="flex gap-1 mb-4 text-orange-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < item.rating ? "currentColor" : "none"} 
                      className={i < item.rating ? "text-orange-400" : "text-neutral-700"} 
                    />
                  ))}
                </div>

                <p className="text-neutral-200 text-base md:text-lg italic leading-relaxed mb-6">
                  "{item.feedback}"
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-bold text-orange-400 text-sm">
                  {item.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                  <p className="text-xs text-neutral-400">{item.role}</p>
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
          className="p-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white rounded-full transition-all active:scale-95 shadow-lg"
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
                backgroundColor: idx === current ? "#f97316" : "#404040"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          ))}
        </div>

        <button
          onClick={nextClick}
          className="p-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white rounded-full transition-all active:scale-95 shadow-lg"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default Testimonial;
