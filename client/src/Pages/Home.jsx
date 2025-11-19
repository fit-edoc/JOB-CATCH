import React from "react";

import { motion } from "motion/react";

import BentoGrid from "./BentoGrid";
import { Link } from "react-router-dom";
import Platform from "./Platform";
import Testinomial from "./Testinomial";

const Home = () => {
  const dataJob = [{ id: 1,postion:"60px",img:"images/fourth.png" }, { id: 2,postion:"40px",img:"/images/third.png"  }, { id: 3,postion:"20px",img:"/images/second.png"  }, { id: 4,postion:"0px",img:"/images/first.png"  }];
  return (
    <>
      <div className="min-h-[100vh] w-[100vw]  relative flex flex-col bg-[#ffffff] md:flex-row overflow-hidden">
        <div className="h-[400px] w-screen  flex flex-col items-center justify-center gap-3 md:h-[450px]">
          <h1 className="text-[30px] font-hero max-w-[250px] leading-[27px] text-center md:max-w-[35vw] md:leading-[55px] md:text-[4.5vw]">
            Find Jobs. Hire Talent. Grow Together
          </h1>
          <div className="flex items-center mt-5 w-full  h-[10px]  justify-center ">
            <div className="flex h-[30px] w-[100px] relative md:w-[120px]">
              {dataJob.map((item, index) => (
                <div  key={item.id} className="h-[35px] w-[35px] rounded-full overflow-hidden bg-white border-[1px] border-black absolute md:h-[50px] md:w-[50px]" style={{left:item.postion}}>
                  <img src={item.img} className="h-full w-full object-cover object-center" alt="" />
                </div>
              ))}
            </div>{" "}
           <Link to={'/alljobs'}> <button className="h-[30px] w-[80px] rounded-full bg-black  mt-2 text-white md:mt-5 md:h-[40px]">
              See Jobs
            </button></Link>
          </div>
        </div>

        <div className="ball absolute h-[700px] w-[700px] bg-yellow-200 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-[110%]"></div>
      </div>
      <BentoGrid/>
   <Platform/>
   <Testinomial/>
    </>
  );
};

export default Home;
