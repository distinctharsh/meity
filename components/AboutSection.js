"use client";

import { FaUsers, FaThLarge } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
import { t } from "@/lib/translations";

export default function AboutSection() {
  const [aboutContent, setAboutContent] = useState([]);
  const [navigation, setNavigation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Fetch navigation
        const navRes = await fetch("/api/navigation");

        if (navRes.ok) {
          const navData = await navRes.json();

          if (mounted) {
            setNavigation(Array.isArray(navData) ? navData : []);
          }
        }
      } catch (e) {
        console.error("Failed to load data:", e);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Manual text based on NEXT_PUBLIC_LANGUAGE
  // 1 for English, 2 for Hindi
  const lang = process.env.NEXT_PUBLIC_LANGUAGE;

  const englishAboutText =
    "The Cabinet Secretariat functions directly under the Prime Minister. The administrative head of the Secretariat is the Cabinet Secretary who is also the ex-officio Chairman of the Civil Services Board. The business allocated to Cabinet Secretariat under the Government of India (Allocation of Business) Rules, 1961 includes (i) Secretarial assistance to the Cabinet and Cabinet Committees; and (ii) Rules of Business.";

  const hindiAboutText =
    "मंत्रिमंडल सचिवालय सीधे प्रधानमंत्री के अधीन कार्य करता है। सचिवालय का प्रशासनिक प्रमुख मंत्रिमंडल सचिव होता है जो सिविल सेवा बोर्ड का पदेन अध्यक्ष भी होता है। भारत सरकार (कार्य आबंटन) नियम, 1961 के तहत मंत्रिमंडल सचिवालय को आवंटित कार्य में (i) मंत्रिमंडल और मंत्रिमंडल समितियों को सचिवीय सहायता; और (ii) कार्य के नियम शामिल हैं।";

  const aboutText =
    lang === "2" ? hindiAboutText : englishAboutText;

  // Get navigation items after About Us
  const getTopNavItemsAfterAbout = () => {
    // Find Cabinet Secretariat navigation item
    const cabinetSecretariat = navigation.find(
      (nav) =>
        nav.text?.toLowerCase().includes("cabinet") ||
        nav.text?.toLowerCase().includes("secretariat")
    );

    if (!cabinetSecretariat || !cabinetSecretariat.children) {
      return [];
    }

    // Find About Us in Cabinet Secretariat children
    const aboutUsIndex =
      cabinetSecretariat.children.findIndex((child) =>
        child.text?.toLowerCase().includes("about")
      );

    // Get items after About Us
    const itemsAfterAbout =
      cabinetSecretariat.children.slice(aboutUsIndex + 1);

    // Return top 3 items
    return itemsAfterAbout.slice(0, 3).map((item, index) => ({
      title: item.text,
      href: item.href,
      icon:
        index === 0 ? (
          <FaUsers />
        ) : index === 1 ? (
          <FaThLarge />
        ) : null,
      imageSrc:
        index === 2 ? "/images/council_ministry.svg" : null,
      section_key: `nav_card_${index}`,
    }));
  };

  const navCards = getTopNavItemsAfterAbout();

  // Default cards with href
  const defaultCards = [
    {
      title: t("our_organisations"),
      icon: <FaUsers />,
      href: "/cabinet-secretariat/our-organization",
      section_key: "our_organisations",
    },
    {
      title: t("our_team"),
      href: "/cabinet-secretariat/our-team",
      icon: <FaThLarge />,
      section_key: "our_team",
    },
    {
      title: t("our_performance"),
      href: "/cabinet-secretariat/council-of-ministers",
      imageSrc: "/images/council_ministry.svg",
      section_key: "our_performance",
    },
  ];

  // Use navigation cards if available, otherwise use default cards
  const cardsToUse =
    navCards.length > 0 ? navCards : defaultCards;

  const getCardData = (section_key) => {
    const item = aboutContent.find(
      (c) => c.section_key === section_key
    );

    return item
      ? {
          title:
            item.title ||
            cardsToUse.find(
              (card) => card.section_key === section_key
            )?.title ||
            section_key,
          content: item.content || "",
        }
      : null;
  };

  return (
    <section className="py-15 bg-white">
      <div className="gi-container flex flex-col gap-10 md:flex-row md:items-start md:justify-between">

        {/* Left Column - Content */}
        <div className="md:flex-[2]">
          <div className="flex items-center mb-5">
            <img
              src="/images/icons/ministry.svg"
              alt="Ministry"
              className="mr-[15px]"
            />

            <h2 className="main-heading">
              {t("about")}
            </h2>
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

          {/* About Cards */}
          <div className="flex flex-col sm:flex-row gap-5 mt-5">
            {cardsToUse.map((card) => {
              const cardData = getCardData(card.section_key);
              const title = cardData?.title || card.title;

              return (
                <a
                  key={card.section_key}
                  href={card.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 border border-[#1e3a8a] rounded-md py-6 px-4 text-center cursor-pointer
                  transition-all duration-300 hover:bg-[#1e3a8a] hover:shadow-lg no-underline"
                >
                  {/* Icon / Image Container */}
                  <div className="flex justify-center mb-3 text-[#1e3a8a] text-2xl transition-all duration-300 group-hover:text-white">
                    {card.imageSrc ? (
                      <Image
                        src={card.imageSrc}
                        alt={title}
                        width={30}
                        height={30}
                        className="w-7 h-7 object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                      />
                    ) : (
                      card.icon
                    )}
                  </div>

                  {/* Title */}
                  <span className="font-semibold text-gray-800 transition-all duration-300 group-hover:text-white about-cards font-20-600">
                    {title}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Column - Cabinet Secretary */}
        <div className="md:flex-[1]">
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">

            {/* Cabinet Secretary Image */}
            <div className="flex flex-col items-center">
              <div className="flex justify-center">
                <a
                  href="/cabinet-secretariat/cabinet-secretary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                <h3
                  className="font-bold mb-[3px] font-20-600"
                  style={{ color: "rgb(21, 2, 2)" }}
                >
                  {t("dr_t_v__somanathan")}
                </h3>

                <div
                  className="uppercase font-16-400"
                  style={{ color: "rgb(21, 2, 2)" }}
                >
                  {t("cabinet_secretary")}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}