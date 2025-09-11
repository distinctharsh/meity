"use client";
import { useState } from "react";

export default function AnnouncementBar() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="flex items-center bg-[#e0e0e0] py-[6px] px-3 overflow-hidden text-[14px]">
      {/* Left side: Title + Sound icon */}
      <div className="flex items-center font-bold text-[#12306b] mr-3 gap-1">
        <span className="mr-1">Announcements</span>
        <span className="text-[16px]">{isPaused ? "🔇" : "🔊"}</span>
      </div>

      {/* Marquee text */}
      <div className="flex-1 overflow-hidden whitespace-nowrap relative">
        <div className={`inline-block whitespace-nowrap pl-[100%] ${isPaused ? '' : 'animate-[marquee_20s_linear_infinite]'} }`}>
          <span className="mr-[50px] text-[#1a1a1a]">Call for 2D Innovation Hub coming soon</span>
          <span className="mr-[50px] text-[#1a1a1a]">Ten Years of Digital Progress - Building an Inclusive and Future-Ready India</span>
          <span className="mr-[50px] text-[#1a1a1a]">Electronics Component</span>
        </div>
      </div>

      {/* Right side: Play/Pause Button */}
      <button
        className="ml-3 bg-[rgba(0,0,0,0.6)] text-white text-[14px] font-bold w-7 h-7 rounded-full cursor-pointer flex items-center justify-center hover:bg-[rgba(0,0,0,0.8)] transition-colors"
        onClick={() => setIsPaused(!isPaused)}
        aria-label={isPaused ? 'Play announcements' : 'Pause announcements'}
      >
        {isPaused ? "▶" : "⏸"}
      </button>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
