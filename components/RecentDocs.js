import React, { useEffect, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import Document from './icons/Document';

const fallbackRecent = [
  { title: "No recent documents available", description: "Check back later for updates" }
];

const importantLinks = [
  "Cabinet Secretariat Dashboard",
  "Interested in Applying for Tender?",
  "Public Grievances",
  "Section 69A of IT Act",
  "Explore What's new",
];

const personas = [
  { img: "/images/user-personas/it-professional.jpg", label: "FOR IT PROFESSIONAL" },
  { img: "/images/user-personas/researcher.jpg", label: "FOR RESEARCHER" },
  { img: "/images/user-personas/media.jpg", label: "FOR MEDIA" },
  { img: "/images/user-personas/business-owner.jpg", label: "FOR BUSINESS OWNER" },
];

const RecentDocs = () => {
  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0);
  const [docs, setDocs] = useState(fallbackRecent);
  const [navLinks, setNavLinks] = useState(null);
   const [recentDocs, setRecentDocs] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/recent-doc-links');
        if (res.ok) {
          const data = await res.json();
          if (mounted && Array.isArray(data)) setNavLinks(data);
        }
      } catch (err) {
        // fallback to recent-docs items if links endpoint fails
        try {
          const r2 = await fetch('/api/recent-docs');
          if (r2.ok) {
            const d2 = await r2.json();
            if (mounted && Array.isArray(d2) && d2.length) setDocs(d2);
          }
        } catch { }
      }
    })();
    return () => { mounted = false; };
  }, []);



  useEffect(() => {
    const fetchRecentDocs = async () => {
      try {
        const response = await fetch('/api/recent-reports');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setRecentDocs(data);
          } else {
            setRecentDocs(fallbackRecent);
          }
        } else {
          setRecentDocs(fallbackRecent);
        }
      } catch (error) {
        console.error('Error fetching recent documents:', error);
        setRecentDocs(fallbackRecent);
      }
    };
    fetchRecentDocs();
  }, []);


  const prevPersona = () => {
    setCurrentPersonaIndex((prev) => (prev === 0 ? personas.length - 1 : prev - 1));
  };

  const nextPersona = () => {
    setCurrentPersonaIndex((prev) => (prev === personas.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full bg-white py-8">
      <div className="gi-container flex flex-col md:flex-row justify-between items-start w-full gap-10">

        {/* Recent Documents */}
        <div className="flex flex-col items-start w-full md:flex-[2] md:mr-0">
          <div className="flex items-center mb-4">
            <Document className="w-5 h-5 mr-2" />
            <h3 className="text-[#202A3A] text-[1.4rem] font-bold leading-none tracking-tight m-0">Recent Documents</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 mt-2 w-full">
             {recentDocs.map((doc, index) => (
              <div
                key={index}
                className="bg-white border border-[#0a2e60] rounded-[6px] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              >
                <h4 className="text-[#0a2e60] text-base font-bold mb-2">
                  {doc.nav_link ? (
                    <a 
                      href={doc.nav_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#0a2e60] hover:underline"
                    >
                      {doc.nav_name}
                    </a>
                  ) : (
                    doc.nav_name
                  )}
                </h4>
                <p className="text-[0.95rem] text-black leading-snug font-normal">
                  { doc.title || 'General Document'}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end w-full">
            <button className="inline-flex items-center gap-2 border border-[#0b3a82] text-[#0b3a82] bg-white py-[8px] px-[16px] rounded-[6px] cursor-pointer font-semibold">
              VIEW MORE
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* User Personas */}
        {/* <div className="flex flex-col items-center justify-center w-full md:flex-[1] md:mt-0">
          <div className="flex items-center mb-4">
            <img src="/images/icons/user-personas.svg" alt="User Personas" />
            <h3 className="text-[#162f6a] text-[1.4rem] font-bold leading-none tracking-tight m-0">Explore User Personas</h3>
          </div>

          <div className="bg-[#b4c5f9] rounded-full w-[180px] h-[180px] flex items-center justify-center mb-3">
            <div className="rounded-full overflow-hidden w-[150px] h-[150px]">
              <Image
                src={personas[currentPersonaIndex].img}
                alt={personas[currentPersonaIndex].label}
                width={150}
                height={150}
                className="object-cover"
              />
            </div>
          </div>

          <div className="font-bold text-sm uppercase text-[#23232f] text-center tracking-wide mb-2">
            {personas[currentPersonaIndex].label}
          </div>

          <div className="flex items-center justify-center gap-4 select-none mt-1">
            <button
              aria-label="Prev"
              className="text-[#162f6a] text-[18px] px-2 cursor-pointer"
              onClick={prevPersona}
            >&lt;</button>
            {personas.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to ${idx + 1}`}
                className={idx === currentPersonaIndex
                  ? 'w-[14px] h-[14px] rounded-[2px] bg-[#162f6a]'
                  : 'w-[12px] h-[12px] rounded-full bg-[#214ca8]'}
                onClick={() => setCurrentPersonaIndex(idx)}
              />
            ))}
            <button
              aria-label="Next"
              className="text-[#162f6a] text-[18px] px-2 cursor-pointer"
              onClick={nextPersona}
            >&gt;</button>
          </div>
        </div> */}

        {/* Important Links */}
        <div className="flex flex-col items-start w-full md:flex-[1] md:ml-[20px]">
          <div className="flex items-center mb-4">
            <img
              src="/images/icons/important-link.svg"
              alt="Important Link"
              style={{ filter: 'invert(9%) sepia(33%) saturate(1659%) hue-rotate(191deg) brightness(92%) contrast(97%)' }}
            />
            <h3 className="text-[#162f6a] text-[1.4rem] font-bold leading-none tracking-tight m-0">Important Links</h3>
          </div>
          <div className="relative w-full">
            <ul className="m-0 p-0 w-full mt-2 bg-white">
              {importantLinks.map((link, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between border-b last:border-none border-[#e6ecff] py-3 px-4 text-[0.95rem] text-[#0b3a82] hover:bg-[#f7f9ff] cursor-pointer transition-colors"
                >
                  {link}
                  <span className="text-[#0b3a82]"><FiChevronRight /></span>
                </li>
              ))}
            </ul>
            <span className="absolute top-0 right-0 h-full w-[3px] bg-[#0b3a82]" aria-hidden></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentDocs;
