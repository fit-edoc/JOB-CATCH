import React from 'react'

const Platform = () => {

    const gridItems = [
        
   
    {
      "title": "Verified & Trusted Jobs",
      "img":"/icons/1.png",
      "description": "Access authentic job postings from verified companies — no spam, no fake listings.",
      "points": [
        "100% verified employers",
        "Transparent job details",
        "Safe application process"
      ]
    },
    {
      "title": "Smart Job Matching",
        "img":"/icons/2.png",
      "description": "Get job recommendations that match your skills, experience, and preferences.",
      "points": [
        "Personalized job suggestions",
        "Skill-based matching",
        "Better visibility to recruiters"
      ]
    },
    {
      "title": "Seamless Hiring for Companies",
        "img":"/icons/3.png",
      "description": "Post jobs and manage applications through an intuitive recruitment dashboard.",
      "points": [
        "Quick job posting",
        "Applicant tracking",
        "Easy candidate management"
      ]
    },
    {
      "title": "Designed for Speed & Simplicity",
        "img":"/icons/4.png",
      "description": "Enjoy a smooth, fast, and modern user experience across all devices.",
      "points": [
        "Clean modern interface",
        "Fast application process",
        "Mobile-friendly experience"
      ]
    }
]

    
  return (
    <div className='plat min-h-screen  relative w-screen flex flex-col  justify-center items-center bg-white  mb-7'>
      <div className="flex justify-center items-center "><h1 className='text-[20px] font-bold md:text-[2vw]'>Platform Benifts</h1></div>
        <div className="blob h-[500px]  z-0 w-[500px] absolute rounded-full blur-3xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="min-h-[95vh] z-20 w-[95vw] bg-[#ffffff26] rounded-[20px] shadow-sm shadow-black flex items-center justify-center">

<div className="min-h-[40vh]  grid grid-flow-row gap-8  grid-cols-1 md:grid-cols-2  px-2 ">

            {gridItems.map((item,index)=>(
                <div key={item.id} className="cardd   bg-[#ffffff73]  py-2 h-[250px] w-full rounded-[40px] mx-auto flex flex-col md:h-[42vh] md:w-[32vw]">
                  <div className="h-[20%] w-full flex justify-between px-4 items-center ">  <img src={item.img} className='h-[50px]' alt="" /></div>
                  <h1 className='font-bold px-2'>{item.title}</h1>
                  <div className=" h-[80%] w-full flex items-center justify-center px-4"><p>{item.description}</p></div>
                </div>
            ))}
</div>
            
        </div>
        
      
    </div>
  )
}

export default Platform
