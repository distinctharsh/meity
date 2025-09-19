"use client";
import AccessibilityBar from "./AccessibilityBar";
import Bhashini from "./icons/Bhashini";
import Emblem from "./icons/Emblem";
import Skip from "./icons/Skip";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white py-[28px] px-4 md:px-[120px] border-b border-[#e6e6e6] sticky top-0 z-[998]">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[3fr_auto_1fr] md:items-end">
          {/* Left Column */}
          <div className="flex flex-col md:flex-row md:items-end gap-3 order-2 md:order-none w-full">
            {/* Top row: Emblem + Text */}
            <div className="flex items-start gap-3">
              {/* Emblem */}
              <div className="flex items-center flex-none">
                <Emblem />
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center leading-[1.2] min-w-0 mt-[25px] md:flex-1">
                <div className="text-[1.5rem] text-black mb-[15px] font-normal leading-[18px] tracking-[-0.08px]">
                  Government of India
                </div>
                <h2 className="text-[1.8rem] font-bold text-black mb-[8px] leading-[1.3]">
                  Cabinet Secretariat
                </h2>
              </div>
            </div>

            {/* Digital India (mobile only, above search) */}
            <div className="md:hidden w-full flex justify-center my-2">
              <Image src="/images/digitalindia.svg" alt="Digital India" width={120} height={120} />
            </div>

            {/* Search */}
            <div className="flex items-center md:ml-5  md:mb-0 md:mr-5 order-4 md:order-none w-full md:w-auto justify-center md:justify-start ">
              <div className="flex items-center border-[2px] border-[#ebeaea] border-b-[3px] border-b-[#123a6b] rounded-t-[12px] overflow-hidden w-full max-w-[320px] md:max-w-[400px] md:w-[300px] bg-white mb-[10px]">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 border-0 outline-none py-[10px] px-[9px] text-[14px] font-sans border-r border-[#ebeaea] placeholder:text-[16px] placeholder:text-[#453636]"
                />
                <button className="bg-transparent border-0 px-4 pt-2 cursor-pointer text-[#123a6b] text-[20px] border-l border-[#ebeaea]" title="Search">
                  <span className="material-symbols-outlined">search</span>
                </button>
              </div>
              {/* Mobile hamburger to the right of search */}
              <button
                className="ml-3 bg-transparent border-0 text-[24px] cursor-pointer p-2 text-[#123a6b] md:hidden"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('toggle-navbar'));
                  }
                }}
                aria-label="Toggle navigation"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>

          {/* Middle Column (desktop/tablet only) */}
          <div className="hidden md:flex justify-center mb-[10px] order-3 md:order-none">
            <Image src="/images/digitalindia.svg" alt="Digital India" width={100} height={100} />
          </div>

          {/* Right Column */}
          <div className="flex justify-center md:justify-end gap-[18px] mb-[10px] order-1 md:order-none">
            <div className="flex gap-3 items-center">
              <button className="bg-transparent border-0 cursor-pointer p-[6px]" title="Login">
                <Skip />
              </button>
              <button className="bg-transparent border-0 cursor-pointer p-[6px] border-x border-[#162f6a]" title="Language">
                <Bhashini />
              </button>
              <AccessibilityBar />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
