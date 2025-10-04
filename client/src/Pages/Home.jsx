import React from 'react'

const Home = () => {
  return (
    <div className='min-h-[80vh] w-[100vw] flex flex-col bg-[#eaf8ff] md:flex-row'>


      <div className="h-[50vh]  md:h-[80vh] md:w-[50%] flex flex-col justify-center items-center">
        <h1 className='max-w-[250px] text-center text-[32px] font-hero  md:text-[3.5vw] md:max-w-[40vw]'>Job Catch Where Great Jobs and Talented People Meet</h1>
        <h1 className='max-w-[300px] text-center md:text-start md:max-w-[30vw]' >Tired of casting wide nets with little results? Job Catch revolutionizes hiring by connecting employers with pre-qualified candidates who are ready to make an impact. </h1>
      </div>
      <div className="h-[50vh] md:h-[80vh] md:w-[50%] flex items-center justify-center px-4 py-4 ">
        <img src="/images/jobss.jpg" className='h-full rounded-xl' alt="" />
      </div>
    
  

  
   </div>
  )
}

export default Home
