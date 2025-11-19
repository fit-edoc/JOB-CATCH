import React from "react";

const BentoGrid = () => {
  const bentoData = [
    {
      id: 1,
      title: "Dream Job",
      description:
        "Discover your perfect role with personalized recommendations",
      icon: "💼",
      buttonText: "Explore Jobs",
      gradient: "from-[#ECECEC]",
      textColor: "text-white",
      colSpan: "md:col-span-1",
      img: "/images/iphone.png", // This item will span 2 columns
    },
    {
      id: 2,
      title: "Top Talent",
      description: "Connect with the best professionals in your industry",
      icon: "⭐",
      buttonText: "Find Talent",
      gradient: "from-[#FFFFEF]",
      textColor: "text-white",
      colSpan: "md:col-span-2",
      img: "https://i.pinimg.com/736x/33/99/70/339970a8b4b0dd25b9a334b58bf4509b.jpg",
    },
    {
      id: 3,
      title: "Smart Matching AI",
      description:
        "Advanced AI algorithms to match you with perfect opportunities",
      icon: "🤖",
      buttonText: "Try AI Match",
      gradient: "from-[#FFFFEF]",
      textColor: "text-white",
      colSpan: "md:col-span-2",
      img: "https://i.pinimg.com/1200x/a1/d1/12/a1d1126efe7c1ec05441af874612a30e.jpg",
      // This item will span 2 rows
    },
    {
      id: 4,
      title: "Career Growth",
      description: "Plan your career path with our growth tools and resources",
      icon: "📈",
      buttonText: "Grow Career",
      gradient: "from-[#ECECEC]",
      textColor: "text-white",
      colSpan: "md:col-span-1",
      img: "https://i.pinimg.com/736x/25/a9/d3/25a9d38d24f5305f54040ebfcd650cbb.jpg",
    },
  ];

  return (
    <div className="min-h-screen mt-10   grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-6 auto-rows-min">
      {bentoData.map((item) => (
        <div
          key={item.id}
          className={`rounded-2xl p-8 flex flex-col justify-between bg-gradient-to-br ${item.gradient} ${item.textColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${item.colSpan}`}
        >
          <div className="flex">
            <div
              className="h-[200px] w-[200px]  overflow-hidden shadow-gray-400 shadow-xl rounded-2xl "
              style={{ backgroundColor: item.gradient }}
            >
              <img
                src={item.img}
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
            <div className="flex-col flex items-center  justify-center px-2">
              <h1 className="text-[20px]  text-black  md:text-nowrap max-w-[100px]">{item.title}</h1>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BentoGrid;
