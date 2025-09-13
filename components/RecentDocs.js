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
        <div className="flex flex-col items-start flex-[2] mr-[0px]">
          <div className="flex items-center mb-3">
            <Document className="w-5 h-5 mr-2" />
            <h3 className="text-[#202A3A] text-[1.4rem] font-bold leading-none tracking-tight m-0">Recent Documents</h3>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-2 w-full">
            {recentDocs.map((doc, i) => (
              <div
                key={i}
                className="bg-white border border-[#0a2e60] rounded-[6px] px-5 py-4"
              >
                <h4 className="text-[#0a2e60] text-base font-bold mb-2">{doc.title}</h4>
                <p className="text-base text-black leading-snug font-normal">{doc.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-end w-full">
            <button className="py-1.5 px-3 bg-white border border-[#0a2e60] text-[#0a2e60] text-sm rounded hover:bg-[#0a2e60] hover:text-white transition-colors">
              <span className="font-bold">VIEW MORE</span> {'>'}
            </button>
          </div>
        </div>

        {/* User Personas */}
        <div className="flex flex-col items-center justify-center flex-[1]">
          <div className="flex items-center mb-3">
            <UserPersonas className="w-5 h-5 mr-2" />
            <h3 className="text-[#202A3A] text-[1.4rem] font-bold leading-none tracking-tight m-0">Explore User Personas</h3>
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

          <div className="flex items-center gap-3 select-none mt-1">
            <span className="text-[#0a2e60] font-extrabold text-[1rem] px-2 cursor-pointer" onClick={prevPersona}>&lt;</span>
            {personas.map((_, idx) => (
              <span
                key={idx}
                className={`w-[8px] h-[8px] ${idx === currentPersonaIndex ? 'bg-[#0a2e60]' : 'bg-gray-400'} transition-colors`}
                style={{ display: 'inline-block', borderRadius: '1px' }}
                onClick={() => setCurrentPersonaIndex(idx)}
              />
            ))}
            <span className="text-[#0a2e60] font-extrabold text-[1rem] px-2 cursor-pointer" onClick={nextPersona}>&gt;</span>
          </div>
        </div>

        {/* Important Links */}
        <div className="flex flex-col items-start flex-[1] ml-[20px]">
          <div className="flex items-center mb-3">
            <ImportantLink className="w-5 h-5 mr-2" />
            <h3 className="text-[#202A3A] text-[1.4rem] font-bold leading-none tracking-tight m-0">Important Links</h3>
          </div>
          <ul className="m-0 p-0 w-full mt-2 border-r-4 border-[#0a2e60] bg-white rounded-none shadow-none">
            {importantLinks.map((link, i) => (
              <li
                key={i}
                className="flex items-center justify-between border-b last:border-none border-[#e2e2e2] py-2 px-3 text-sm text-[#0a2e60] hover:bg-[#f8f9fa] cursor-pointer transition-colors font-normal"
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
