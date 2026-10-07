import React from "react";
import { 
  XLogo, 
  LinkedinLogo, 
  GithubLogo 
} from "@phosphor-icons/react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-900 pt-12 pb-4 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Only social icons on the left */}
        <div className="flex items-center justify-between gap-3 ">
         <div className="flex gap-1">
           <a 
            href="https://github.com/fit-edoc/JOB-CATCH" 
            target="_blank" 
            rel="noreferrer"
            className="p-2.5 rounded-[4px] border border-slate-200 bg-white text-slate-600 hover:text-slate-950 hover:border-slate-300 transition-colors shadow-xs"
            aria-label="GitHub Repository"
          >
            <GithubLogo size={18} weight="regular" />
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noreferrer"
            className="p-2.5 rounded-[4px] border border-slate-200 bg-white text-slate-600 hover:text-slate-950 hover:border-slate-300 transition-colors shadow-xs"
            aria-label="X / Twitter"
          >
            <XLogo size={18} weight="regular" />
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noreferrer"
            className="p-2.5 rounded-[4px] border border-slate-200 bg-white text-slate-600 hover:text-slate-950 hover:border-slate-300 transition-colors shadow-xs"
            aria-label="LinkedIn"
          >
            <LinkedinLogo size={18} weight="regular" />
          </a>
         </div>
           <div className="select-none overflow-hidden flex justify-center items-center gap-2">
        <img src="images/logo.png" className="h-[45px]" alt="" />
          <h1 className="text-[4vw] font-mona tracking-[-0.04em] leading-none text-[#000000] opacity-30 select-none uppercase">
            WAYHYRE
          </h1>
        </div>
        </div>

        {/* In last: Large name WAYHYRE */}
       

      </div>
    </footer>
  );
};

export default Footer;
