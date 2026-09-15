"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const PartnerLogoCarousel = () => {
  const containerRef = useRef(null);
  const autoRotateRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultLogos = [
    { image_url: "/images/partner/president.jpg", external_link: "#" },
    { image_url: "/images/partner/pm.jpg", external_link: "#" },
    { image_url: "/images/partner/data-gov.png", external_link: "#" },
    { image_url: "/images/partner/egazette.jpg", external_link: "#" },
    { image_url: "/images/partner/india-code.png", external_link: "#" },
    { image_url: "/images/partner/esamiksha.jpg", external_link: "#" },
  ];

  useEffect(() => {
    fetchPartnerLogos();
  }, []);

  const fetchPartnerLogos = async () => {
    try {
      const response = await fetch('/api/admin/partner-logos');
      if (response.ok) {
        const data = await response.json();
        const activeLogos = data
          .filter(logo => logo.is_active === 1)
          .sort((a, b) => a.display_order - b.display_order)
          .map(logo => ({
            image_url: logo.image_url,
            external_link: logo.external_link || '#'
          }));
        setLogos(activeLogos.length > 0 ? activeLogos : defaultLogos);
      } else {
        setLogos(defaultLogos);
      }
    } catch (error) {
      console.error('Failed to fetch partner logos:', error);
      setLogos(defaultLogos);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const items = Array.from(container.children);
    if (items.length === 0) return;
    
    const itemWidth = 160;
    const gap = 16;
    const stepSize = itemWidth + gap;
    
    const currentScroll = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const currentItemIndex = Math.round(currentScroll / stepSize);
    
    let newScrollPos;
    
    if (direction === 'right') {
      const nextIndex = currentItemIndex + 1;
      if (nextIndex >= items.length) {
        newScrollPos = 0;
      } else {
        newScrollPos = nextIndex * stepSize;
      }
    } else {
      const prevIndex = currentItemIndex - 1;
      if (prevIndex < 0) {
        const maxVisibleItems = Math.floor(containerWidth / stepSize);
        const lastVisibleIndex = Math.max(0, items.length - maxVisibleItems);
        newScrollPos = lastVisibleIndex * stepSize;
      } else {
        newScrollPos = prevIndex * stepSize;
      }
    }
    
    const maxScroll = Math.max(0, (items.length - 1) * stepSize);
    newScrollPos = Math.max(0, Math.min(newScrollPos, maxScroll));
    
    container.scrollTo({
      left: newScrollPos,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;
    
    autoRotateRef.current = setInterval(() => {
      if (!isInteracting) {
        scroll("right");
      }
    }, 3000);

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
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              scrollBehavior: 'smooth'
            }}
          >
            {logos.map((logo, index) => (
              <a
                key={index}
                href={logo.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center relative snap-start hover:shadow-xl transition-shadow duration-200"
                style={{ 
                  width: '160px', 
                  height: '80px',
                  minWidth: '160px'
                }}
              >
                <Image
                  src={logo.image_url}
                  alt={`Partner logo ${index + 1}`}
                  fill
                  style={{ objectFit: "contain" }}
                  className="object-contain p-2"
                  sizes="160px"
                />
              </a>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            onClick={() => handleManualScroll("left")}
            className="hidden md:flex items-center justify-center absolute -left-3 lg:-left-6 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/80 shadow text-black cursor-pointer backdrop-blur hover:bg-white"
            aria-label="Previous logos"
          >
            <span className="material-symbols-outlined text-base lg:text-xl">chevron_left</span>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => handleManualScroll("right")}
            className="hidden md:flex items-center justify-center absolute -right-3 lg:-right-6 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/80 shadow text-black cursor-pointer backdrop-blur hover:bg-white"
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