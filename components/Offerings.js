import { useState } from "react";
import Offering from "./icons/Offering";
import WhatsNew from './icons/WhatsNew';
import { FiChevronRight } from 'react-icons/fi';

export default function Offerings() {
  const [activeTab, setActiveTab] = useState("schemes");

  const schemesList = [
    "Guidelines for implementation of Scheme for reimbursement of Testing and Certification Charges",
    "TECHNICAL INTERNSHIP PROGRAMME 2025",
    "Electronics Component Manufacturing Scheme",
    "Digital India Internship Scheme-2025"
  ];

  const vacanciesList = [
    "Vacancy 1: Technical Assistant",
    "Vacancy 2: Junior Engineer",
    "Vacancy 3: Project Manager",
    "Vacancy 4: Data Analyst"
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section className="py-9 px-4 bg-[#f1f1f2]">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex gap-6 items-start flex-col md:flex-row">
          <div className="flex-[1_1_68%] w-full">
            <div className="flex gap-3 items-center mb-3">
              <div className="[&>svg]:block" aria-hidden>
                <Offering />
              </div>
              <h3 className="text-[20px] text-[#123a6b] m-0 font-bold">Key Offerings</h3>
            </div>

            <div className="flex mb-2.5 border border-[#162f6a] rounded overflow-hidden w-full max-w-full">
              <button
                className={`${activeTab === "schemes" ? 'text-white bg-[#222e4c] font-semibold' : 'text-[#222e4c] bg-white font-normal'} flex-1 text-center py-3 border-0 cursor-pointer select-none text-[1.2rem]`}
                onClick={() => handleTabClick("schemes")}
                aria-selected={activeTab === "schemes"}
              >
                Schemes
              </button>
              <button
                className={`${activeTab === "vacancies" ? 'text-white bg-[#222e4c] font-semibold' : 'text-[#222e4c] bg-white font-normal'} flex-1 text-center py-3 border-0 cursor-pointer select-none text-[1.2rem]`}
                onClick={() => handleTabClick("vacancies")}
                aria-selected={activeTab === "vacancies"}
              >
                Vacancies
              </button>
            </div>

            <div className="bg-white rounded-b-[6px] p-0 shadow-[0_1px_0_rgba(0,0,0,0.04)] border-t-0 max-h-[230px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#123a6b_#f1f1f1]">
              <ul className="list-none m-0 py-2">
                {(activeTab === "schemes" ? schemesList : vacanciesList).map((item, index) => (
                  <li key={index} className="py-[14px] px-5 border-b border-[#e8eefc] flex justify-between items-center text-[#150202] font-normal text-[1.1rem] cursor-pointer select-none leading-[1.5] no-underline whitespace-normal overflow-hidden text-ellipsis [display:-webkit-box] [line-clamp:3] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] max-w-full last:border-b-0">
                    {item}
                    <span className="text-[#123a6b] font-bold">
                      <FiChevronRight />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 px-5 flex justify-end rounded-b-[6px] max-w-full mt-0">
              <button className="border border-[#123a6b] bg-white text-[#123a6b] py-[10px] px-[18px] rounded-[6px] cursor-pointer font-semibold">VIEW MORE</button>
            </div>
          </div>

          <aside className="flex-[0_0_30%] flex flex-col w-full">
            <div className="flex gap-3 items-center mb-3">
              <div className="[&>svg]:block" aria-hidden>
                <WhatsNew />
              </div>
              <h3 className="text-[20px] text-[#123a6b] m-0 font-bold">What's New</h3>
            </div>

            <div className="bg-[#162f6a] text-white rounded-[8px] py-9 px-6 min-h-[220px] flex items-center">
              <div className="flex items-center gap-2">MeitY Performance Smartboard <FiChevronRight /></div>
            </div>

            <div className="mt-3 flex justify-end">
              <button className="border border-[#123a6b] bg-white text-[#123a6b] py-[10px] px-[18px] rounded-[6px] cursor-pointer font-semibold">VIEW MORE</button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
