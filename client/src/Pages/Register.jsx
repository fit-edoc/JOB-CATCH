
import { useState } from "react";

import {motion} from 'motion/react'
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";


const FormInput = ({ label, id, type = 'text', value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
    />
  </div>
);

const Register = () => {


    const navigate=  useNavigate()

const {register} = useAuth()

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { message, type: 'success'|'error' }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setFeedback(null);

  try {
    const response = await register(form); 

    console.log(response);

    if (response.success) {
      setFeedback({ message: response.message, type: "success" });
      navigate("/login");
    } else {
      setFeedback({ message: response.message, type: "error" });
    }
  } catch (error) {
    setFeedback({
      message: "Registration API not working (Client-side error)",
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};


  return (

    <>
    
    <div className="w-screen h-[80vh] flex items-center  bg-[#ddf4ff] justify-center">


   
   
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-[50px] shadow-2xl max-w-md w-full"
    >
      <h2 className="text-3xl font-bold text-center text-[#8fdcff] mb-6">Register User</h2>
      <form onSubmit={handleSubmit}>
        <FormInput label="Name" id="name" value={form.name} onChange={handleChange} />
        <FormInput label="Email" id="email" type="email" value={form.email} onChange={handleChange} />
        <FormInput label="Password" id="password" type="password" value={form.password} onChange={handleChange} />
        
        {feedback && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-3 rounded-lg text-sm mb-4 ${
              feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {feedback.message}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-4 bg-p bg-black text-white font-semibold rounded-lg hover:bg-[#8fdcff] transition duration-150 ease-in-out disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="60 40" /></svg>
          ) : (
            'Register'
          )}
        </button>
      </form>
      <div className="w-full text-center underline mt-6"> <Link to={'/login'}>Already have account</Link></div>
    </motion.div>
     </div>
     </>
  );
};

export default Register