"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const PromoSection = () => {
    const [activeSlide, setActiveSlide] = useState(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const [mounted, setMounted] = useState(false);
    const intervalRef = useRef(null);

    const duration = 3000;

    const banners = [
        {
            id: 1,
            imgSrc: "/images/promo/cyber-security-challenge.jpg",
            alt: "Cyber Security Challenge",
            link: "https://innovateindia.mygov.in/cyber-security-grand-challenge/"
        },
        {
            id: 2,
            imgSrc: "/images/promo/digital-india-internship.jpg",
            alt: "Digital India Internship",
            link: "https://intern.meity.gov.in/login"
        }
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isPlaying || !mounted) return;

        intervalRef.current = setInterval(() => {
            setActiveSlide((prev) => (prev === banners.length ? 1 : prev + 1));
        }, duration);

        return () => clearInterval(intervalRef.current);
    }, [isPlaying, mounted]);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        setActiveSlide((prev) => (prev === banners.length ? 1 : prev + 1));
    };

    const handlePrev = () => {
        setActiveSlide((prev) => (prev === 1 ? banners.length : prev - 1));
    };

    if (!mounted) return null;

    return (
        <div className="w-full bg-transparent py-10">
            <div className="gi-container flex flex-row gap-4 items-stretch h-[300px]">

                {/* Image Section – zyada space le raha hai */}
                <div className="flex-[2] h-full bg-gray-100 rounded-lg overflow-hidden relative">
                    <Image
                        src="/images/promo/digital-personal-data.jpg"
                        alt="Digital Personal Data Protection"
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </div>

                {/* Video Section with gaps */}
                <div className="flex-1 h-full bg-blue-100 rounded-lg overflow-hidden relative mx-2">
                    <video
                        src="https://playhls.media.nic.in/igot_vod/MyGov/NOV24/video/studentmustknow.mp4"
                        poster="https://ccps.digifootprint.gov.in/static//uploads/2025/04/1788fb793d870f1ee49f02201be384e1.jpg"
                        className="w-full h-full object-cover"
                        controls
                        preload="auto"
                    />
                </div>

                {/* Carousel Section */}
                <div className="flex-1 h-full bg-white rounded-lg overflow-hidden relative">
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 hover:bg-gray-300 z-10"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 hover:bg-gray-300 z-10"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>

                    <button
                        onClick={togglePlayPause}
                        className="absolute bottom-4 right-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 z-10"
                    >
                        <span className="material-symbols-outlined">
                            {isPlaying ? "pause" : "play_arrow"}
                        </span>
                    </button>

                    <div className="w-full h-full relative">
                        {banners.map((banner) => (
                            <div
                                key={banner.id}
                                className={`absolute inset-0 transition-opacity duration-300 ${activeSlide === banner.id ? "opacity-100" : "opacity-0"}`}
                            >
                                <a href={banner.link} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                                    <Image
                                        src={banner.imgSrc}
                                        alt={banner.alt}
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </a>
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                        {banners.map((banner) => (
                            <button
                                key={banner.id}
                                className={`w-3 h-3 rounded-full ${activeSlide === banner.id ? "bg-blue-600" : "bg-gray-300"}`}
                                onClick={() => setActiveSlide(banner.id)}
                                aria-label={`Go to slide ${banner.id}`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PromoSection;
