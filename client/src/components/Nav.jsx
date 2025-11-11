import React from "react";

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Nav = () => {
  const { user, logout } = useAuth();

  const token = localStorage.getItem("token")

  
  return (
    <div className="h-[100px] w-screen fixed z-20 mx-auto  bg-[#ffabab]  flex  px-5">
      <div className="flex items-center justify-start h-full w-[30%] md:justify-center font-hero">
        <Link to={"/"}>
          <h1>JobCatch</h1>
        </Link>
      </div>
      <div className="hidden items-center justify-center gap-7 h-full w-[40%] md:flex">
        <a href="">About</a>
        <a href="">Contact</a>
     <Link to={'/jobs'}> create job</Link>
      </div>
      <div className="flex items-center justify-end  h-full w-[70%] md:w-[30%] md:justify-center cursor-pointer">
        {token ? (
          <h1
            className="bg-[#000] text-white rounded-lg px-4 py-1"
            onClick={logout}
          >
            Logout
          </h1>
        ) : (
          <Link to={"/login"}>
            {" "}
            <h1 className="bg-[#000] text-white rounded-lg px-4 py-1">Login</h1>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Nav;
