"use client";
import Image from "next/image";

export default function EventQuote() {
  return (
    <div className="w-full mx-auto px-[10%] bg-[#ebeaea]">
      <div className="flex flex-wrap rounded-[8px] overflow-hidden">
        {/* Left Column - Image */}
        <div className="flex-[0_0_300px] p-[30px] flex justify-center items-center w-full md:w-auto">
          <div className="relative w-[260px] h-[260px] rounded-full overflow-hidden bg-white shadow-[0_2px_4px_rgba(35,35,47,0.06),_0_6px_12px_rgba(35,35,47,0.08)]">
            <img
              src="./images/pm/pm-modi.jpg"
              alt="PM"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="flex-1 p-[30px] flex flex-col justify-center">
          <div className="max-w-full">
            <p className="text-[1.25rem] leading-[1.6] text-[#162f6a] font-medium tracking-[-0.12px]">
              <span className="block text-[4.4rem] text-[#162f6a] leading-none mb-5">“</span>
              PM emphasises that democracy and technology together can ensure the
              welfare of humanity.
            </p>

            <hr className="border-0 h-px bg-[#d1d1d1] my-5" />

            <div className="flex justify-between items-center mb-6 flex-wrap gap-4 text-[#162f6a]">
              <span className="uppercase text-[0.9rem] tracking-[0.5px] font-medium">
                SEMICONDUCTOR EXECUTIVES' ROUNDTABLE
                <br />
                <span className="text-[0.85rem] bg-[#e9e9e9] rounded-[20px] font-medium">10.09.2024</span>
              </span>

              <a href="#" className="inline-flex items-center gap-2 bg-[#162f6a] text-white py-[10px] px-5 rounded-[4px] no-underline font-medium text-[0.9rem] transition-all hover:bg-[#1a3a80] hover:-translate-y-[2px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <span aria-hidden="true" className="material-symbols-outlined">open_in_new</span>
                VIEW EVENT
              </a>
            </div>

            <div className="mt-2 flex justify-start md:justify-end"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
