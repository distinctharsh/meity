import { useEffect, useState } from "react";
import Image from "next/image";

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
        // ignore, fallback will be used
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

  const renderFallback = () => (
    <footer className="bg-[#0B2C6A] text-white py-10">
      <div className="gi-container">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">

          {/* Left Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">USEFUL LINKS</h4>
              <ul className="space-y-2 text-base">
                <li><a href="#" className="hover:underline flex items-center"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>Archives</a></li>
                <li><a href="#" className="hover:underline flex items-center"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>Sitemap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Website Policies</h4>
              <ul className="space-y-2 text-base">
                <li><a href="#" className="hover:underline flex items-center"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>Website Policies</a></li>
                <li><a href="#" className="hover:underline flex items-center"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>Help</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Related Links</h4>
              <ul className="space-y-2 text-base">
                <li><a href="#" className="hover:underline flex items-center"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>Related Links</a></li>
                <li><a href="#" className="hover:underline flex items-center"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>Contact Us</a></li>
              </ul>
            </div>

            {/* Footer Bottom Text */}
            <div className="text-left text-gray-300 text-base">
              This Website belongs to Cabinet Secretariat, Government of India
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-4">
            <h4 className="text-lg font-semibold whitespace-nowrap">SUBSCRIBE FOR UPDATES</h4>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" aria-label="Twitter">
                <img src="/images/footer/x.jpg" alt="Twitter" width={28} height={28} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              </a>
              <a href="#" aria-label="YouTube">
                <img src="/images/footer/youtube.jpg" alt="YouTube" width={28} height={28} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              </a>
              <a href="#" aria-label="Facebook">
                <img src="/images/footer/facebook.jpg" alt="Facebook" width={28} height={28} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              </a>
              <a href="#" aria-label="Instagram">
                <img src="/images/footer/instagram.jpg" alt="Instagram" width={28} height={28} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              </a>
            </div>

            {/* Logos */}
            <div className="flex space-x-8">
              <div className="bg-white p-3 rounded-lg">
                <img src="/images/footer/mygovmerisarkar.jpg" alt="MyGov" width={140} height={60} style={{ width: '140px', height: 'auto', objectFit: 'contain' }} />
              </div>
              <div className="bg-white p-3 rounded-lg">
                <img src="/images/footer/indiaportal.svg" alt="India Portal" width={140} height={60} style={{ width: '140px', height: 'auto', objectFit: 'contain' }} />
              </div>
            </div>

            {/* Last Updated */}
            <p className="text-sm text-gray-300 whitespace-nowrap">Last Updated On: 12.09.2025</p>

          </div>
        </div>
      </div>
    </footer>
  );

  if (loading && !data) {
    // During first load, show fallback so page doesn't jump
    return renderFallback();
  }

  if (!data || !Array.isArray(data.sections)) {
    return renderFallback();
  }

  const sections = data.sections;
  const s1 = sections[0] || {};
  const s2 = sections[1] || {};
  const s3 = sections[2] || {};

  const s1Links = Array.isArray(s1.links) ? s1.links : [];
  const s2Links = Array.isArray(s2.links) ? s2.links : [];
  const s3Links = Array.isArray(s3.links) ? s3.links : [];

  const social = data.social_links || {};

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">{s1.title || "USEFUL LINKS"}</h4>
              <ul className="space-y-2 text-base">
                <li>
                  <a href={s1Links[0]?.url || "#"} className="hover:underline flex items-center">
                    <span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>
                    {s1Links[0]?.label || "Archives"}
                  </a>
                </li>
                <li>
                  <a href={s1Links[1]?.url || "#"} className="hover:underline flex items-center">
                    <span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>
                    {s1Links[1]?.label || "Sitemap"}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{s2.title || "Website Policies"}</h4>
              <ul className="space-y-2 text-base">
                <li>
                  <a href={s2Links[0]?.url || "#"} className="hover:underline flex items-center">
                    <span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>
                    {s2Links[0]?.label || "Website Policies"}
                  </a>
                </li>
                <li>
                  <a href={s2Links[1]?.url || "#"} className="hover:underline flex items-center">
                    <span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>
                    {s2Links[1]?.label || "Help"}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{s3.title || "Related Links"}</h4>
              <ul className="space-y-2 text-base">
                <li>
                  <a href={s3Links[0]?.url || "#"} className="hover:underline flex items-center">
                    <span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>
                    {s3Links[0]?.label || "Related Links"}
                  </a>
                </li>
                <li>
                  <a href={s3Links[1]?.url || "#"} className="hover:underline flex items-center">
                    <span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>
                    {s3Links[1]?.label || "Contact Us"}
                  </a>
                </li>
              </ul>
            </div>

            {/* Footer Bottom Text */}
            <div className="text-left text-gray-300 text-base">
              {copyrightText}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-4">
            <h4 className="text-lg font-semibold whitespace-nowrap">SUBSCRIBE FOR UPDATES</h4>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href={social.twitter || "#"} aria-label="Twitter">
                <img src="/images/footer/x.jpg" alt="Twitter" width={28} height={28} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              </a>
              <a href={social.youtube || "#"} aria-label="YouTube">
                <img src="/images/footer/youtube.jpg" alt="YouTube" width={28} height={28} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              </a>
              <a href={social.facebook || "#"} aria-label="Facebook">
                <img src="/images/footer/facebook.jpg" alt="Facebook" width={28} height={28} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              </a>
              <a href={social.instagram || "#"} aria-label="Instagram">
                <img src="/images/footer/instagram.jpg" alt="Instagram" width={28} height={28} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              </a>
            </div>

            {/* Logos */}
            <div className="flex space-x-8">
              <div className="bg-white p-3 rounded-lg">
                <img src="/images/footer/mygovmerisarkar.jpg" alt="MyGov" width={140} height={60} style={{ width: '140px', height: 'auto', objectFit: 'contain' }} />
              </div>
              <div className="bg-white p-3 rounded-lg">
                <img src="/images/footer/indiaportal.svg" alt="India Portal" width={140} height={60} style={{ width: '140px', height: 'auto', objectFit: 'contain' }} />
              </div>
            </div>

            {/* Last Updated */}
            <p className="text-sm text-gray-300 whitespace-nowrap">Last Updated On: {lastUpdated}</p>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
