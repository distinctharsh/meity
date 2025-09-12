// components/PromoSection.jsx
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const PromoSection = () => {
    const [activeSlide, setActiveSlide] = useState(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const intervalRef = useRef(null);

    const duration = 3000; // 3 seconds per slide

    // Auto play logic
    useEffect(() => {
        if (!isPlaying) return;

        intervalRef.current = setInterval(() => {
            setActiveSlide((prev) => (prev === banners.length ? 1 : prev + 1));
        }, duration);

        return () => clearInterval(intervalRef.current);
    }, [isPlaying, activeSlide]);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

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

    const handleNext = () => {
        setActiveSlide((prev) => (prev === banners.length ? 1 : prev + 1));
    };

    const handlePrev = () => {
        setActiveSlide((prev) => (prev === 1 ? banners.length : prev - 1));
    };

    return (
        <div className="container mx-auto px-[4.5%] py-15">
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Left Section - Image and Video */}
                <div className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-5 gap-4" style={{ gridTemplateRows: '268px' }}>
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-lg cursor-pointer md:col-span-4 flex items-center justify-center bg-gray-50">
                        <Image
                            src="/images/promo/digital-personal-data.jpg"
                            alt="Feedback for Digital Personal Data Protection rules 2025"
                            fill
                            style={{ objectFit: "contain" }}
                            priority
                            className="object-contain"
                        />
                    </div>

                    {/* Video */}
                    <div className="relative bg-blue-100 rounded-lg overflow-hidden md:col-span-2 flex items-center justify-center">
                        <video
                            src="https://playhls.media.nic.in/igot_vod/MyGov/NOV24/video/studentmustknow.mp4"
                            poster="https://ccps.digifootprint.gov.in/static//uploads/2025/04/1788fb793d870f1ee49f02201be384e1.jpg"
                            className="w-full h-full object-contain rounded-lg"
                            controls
                            preload="auto"
                        />
                    </div>
                </div>

                {/* Right Section - Carousel */}
                <div className="w-full lg:w-1/4">
                    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                        
                        {/* Carousel Container */}
                        <div className="relative flex items-center justify-center" style={{ height: '268px' }}>
                            {/* Navigation Buttons */}
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
                            
                            {/* Play/Pause Button */}
                            <button
                                onClick={togglePlayPause}
                                className="absolute bottom-4 right-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 z-10"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                <span className="material-symbols-outlined">
                                    {isPlaying ? "pause" : "play_arrow"}
                                </span>
                            </button>

                            {/* Carousel Slides */}
                            <div className="h-full flex items-center justify-center">
                                {banners.map((banner) => (
                                    <div
                                        key={banner.id}
                                        className={`absolute inset-0 transition-opacity duration-300 ${activeSlide === banner.id ? "opacity-100 z-0" : "opacity-0 z-0"}`}
                                    >
                                        <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                                            <Image
                                                src={banner.imgSrc}
                                                alt={banner.alt}
                                                fill
                                                style={{ objectFit: "contain" }}
                                                className="object-contain"
                                            />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Indicators */}
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
        </div>
    );
};

export default PromoSection;
