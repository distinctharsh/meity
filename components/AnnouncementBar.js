"use client";
import { useState, useEffect } from "react";

export default function AnnouncementBar() {
  const [isPaused, setIsPaused] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements');
      if (response.ok) {
        const data = await response.json();
        // Filter only active announcements
        const activeAnnouncements = data.filter(announcement => announcement.is_active);
        setAnnouncements(activeAnnouncements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  // If no announcements, show default message
  if (loading) {
    return (
      <div className="flex items-center bg-[#e0e0e0] py-[6px] px-3 overflow-hidden text-[14px]">
        <div className="flex items-center font-bold text-[#12306b] mr-3 gap-1">
          <span className="mr-1">Announcements</span>
          <span className="text-[16px]">🔊</span>
        </div>
        <div className="flex-1 text-center text-[#1a1a1a]">
          Loading announcements...
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="flex items-center bg-[#e0e0e0] py-[6px] px-3 overflow-hidden text-[14px]">
        <div className="flex items-center font-bold text-[#12306b] mr-3 gap-1">
          <span className="mr-1">Announcements</span>
          <span className="text-[16px]">🔊</span>
        </div>
        <div className="flex-1 text-center text-[#1a1a1a]">
          No announcements available
        </div>
      </div>
    );
  }

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
          {announcements.map((announcement, index) => (
            <span key={announcement.id} className="mr-[50px] text-[#1a1a1a]">
              {announcement.is_urgent && <span className="text-red-600 font-bold">🚨 </span>}
              {announcement.title}
              {announcement.link_url && (
                <a 
                  href={announcement.link_url} 
                  className="ml-2 text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {announcement.link_text || 'Read More'}
                </a>
              )}
            </span>
          ))}
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
