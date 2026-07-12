import { createContext, useEffect, useMemo, useState } from "react";
import axios from 'axios';
import { loginApi, registerApi, createJobApi, getalljobs, API_BASE_URL } from "../api/api";
import React from "react";
import { useContext } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({children})=>{
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [job, setJob] = useState([]);

  const fetchJob = async()=>{
    try {
      const { data } = await axios.get(getalljobs);
      setJob(data.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    fetchJob();
  },[]);

  const createJob = async(formData)=>{
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(createJobApi, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Job posted successfully!");
      fetchJob();
      return res.data;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
      throw err;
    }
  };

  const register = async (form) => {
    try {
      const { data } = await axios.post(registerApi, form);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      }
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
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteJob = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/job/deletejob/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success("Job deleted successfully");
        fetchJob();
      }
      return res.data;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete job");
      return { success: false };
    }
  };

  const sendOtp = async (email) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/user/send-otp`, { email });
      return data;
    } catch (error) {
      if (error.response) return error.response.data;
      return { success: false, message: "Network error" };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/user/verify-otp`, { email, otp });
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      if (error.response) return error.response.data;
      return { success: false, message: "Network error" };
    }
  };

  const value = useMemo(()=>({
    register, login, user, logout, createJob, job, fetchJob, deleteJob, sendOtp, verifyOtp
  }), [user, job]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext); 
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};