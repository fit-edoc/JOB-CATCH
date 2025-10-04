import React from 'react'

const Nav = () => {
  return (
    <div className='h-[100px] w-full mx-auto  bg-[#eaf8ff] flex  px-5'>
      <div className='flex items-center justify-start h-full w-[30%] md:justify-center font-hero'><h1>JobCatch</h1></div>
          <div className='hidden items-center justify-center gap-7 h-full w-[40%] md:flex'>

            <a href="">About</a><a href="">Contact</a><a href="">Jobs</a>
          </div>
            <div className='flex items-center justify-end  h-full w-[70%] md:w-[30%] md:justify-center'><h1 className='bg-blue-400 rounded-lg px-4 py-2'>Login</h1></div>
    </div>
  )
}

export default Nav
