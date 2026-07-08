"use client";

import AccessibilityBar from "./AccessibilityBar";
import Emblem from "./icons/Emblem";
import { t } from "@/lib/translations";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Header() {
  
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const dropdownRef = useRef(null);

  const languages =
  process.env.NEXT_PUBLIC_LANGUAGE === "2"
    ? ["Hindi (हिन्दी)"]
    : ["English"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

 const handleSearch = () => {
  if (!searchText.trim()) return;

  router.push(
    `/search?q=${encodeURIComponent(searchText)}`
  );

  setSearchText(""); // textbox clear
};

  return (
    <>
      <header
        id="site-header"
        className="bg-white py-[12px] px-4 md:px-[120px] border-b border-[#e6e6e6] md:sticky md:top-0 md:z-[998]"
      >
        <div className="w-full mx-auto py-8">
          <div className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-[3fr_auto_1fr] md:items-end">

            {/* Left Column */}
            <div className="flex flex-col md:flex-row md:items-end gap-3 order-2 md:order-none w-full">

              {/* Logo */}
              <Link href="/" className="block">
                <div className="flex items-end gap-3 cursor-pointer">
                  <div className="flex items-center flex-none">
                    <Emblem />
                  </div>

                  <div className="flex flex-col leading-[1.2] min-w-0 md:flex-1 font-20-400">
                    <div
                      style={{
                        color: "#000",
                        letterSpacing: "-0.08px",
                        marginBottom: 0,
                      }}
                    >
                      {t("government_of_india")}
                    </div>

                    <h2
                      style={{
                        color: "#000",
                        letterSpacing: "0",
                        marginBottom: 6,
                      }}
                      className="leading-[1.3] font-24-700"
                    >
                      {t("cabinet_secretariat")}
                    </h2>
                  </div>
                </div>
              </Link>

              {/* Mobile Logo */}
              <div className="md:hidden w-full flex justify-center my-1">
                <img
                  src="/images/digitalindia.svg"
                  alt={t("digital_india")}
                  width={120}
                  height={120}
                  style={{ width: 120, height: "auto" }}
                />
              </div>

              {/* Desktop Search */}
              <div className="hidden md:flex items-center md:ml-auto md:mb-0 md:mr-5 order-4 md:order-none w-full md:w-auto justify-center md:justify-end">
                <div className="flex items-center border-[2px] border-[#ebeaea] border-b-[3px] border-b-[#123a6b] rounded-t-[12px] overflow-hidden w-full max-w-[320px] md:max-w-[400px] md:w-[300px] bg-white mb-0 md:mb-[10px]">

                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) =>
                      setSearchText(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    placeholder={t("search_placeholder")}
                    className="flex-1 border-0 outline-none py-[10px] px-[9px] text-[14px] font-sans border-r border-[#ebeaea]"
                  />

                  <button
                    onClick={handleSearch}
                    className="bg-transparent border-0 px-4 pt-2 cursor-pointer text-[#123a6b] text-[20px] border-l border-[#ebeaea]"
                    title={t("search")}
                  >
                    <span className="material-symbols-outlined">
                      search
                    </span>
                  </button>

                </div>
              </div>

            </div>

            {/* Center Logo */}
            <div className="hidden md:flex justify-end pr-8 order-3 md:order-none">
              <img
                src="/images/digitalindia.svg"
                alt={t("digital_india")}
                width={100}
                height={100}
                style={{ width: 200, height: "auto" }}
              />
            </div>

            {/* Right Column */}
            <div className="flex justify-end md:justify-end gap-[18px] mb-0 md:mb-[10px] order-1 md:order-none">
              <div className="flex gap-3 items-center">
                <a
                  href="#main-content"
                  className="bg-transparent border-0 cursor-pointer p-[6px] inline-flex"
                >
                  <img
                    src="/images/icons/skip.svg"
                    alt={t("skip_to_main_content_label")}
                  />
                </a>
                {/* <div className="border-x border-[#162f6a] p-[2px] flex items-center">
                  <div className="bhashini-plugin-container">
                    <img
                      src="/images/icons/bhashini.svg"
                      alt="Bhashini"
                    />
                  </div>
                </div> */}

                  <div
                    className="relative border-x border-[#162f6a] px-[6px] flex items-center"
                    ref={dropdownRef}
                  >
                    <button
                      onClick={() => setLangOpen(!langOpen)}
                      className="flex items-center justify-center bg-transparent border-0 cursor-pointer"
                    >
                      <img
                        src="/images/icons/bhashini.svg"
                        alt="Language"
                        className="w-[28px] h-[28px]"
                      />
                    </button>

                    {langOpen && (
                      <div className="absolute top-[38px] right-0 w-[180px] bg-white border border-[#d1d5db] shadow-lg z-[9999]">
                        <div className="max-h-[120px] overflow-y-auto custom-scrollbar">
                          {languages.map((lang) => (
                            <div
                              key={lang}
                              onClick={() => {
                                setSelectedLang(lang);
                                setLangOpen(false);

                                // language switch logic here
                                console.log("Selected:", lang);
                              }}
                              className={`px-4 py-2 text-[18px] cursor-pointer hover:bg-[#f3f4f6] ${
                                selectedLang === lang
                                  ? "bg-[#f3f4f6] font-medium"
                                  : ""
                              }`}
                            >
                              {lang}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                <AccessibilityBar />
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden sticky top-0 z-[999] bg-white border-b border-[#e6e6e6] px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="flex items-center border-[2px] border-[#ebeaea] border-b-[3px] border-b-[#123a6b] rounded-t-[12px] overflow-hidden w-full max-w-[320px] bg-white">
              <input
                type="text"
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder={t("search_placeholder")}
                className="flex-1 border-0 outline-none py-[10px] px-[9px]"
              />
              <button
                onClick={handleSearch}
                className="bg-transparent border-0 px-4 pt-2 cursor-pointer text-[#123a6b] text-[20px] border-l border-[#ebeaea]"
              >
                <span className="material-symbols-outlined">
                  search
                </span>
              </button>
            </div>
          </div>

          <button
            className="ml-3 bg-transparent border-0 text-[24px] cursor-pointer p-2 text-[#123a6b]"
            onClick={() => {
              window.dispatchEvent(
                new Event("toggle-navbar")
              );
            }}
          >
            <span className="material-symbols-outlined">
              menu
            </span>
          </button>

        </div>
      </div>
    </>
  );
}