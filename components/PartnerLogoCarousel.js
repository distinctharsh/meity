"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const PartnerLogoCarousel = () => {
  const containerRef = useRef(null);
  const autoRotateRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartnerLogos();
  }, []);

  const fetchPartnerLogos = async () => {
    try {
      const response = await fetch('/api/admin/partner-logos');
      if (response.ok) {
        const data = await response.json();
        // Filter only active logos and map to image URLs
        const activeLogos = data
          .filter(logo => logo.is_active === 1)
          .sort((a, b) => a.display_order - b.display_order)
          .map(logo => logo.image_url);
        setLogos(activeLogos);
      } else {
        // Fallback to default logos if API fails
        setLogos([
          "/images/partner/president.jpg",
          "/images/partner/pm.jpg",
          "/images/partner/data-gov.png",
          "/images/partner/egazette.jpg",
          "/images/partner/india-code.png",
          "/images/partner/esamiksha.jpg",
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch partner logos:', error);
      // Fallback to default logos
      setLogos([
        "/images/partner/president.jpg",
        "/images/partner/pm.jpg",
        "/images/partner/data-gov.png",
        "/images/partner/egazette.jpg",
        "/images/partner/india-code.png",
        "/images/partner/esamiksha.jpg",
      ]);
    } finally {
      setLoading(false);
    }
  };

const scroll = (direction) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const items = Array.from(container.children);
    if (items.length === 0) return;
    
    // Fixed item width and gap
    const itemWidth = 160;
    const gap = 16; // Matches the gap in CSS
    const stepSize = itemWidth + gap;
    
    // Get current scroll position
    const currentScroll = container.scrollLeft;
    const containerWidth = container.clientWidth;
    
    // Calculate current item index
    const currentItemIndex = Math.round(currentScroll / stepSize);
    
    let newScrollPos;
    
    if (direction === 'right') {
      // Move to next item
      const nextIndex = currentItemIndex + 1;
      
      if (nextIndex >= items.length) {
        // Wrap around to start
        newScrollPos = 0;
      } else {
        newScrollPos = nextIndex * stepSize;
      }
    } else {
      // Move to previous item
      const prevIndex = currentItemIndex - 1;
      
      if (prevIndex < 0) {
        // Wrap around to end - show the last item that fits in view
        const maxVisibleItems = Math.floor(containerWidth / stepSize);
        const lastVisibleIndex = Math.max(0, items.length - maxVisibleItems);
        newScrollPos = lastVisibleIndex * stepSize;
      } else {
        newScrollPos = prevIndex * stepSize;
      }
    }
    
    // Ensure we don't scroll beyond bounds
    const maxScroll = Math.max(0, (items.length - 1) * stepSize);
    newScrollPos = Math.max(0, Math.min(newScrollPos, maxScroll));
    
    // Apply the scroll with smooth behavior
    container.scrollTo({
      left: newScrollPos,
      behavior: 'smooth'
    });
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

  if (loading) {
    return (
      <div className="w-full bg-gray-100 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center items-center h-20">
            <div className="animate-pulse flex space-x-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 w-20 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative group">
          {/* Scroll Container */}
          <div
            ref={containerRef}
            className="flex overflow-x-auto px-4 sm:px-6 lg:px-8 gap-2 sm:gap-4 md:gap-6 snap-x snap-mandatory scrollbar-hide"
            role="region"
            aria-label="Partner logos"
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => setIsInteracting(false)}
            style={{
              msOverflowStyle: 'none',  // IE and Edge
              scrollbarWidth: 'none',  // Firefox
              scrollBehavior: 'smooth'
            }}
          >
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center relative snap-start"
                style={{ 
                  width: '160px', 
                  height: '80px',
                  minWidth: '160px'
                }}
              >
                <Image
                  src={logo}
                  alt={`Partner logo ${index + 1}`}
                  fill
                  style={{ objectFit: "contain" }}
                  className="object-contain p-2"
                  sizes="160px"
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
