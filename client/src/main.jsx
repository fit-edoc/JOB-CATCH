import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import router from './router/Index.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById("root")).render(
  
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  
);

