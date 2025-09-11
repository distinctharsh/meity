import React, { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
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
    <div className="w-full min-h-[700px] flex justify-center items-start bg-white pt-8 pb-0">
      <div className="flex flex-row justify-between items-start w-full max-w-[1640px] px-8">

        {/* Recent Documents */}
        <div className="flex flex-col items-start w-[520px] mr-[56px]">
          <div className="flex items-center mb-4">
            <Document className="w-8 h-8 mr-2" />
            <h3 className="text-[#202A3A] text-[2rem] font-bold leading-none tracking-tight m-0">Recent Documents</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 mt-4 mb-2 w-full">
            {recentDocs.map((doc, i) => (
              <div
                key={i}
                className="bg-white border border-[#162f6a] rounded-[8px] shadow-[0_6px_12px_rgba(35,35,47,0.078),_0_2px_4px_rgba(35,35,47,0.059)] min-h-[180px] h-auto px-6 pt-6 pb-4 flex flex-col"
              >
                <h4 className="text-[#162f6a] text-[1.25rem] font-bold mb-2">{doc.title}</h4>
                <p className="text-[1.09rem] leading-relaxed break-words">{doc.description}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 border border-[#0a2e60] py-2 px-5 bg-white font-bold cursor-pointer inline-flex items-center gap-2 text-[#0a2e60] rounded text-[1rem] hover:bg-[#0a2e60] hover:text-white shadow-none transition-colors">
            VIEW MORE <FiArrowRight />
          </button>
        </div>

        {/* User Personas */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-[#9aacf2] rounded-full w-[265px] h-[265px] flex items-center justify-center mb-4 overflow-hidden">
            <div className="rounded-full overflow-hidden w-[224px] h-[224px] border-0" key={`${personas[currentPersonaIndex].img}-${currentPersonaIndex}`}>
              <Image
                key={`${personas[currentPersonaIndex].img}-${currentPersonaIndex}`}
                src={personas[currentPersonaIndex].img}
                alt={personas[currentPersonaIndex].label}
                width={224}
                height={224}
                className="object-cover"
              />
            </div>
          </div>
          <div className="font-bold text-[1.35rem] mt-1 mb-2 text-[#23232f] text-center tracking-wide">{personas[currentPersonaIndex].label}</div>
          <div className="flex items-center gap-4 select-none mt-2 mb-1">
            <span className="text-[#162f6a] font-extrabold text-[1.35rem] px-2 cursor-pointer" onClick={prevPersona}>&lt;</span>
            {personas.map((_, idx) => (
              <span
                key={idx}
                className={`rounded-full transition-colors ${idx === currentPersonaIndex
                  ? 'bg-[#0a2e60] w-[12px] h-[12px]'
                  : 'bg-gray-400 w-[9px] h-[9px]'} `}
                onClick={() => setCurrentPersonaIndex(idx)}
              />
            ))}
            <span className="text-[#162f6a] font-extrabold text-[1.35rem] px-2 cursor-pointer" onClick={nextPersona}>&gt;</span>
          </div>
        </div>

        {/* Important Links */}
        <div className="flex flex-col items-start w-[365px] ml-[56px]">
          <div className="flex items-center mb-4">
            <ImportantLink className="w-8 h-8 mr-2" />
            <h3 className="text-[#202A3A] text-[2rem] font-bold leading-none tracking-tight m-0">
              Important Links
            </h3>
          </div>
          <ul className="m-0 p-0 w-full mt-4 border-l-4 border-[#0a2e60] bg-white rounded-none shadow-none">
            {importantLinks.map((link, i) => (
              <li
                key={i}
                className="flex items-center justify-between border-b last:border-none border-[#e2e2e2] py-3 px-5 text-[1.13rem] text-[#0a2e60] hover:bg-[#f8f9fa] cursor-pointer transition-colors font-normal"
              >
                {link}
                <FiArrowRight className="text-[22px]" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecentDocs;
