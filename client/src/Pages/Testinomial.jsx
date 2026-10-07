import React, { useState } from "react";
import { CaretLeft, CaretRight, Star, Quotes, CheckCircle } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";

const Testimonial = () => {
  const [current, setCurrent] = useState(0);

  const testimonials = [
    {
      quote:
        "WayHyre eliminated the noise of traditional job boards. I saw verified compensation upfront, applied directly to the engineering team at a Series B fintech, and had an offer within 9 days.",
      author: "Priya Sharma",
      role: "Senior Frontend Engineer",
      company: "Razorpay Alumni • Now at Stripe",
      status: "Placed Candidate",
      statusBadge: "bg-emerald-50 text-emerald-700",
      rating: 5,
    },
    {
      quote:
        "The signal-to-noise ratio here is unmatched. As an engineering manager, reviewing candidates with verified tech credentials and salary expectations cut our screening timeline in half.",
      author: "Vikram Mehta",
      role: "VP of Engineering",
      company: "HyperScale Tech",
      status: "Verified Employer",
      statusBadge: "bg-indigo-50 text-indigo-700",
      rating: 5,
    },
    {
      quote:
        "The application radar and timeline guarantee are game-changing. No wondering if your resume disappeared into a recruiter black hole. Real people, real feedback.",
      author: "Arjun Nambiar",
      role: "Distributed Systems Lead",
      company: "Postman",
      status: "Placed Candidate",
      statusBadge: "bg-emerald-50 text-emerald-700",
      rating: 5,
    },
    {
      quote:
        "We closed three senior backend engineering hires in under three weeks through WayHyre. Direct candidate messaging without third-party recruitment agency spam.",
      author: "Shivani Sengupta",
      role: "Head of Talent Acquisition",
      company: "NextGen Cloud Labs",
      status: "Verified Employer",
      statusBadge: "bg-indigo-50 text-indigo-700",
      rating: 5,
    },
  ];

  const handleNext = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const currentItem = testimonials[current];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80 text-slate-900">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-[2px] bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 mb-3 tracking-[-0.01em]">
              Candidate & Recruiter Signal
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-950 leading-[1.15]">
              Built for people who value transparency and respect.
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 bg-white border border-slate-200 hover:border-[#00a151] hover:text-[#00a151] text-slate-700 rounded-[4px] transition-colors shadow-sm"
              aria-label="Previous testimonial"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <span className="text-xs font-medium text-slate-500 px-2">
              {current + 1} / {testimonials.length}
            </span>
            <button
              onClick={handleNext}
              className="p-2 bg-white border border-slate-200 hover:border-[#00a151] hover:text-[#00a151] text-slate-700 rounded-[4px] transition-colors shadow-sm"
              aria-label="Next testimonial"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>

        {/* Testimonial Presentation Card */}
        <div className="bg-white rounded-[8px] border border-slate-200 p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
            
            {/* Quote & Stars */}
            <div className="flex-1">
              <div className="flex items-center gap-1 text-amber-500 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    weight="fill" 
                  />
                ))}
                <span className="text-xs font-medium text-slate-500 ml-2">5.0 Verified Review</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={current}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="text-lg sm:text-xl md:text-2xl font-normal text-slate-900 leading-relaxed tracking-[-0.01em] mb-8"
                >
                  "{currentItem.quote}"
                </motion.blockquote>
              </AnimatePresence>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                <div className="w-10 h-10 rounded-[6px] bg-slate-900 text-white font-semibold text-sm flex items-center justify-center shrink-0">
                  {currentItem.author.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-950">
                      {currentItem.author}
                    </h3>
                    <span className={`inline-flex items-center rounded-[2px] px-2 py-[2px] text-[11px] font-medium ${currentItem.statusBadge}`}>
                      {currentItem.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentItem.role} • {currentItem.company}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick trust metrics panel */}
            <div className="w-full lg:w-72 bg-slate-50 rounded-[6px] border border-slate-200/80 p-5 shrink-0">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
                Platform Standard
              </h4>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} weight="fill" className="text-emerald-600 shrink-0" />
                  <span>Zero recruiter paywalls</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} weight="fill" className="text-emerald-600 shrink-0" />
                  <span>Explicit compensation ranges</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} weight="fill" className="text-emerald-600 shrink-0" />
                  <span>Direct team communication</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} weight="fill" className="text-emerald-600 shrink-0" />
                  <span>Real application tracking</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default React.memo(Testimonial);
