import React, { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';
import Document from './icons/Document';
import ImportantLink from './icons/ImportantLink';
import UserPersonas from './icons/UserPersonas';

const recentDocs = [
  { title: "Orders And Notices", description: "Observance of Vigilance Awareness Week-2025-Digital Initiatives-reg" },
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
    <div className="flex justify-between gap-8 px-20 py-8 text-[#0a2e60] flex-col lg:flex-row">
      {/* Recent Documents Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 font-bold text-[1.15rem] mb-4">
          <Document className="max-w-12" />
          <h3 className="m-0">Recent Documents</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 mb-6">
          {recentDocs.map((doc, i) => (
            <div key={i} className="min-h-[140px] h-auto p-6 border border-[#162f6a] rounded shadow-[0_6px_12px_rgba(35,35,47,0.078),_0_2px_4px_rgba(35,35,47,0.059)]">
              <h4 className="text-[#150202] font-normal leading-normal mb-2">{doc.title}</h4>
              <p className="m-0 text-sm leading-6">{doc.description}</p>
            </div>
          ))}
        </div>
        <button className="self-start border border-[#0a2e60] py-1.5 px-4 bg-transparent font-semibold cursor-pointer inline-flex items-center gap-1 text-[#0a2e60] rounded text-[0.75rem] hover:bg-[#0a2e60] hover:text-white transition-colors">
          VIEW MORE <FiArrowRight />
        </button>
      </div>

      {/* User Personas Section */}
      <div className="flex-[0.6] flex flex-col items-center">
        <div className="flex items-center gap-2 font-bold text-[1.15rem] mb-4">
          <UserPersonas className="max-w-12" />
          <h3 className="m-0">Explore User Personas</h3>
        </div>

        <div className="bg-[#9aacf2] rounded-full w-[150px] h-[150px] flex items-center justify-center mb-4 overflow-hidden">
          <div className="rounded-full overflow-hidden w-[140px] h-[140px]">
            <Image src={personas[currentPersonaIndex].img} alt={personas[currentPersonaIndex].label} width={140} height={140} />
          </div>
        </div>
        <div className="font-bold text-[0.85rem] mb-4 text-center">{personas[currentPersonaIndex].label}</div>

        {/* Pagination */}
        <div className="flex items-center gap-3 select-none">
          <span className="font-bold text-[1.3rem] px-1 cursor-pointer" onClick={prevPersona}>&lt;</span>
          {personas.map((_, idx) => (
            <span
              key={idx}
              className={`rounded-full transition-colors ${idx === currentPersonaIndex ? 'bg-[#0a2e60] w-[10px] h-[10px]' : 'bg-[#a3a3a3] w-2 h-2'}`}
              onClick={() => setCurrentPersonaIndex(idx)}
            />
          ))}
          <span className="font-bold text-[1.3rem] px-1 cursor-pointer" onClick={nextPersona}>&gt;</span>
        </div>
      </div>

      {/* Important Links Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 font-bold text-[1.15rem] mb-4">
          <ImportantLink className="max-w-12" />
          <h3 className="m-0">Important Links</h3>
        </div>
        <ul className="list-none m-0 p-0 border-l-4 border-[#0a2e60]">
          {importantLinks.map((link, i) => (
            <li key={i} className="flex items-center justify-between border-b border-[#e2e2e2] py-2 px-4 text-[0.85rem] text-[#0a2e60] hover:bg-[#f0f0f0] cursor-pointer">
              {link}
              <FiArrowRight className="text-[18px]" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentDocs;
