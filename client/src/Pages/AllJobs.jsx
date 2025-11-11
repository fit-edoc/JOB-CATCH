import React from "react";
import { useAuth } from "../context/AuthContext";
import { Banknote, IndianRupee, MapPin } from "lucide-react";

const AllJobs = () => {
  const { job } = useAuth();
  console.log(job);

  return (
    <>
      <div className="min-h-screen sm:px-3 bg-gradient-to-t from-white to-purple-300 py-3 w-screen gap-6 grid grid-cols-1  md:grid-cols-2 md:gap-0">
        {job.map((item, index) => (

           
          <div
            key={index}
            className="card min-h-[200px] w-[300px] bg-gradient-to-t from-purple-200  to-purple-300 rounded-lg mx-auto md:h-[200px] md:w-[30vw] "
          >
            <div className="w-full h-[20%]  flex justify-between items-center  px-1 py-1 capitalize md:px-4">
              <h1 className="text-lg font-bold ">{item.company}</h1>{" "}
              <h1>{item.position}</h1>
            </div>
            <div className="w-full h-[40%] px-4 flex items-center justify-between">
              {" "}
              <div className="flex items-center  gap-1">
                {" "}
                <Banknote />
                {item.salary.disclosed === true ?  <div className="flex">  <h1>{item.salary.min}</h1>-<h1>{item.salary.max}</h1>{" "}</div> : <h1>not-disclosed</h1> }
            
               {item.salary.disclosed === true &&  <IndianRupee />}
              </div>{" "}
             
            </div>
            <div className="w-full h-[40%] py-2 flex items-end justify-between px-4">
                
                <div className="flex gap-1">

                 <MapPin /> <h1>{item.workLocation}</h1>

                </div>
                
              <a href={item.applyLink}>  <button className="h-[40px] w-[80px] px-1 py-1 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-700  text-white">Apply</button></a>
                
                </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AllJobs;
