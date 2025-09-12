import React, { useState } from 'react';
import Image from 'next/image';
import Document from './icons/Document';
import ImportantLink from './icons/ImportantLink';
import UserPersonas from './icons/UserPersonas';

const recentDocs = [
  { title: "Orders And Notices", description: "Observance of Vigilance Awareness Week-2025- Digital Initiatives-reg" },
  { title: "Act And Policies", description: "Promotion and Regulation of Online Gaming Act, 2025 and its Corrigenda" },
  { title: "Gazettes Notifications", description: "Notification (Extraordinary) regarding declaration of certain computer resources relating to identified Critical Information Infrastructures (CIIs) of the Delhi International Airport Ltd (DIAL) and the computer resources of their associated dependencies as protected systems" },
  { title: "Gazettes Notifications", description: "Notification (Extraordinary) regarding declaration of certain computer resources relating to identified Critical Information Infrastructures (CIIs) of the GMR Hyderabad International Airport Ltd (GHIAL) and the computer resources of their associated dependencies as protected systems" },
];

const importantLinks = [
  "MeitY Dashboard",
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

  const prevPersona = () => {
    setCurrentPersonaIndex((prev) => (prev === 0 ? personas.length - 1 : prev - 1));
  };

  const nextPersona = () => {
    setCurrentPersonaIndex((prev) => (prev === personas.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full min-h-[500px] flex justify-center items-start bg-white py-4">
      <div className="flex flex-row justify-between items-start w-full max-w-[1640px] px-4">

        {/* Recent Documents */}
        <div className="flex flex-col items-start w-[460px] mr-[20px]">
          <div className="flex items-center mb-3">
            <Document className="w-5 h-5 mr-2" />
            <h3 className="text-[#202A3A] text-[1.4rem] font-bold leading-none tracking-tight m-0">Recent Documents</h3>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-2 w-full">
            {recentDocs.map((doc, i) => (
              <div
                key={i}
                className="border border-[#0a2e60] rounded-md p-3"
              >
                <h4 className="text-[#0a2e60] text-sm font-bold mb-1">{doc.title}</h4>
                <p className="text-sm text-black leading-snug">{doc.description}</p>
              </div>
            ))}
          </div>

          <button className="mt-3 py-1.5 px-3 border border-[#0a2e60] text-[#0a2e60] font-bold text-sm rounded hover:bg-[#0a2e60] hover:text-white transition-colors">
            VIEW MORE <span className="ml-1">{'>'}</span>
          </button>
        </div>

        {/* User Personas */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center mb-3">
            <UserPersonas className="w-5 h-5 mr-2" />
            <h3 className="text-[#202A3A] text-[1.4rem] font-bold leading-none tracking-tight m-0">Explore User Personas</h3>
          </div>

          <div className="bg-[#9aacf2] rounded-full w-[130px] h-[130px] flex items-center justify-center mb-3 overflow-hidden">
            <div className="rounded-full overflow-hidden w-[105px] h-[105px] border-0" key={`${personas[currentPersonaIndex].img}-${currentPersonaIndex}`}>
              <Image
                src={personas[currentPersonaIndex].img}
                alt={personas[currentPersonaIndex].label}
                width={105}
                height={105}
                className="object-cover"
              />
            </div>
          </div>

          <div className="font-bold text-[0.9rem] uppercase text-[#23232f] text-center tracking-wide mb-2">
            {personas[currentPersonaIndex].label}
          </div>

          <div className="flex items-center gap-3 select-none mt-1">
            <span className="cursor-pointer text-[#0a2e60]" onClick={prevPersona}>&lt;</span>
            {personas.map((_, idx) => (
              <span
                key={idx}
                className={`w-[10px] h-[10px] ${idx === currentPersonaIndex ? 'bg-[#0a2e60]' : 'bg-gray-400'} transition-colors`}
                style={{ display: 'inline-block', borderRadius: '2px' }}
                onClick={() => setCurrentPersonaIndex(idx)}
              />
            ))}
            <span className="cursor-pointer text-[#0a2e60]" onClick={nextPersona}>&gt;</span>
          </div>
        </div>

        {/* Important Links */}
        <div className="flex flex-col items-start w-[320px] ml-[20px]">
          <div className="flex items-center mb-3">
            <ImportantLink className="w-5 h-5 mr-2" />
            <h3 className="text-[#202A3A] text-[1.4rem] font-bold leading-none tracking-tight m-0">Important Links</h3>
          </div>
          <ul className="m-0 p-0 w-full mt-2 border-r-4 border-[#0a2e60] bg-white rounded-none shadow-none">
            {importantLinks.map((link, i) => (
              <li
                key={i}
                className="flex items-center justify-between border-b border-gray-200 py-2 px-3 text-sm text-[#0a2e60] hover:bg-gray-100 cursor-pointer"
              >
                {link}
                <span className="text-base">{'>'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecentDocs;
