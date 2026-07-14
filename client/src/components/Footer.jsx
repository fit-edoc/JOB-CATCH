import { Facebook, Github, Twitter, Linkedin } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    Company: ["About Us", "Careers", "Contact", "Partners"],
    Candidates: ["Find Jobs", "Browse Companies", "Career Advice", "Salaries"],
    Employers: ["Post a Job", "Search Resumes", "Pricing", "Resources"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"]
  };

  const socials = [
    { icon: <Twitter size={20} />, href: "#" },
    { icon: <Linkedin size={20} />, href: "#" },
    { icon: <Facebook size={20} />, href: "#" },
    { icon: <Github size={20} />, href: "https://github.com/fit-edoc/JOB-CATCH" }
  ];

  return (
    <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl border border-slate-800">
                Wh
              </div>
              <span className="font-display font-bold text-2xl text-slate-900">
                WayHyre
              </span>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-sm">
              The ultimate platform connecting ambitious talent with world-class companies. 
              Find your dream job or hire the perfect candidate today.
            </p>
            <div className="flex gap-4">
              {socials.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all hover:-translate-y-1 shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-slate-900 font-semibold mb-6">{title}</h3>
              <ul className="flex flex-col gap-3">
                {items.map((item, index) => (
                  <li key={index}>
                    <Link to="#" className="text-slate-600 text-sm hover:text-orange-600 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} WayHyre. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-slate-500 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
