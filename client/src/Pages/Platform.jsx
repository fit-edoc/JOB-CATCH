import React from "react";
import { 
  ShieldCheck, 
  Lightning, 
  Briefcase, 
  CheckCircle,
  ChartLineUp,
  UserCheck,
  ArrowRight
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const Platform = () => {
  const capabilities = [
    {
      id: "verified",
      title: "100% Verified Employers",
      description: "Direct postings from vetted tech teams and verified talent partners. Zero recruitment spam, zero stale reposts.",
      badge: "Quality Guarantee",
      badgeClass: "bg-emerald-50 text-emerald-700",
      points: [
        "KYC verified company domains",
        "Mandatory salary band disclosure",
        "Real response time tracking"
      ]
    },
    {
      id: "matching",
      title: "Direct Engineering Match",
      description: "Match by technical stack, architecture experience, and compensation floor instead of generic keyword parsing.",
      badge: "High Precision",
      badgeClass: "bg-indigo-50 text-indigo-700",
      points: [
        "Tech stack & system design tags",
        "Target seniority alignment",
        "Direct routing to hiring managers"
      ]
    },
    {
      id: "pipeline",
      title: "Transparent Application Radar",
      description: "Know exactly where your application stands. Get guaranteed stage notifications and actionable feedback.",
      badge: "No Ghosting",
      badgeClass: "bg-amber-50 text-amber-700",
      points: [
        "Stage-by-stage tracking",
        "Average 48h first review cycle",
        "One-click withdrawal & updates"
      ]
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-200/80 text-slate-900">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="inline-flex items-center rounded-[2px] bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 mb-3 tracking-[-0.01em]">
            Hiring Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] text-slate-950 leading-[1.15] mb-4">
            Engineered for clarity, speed, and genuine signal.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            Legacy job boards bury candidates under thousands of reposted listings. WayHyre creates a direct, transparent channel between engineers and hiring managers.
          </p>
        </div>

        {/* Editorial Split Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
          
          {/* Left Column: Feature Highlights */}
          <div className="lg:col-span-6 space-y-6">
            {capabilities.map((item) => (
              <div 
                key={item.id}
                className="p-6 rounded-[8px] border border-slate-200 bg-white hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center rounded-[2px] px-2 py-[2px] text-xs font-medium ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-950 mb-2 tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {item.description}
                </p>
                <div className="pt-4 border-t border-slate-100">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    {item.points.map((pt, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle size={14} weight="fill" className="text-emerald-600 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: High-Fidelity UI Workbench Preview */}
          <div className="lg:col-span-6">
            <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-6 md:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="text-xs font-medium text-slate-500 ml-2">Pipeline Radar • Live Feed</span>
                </div>
                <span className="inline-flex items-center rounded-[2px] bg-emerald-50 text-emerald-700 px-2 py-[2px] text-xs font-medium">
                  Active Sync
                </span>
              </div>

              {/* Sample Hiring Flow Card */}
              <div className="bg-white rounded-[6px] border border-slate-200 p-5 mb-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Candidate Match</span>
                    <h4 className="text-base font-semibold text-slate-950">Staff Frontend Architect</h4>
                    <p className="text-xs text-slate-500">Stripe • Remote (APAC / IST)</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-[4px]">
                    96% Compatibility
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center my-3">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Base Pay</span>
                    <span className="text-xs font-semibold text-slate-900">₹36 - ₹45 LPA</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Avg Reply</span>
                    <span className="text-xs font-semibold text-slate-900">18 hours</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Process</span>
                    <span className="text-xs font-semibold text-slate-900">3 Rounds</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">Skills: React, WebGL, Node.js, Distributed Systems</span>
                  <span className="font-medium text-indigo-600 flex items-center gap-1">
                    Verified Opening
                  </span>
                </div>
              </div>

              {/* Verification Stat Card */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white rounded-[6px] border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <ShieldCheck size={18} weight="regular" />
                    <span className="text-xs font-medium text-slate-900">Employer Audit</span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-950 tracking-tight">100%</p>
                  <p className="text-xs text-slate-500 mt-0.5">Vetted corporate identity</p>
                </div>
                <div className="bg-white rounded-[6px] border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <Lightning size={18} weight="regular" />
                    <span className="text-xs font-medium text-slate-900">First Contact</span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-950 tracking-tight">24 hrs</p>
                  <p className="text-xs text-slate-500 mt-0.5">Median candidate response</p>
                </div>
              </div>

              <div className="bg-white rounded-[6px] border border-slate-200 p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-900">Ready to explore open opportunities?</p>
                  <p className="text-[11px] text-slate-500">Filter through 1,200+ verified listings across India & Remote.</p>
                </div>
                <Link
                  to="/alljobs"
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#00a151] hover:bg-[#008c46] text-white px-3.5 py-1.5 text-xs font-medium transition-colors shrink-0 shadow-sm"
                >
                  Browse Roles
                  <ArrowRight size={13} weight="bold" />
                </Link>
              </div>

            </div>
          </div>

        </div>

        {/* Restrained Platform Metrics Strip (Rule 14 & 15: No huge glowing cards, clean divider structure) */}
        <div className="border-t border-slate-200 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-3xl sm:text-4xl font-semibold text-slate-950 tracking-tight">12,400+</p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Active Tech Roles</p>
              <p className="text-xs text-slate-500 mt-1">Verified within the last 30 days</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-semibold text-slate-950 tracking-tight">520+</p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Verified Companies</p>
              <p className="text-xs text-slate-500 mt-1">From seed startups to public orgs</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-semibold text-slate-950 tracking-tight">96%</p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Interview Response Rate</p>
              <p className="text-xs text-slate-500 mt-1">Zero automated ghosting</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-semibold text-slate-950 tracking-tight">₹18.4L</p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Average Placed CTC</p>
              <p className="text-xs text-slate-500 mt-1">Complete salary transparency</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default React.memo(Platform);
