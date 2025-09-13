"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const HeroSlider = () => {
  const sliderImages = [
    "/images/slider/slider1.jpg",
    "/images/slider/slider2.jpg",
    "/images/slider/slider3.jpg",
    "/images/slider/slider4.jpg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const duration = 5000; // 5 sec per slide

  // Auto play logic
  useEffect(() => {
    if (!isPlaying) return;

    let start = Date.now();

    intervalRef.current = setInterval(() => {
      const timePassed = Date.now() - start;
      const percent = (timePassed / duration) * 100;

      if (percent >= 100) {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
        start = Date.now();
        setProgress(0);
      } else {
        setProgress(percent);
      }
    }, 50);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
    setProgress(0);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
    setProgress(0);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full" style={{ height: '70vh' }}>
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${index === currentSlide ? 'opacity-100 z-[1]' : ''}`}
          >
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              width={1600}
              height={900}
              className="w-full h-full object-contain"  // Changed to object-contain to avoid cropping
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button className="absolute top-1/2 -translate-y-1/2 left-5 bg-[rgba(0,0,0,0.6)] text-white border-0 text-[24px] w-10 h-10 rounded-full cursor-pointer z-[5]" onClick={goToPrevious}>
        &#10094;
      </button>
      <button className="absolute top-1/2 -translate-y-1/2 right-5 bg-[rgba(0,0,0,0.6)] text-white border-0 text-[24px] w-10 h-10 rounded-full cursor-pointer z-[5]" onClick={goToNext}>
        &#10095;
      </button>

      {/* Indicators with progress */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2.5 z-[5]">
        {sliderImages.map((_, index) => (
          <div
            key={index}
            className={`relative w-[30px] h-[6px] rounded bg-[rgba(255,255,255,0.3)] overflow-hidden cursor-pointer ${index === currentSlide ? 'bg-[rgba(255,255,255,0.5)]' : ''}`}
            onClick={() => goToSlide(index)}
          >
            {index === currentSlide && (
              <span
                className="block h-full bg-white rounded transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              ></span>
            )}
          </div>
        ))}
      </div>

      {/* Play Pause Button */}
      <button className="absolute bottom-2 right-5 w-8 h-8 rounded-full border-0 bg-[rgba(0,0,0,0.6)] text-white text-[16px] cursor-pointer z-[5]" onClick={togglePlayPause}>
        {isPlaying ? "⏸" : "▶"}
      </button>
    </div>
  );
};

export default HeroSlider;
