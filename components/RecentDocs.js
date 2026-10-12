"use client";

import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Image from "next/image";
import { useEffect, useState } from "react";
import Document from "./icons/Document";
import { showConfirmationPopup } from "./common/ConfirmationPopup";
import { t } from "@/lib/translations";

const fallbackRecent = [
  {
    title: t("no_recent_documents"),
    description: t("check_back_later"),
  },
];

const personas = [
  {
    img: "/images/user-personas/media.jpg",
    label: t("for_media"),
  },
  {
    img: "/images/user-personas/researcher.jpg",
    label: t("for_researcher"),
  },
];

const RecentDocs = () => {
  const [docs, setDocs] = useState(fallbackRecent);
  const [navLinks, setNavLinks] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [importantLinks, setImportantLinks] = useState([]);
  const [importantLinksLoading, setImportantLinksLoading] = useState(true);

  // Persona Slider State & Animation Trigger
  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const changePersona = (newIndex) => {
    if (newIndex === currentPersonaIndex) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPersonaIndex(newIndex);
      setIsAnimating(false);
    }, 200); // 200ms duration for fade out/in effect
  };

  const nextPersona = () => {
    const nextIndex = (currentPersonaIndex + 1) % personas.length;
    changePersona(nextIndex);
  };

  const prevPersona = () => {
    const prevIndex = (currentPersonaIndex - 1 + personas.length) % personas.length;
    changePersona(prevIndex);
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/recent-doc-links");

        if (res.ok) {
          const data = await res.json();

          if (mounted && Array.isArray(data)) {
            setNavLinks(data);
          }
        }
      } catch (err) {
        try {
          const r2 = await fetch("/api/recent-docs");

          if (r2.ok) {
            const d2 = await r2.json();

            if (mounted && Array.isArray(d2) && d2.length) {
              setDocs(d2);
            }
          }
        } catch {}
      }

      // Fetch important links
      try {
        const importantLinksRes = await fetch(
          "/api/admin/important-links"
        );

        if (importantLinksRes.ok) {
          const importantLinksData = await importantLinksRes.json();

          if (mounted && Array.isArray(importantLinksData)) {
            const activeLinks = importantLinksData
              .filter((link) => link.is_active === 1)
              .sort((a, b) => a.display_order - b.display_order);

            setImportantLinks(activeLinks);
          }
        }
      } catch (error) {
        console.error("Failed to fetch important links:", error);

        if (mounted) {
          setImportantLinks([
            {
              title: "Secretary to GOI List",
              link_type: "url",
              url: "#",
            },
            {
              title: "Former Cabinet Secretary List",
              link_type: "url",
              url: "#",
            },
            {
              title: "IGoT",
              link_type: "url",
              url: "#",
            },
            {
              title: "EHRMS",
              link_type: "url",
              url: "#",
            },
            {
              title: "SPARROW",
              link_type: "url",
              url: "#",
            },
          ]);
        }
      } finally {
        if (mounted) {
          setImportantLinksLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchRecentDocs = async () => {
      try {
        const response = await fetch("/api/recent-reports");

        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data) && data.length > 0) {
            setRecentDocs(data);
          } else {
            setRecentDocs(fallbackRecent);
          }
        } else {
          setRecentDocs(fallbackRecent);
        }
      } catch (error) {
        console.error("Error fetching recent documents:", error);
        setRecentDocs(fallbackRecent);
      }
    };

    fetchRecentDocs();
  }, []);

  const handleLinkClick = async (link) => {
    try {
      if (link.link_type === "url" && link.url) {
        const confirmed = await showConfirmationPopup({
          title: t("external_website"),
          message: t("external_website_message"),
          confirmText: t("continue"),
          cancelText: t("cancel"),
        });

        if (confirmed) {
          window.open(link.url, "_blank", "noopener,noreferrer");
        }
      } else if (link.link_type === "file" && link.file_path) {
        window.open(link.file_path, "_blank", "noopener,noreferrer");
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
                {recentDocs.map((doc, index) => (
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
                        doc.nav_name
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
                  onClick={async () => {
                    try {
                      const navRes = await fetch("/api/navigation");

                      if (!navRes.ok) throw new Error("nav fetch failed");

                      const nav = await navRes.json();

                      const findByLink = (nodes, link) => {
                        for (const n of nodes || []) {
                          if ((n.link || n.href) === link) return n;
                          if (n.children) {
                            const f = findByLink(n.children, link);
                            if (f) return f;
                          }
                        }
                        return null;
                      };

                      const section = findByLink(nav, "/documents");
                      const children = section?.children || section?.items || [];
                      const first = children.find((c) => c.is_active !== false) || children[0];

                      let target = "/documents";
                      if (first) {
                        target = first.link || first.href || target;
                      }

                      if (typeof target === "string" && target.startsWith("/documents")) {
                        if (target === "/documents") {
                          window.location.href = "/documents";
                        } else {
                          const rest = target.replace(/^\/documents\//, "");
                          window.location.href = `/documents/${encodeURIComponent(rest)}`;
                        }
                      } else {
                        window.location.href = target;
                      }
                    } catch (e) {
                      window.location.href = "/documents";
                    }
                  }}
                >
                  {t("view_more")}
                  <FiChevronRight />
                </button>
              </div>
            </div>

            {/* Explore User Personas (Slider with SVG Icon & Transition) */}
            <div className="flex flex-col items-start w-full md:flex-[1] min-w-0">
              <div className="flex items-center mb-4">
                <img
                  src="/images/user-personas/user.svg"
                  alt="User Personas"
                  className="w-10 h-10 mr-2"
                  
                />
                <h3 className="main-heading">Explore User Personas</h3>
              </div>

              {/* Slider Container */}
              <div className="flex flex-col items-center justify-between bg-white rounded-[6px] p-6 w-full">
                
                {/* Active Persona Item with Smooth Transition */}
                <div 
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

                {/* Bottom Navigation Controls */}
                <div className="flex items-center justify-between w-full pt-6 mt-2">
                  <button
                    onClick={prevPersona}
                    className="text-[#0a2e60] hover:text-[#0b3a82] p-1 transition-colors"
                    aria-label="Previous Persona"
                  >
                    <FiChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {personas.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => changePersona(index)}
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
                    onClick={nextPersona}
                    className="text-[#0a2e60] hover:text-[#0b3a82] p-1 transition-colors"
                    aria-label="Next Persona"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>

              </div>
            </div>

            {/* Important Links */}
            <div className="flex flex-col items-start w-full md:flex-[1] min-w-0">
              <div className="flex items-center mb-4">
                <img
                  src="/images/icons/important-link.svg"
                  alt="Important Link"
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
                {importantLinksLoading ? (
                  <div className="flex justify-center items-center h-32 mt-2 bg-white">
                    <div className="animate-pulse flex flex-col space-y-2 w-full px-4">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="h-3 bg-gray-200 rounded"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <ul className="m-0 p-0 w-full mt-2 bg-white">
                    {importantLinks.map((link, i) => (
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
                )}

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