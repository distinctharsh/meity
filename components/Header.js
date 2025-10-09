"use client";
import AccessibilityBar from "./AccessibilityBar";
import Emblem from "./icons/Emblem";

export default function Header() {
  return (
    <header id="site-header" className="bg-white py-[12px] px-4 md:px-[120px] border-b border-[#e6e6e6] sticky top-0 z-[998]">
      <div className="w-full mx-auto py-4">
        <div className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-[3fr_auto_1fr] md:items-end">
          {/* Left Column */}
          <div className="flex flex-col md:flex-row md:items-end gap-3 order-2 md:order-none w-full">
            {/* Top row: Emblem + Text */}
            <div className="flex items-start gap-3">
              {/* Emblem */}
              <div className="flex items-center flex-none">
                <Emblem />
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center leading-[1.2] min-w-0 mt-[8px] md:mt-[25px] md:flex-1">
                <div className="text-[1.5rem] text-black mb-[6px] font-normal leading-[18px] tracking-[-0.08px]">
                  Government of India
                </div>
                <h2 className="text-[1.8rem] font-bold text-black mb-[4px] leading-[1.3]">
                  Cabinet Secretariat
                </h2>
              </div>
            </div>

            {/* Digital India (mobile only, above search) */}
            <div className="md:hidden w-full flex justify-center my-1">
              <img src="/images/digitalindia.svg" alt="Digital India" width={120} height={120} style={{ width: 120, height: 'auto' }} />
            </div>

            {/* Search */}
            <div className="flex items-center md:ml-5 md:mb-0 md:mr-5 order-4 md:order-none w-full md:w-auto justify-center md:justify-start ">
              <div className="flex items-center border-[2px] border-[#ebeaea] border-b-[3px] border-b-[#123a6b] rounded-t-[12px] overflow-hidden w-full max-w-[320px] md:max-w-[400px] md:w-[300px] bg-white mb-0 md:mb-[10px]">
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

            {/* Middle Column (desktop/tablet only) */}
            <div className="hidden md:flex justify-center mb-[10px] order-3 md:order-none">
              <img src="/images/digitalindia.svg" alt="Digital India" width={100} height={100} style={{ width: 130, height: 'auto' }} />
            </div>

          </div>

          {/* Middle Column (desktop/tablet only) */}
          <div className="hidden md:flex justify-center mb-[10px] order-3 md:order-none">
            
          </div>

          {/* Right Column */}
          <div className="flex justify-end md:justify-end gap-[18px] mb-0 md:mb-[10px] order-1 md:order-none">
            <div className="flex gap-3 items-center">
              <a
                href="#main-content"
                onClick={(e) => {
                  // Let the hash change happen, then focus the main region for screen readers/keyboard users
                  setTimeout(() => {
                    const main = document.getElementById('main-content');
                    if (main) main.focus();
                  }, 0);
                }}
                className="bg-transparent border-0 cursor-pointer p-[6px] inline-flex"
                aria-label="Skip to main content"
                title="Skip to main content"
              >
                <img src="/images/icons/skip.svg" alt="Skip to main content" />
              </a>
              <button className="bg-transparent border-0 cursor-pointer p-[6px] border-x border-[#162f6a]" title="Language" onClick={async () => {
                try {
                  const current = document.documentElement.lang || 'en';
                  const next = current === 'en' ? 'hi' : 'en';
                  await fetch('/api/lang', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: next }) });
                  location.reload();
                } catch (e) { console.error(e); }
              }}>
                <img src="/images/icons/bhashini.svg" alt="Bhashini" />
              </button>
              <AccessibilityBar />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
