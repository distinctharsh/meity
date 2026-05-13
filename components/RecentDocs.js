import React, { useEffect, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import Document from './icons/Document';
import { showConfirmationPopup } from './common/ConfirmationPopup';

const fallbackRecent = [
  { title: "No recent documents available", description: "Check back later for updates" }
];

const personas = [
  { img: "/images/user-personas/it-professional.jpg", label: "FOR IT PROFESSIONAL" },
  { img: "/images/user-personas/researcher.jpg", label: "FOR RESEARCHER" },
  { img: "/images/user-personas/media.jpg", label: "FOR MEDIA" },
  { img: "/images/user-personas/business-owner.jpg", label: "FOR BUSINESS OWNER" },
];

const RecentDocs = () => {
  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0);
  const [docs, setDocs] = useState(fallbackRecent);
  const [navLinks, setNavLinks] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [importantLinks, setImportantLinks] = useState([]);
  const [importantLinksLoading, setImportantLinksLoading] = useState(true);
  
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/recent-doc-links');
        if (res.ok) {
          const data = await res.json();
          if (mounted && Array.isArray(data)) setNavLinks(data);
        }
      } catch (err) {
        // fallback to recent-docs items if links endpoint fails
        try {
          const r2 = await fetch('/api/recent-docs');
          if (r2.ok) {
            const d2 = await r2.json();
            if (mounted && Array.isArray(d2) && d2.length) setDocs(d2);
          }
        } catch { }
      }

      // Fetch important links
      try {
        const importantLinksRes = await fetch('/api/admin/important-links');
        if (importantLinksRes.ok) {
          const importantLinksData = await importantLinksRes.json();
          if (mounted && Array.isArray(importantLinksData)) {
            // Filter only active items and keep full link data
            const activeLinks = importantLinksData
              .filter(link => link.is_active === 1)
              .sort((a, b) => a.display_order - b.display_order);
            setImportantLinks(activeLinks);
          }
        }
      } catch (error) {
        console.error('Failed to fetch important links:', error);
        // Set fallback data if API fails
        if (mounted) {
          setImportantLinks([
            "Secretary to GOI List",
            "Former Cabinet Secretary List",
            "IGoT",
            "EHRMS",
            "SPARROW",
          ]);
        }
      } finally {
        if (mounted) {
          setImportantLinksLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);



  useEffect(() => {
    const fetchRecentDocs = async () => {
      try {
        const response = await fetch('/api/recent-reports');
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
        console.error('Error fetching recent documents:', error);
        setRecentDocs(fallbackRecent);
      }
    };
    fetchRecentDocs();
  }, []);


  const prevPersona = () => {
    setCurrentPersonaIndex((prev) => (prev === 0 ? personas.length - 1 : prev - 1));
  };

  const nextPersona = () => {
    setCurrentPersonaIndex((prev) => (prev === personas.length - 1 ? 0 : prev + 1));
  };

  const handleLinkClick = async (link) => {
    try {
      // For external URLs, show confirmation popup
      if (link.link_type === 'url' && link.url) {
        const confirmed = await showConfirmationPopup({
          title: "External Website",
          message: "This would take you to an external website that opens in a new tab. Do you want to continue anyway?",
          confirmText: "Continue",
          cancelText: "Cancel"
        });
        
        if (confirmed) {
          window.open(link.url, '_blank', 'noopener,noreferrer');
        }
      } else if (link.link_type === 'file' && link.file_path) {
        // For files, open directly (no confirmation needed)
        window.open(link.file_path, '_blank', 'noopener,noreferrer');
      } else {
        console.warn('No valid link found for:', link);
      }
    } catch (error) {
      console.error('Error handling link click:', error);
    }
  };

  return (
    <>
      <main id="main">
        <div className="w-full bg-white py-8">
          <div className="gi-container flex flex-col md:flex-row justify-between items-start w-full gap-10">

            {/* Recent Documents */}
            <div className="flex flex-col items-start w-full md:flex-[2] md:mr-0">
              <div className="flex items-center mb-4">
                <Document className="w-5 h-5 mr-2" />
                <h3 className="main-heading">Recent Documents</h3>
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
                      {doc.title || 'General Document'}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end w-full">
                <button
                  className="view-btn"
                  onClick={async () => {
                    try {
                      // Try to load main navigation and find first active child under /documents
                      const navRes = await fetch('/api/navigation');
                      if (!navRes.ok) throw new Error('nav fetch failed');
                      const nav = await navRes.json();
                      
                      // Debug: Log the entire navigation structure
                      
                      // find section node for /documents - check both link and href properties
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
                      
                      const section = findByLink(nav, '/documents');
                      const children = section?.children || section?.items || [];
                      
                      // Find first active child
                      const first = children.find((c) => c.is_active !== false) || children[0];
                      let target = '/documents';
                      
                      if (first) {
                        target = first.link || first.href || target;
                      } else {
                      }
                      
                      // If target is a documents path, map to pretty route
                      if (typeof target === 'string' && target.startsWith('/documents')) {
                        if (target === '/documents') {
                          window.location.href = '/documents';
                        } else {
                          const rest = target.replace(/^\/documents\//, '');
                          const prettyUrl = `/documents/${encodeURIComponent(rest)}`;
                          window.location.href = prettyUrl;
                        }
                      } else if (typeof target === 'string') {
                        window.location.href = target;
                      } else {
                        window.location.href = '/documents';
                      }
                    } catch (e) {
                      // fallback: open documents root
                      window.location.href = '/documents';
                    }
                  }}
                >
                  VIEW MORE
                  <FiChevronRight />
                </button>
              </div>
            </div>

            {/* Important Links */}
            <div className="flex flex-col items-start w-full md:flex-[1] md:ml-[20px]">
              <div className="flex items-center mb-4">
                <img
                  src="/images/icons/important-link.svg"
                  alt="Important Link"
                  style={{ filter: 'invert(9%) sepia(33%) saturate(1659%) hue-rotate(191deg) brightness(92%) contrast(97%)' }}
                />
                <h3 className="main-heading">Important Links</h3>
              </div>
              <div className="relative w-full">
                {importantLinksLoading ? (
                  <div className="flex justify-center items-center h-32 mt-2 bg-white">
                    <div className="animate-pulse flex flex-col space-y-2 w-full px-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-3 bg-gray-200 rounded"></div>
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
                        <span className="flex-1">{link.title}</span>
                        <span className="text-[#0b3a82]"><FiChevronRight /></span>
                      </li>
                    ))}
                  </ul>
                )}
                <span className="absolute top-0 right-0 h-full w-[3px] bg-[#0b3a82]" aria-hidden></span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      </>
  );
};

export default RecentDocs;
