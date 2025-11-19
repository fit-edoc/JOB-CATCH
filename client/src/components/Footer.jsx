import { Copyright, Facebook, Github, X } from 'lucide-react'
import React from 'react'

const Footer = () => {
  

  const icon = [<Facebook/>,<X/>,<Github/>]
  const date = new Date();
let year = date.getFullYear()
  return (
    <div className='box h-[40vh] flex flex-col bg-gradient-to-r from-gray-700 via-gray-900 to-black md:flex-row'>
<div className="h-[60%]   flex justify-center items-center md:w-[30%] md:h-full">
  <h1 className='text-white  font-bold text-[20px] md:text-[5vw]'>JobCatch</h1>
</div>
<div className="h-[40%]   bg-gradient-to-t from-yellow-50 to-yellow-100 flex flex-col justify-center items-center gap-4 md:w-[70%] md:h-full">
<div className="flex gap-4">{icon.map((item)=>(<a className='bg-white rounded-full px-2 py-2 hover:bg-black hover:text-white'>{item}</a>))}</div> <p className='flex gap-1'>All Rights Reserved {year} <Copyright/></p>
</div>
      
    </div>
  )
}

export default Footer
