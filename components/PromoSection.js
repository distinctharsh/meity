"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const PromoSection = () => {
    const [activeSlide, setActiveSlide] = useState(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const [mounted, setMounted] = useState(false);
    const intervalRef = useRef(null);

    const defaultPromoData = {
        imageUrl: "/images/promo/digital-personal-data.jpg",
        imageLink: "https://www.mygov.in/campaigns/make-in-india/?target=webview&type=campaign&nid=0",
        videoLink: "/media/promo-video.mp4",
        videoPoster: "/media/promo-poster.jpg"
    };

    const [promoData, setPromoData] = useState(defaultPromoData);

    const duration = 3000;

    const banners = [
        {
            id: 1,
            imgSrc: "/images/promo/dbt.jpg",
            alt: "Cyber Security Challenge",
            link: "https://dbtbharat.gov.in/"
        }
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    // 🌐 API hit karke data fetch aur map karne ka logic (with Fallback Handling)
    useEffect(() => {
        async function fetchPromoData() {
            try {
                const res = await fetch("/api/ccps", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({}),
                    cache: 'no-store'
                });

                if (res.ok) {
                    const jsonRes = await res.json();
                    const item = jsonRes?.data?.data?.[0];

                    if (item) {
                        let newImgUrl = defaultPromoData.imageUrl;
                        let newVideoLink = defaultPromoData.videoLink;
                        let newVideoPoster = defaultPromoData.videoPoster;
                        let newVideoRedirect = defaultPromoData.imageLink;

                        let hasValidData = false;

                        // 1. ministry_data_2-1a se image uthana
                        const data21a = item["ministry_data_2-1a"];
                        if (Array.isArray(data21a) && data21a[0]?.image_src?.url) {
                            newImgUrl = data21a[0].image_src.url;
                            hasValidData = true;
                        }

                        // 2. ministry_data_2-1b se video link aur poster uthana
                        const data21b = item["ministry_data_2-1b"];
                        if (Array.isArray(data21b) && data21b[0]) {
                            if (data21b[0].video_link) {
                                newVideoLink = data21b[0].video_link;
                                hasValidData = true;
                            }
                            if (data21b[0].image_src?.url) {
                                newVideoPoster = data21b[0].image_src.url;
                                hasValidData = true;
                            }
                            if (data21b[0].image_src?.link) {
                                newVideoRedirect = data21b[0].image_src.link;
                            }
                        }

                        // Agar valid data mila toh state update karo, warna default hi rehne do
                        if (hasValidData) {
                            setPromoData({
                                imageUrl: newImgUrl,
                                imageLink: newVideoRedirect,
                                videoLink: newVideoLink,
                                videoPoster: newVideoPoster
                            });
                        }
                    }
                }
            } catch (err) {
                console.error("Promo API Fetch Error, falling back to defaults:", err);
                // Error aane par default values hi use hongi jo state ki initial value hain
            }
        }

        fetchPromoData();
    }, []);

    useEffect(() => {
        if (!isPlaying || !mounted) return;

        intervalRef.current = setInterval(() => {
            setActiveSlide((prev) => (prev === banners.length ? 1 : prev + 1));
        }, duration);

        return () => clearInterval(intervalRef.current);
    }, [isPlaying, mounted]);

    if (!mounted) return null;

    return (
        <div className="w-full bg-transparent py-6 md:py-10">
            <div className="gi-container flex flex-col md:flex-row gap-4 items-stretch md:h-[300px]">

                {/* Image Section – ministry_data_2-1a image or Default Fallback */}
                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden md:h-full md:flex-[2] aspect-[16/9] md:aspect-auto">
                    <a
                        href={promoData.imageLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full relative"
                    >
                        <Image
                            src={promoData.imageUrl}
                            alt="Digital Personal Data Protection"
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw"
                            unoptimized={true}
                        />
                    </a>
                </div>

                {/* Video Section – ministry_data_2-1b video & poster or Default Fallback */}
                <div className="relative w-full bg-blue-100 rounded-lg overflow-hidden md:h-full md:flex-1 md:mx-2 aspect-[16/9] md:aspect-auto">
                    <video
                        src={promoData.videoLink}
                        poster={promoData.videoPoster}
                        className="w-full h-full object-cover"
                        controls
                        preload="none" 
                        playsInline
                    />
                </div>

                {/* Carousel Section */}
                <div className="relative w-full bg-white rounded-lg overflow-hidden md:h-full md:flex-1 aspect-[16/9] md:aspect-auto">
                    <div className="w-full h-full relative">
                        {banners.map((banner) => (
                            <div
                                key={banner.id}
                                className={`absolute inset-0 transition-opacity duration-300 ${activeSlide === banner.id ? "opacity-100" : "opacity-0"}`}
                            >
                                <a href={banner.link} target="_blank" rel="noopener noreferrer" className="w-full h-full block relative">
                                    <Image
                                        src={banner.imgSrc}
                                        alt={banner.alt}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
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