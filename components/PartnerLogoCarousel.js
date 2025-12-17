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
    
    const container = containerRef.current;
    const itemWidth = container.firstChild?.offsetWidth || 150; // Width of each logo item
    const scrollAmount = itemWidth + 16; // 16px for gap between items
    const maxScroll = container.scrollWidth - container.clientWidth;
    const isScrollingRight = direction === 'right';
    
    // Calculate new scroll position
    let newScrollPos;
    if (isScrollingRight) {
      // If near the end, wrap around to the start
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
        newScrollPos = 0;
      } else {
        newScrollPos = Math.min(container.scrollLeft + scrollAmount, maxScroll);
      }
    } else {
      // If near the start, wrap around to the end
      if (container.scrollLeft <= 5) {
        newScrollPos = maxScroll;
      } else {
        newScrollPos = Math.max(0, container.scrollLeft - scrollAmount);
      }
    }
    
    // Apply the scroll with smooth behavior
    container.scrollTo({
      left: newScrollPos,
      behavior: 'smooth'
    });
    
    // If we wrapped around, we need to handle the visual transition
    if ((isScrollingRight && newScrollPos === 0) || (!isScrollingRight && newScrollPos === maxScroll)) {
      // Force a reflow to ensure the scroll position is updated
      void container.offsetHeight;
    }
  };

  // Auto-rotate functionality - continuous circular motion, pauses on interaction
  useEffect(() => {
    if (!containerRef.current) return;
    
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative group">
          {/* Scroll Container */}
          <div
            ref={containerRef}
            className="flex overflow-x-auto px-2 gap-2 sm:gap-4 md:gap-6 snap-x snap-mandatory scrollbar-hide justify-center"
            role="region"
            aria-label="Partner logos"
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => setIsInteracting(false)}
            style={{
              msOverflowStyle: 'none',  // IE and Edge
              scrollbarWidth: 'none',  // Firefox
            }}
          >
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center relative snap-start w-1/2 h-20 sm:w-1/4 md:w-1/5 lg:w-[18%] p-2 sm:p-3"
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
