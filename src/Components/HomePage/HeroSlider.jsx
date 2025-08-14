import React, { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderImages = [
    { id: 1, src: "/hero1.jpg" },
    { id: 2, src: "/hero2.jpg" },
    { id: 3, src: "/hero3.jpg" }
  ];

  // فقط یکبار هنگام mount اجرا بشه
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev =>
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    // پاک کردن interval موقع unmount
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev =>
      prev === sliderImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide(prev =>
      prev === 0 ? sliderImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-7xl">
        {/* Main Image */}
        <img
          src={sliderImages[currentSlide].src}
          className="w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[50vh] shadow-2xl shadow-blue-950 border-2 sm:border-4 lg:border-8 border-slate-500 rounded-lg sm:rounded-xl mx-auto object-cover"
          alt={`Slide ${currentSlide + 1}`}
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
        >
          <KeyboardArrowLeftIcon className="text-lg sm:text-xl md:text-2xl" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
        >
          <KeyboardArrowRightIcon className="text-lg sm:text-xl md:text-2xl" />
        </button>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
