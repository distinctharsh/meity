"use client";
import { useState, useEffect } from 'react';

export default function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-15 right-12 bg-[#162f6a] text-white p-3 rounded-full shadow-lg hover:bg-[#0f1f4a] transition-all duration-300 z-[1001] flex items-center justify-center group cursor-pointer"
          title="Go to top"
          aria-label="Go to top"
        >
          <span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation text-2xl group-hover:scale-110 transition-transform duration-200">
            arrow_upward
          </span>
        </button>
      )}
    </>
  );
}
