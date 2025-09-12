"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const logos = [
  "/images/partner/digital-india.jpg",
  "/images/partner/bhashni.jpg",
  "/images/partner/cpgrams.jpg",
  "/images/partner/data-gov.svg",
  "/images/partner/digilocker.jpg",
  "/images/partner/india-semiconductor.jpg",
  "/images/partner/international-year.jpg",
  "/images/partner/meity-startup.jpg",
  "/images/partner/she-box.jpg",
  "/images/partner/stqc.jpg"
];

const PartnerLogoCarousel = () => {
  const containerRef = useRef(null);
  const autoRotateRef = useRef(null);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const scrollAmount = 200;
    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  // Auto-rotate functionality - continuous circular motion
  useEffect(() => {
    autoRotateRef.current = setInterval(() => {
      scroll("right");
    }, 3000); // Auto-rotate every 3 seconds

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, []); // Empty dependency array means it runs once and never stops

  const handleManualScroll = (direction) => {
    scroll(direction);
  };

  return (
    <div className="w-full bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-center text-gray-700 mb-6 font-semibold">Our Partners</h3>
        
        <div className="relative group">
          {/* Scroll Container */}
          <div
            ref={containerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide px-4"
            role="region"
            aria-label="Partner logos"
          >
            {logos.map((logo, index) => (
              <div key={index} className="flex-shrink-0 w-40 h-24 bg-white rounded-xl shadow-lg border-2 border-gray-300 flex items-center justify-center p-3 relative">
                <Image 
                  src={logo} 
                  alt={`Partner logo ${index + 1}`} 
                  fill
                  style={{ objectFit: "contain" }}
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            onClick={() => handleManualScroll("left")}
            className="absolute -left-8 top-1/2 transform -translate-y-1/2  text-black cursor-pointer "
            aria-label="Previous logos"
          >
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => handleManualScroll("right")}
            className="absolute -right-8 top-1/2 transform -translate-y-1/2  text-black cursor-pointer"
            aria-label="Next logos"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogoCarousel;
