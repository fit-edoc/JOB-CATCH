import React from "react";
import { useAuth } from "../context/AuthContext";
import { Banknote, IndianRupee, MapPin } from "lucide-react";
import { useState } from "react";

const AllJobs = () => {
  const { job } = useAuth();



  

  const [filters, setFilters] = useState({
  workType: "",
  status: "",
  location: "",
});


const filteredJobs = job.filter(job => {
  return (
    (filters.workType === "" || job.workType === filters.workType) &&
    (filters.status === "" || job.status === filters.status) &&
    (filters.location === "" ||
      job.workLocation.toLowerCase().includes(filters.location.toLowerCase()))
  );
});

  

  return (
    <>

    <div className="h-[200px] px-4 w-full  flex  flex-wrap   justify-center  items-end    md:gap-4">
 <div className="w-full flex flex-wrap justify-center gap-2 ">
       <select
  value={filters.workType}
  className="px-4 py-2 rounded-lg shadow-sm shadow-black"
  onChange={(e) => setFilters({ ...filters, workType: e.target.value })}
>
  <option value="">All Work Types</option>
  <option value="full-time">Full Time</option>
  <option value="part-time">Part Time</option>
  <option value="internship">Internship</option>
  <option value="contract">Contract</option>
</select>

<select
  value={filters.status}
  className="px-4 py-2 rounded-lg shadow-sm shadow-black"
  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
>
  <option value="">All Status</option>
  <option value="pending">Pending</option>
  <option value="rejected">Rejected</option>
  <option value="interview">Interview</option>
</select>

<input
  type="text"
  className="px-4 py-2 rounded-lg shadow-sm shadow-black"
  placeholder="Location"
  value={filters.location}
  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
/>
 </div>

    </div>
      <div className="min-h-screen sm:px-3 bg-gradient-to-t from-white  py-3 w-screen gap-6 grid grid-cols-1  md:grid-cols-3 md:gap-5">
       
       
        { filteredJobs.length > 1 ? filteredJobs.map((item, index) => (

           
          <div
            key={item.id}
            className="card min-h-[200px] w-[300px] mt-5 bg-gradient-to-t from-yellow-100  to-yellow-50 rounded-lg mx-auto md:h-[200px] md:w-[30vw] "
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
        )) : <p> {filters.location} not found</p>}
      </div>
    </>
  );
};

export default AllJobs;
