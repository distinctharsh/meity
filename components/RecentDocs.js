"use client";

import { FiChevronRight } from "react-icons/fi";
import Document from "./icons/Document";
import { showConfirmationPopup } from "./common/ConfirmationPopup";
import { t } from "@/lib/translations";

const fallbackRecent = [
  {
    title: t("no_recent_documents"),
    description: t("check_back_later"),
  },
];

const RecentDocs = ({ docs = [], importantLinks = [] }) => {
  const displayDocs = Array.isArray(docs) && docs.length > 0 ? docs : fallbackRecent;
  const displayLinks = Array.isArray(importantLinks) && importantLinks.length > 0 ? importantLinks : [];

  const handleLinkClick = async (link) => {
    try {
      const targetUrl = link.url || link.file_path;
      if (targetUrl) {
        const confirmed = await showConfirmationPopup({
          title: t("external_website"),
          message: t("external_website_message"),
          confirmText: t("continue"),
          cancelText: t("cancel"),
        });

        if (confirmed) {
          window.open(targetUrl, "_blank", "noopener,noreferrer");
        }
      }
    } catch (error) {
      console.error("Error handling link click:", error);
    }
  };

  return (
    <>
      <main id="main">
        <div className="w-full bg-white py-8">
          <div className="gi-container flex flex-col md:flex-row items-start w-full gap-8">

            {/* Recent Documents */}
            <div className="flex flex-col items-start w-full md:flex-[2] min-w-0">
              <div className="flex items-center mb-4">
                <Document className="w-5 h-5 mr-2" />
                <h3 className="main-heading">
                  {t("recent_documents")}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 mt-2 w-full">
                {displayDocs.map((doc, index) => (
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
                          className="recent-head"
                        >
                          {doc.nav_name}
                        </a>
                      ) : (
                        doc.nav_name || "Document"
                      )}
                    </h4>

                    <p className="recent-text">
                      {doc.title || "General Document"}
                    </p>
                  </div>
                ))}
              </div>

              {/* View More */}
              <div className="mt-6 flex justify-end w-full">
                <button
                  className="view-btn"
                  onClick={() => {
                    window.location.href = "/documents/council-of-ministers-portfolio-allocations";
                  }}
                >
                  {t("view_more")}
                  <FiChevronRight />
                </button>
              </div>
            </div>

            {/* Explore User Personas (Slider with New Tab Open on Click) */}
            {/* <div className="flex flex-col items-start w-full md:flex-[1] min-w-0">
              <div className="flex items-center mb-4">
                <img
                  src="/images/user-personas/user.svg"
                  alt="User Personas"
                  className="w-10 h-10 mr-2"
                />
                <h3 className="main-heading">{t("explore_user_personas")}</h3>
              </div>

              <div className="flex flex-col items-center justify-between bg-white rounded-[6px] p-6 w-full">
                
                <div 
                  onClick={handlePersonaClick}
                  className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform w-full pt-2 ${
                    isAnimating ? "opacity-0 scale-95 translate-y-2" : "opacity-100 scale-100 translate-y-0"
                  }`}
                >
                  <div 
                    className="rounded-full flex items-center justify-center overflow-hidden mb-4 shadow-sm"
                    style={{
                      width: "260px",
                      height: "260px",
                      backgroundColor: "rgb(163, 187, 243)",
                    }}
                  >
                    <Image
                      src={personas[currentPersonaIndex].img}
                      alt={personas[currentPersonaIndex].label}
                      width={240}
                      height={240}
                      className="rounded-full object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <span className="text-center font-bold text-base text-[#0a2e60] uppercase tracking-wide">
                    {personas[currentPersonaIndex].label}
                  </span>
                </div>

                <div className="flex items-center justify-between w-full pt-6 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevPersona();
                    }}
                    className="text-[#0a2e60] hover:text-[#0b3a82] p-1 transition-colors"
                    aria-label="Previous Persona"
                  >
                    <FiChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {personas.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          changePersona(index);
                        }}
                        className={`h-2 rounded-full transition-all ${
                          currentPersonaIndex === index
                            ? "w-4 bg-[#0a2e60]"
                            : "w-2 bg-gray-300"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextPersona();
                    }}
                    className="text-[#0a2e60] hover:text-[#0b3a82] p-1 transition-colors"
                    aria-label="Next Persona"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>

              </div>
            </div> */}

            {/* Important Links */}
            <div className="flex flex-col items-start w-full md:flex-[1] min-w-0">
              <div className="flex items-center mb-4">
                <img
                  src="/images/icons/important-link.svg"
                  alt="Important Link"
                  className="w-10 h-10 mr-2"
                  style={{
                    filter:
                      "invert(9%) sepia(33%) saturate(1659%) hue-rotate(191deg) brightness(92%) contrast(97%)",
                  }}
                />

                <h3 className="main-heading">
                  {t("important_links")}
                </h3>
              </div>

              <div className="relative w-full">
                <ul className="m-0 p-0 w-full mt-2 bg-white">
                  {displayLinks.map((link, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between border-b last:border-none border-[#e6ecff] py-3 px-4 hover:bg-[#f7f9ff] cursor-pointer transition-colors important-link-text"
                      onClick={() => handleLinkClick(link)}
                    >
                      <span className="flex-1">
                        {link.title}
                      </span>

                      <span className="text-[#0b3a82]">
                        <FiChevronRight />
                      </span>
                    </li>
                  ))}
                </ul>

                <span
                  className="absolute top-0 right-0 h-full w-[3px] bg-[#0b3a82]"
                  aria-hidden="true"
                />
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
};

export default RecentDocs;