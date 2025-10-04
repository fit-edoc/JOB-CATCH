import { createContext, useMemo, useState } from "react";

import axios from 'axios'
import { registerApi } from "../api/api";
import React from "react";
import { useContext } from "react";


const AuthContext = createContext(null)



export const AuthProvider = ({children})=>{


const [user,setUser] = useState([])





const register = async (form) => {
  try {
    // Send the form directly, not {form}
    const { data } = await axios.post(registerApi, form);

    // Optional: save user in state
    setUser(data.user);


     localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    // Always return the backend response
    return data;
  } catch (error) {
    if (error.response) {
      // Return backend error message (409, 400, etc.)
      return error.response.data;
    }
    return { success: false, message: "Network error" };
  }
};










    const value =  useMemo(()=>({
        register

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