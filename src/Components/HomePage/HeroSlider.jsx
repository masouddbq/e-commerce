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

  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center">
        <img
          src={sliderImages[currentSlide].src}
          className="w-[100vw] h-[50vh] shadow-2xl shadow-blue-950 border-double border-8 border-slate-500 rounded-xl mx-10 -translate-y-16 object-cover"
          alt=""
        />
      </div>
    </div>
  );
};

export default HeroSlider;
