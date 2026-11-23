import { useEffect, useState } from "react";
import { t } from "@/lib/translations";
const safeUrl = (url) => {
  const u = String(url || "").trim();
  if (!u) return "#";
  return /^(\/|#|https?:\/\/|mailto:|tel:)/i.test(u) ? u : "#";
};

const Footer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFooter = async () => {
      try {
        const res = await fetch("/api/footer");
        if (!res.ok) {
          return;
        }
        const json = await res.json();
        if (isMounted && json) {
          setData(json);
        }
      } catch (e) {
        // ignore
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFooter();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || !data || !Array.isArray(data.sections)) {
    return null;
  }

  const sections = data.sections;

  const copyrightText =
    (data && typeof data.copyright === "string" && data.copyright.trim()) ||
    "This Website belongs to Cabinet Secretariat, Government of India";

  const formatDate = (iso) => {
    if (!iso) return null;
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return null;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}.${month}.${year}`;
    } catch {
      return null;
    }
  };

  const lastUpdated = formatDate(data.updated_at) || "12.09.2025";

  return (
    <footer className="bg-[#0B2C6A] text-white py-10">
      <div className="gi-container">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          {/* Left Links Section (dynamic) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 lg:gap-x-12 xl:gap-x-16 gap-y-4">
            {sections.map((section, i) => {
              const title =
                typeof section?.title === "string" ? section.title.trim() : "";
              const links = (
                Array.isArray(section?.links) ? section.links : []
              ).filter((l) => l && String(l.label || "").trim());

              if (!title && links.length === 0) return null;

              return (
                <div key={i}>
                  {title ? (
                    <h4 className="font-20-600 mb-3 min-h-[28px]"> {title}</h4>
                  ) : (
                    <div className="hidden md:block h-[40px]" />
                  )}

                  <ul className="space-y-2 text-base">
                    {links.map((link, j) => (
                      <li key={j}>
                        <a href={safeUrl(link.url)} className="font-20-400">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined mr-2"
                          >
                            chevron_right
                          </span>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Footer Bottom Text */}
            <div
              className="col-span-full text-left text-gray-300 text-base mt-0 md:mt-0"
              dangerouslySetInnerHTML={{ __html: copyrightText }}
            />
          </div>

          <div className="flex flex-col items-center md:items-end space-y-4 mt-0 md:mt-5">
            {/* Logos */}
            <div className="flex space-x-8">
              <a
                href="https://www.nic.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg block"
              >
                <img
                  src="/images/footer/nic.png"
                  alt="NIC"
                  width={140}
                  height={60}
                  style={{
                    width: "140px",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </a>

              <a
                href="https://www.india.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-3 rounded-lg block"
              >
                <img
                  src="/images/footer/indiaportal.svg"
                  alt="India Portal"
                  width={140}
                  height={60}
                  style={{
                    width: "140px",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </a>
            </div>

            {/* Last Updated */}
            <p className="text-sm text-gray-300 md:whitespace-nowrap">
              {t("last_update_on")}: {lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
