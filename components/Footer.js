import { useEffect, useState } from "react";
import Image from "next/image";
import { t } from '@/lib/translations';

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

  // Agar data load nahi hua hai ya sections nahi hain, toh null return kar do
  if (loading || !data || !Array.isArray(data.sections)) {
    return null;
  }

  const sections = data.sections;
  const s1 = sections[0] || {};
  const s2 = sections[1] || {};
  const s3 = sections[2] || {};

  const s1Links = Array.isArray(s1.links) ? s1.links : [];
  const s2Links = Array.isArray(s2.links) ? s2.links : [];
  const s3Links = Array.isArray(s3.links) ? s3.links : [];

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

          {/* Left Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-20-600 mb-3">{t("useful_links")}</h4>
              <ul className="space-y-2 text-base">
                <li>
                  <a href={s1Links[0]?.url || "#"} className="font-20-400">
                    <span aria-hidden="true" className="material-symbols-outlined mr-2">chevron_right</span>
                    {s1Links[0]?.label || "Archives"}
                  </a>
                </li>
                <li>
                  <a href="/sitemap" className="font-20-400">
                    <span aria-hidden="true" className="material-symbols-outlined mr-2">chevron_right</span>
                    {s1Links[1]?.label || "Sitemap"}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2 text-base mt-0 md:mt-[34px]">
                <li>
                  <a href={s2Links[0]?.url || "#"} className="font-20-400">
                    <span aria-hidden="true" className="material-symbols-outlined mr-2">chevron_right</span>
                    {s2Links[0]?.label || "Website Policies"}
                  </a>
                </li>
                <li>
                  <a href={s2Links[1]?.url || "#"} className="font-20-400">
                    <span aria-hidden="true" className="material-symbols-outlined mr-2">chevron_right</span>
                    {s2Links[1]?.label || "Help"}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2 text-base mt-0 md:mt-[34px]">
                <li>
                  <a href={s3Links[0]?.url || "#"} className="font-20-400">
                    <span aria-hidden="true" className="material-symbols-outlined mr-2">chevron_right</span>
                    {s3Links[0]?.label || "Related Links"}
                  </a>
                </li>
                <li>
                  <a href={s3Links[1]?.url || "#"} className="font-20-400">
                    <span aria-hidden="true" className="material-symbols-outlined mr-2">chevron_right</span>
                    {s3Links[1]?.label || "Contact Us"}
                  </a>
                </li>
              </ul>
            </div>

            {/* Footer Bottom Text */}
            <div className="text-left text-gray-300 text-base mt-0 md:mt-0 md:whitespace-nowrap">
              {copyrightText}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-4 mt-0 md:mt-5">
            {/* Logos */}
            <div className="flex space-x-8">
              <a href="https://www.nic.gov.in/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg block">
                <img src="/images/footer/nic.png" alt="NIC" width={140} height={60} style={{ width: '140px', height: 'auto', objectFit: 'contain' }} />
              </a>

              <a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-lg block">
                <img src="/images/footer/indiaportal.svg" alt="India Portal" width={140} height={60} style={{ width: '140px', height: 'auto', objectFit: 'contain' }} />
              </a>
            </div>

            {/* Last Updated */}
            <p className="text-sm text-gray-300 md:whitespace-nowrap">{t('last_update_on')}: {lastUpdated}</p>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;