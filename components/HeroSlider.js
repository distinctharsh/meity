"use client";
import { useState, useEffect, useRef } from "react";

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const duration = 5000; // 5 sec per slide

  // Load slides from DB (public API)
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/slider', { cache: 'no-store' });
        const data = res.ok ? (await res.json()) : [];
        if (mounted) setSlides(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setSlides([]);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Auto play logic
  useEffect(() => {
    if (!isPlaying || (slides.length === 0)) return;

    let start = Date.now();

    intervalRef.current = setInterval(() => {
      const timePassed = Date.now() - start;
      const percent = (timePassed / duration) * 100;

      if (percent >= 100) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        start = Date.now();
        setProgress(0);
      } else {
        setProgress(percent);
      }
    }, 50);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentSlide, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  const goToPrevious = () => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const goToNext = () => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
    setProgress(0);
  };

  if (!slides.length) {
    return (
      <div className="relative w-full overflow-hidden" style={{ height: '50vh' }}>
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <p className="text-gray-600">No slides available</p>
        </div>
      </div>
    );
  }

  const active = slides[currentSlide] || {};

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full" style={{ height: '70vh' }}>
        {slides.map((s, index) => (
          <div
            key={s.id ?? index}
            className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${index === currentSlide ? 'opacity-100 z-[1]' : ''}`}
          >
            <img
              src={s.image_url}
              alt={s.title || `Slide ${index + 1}`}
              className="w-full h-full object-contain"
            />
            {/* Overlay content */}
            {(s.title || s.description || (s.link_url && s.link_text)) && (
              <div className="absolute inset-0 bg-black/20 flex items-end">
                <div className="p-6 md:p-10 text-white max-w-3xl">
                  {s.title ? <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow">{s.title}</h2> : null}
                  {s.description ? <p className="text-base md:text-lg mb-4 opacity-95">{s.description}</p> : null}
                  {s.link_url && s.link_text ? (
                    <a href={s.link_url} className="inline-block bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-100">
                      {s.link_text}
                    </a>
                  ) : null}
                </div>
              </div>
            )}
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
        {slides.map((_, index) => (
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
