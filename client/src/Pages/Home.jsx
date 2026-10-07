import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  MagnifyingGlass, 
  MapPin, 
  ArrowRight, 
  ArrowUpRight,
  Briefcase, 
  Buildings, 
  ShieldCheck, 
  Sparkle, 
  Clock, 
  Check, 
  CurrencyInr,
  SlidersHorizontal,
  CaretRight,
  UserCheck
} from "@phosphor-icons/react";
import Platform from "./Platform";
import Testimonial from "./Testinomial";

const Home = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/alljobs?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
  };

  const handleQuickTagClick = (tag) => {
    setKeyword(tag);
    navigate(`/alljobs?keyword=${encodeURIComponent(tag)}`);
  };

  // Sample curated real tech roles matching our editorial standard
  const curatedJobs = [
    {
      id: "stripe-frontend",
      title: "Senior Frontend Engineer (Design Systems)",
      company: "Stripe",
      location: "Bengaluru, IN • Hybrid",
      salary: "₹32 - ₹44 LPA",
      type: "Full-time",
      typeBadge: "bg-indigo-50 text-indigo-700",
      category: "frontend",
      posted: "2 hours ago",
      verified: true,
      tags: ["React", "TypeScript", "Accessibility", "TailwindCSS"],
    },
    {
      id: "linear-systems",
      title: "Staff Distributed Systems Engineer",
      company: "Linear",
      location: "Remote (Global / IST)",
      salary: "₹45 - ₹60 LPA",
      type: "Full-time",
      typeBadge: "bg-emerald-50 text-emerald-700",
      category: "backend",
      posted: "5 hours ago",
      verified: true,
      tags: ["Node.js", "Go", "PostgreSQL", "WebSockets"],
    },
    {
      id: "figma-product",
      title: "Lead Product Designer (Core Editor)",
      company: "Figma",
      location: "Remote • India",
      salary: "₹28 - ₹38 LPA",
      type: "Full-time",
      typeBadge: "bg-amber-50 text-amber-700",
      category: "design",
      posted: "1 day ago",
      verified: true,
      tags: ["Design Systems", "Prototyping", "User Research"],
    },
    {
      id: "vercel-platform",
      title: "Edge Infrastructure Architect",
      company: "Vercel",
      location: "Bengaluru / Remote",
      salary: "₹40 - ₹55 LPA",
      type: "Full-time",
      typeBadge: "bg-emerald-50 text-emerald-700",
      category: "devops",
      posted: "1 day ago",
      verified: true,
      tags: ["Rust", "Next.js", "Kubernetes", "AWS"],
    },
  ];

  const filteredJobs = selectedCategory === "all" 
    ? curatedJobs 
    : curatedJobs.filter(j => j.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-slate-900 selection:text-white">
      
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-20 sm:pt-28 sm:pb-28 border-b border-slate-200/80 overflow-hidden">
        {/* Editorial Diagonal Lines Background Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_70%_65%_at_50%_25%,#000_50%,transparent_100%)]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, rgba(148, 163, 184, 0.22) 0, rgba(148, 163, 184, 0.22) 0.1px, transparent 1px, transparent 18px)`,
          }}
          aria-hidden="true"
        />
 <div 
          className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_70%_65%_at_50%_25%,#000_50%,transparent_100%)]"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, rgba(148, 163, 184, 0.22) 0, rgba(148, 163, 184, 0.22) 0.1px, transparent 1px, transparent 18px)`,
          }}
          aria-hidden="true"
        />
         <div 
          className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_70%_65%_at_50%_25%,#000_50%,transparent_100%)]"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, rgba(148, 163, 184, 0.22) 0, rgba(148, 163, 184, 0.22) 0.1px, transparent 1px, transparent 18px)`,
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6">
          
          <div className="max-w-3xl mx-auto text-center mb-10">
            {/* Restrained Eyebrow Badge (Rule 10) */}
            <div className="inline-flex items-center gap-1.5 rounded-[2px] bg-slate-100 border border-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-700 mb-6 tracking-[-0.01em]">
              <Sparkle size={13} weight="fill" className="text-indigo-600" />
              <span>Direct Engineering & Product Hiring</span>
            </div>

            {/* Primary Headline (Rule 2 & 3: Editorial Typography) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-semibold tracking-[-0.02em] text-slate-950 leading-[1.08] mb-6">
              The curated hiring network for top tech talent.
            </h1>

            {/* Supporting Message (Rule 1: Clear hierarchy) */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
              Direct access to vetted engineering teams and product orgs. Guaranteed compensation disclosure, verified recruiter identities, and zero algorithmic ghosting.
            </p>
          </div>

          {/* Unified High-Precision Search Bar (Rule 19: Forms & Inputs) */}
          <form 
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-[6px] p-2 shadow-sm flex flex-col sm:flex-row gap-2 mb-6"
          >
            <div className="flex-1 flex items-center px-3 py-2 sm:py-1 sm:border-r border-slate-200">
              <MagnifyingGlass size={16} weight="regular" className="text-slate-400 mr-2.5 shrink-0" />
              <input 
                type="text" 
                placeholder="Role, tech stack, or company (e.g. React, Stripe)" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full text-slate-900 text-sm placeholder:text-slate-400 bg-transparent outline-none tracking-[-0.01em]" 
              />
            </div>
            
            <div className="flex-1 flex items-center px-3 py-2 sm:py-1 border-t sm:border-t-0 border-slate-100">
              <MapPin size={16} weight="regular" className="text-slate-400 mr-2.5 shrink-0" />
              <input 
                type="text" 
                placeholder="Location or 'Remote'" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-slate-900 text-sm placeholder:text-slate-400 bg-transparent outline-none tracking-[-0.01em]" 
              />
            </div>

            <button 
              type="submit" 
              className="inline-flex items-center justify-center gap-1.5 rounded-[4px] bg-[#00a151] hover:bg-[#008c46] text-white px-5 py-2.5 text-xs font-medium transition-colors shrink-0 shadow-sm"
            >
              <span>Search Roles</span>
              <ArrowRight size={14} weight="bold" />
            </button>
          </form>

          {/* Quick-search tags (Editorial helper) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 mb-16">
            <span className="font-medium text-slate-700">Quick filters:</span>
            {["Remote", "Frontend", "Backend", "Full Stack", "Design Systems", "Founding Engineer"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTagClick(tag)}
                className="inline-flex items-center rounded-[2px] bg-slate-100 hover:bg-[#00a151]/10 hover:text-[#00a151] text-slate-600 px-2 py-0.5 transition-colors font-normal"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* 2. Realistic Product Interface Visual (Rule 22: Make interface the visual) */}
          <div className="rounded-[8px] border border-slate-200 bg-gradient-to-br from-neutral-100 via-white to-slate-50 p-3 sm:p-5 shadow-sm max-w-5xl mx-auto">
            {/* Window Chrome Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="text-slate-500 font-medium ml-2 hidden sm:inline">
                  WayHyre Verified Workspace • Real-Time Openings
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-[2px] bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[11px] font-medium">
                  ● 1,248 Verified Active Roles
                </span>
                <Link 
                  to="/alljobs" 
                  className="text-slate-600 hover:text-[#00a151] font-medium text-xs hidden sm:inline-flex items-center gap-1 transition-colors"
                >
                  View All <ArrowUpRight size={12} weight="bold" />
                </Link>
              </div>
            </div>

            {/* Split Product Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left: Interactive Live Role List (8 cols) */}
              <div className="lg:col-span-8 space-y-3">
                {curatedJobs.slice(0, 3).map((job) => (
                  <div 
                    key={job.id}
                    className="bg-white rounded-[6px] border border-slate-200 p-4.5 hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 tracking-tight">
                          {job.company}
                        </span>
                        <span className="inline-flex items-center rounded-[2px] bg-emerald-50 text-emerald-700 px-1.5 py-[1px] text-[10px] font-medium">
                          Verified
                        </span>
                        <span className="text-[11px] text-slate-400">• {job.posted}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-slate-950 tracking-[-0.01em] truncate mb-1">
                        {job.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {job.tags.slice(0, 3).map((t, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center rounded-[2px] bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600 font-normal"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <span className="text-xs sm:text-sm font-semibold text-slate-950">
                        {job.salary}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {job.location}
                      </span>
                      <Link
                        to="/alljobs"
                        className="inline-flex items-center gap-1 rounded-[4px] bg-[#00a151] hover:bg-[#008c46] text-white px-3 py-1 text-xs font-medium transition-colors shadow-sm"
                      >
                        Apply <CaretRight size={11} weight="bold" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Transparent Radar Snapshot (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-[6px] border border-slate-200 p-5 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Transparency Radar
                    </span>
                    <ShieldCheck size={16} weight="regular" className="text-emerald-600" />
                  </div>

                  <div className="space-y-3.5 mb-6">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Salary Disclosed</span>
                        <span className="font-semibold text-slate-900">100% of roles</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-[2px] overflow-hidden">
                        <div className="bg-slate-900 h-full w-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Average Response Time</span>
                        <span className="font-semibold text-slate-900">&lt; 24 hours</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-[2px] overflow-hidden">
                        <div className="bg-indigo-600 h-full w-[92%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Direct Recruiter Directness</span>
                        <span className="font-semibold text-slate-900">No agencies</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-[2px] overflow-hidden">
                        <div className="bg-emerald-600 h-full w-[98%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-900">
                    <UserCheck size={16} weight="regular" className="text-indigo-600" />
                    <span>Candidate First Policy</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal mb-3">
                    Every listed opening is audited by our engineering operations team to prevent spam listings.
                  </p>
                  <Link
                    to="/about"
                    className="text-xs font-medium text-slate-900 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                  >
                    Read our verification charter <ArrowRight size={12} weight="bold" />
                  </Link>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. Real Brand Logos Strip (Rule 9: Real SVGs, proper aspect ratios, grayscale) */}
      <section className="py-12 border-b border-slate-200/80 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-xs font-medium text-slate-500 tracking-[-0.01em] mb-8">
            Engineers and product builders placed at high-growth organizations
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity">
            
            {/* Stripe */}
            <div className="h-6 flex items-center justify-center text-slate-600 hover:text-slate-950 transition-colors" title="Stripe">
              <svg className="h-6 w-auto fill-current" viewBox="0 0 60 25">
                <path d="M59.64 14.28c0-4.47-2.18-8.02-6.52-8.02-4.36 0-7 3.55-7 8 0 5.25 3.19 7.97 7.6 7.97 2.15 0 3.77-.48 5-.1.17 0 .28-.12.33-.29l.64-2.58a.4.4 0 0 0-.15-.43 9.4 9.4 0 0 1-4.75 1.14c-2.3 0-3.89-.92-4.14-3.23h9c.28 0 .42-.14.44-.45l.05-1.95zm-9-1.57c.12-1.93 1.25-2.8 2.5-2.8 1.21 0 2.32.87 2.45 2.8H50.64zm-14.86-6.45c-1.4 0-2.3.66-2.82 1.13l-.19-.9-.35-.04h-3.8v15.77h4.4v-9.33c.9-1.17 2.43-1.02 2.76-.99v-5.64zm-12.72 2.7l-.23-2.7h-3.8v15.77h4.4v-10.4c1.07-.63 2.87-.52 3.25-.49V6.26c-1.39 0-3.08.66-3.62 2.7zm-7.6-6.68L11 2.32H6.6v4.06H3.37v3.88H6.6v7.35c0 2.83 1.88 4.67 4.75 4.67 1.34 0 2.32-.24 2.88-.54l-.4-3.48c-.4.18-2.8.84-2.8-1.59v-6.49h3.42V6.38H11.45V2.28zM30.4 1.1h-4.4v4.54h4.4V1.1zm0 5.28h-4.4v15.77h4.4V6.38zM0 13.62c0-3.2 2.06-5.26 5.37-5.26 2.05 0 3.66.77 4.4 1.26l.4-3.56a12.8 12.8 0 0 0-4.8-.84C1.94 5.22 0 7.96 0 12.35c0 6.64 4.54 7.89 7.6 7.89a13.3 13.3 0 0 0 4.88-.93l-.4-3.58a8.87 8.87 0 0 1-4.4.98c-2.43 0-7.68-.65-7.68-3.09z"/>
              </svg>
            </div>

            {/* Linear */}
            <div className="h-6 flex items-center justify-center text-slate-600 hover:text-slate-950 transition-colors" title="Linear">
              <svg className="h-5 w-auto fill-current" viewBox="0 0 100 100">
                <path d="M1.2 59.8a48.7 48.7 0 0 0 39 39L1.2 59.8Zm-1-19.6L60.4 99A48.7 48.7 0 0 0 .2 40.2ZM40.2.2A48.7 48.7 0 0 0 1.2 40.2L99 60.4A48.7 48.7 0 0 0 40.2.2ZM59.8 1.2L98.8 40.2A48.7 48.7 0 0 0 59.8 1.2Z"/>
              </svg>
              <span className="font-semibold text-sm tracking-tight ml-2">Linear</span>
            </div>

            {/* Figma */}
            <div className="h-6 flex items-center justify-center text-slate-600 hover:text-slate-950 transition-colors" title="Figma">
              <svg className="h-5 w-auto fill-current" viewBox="0 0 38 57">
                <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0zM0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0zM0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5zm19-9.5h9.5a9.5 9.5 0 0 1 0 19H19V0zm0 19h9.5a9.5 9.5 0 0 1 0 19H19V19z"/>
              </svg>
              <span className="font-semibold text-sm tracking-tight ml-2">Figma</span>
            </div>

            {/* GitHub */}
            <div className="h-6 flex items-center justify-center text-slate-600 hover:text-slate-950 transition-colors" title="GitHub">
              <svg className="h-5 w-auto fill-current" viewBox="0 0 98 96">
                <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
              </svg>
              <span className="font-semibold text-sm tracking-tight ml-2">GitHub</span>
            </div>

            {/* Vercel */}
            <div className="h-6 flex items-center justify-center text-slate-600 hover:text-slate-950 transition-colors" title="Vercel">
              <svg className="h-4 w-auto fill-current" viewBox="0 0 1155 1000">
                <path d="m577.3 0 577.4 1000H0z"/>
              </svg>
              <span className="font-semibold text-sm tracking-tight ml-2">Vercel</span>
            </div>

            {/* Shopify */}
            <div className="h-6 flex items-center justify-center text-slate-600 hover:text-slate-950 transition-colors" title="Shopify">
              <svg className="h-5 w-auto fill-current" viewBox="0 0 109 124">
                <path d="M78.6 15.6c-.4 0-.9.1-1.3.4-.4.2-.8.6-1 1-.2.4-.3.9-.3 1.4v2.7l-7.7 2.3c-.2-1.3-.8-2.6-1.7-3.6-1-1-2.2-1.7-3.6-2-1.4-.4-2.8-.3-4.1.2s-2.4 1.4-3.1 2.5l-6.8 2c-.6.2-1.1.5-1.5 1-.4.5-.6 1.1-.6 1.7v1.8l-8.5 2.5c-.7.2-1.3.6-1.7 1.2s-.6 1.3-.5 2l12 79.5c.1.7.5 1.3 1 1.7.5.4 1.2.6 1.9.5l65-19.1c.7-.2 1.3-.6 1.7-1.2s.5-1.3.4-2l-12-79.6c-.1-.7-.5-1.3-1-1.7s-1.2-.6-1.9-.5l-8.4 2.5v-1.8c0-.6-.2-1.2-.6-1.7-.4-.5-.9-.8-1.5-1l-6.8-2c-.5-.7-1.1-1.3-1.8-1.8-.7-.5-1.5-.9-2.4-1.1-.8-.3-1.7-.4-2.6-.3-.9.1-1.8.4-2.5.9l-7.7-2.3v-2.7c0-.5-.1-1-.3-1.4-.2-.4-.6-.8-1-1-.4-.3-.9-.4-1.3-.4z"/>
              </svg>
              <span className="font-semibold text-sm tracking-tight ml-2">Shopify</span>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Curated Open Roles Section (Editorial Layout, Rule 16) */}
      <section className="py-24 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-flex items-center rounded-[2px] bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 mb-3 tracking-[-0.01em]">
                Verified Roles
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-slate-950">
                Featured Engineering & Design Openings
              </h2>
            </div>

            {/* Category filter pills - restrained buttons (Rule 11 & 12) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "all", label: "All Roles" },
                { id: "frontend", label: "Frontend" },
                { id: "backend", label: "Backend" },
                { id: "design", label: "Design" },
                { id: "devops", label: "Infra & Cloud" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-[4px] text-xs font-medium transition-colors shrink-0 ${
                    selectedCategory === tab.id
                      ? "bg-slate-950 text-white"
                      : "bg-white text-slate-600 hover:text-slate-950 border border-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Job Cards Grid (Rule 13: Clean white cards with #E5E5E5 border and 6px radius) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {filteredJobs.map((job) => (
              <div 
                key={job.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-[6px] p-6 transition-colors flex flex-col justify-between shadow-sm group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-950 tracking-tight">
                        {job.company}
                      </span>
                      <span className="inline-flex items-center rounded-[2px] bg-emerald-50 text-emerald-700 px-1.5 py-[1px] text-[10px] font-medium">
                        Verified
                      </span>
                    </div>
                    <span className={`inline-flex items-center rounded-[2px] px-2 py-[2px] text-xs font-medium ${job.typeBadge}`}>
                      {job.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-950 tracking-[-0.01em] group-hover:text-indigo-600 transition-colors mb-2">
                    {job.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-5">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-900">{job.salary}</span>
                    <span>•</span>
                    <span>{job.posted}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center rounded-[2px] bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-normal"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/alljobs"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-900 group-hover:text-indigo-600 transition-colors ml-2 shrink-0"
                  >
                    <span>View Role</span>
                    <ArrowUpRight size={13} weight="bold" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="text-center">
            <Link
              to="/alljobs"
              className="inline-flex items-center gap-2 rounded-[4px] bg-[#00a151] hover:bg-[#008c46] text-white px-5 py-2.5 text-xs font-medium transition-colors shadow-sm"
            >
              <span>Explore All Active Listings</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>

        </div>
      </section>

      {/* 5. Platform Architecture & Benefits Section */}
      <Platform />

      {/* 6. Candidate & Recruiter Social Proof */}
      <Testimonial />

      {/* 7. Pre-Footer Call to Action (Rule 11: Two clear CTAs) */}
      <section className="py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-8 sm:p-14 text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center rounded-[2px] bg-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-700 mb-4 tracking-[-0.01em]">
              Start Hiring or Getting Hired
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-950 mb-4 leading-tight">
              Ready to find your next engineering opportunity?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-8 font-normal leading-relaxed">
              Create your profile in 2 minutes, get discovered by verified companies, and track every application with zero opacity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/alljobs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[4px] bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 text-xs font-medium transition-colors shadow-sm"
              >
                <span>Browse All Open Roles</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
              <Link
                to="/postjob"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#00a151] hover:bg-[#008c46] text-white px-5 py-2.5 text-xs font-medium transition-colors shadow-sm"
              >
                <Briefcase size={14} weight="regular" />
                <span>Post an Engineering Opening</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
