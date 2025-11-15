import React, { useLayoutEffect, useRef } from "react";

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {gsap} from "gsap"


import {ScrollTrigger} from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger);
 
const Nav = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(sectionRef.current, {
       
        backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  background: "rgba(255, 255, 255, 0.25)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  duration: 0.5,
  ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "120% 10%",
          end: "150% 50%",
          scrub: false,
          
          toggleActions: "play none none reverse"
        }
      });
    }, sectionRef);

    return () => ctx.revert(); // 🧹 Clean up
  }, []);
  const { user, logout } = useAuth();

  console.log(user)

  const token = localStorage.getItem("token")


  

  
  return (
    <div className="h-[80px] w-screen fixed z-20 mx-auto  bg-[#ffffff] rounded-t-[50px]  flex  px-5" ref={sectionRef}>
      <div className="flex items-center justify-start h-full w-[30%] md:justify-center font-bold">
        <Link to={"/"}>
          <h1>JobCatch</h1>
        </Link>
      </div>
      <div className="hidden items-center justify-end gap-7 h-full w-[40%] md:flex">
   
      </div>
      <div className="flex items-center justify-end  gap-2 h-full w-[70%] md:w-[30%] md:justify-center cursor-pointer">
        {token ? (
          <h1
            className="bg-[#000] text-white rounded-full px-4 py-1.5"
            onClick={logout}
          >
            Logout
          </h1>
        ) : (
          <Link to={"/login"}>
            {" "}
            <h1 className="bg-[#000] text-white rounded-full px-4 py-1">Login</h1>
          </Link>
          
        )}
          {token && <Link to={'/postjob'}> <h1 className="font-bold  py-1 px-2 border-[1px] rounded-full border-black">Post a Job</h1></Link>}
      </div>
    </div>
  );
};

export default Nav;
