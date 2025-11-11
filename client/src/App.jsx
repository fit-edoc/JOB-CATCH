import { useState } from 'react'
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
   <Outlet/>
   <Footer/>
   <Toaster/>
   </>
  )
}

export default App
