"use client";
import { useState, useEffect } from "react";
import { fetchAnnouncements } from "@/utils/api";
import { parseBoolean } from "@/utils/debug";
import Announcement from "./icons/Announcement";

export default function AnnouncementBar() {
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncementsData();

    // Auto-refresh every 30 seconds to get latest updates
    const interval = setInterval(() => {
      fetchAnnouncementsData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchAnnouncementsData = async () => {
    try {
      const data = await fetchAnnouncements();
      // Filter only active announcements
      const activeAnnouncements = data.filter(announcement => parseBoolean(announcement.is_active));
      setAnnouncements(activeAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  // If no announcements, show default message
  if (loading) {
    return (
      <div className="bg-[#e0e0e0]">
        <div className="gi-container flex items-center py-[6px] px-3 overflow-hidden text-[14px]">
          <div className="flex items-center font-bold text-[#12306b] mr-3 gap-1">
            <span className="mr-1">Announcements</span>
            <span className="text-[16px]">🔊</span>
          </div>
          <div className="flex-1 text-center text-[#1a1a1a]">
            Loading announcements...
          </div>
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="bg-[#e0e0e0]">
        <div className="gi-container flex items-center py-[6px] px-3 overflow-hidden text-[14px]">
          <div className="flex items-center font-bold text-[#12306b] mr-3 gap-1">
            <span className="mr-1">Announcements</span>
           <Announcement />
          </div>
          <div className="flex-1 text-center text-[#1a1a1a]">
            No announcements available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#e0e0e0]">
      <div className="gi-container flex items-center py-[6px] px-3 overflow-hidden text-[14px]">
        {/* Left side: Title + Sound icon */}
        <div className="flex items-center font-bold text-[#12306b] mr-3 gap-1">
          <span className="mr-1">Announcements</span>
          <Announcement />
        </div>

        {/* Marquee text */}
        <div className="flex-1 marquee-container">
          <div
            className={`marquee-content ${(isPaused || isHovered) ? 'paused' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {announcements.map((announcement, index) => (
              <span key={announcement.id} className="mr-[50px] text-[#1a1a1a]">
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
          className="ml-3   text-blue-600 text-[16px] font-bold w-8 h-8  cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-110 "
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Play announcements' : 'Pause announcements'}
          title={isPaused ? 'Resume announcements' : 'Pause announcements (or hover to pause)'}
        >
          {isPaused ? (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          )}
        </button>

        <style jsx>{`
        @keyframes marquee {
          0% { 
            transform: translateX(100%); 
          }
          100% { 
            transform: translateX(-100%); 
          }
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
          animation-fill-mode: both;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        
        .marquee-paused {
          animation-play-state: paused !important;
        }
        
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
        }
        
        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 20s linear infinite;
        }
        
        .marquee-content.paused {
          animation-play-state: paused !important;
        }
      `}</style>
      </div>
    </div>
  );
}
