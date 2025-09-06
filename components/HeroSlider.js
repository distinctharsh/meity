"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../styles/HeroSlider.module.css"; // अलग CSS file

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
    <div className={styles.sliderContainer}>
      <div className={styles.sliderWrapper}>
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ""}`}
          >
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              width={1600}
              height={600}
              className={styles.slideImage}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button className={`${styles.arrow} ${styles.left}`} onClick={goToPrevious}>
        &#10094;
      </button>
      <button className={`${styles.arrow} ${styles.right}`} onClick={goToNext}>
        &#10095;
      </button>

      {/* Indicators with progress */}
      <div className={styles.indicators}>
        {sliderImages.map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ""}`}
            onClick={() => goToSlide(index)}
          >
            {index === currentSlide && (
              <span
                className={styles.progress}
                style={{ width: `${progress}%` }}
              ></span>
            )}
          </div>
        ))}
      </div>

      {/* Play Pause Button */}
      <button className={styles.playPause} onClick={togglePlayPause}>
        {isPlaying ? "⏸" : "▶"}
      </button>
    </div>
  );
};

export default HeroSlider;
