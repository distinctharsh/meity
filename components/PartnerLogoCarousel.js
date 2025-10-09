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
  const [isInteracting, setIsInteracting] = useState(false);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    // Dynamic scroll amount for better mobile behavior
    const base = containerRef.current.clientWidth || 320;
    const scrollAmount = Math.max(120, Math.floor(base * 0.6));
    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Auto-rotate functionality - continuous motion, pauses on interaction
  useEffect(() => {
    // Start interval
    autoRotateRef.current = setInterval(() => {
      if (!isInteracting) {
        scroll("right");
      }
    }, 3000); // Auto-rotate every 3 seconds

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [isInteracting]);

  const handleManualScroll = (direction) => {
    scroll(direction);
  };

  return (
    <div className="w-full bg-gray-100 py-6 sm:py-8">
      <div className="gi-container">
        <div className="relative group">
          {/* Scroll Container */}
          <div
            ref={containerRef}
            className="flex overflow-x-auto scrollbar-hide px-3 sm:px-4 gap-0 sm:gap-4 md:gap-6 snap-x snap-mandatory"
            role="region"
            aria-label="Partner logos"
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => setIsInteracting(false)}
          >
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center relative snap-start w-1/2 h-20 sm:w-36 sm:h-20 md:w-40 md:h-24 p-2 sm:p-3"
              >
                <Image
                  src={logo}
                  alt={`Partner logo ${index + 1}`}
                  fill
                  style={{ objectFit: "contain" }}
                  className="object-contain"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 160px"
                />
              </div>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            onClick={() => handleManualScroll("left")}
            className="hidden md:flex items-center justify-center absolute -left-3 lg:-left-6 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/80 shadow text-black cursor-pointer backdrop-blur"
            aria-label="Previous logos"
          >
            <span className="material-symbols-outlined text-base lg:text-xl">chevron_left</span>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => handleManualScroll("right")}
            className="hidden md:flex items-center justify-center absolute -right-3 lg:-right-6 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/80 shadow text-black cursor-pointer backdrop-blur"
            aria-label="Next logos"
          >
            <span className="material-symbols-outlined text-base lg:text-xl">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogoCarousel;
