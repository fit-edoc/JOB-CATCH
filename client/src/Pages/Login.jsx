import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";








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

const LoginForm = () => {


  const Navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const {login} = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    
    try {
      const result = await login(form);
      
      if (result.success) {
        setFeedback({ message: result.message, type: 'success' });
        Navigate("/")
      } else {
       
        setFeedback({ message: result.message, type: 'error' });
      }

    } catch (error) {
      console.log(error)
      setFeedback({ message: "Login API not working (Client-side error)", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="h-[80vh] w-screen flex-center bg-[#ddf4ff]">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-[50px] shadow-2xl max-w-md h-[50vh] w-full"
    >
      <h2 className="text-3xl font-bold text-center text-[#96deff] mb-6">Login User</h2>
      <form onSubmit={handleSubmit}>
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
          className="w-full py-2 mt-4 bg-black text-white font-semibold rounded-lg hover:bg-[#8fdcff] transition duration-150 ease-in-out disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="60 40" /></svg>
          ) : (
            'Login'
          )}
        </button>
      </form>
      <div className="w-full text-center mt-3 underline"><Link  to={'/register'}> Create new Account</Link></div>
    </motion.div>
    </div>
  );
};


export default LoginForm