import { createContext, useEffect, useMemo, useState } from "react";

import axios from 'axios'
import { loginApi, registerApi,createJob } from "../api/api";
import React from "react";
import { useContext } from "react";
import toast from "react-hot-toast";
import { data } from "react-router-dom";


const AuthContext = createContext(null)



export const AuthProvider = ({children})=>{


const [user, setUser] = useState([]);


const[job,setJob] = useState([])

 





const fetchJob = async()=>{

 try {
   const {data} = await axios.get("https://job-catch.onrender.com/api/job/getjobs")

   setJob(data.jobs)
  
 } catch (error) {
  
  console.log(error)
 }


}


useEffect(()=>{
  fetchJob()
},[])



const createJob = async(formData)=>{


  const token = localStorage.getItem("token")

   try {


        const res = await axios.post("https://job-catch.onrender.com/api/job/createjob", formData,{
          headers:{
            Authorization : `Bearer ${token}`
          }
        });
        alert("Job added successfully!");
        fetchJob()
        console.log(res.data);
        console.log("token" + token)
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Something went wrong");
      }
}

const register = async (form) => {
  try {
    
    const { data } = await axios.post(registerApi, form);

    setUser(data.user);


     localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
   
    return data;
  } catch (error) {
    if (error.response) {
     
      return error.response.data;
    }
    return { success: false, message: "Network error" };
  }
};


const login = async (form) => {
  try {
  
    const { data } = await axios.post(loginApi, form);

    setUser(data);
  console.log(data)
 console.log("Token received:", data.token); // ✅ should log actual token
  localStorage.setItem("token", data.token);
     localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    
    return data;
  } catch (error) {
    if (error.response) {
     
      return error.response.data;
    }
    return { success: false, message: "Network error" };
  }
};






const logout = async()=>{
 

  try {
    localStorage.removeItem("token")
    setUser(null)
    
  } catch (error) {
    
  }
}





    const value =  useMemo(()=>({
        register,login,user,logout ,createJob ,job

    }))

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext); 
    if (!context) {
        // This check ensures the hook is only used inside the Provider
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};