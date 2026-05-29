"use client";
import { FaUsers, FaThLarge, FaChartBar } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
import { t } from '@/lib/translations';

export default function AboutSection() {
  const [aboutContent, setAboutContent] = useState([]);
  const [navigation, setNavigation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Fetch both about content and navigation
        const [aboutRes, navRes] = await Promise.all([
          fetch('/api/admin/about'),
          fetch('/api/navigation')
        ]);

        if (aboutRes.ok) {
          const aboutData = await aboutRes.json();
          if (mounted) setAboutContent(Array.isArray(aboutData) ? aboutData : []);
        }

        if (navRes.ok) {
          const navData = await navRes.json();
          if (mounted) setNavigation(Array.isArray(navData) ? navData : []);
        }
      } catch (e) {
        console.error('Failed to load data:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const getContentByKey = (key) => {
    const item = aboutContent.find(c => c.section_key === key);
    return item ? item.content : '';
  };

  // Default content fallback
  const defaultAboutText = "The Cabinet Secretariat functions directly under the Prime Minister. The administrative head of the Secretariat is the Cabinet Secretary who is also the ex-officio Chairman of the Civil Services Board. The business allocated to Cabinet Secretariat under the Government of India (Allocation of Business) Rules, 1961 includes (i) Secretarial assistance to the Cabinet and Cabinet Committees; and (ii) Rules of Business.";

  const aboutText = getContentByKey('vision') || defaultAboutText;

  // Get navigation items after About Us
  const getTopNavItemsAfterAbout = () => {
    // Find Cabinet Secretariat nav item
    const cabinetSecretariat = navigation.find(nav =>
      nav.text?.toLowerCase().includes('cabinet') ||
      nav.text?.toLowerCase().includes('secretariat')
    );

    if (!cabinetSecretariat || !cabinetSecretariat.children) {
      return [];
    }

    // Find About Us in Cabinet Secretariat children
    const aboutUsIndex = cabinetSecretariat.children.findIndex(child =>
      child.text?.toLowerCase().includes('about')
    );

    // Get items after About Us (skip About Us itself)
    const itemsAfterAbout = cabinetSecretariat.children.slice(aboutUsIndex + 1);

    // Return top 3 items
    return itemsAfterAbout.slice(0, 3).map((item, index) => ({
      title: item.text,
      href: item.href,
      icon: index === 0 ? <FaUsers /> : index === 1 ? <FaThLarge /> : <FaChartBar />,
      section_key: `nav_card_${index}`
    }));
  };

  const navCards = getTopNavItemsAfterAbout();

  // Fallback cards if no navigation found
  const defaultCards = [
    {
      title: t("our_team"),
      icon: <FaUsers />,
      section_key: "our_team"
    },
    {
      title: t("our_organisations"),
      icon: <FaThLarge />,
      section_key: "our_organisations"
    },
    {
      title: t("our_performance"),
      icon: <FaChartBar />,
      section_key: "our_performance"
    }
  ];

  const cardsToUse = navCards.length > 0 ? navCards : defaultCards;

  const getCardData = (section_key) => {
    const item = aboutContent.find(c => c.section_key === section_key);
    return item ? {
      title: item.title || cardsToUse.find(card => card.section_key === section_key)?.title || section_key,
      content: item.content || ''
    } : null;
  };

  return (
    <section className="py-15 bg-white">
      <div className="gi-container flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        {/* Left Column - Content */}
        <div className="md:flex-[2]">
          <div className="flex items-center mb-5">
            <img src="/images/icons/ministry.svg" alt="Ministry" className="mr-[15px]" />
            <h2 className="main-heading">{t("about")}</h2>
          </div>
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          ) : (
            <p className="font-20-400 about-content">
              {aboutText}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-5 mt-5">
            {cardsToUse.map((card) => {
              const cardData = getCardData(card.section_key);
              const title = cardData?.title || card.title;

              return (
                <a
                  key={card.section_key}
                  href={card.href || '#'}
                  className="group flex-1 border border-[#1e3a8a] rounded-md py-6 px-4 text-center cursor-pointer 
                transition-all duration-300 hover:bg-[#1e3a8a] hover:shadow-lg no-underline"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-3 text-[#1e3a8a] text-2xl transition-all duration-300 group-hover:text-white">
                    {card.icon}
                  </div>

                  {/* Title */}
                  <span className=" font-semibold text-gray-800 transition-all duration-300 group-hover:text-white about-cards font-20-600">
                    {title}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Column - Ministers */}
        <div className="md:flex-[1]">
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">

            {/* Minister 1 */}
            <div className="flex flex-col items-center">
              <div className="flex justify-center">
                <a href="/cabinet-secretariat/cabinet-secretary">
                  <Image
                    src="/images/about/cs.jpg"
                    alt="Dr. T. V. Somanathan"
                    width={215}
                    height={200}
                    className="w-full max-w-[215px] h-auto max-h-[200px] border-2 border-[#ebeaea] border-b-[6px] border-b-[#162f6a] object-contain"
                  />
                </a>
              </div>
              <div className="mt-[10px] text-center">
                <h3 className="font-bold mb-[3px] font-20-600" style={{ color: "rgb(21, 2, 2)" }}>{t("dr_t_v__somanathan")}</h3>
                <div className="uppercase font-16-400" style={{ color: "rgb(21, 2, 2)" }}>{t("cabinet_secretary")}</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
