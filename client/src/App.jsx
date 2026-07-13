import { useState, Suspense } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import toast, { Toaster } from 'react-hot-toast';
import './App.css'
import Nav from './components/Nav'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   <Nav/>
   <Suspense fallback={
     <div className="min-h-screen bg-slate-50 flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-orange-550/20 border-t-orange-550 rounded-full animate-spin"></div>
     </div>
   }>
     <Outlet/>
   </Suspense>
   <Footer/>
   <Toaster/>
   </>
  )
}

export default App
