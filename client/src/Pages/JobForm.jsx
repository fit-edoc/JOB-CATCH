import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const JobForm = () => {


    const token = localStorage.getItem("token")
    console.log(token)

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "pending",
    workType: "full-time",
    salary: {
      min: "",
      max: "",
      currency: "INR",
      disclosed: true,
    },
    workLocation: "",
    applyLink: "",
    createdBy: "" // use your logged-in user ID
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested salary fields
    if (name.startsWith("salary.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        salary: { ...prev.salary, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDisclosedToggle = () => {
    setFormData((prev) => ({
      ...prev,
      salary: { ...prev.salary, disclosed: !prev.salary.disclosed },
    }));
  };


  const {createJob} = useAuth()
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      createJob(formData)
      // const res = await axios.post("http://localhost:8000/api/job/createjob", formData,{
      //   headers:{
      //     Authorization : `Bearer ${token}`
      //   }
      // });
      // alert("Job added successfully!");
      // console.log(res.data);
      // console.log("token" + token)
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
   <div className="h-screen w-screen flex">


<div className="h-full w-[50%] bg-lime-200"></div>
<div className="h-full w-[50%] bg-lime-200 flex items-center justify-center">
     <div className="max-w-lg min-h-[50vh] mx-auto  p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="workType"
          value={formData.workType}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
        </select>

        <div className="flex items-center justify-between">
          <label className="font-medium">Salary Disclosed:</label>
          <input
            type="checkbox"
            checked={formData.salary.disclosed}
            onChange={handleDisclosedToggle}
          />
        </div>

        {formData.salary.disclosed && (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="salary.min"
              placeholder="Min Salary"
              value={formData.salary.min}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="salary.max"
              placeholder="Max Salary"
              value={formData.salary.max}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
        )}

        <input
          type="text"
          name="workLocation"
          placeholder="Work Location"
          value={formData.workLocation}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="url"
          name="applyLink"
          placeholder="Apply Link"
          value={formData.applyLink}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

    
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Job
        </button>
      </form>
    </div>
</div>

  
   </div>
  );
};

export default JobForm;
