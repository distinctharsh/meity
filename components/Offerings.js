import { useEffect, useState } from "react";
import Offering from "./icons/Offering";
import { FiChevronRight } from 'react-icons/fi';
import WhatsNew from "../components/icons/whats-new";
import { showConfirmationPopup } from './common/ConfirmationPopup';
import { t } from '@/lib/translations';

const USE_DUMMY_DATA = true;

const dummyKeyDocumentsEn = [
  { title: "AOB (Allocation of Business Rules)", url: "#" },
  { title: "TOB (Transaction of Business Rules)", url: "#" },
  { title: "Handbook on Cabinet Notes", url: "#" },
  { title: "Monitoring of inter-ministerial consultation process through the IMC module of e-SamikSha portal for implementing timelines for finalization of Cabinet/CCEA Notes- reg.", url: "#" }
];

const dummyKeyDocumentsHi = [
  { title: "कार्य आवंटन नियम (AOB)", url: "#" },
  { title: "व्यवहार और लेनदेन के नियम (TOB)", url: "#" },
  { title: "मंत्रिमंडल नोट और प्रक्रियाओं पर दिशा-निर्देश", url: "#" },
  { title: "सचिवालय निर्देश और कार्यालय नियमावली", url: "#" }
];

const currentLang = process.env.NEXT_PUBLIC_LANGUAGE;
const dummyKeyDocuments = currentLang === '2' ? dummyKeyDocumentsHi : dummyKeyDocumentsEn;

export default function Offerings() {
  const [activeTab, setActiveTab] = useState("vacancies");
  const [vacanciesList, setVacanciesList] = useState([]);
  const [tendersList, setTendersList] = useState([]);
  const [whatsNewList, setWhatsNewList] = useState([]);
  const [whatsNewLoading, setWhatsNewLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Fetch vacancies
        const vacanciesRes = await fetch('/api/offerings/vacancies');
        if (vacanciesRes.ok) {
          const vacanciesData = await vacanciesRes.json();
          if (mounted && Array.isArray(vacanciesData)) {
            setVacanciesList(vacanciesData.slice(0, 5)); // Show only 5 latest vacancies
          }
        }

        // Fetch tenders
        const tendersRes = await fetch('/api/offerings/tenders');
        if (tendersRes.ok) {
          const tendersData = await tendersRes.json();
          if (mounted && Array.isArray(tendersData)) {
            setTendersList(tendersData.slice(0, 5)); // Show only 5 latest tenders
          }
        }

        // Fetch what's new items
        try {
          const whatsNewRes = await fetch('/api/admin/whats-new');
          if (whatsNewRes.ok) {
            const whatsNewData = await whatsNewRes.json();
            if (mounted && Array.isArray(whatsNewData)) {
              // Filter only active items and map to the expected format
              const activeItems = whatsNewData
                .filter(item => item.is_active === 1)
                .sort((a, b) => a.display_order - b.display_order)
                .map(item => ({
                  title: item.title,
                  link_url: item.type === 'link' ? item.external_url : item.file_url
                }));
              setWhatsNewList(activeItems);
            }
          }
        } catch (error) {
          console.error('Failed to fetch what\'s new items:', error);
          // Set fallback data if API fails
          if (mounted) {
            setWhatsNewList([
              "Cabinet Secretariat Performance Smartboard",
              "Latest update from Ministry",
              "New policy announcement"
            ]);
          }
        } finally {
          if (mounted) {
            setWhatsNewLoading(false);
          }
        }
      } catch { }
    })();
    return () => { mounted = false; };
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const displayList = USE_DUMMY_DATA 
    ? dummyKeyDocuments 
    : (activeTab === "vacancies" ? vacanciesList : tendersList);

  return (
    <section className="py-9 bg-[#f1f1f2]">
      <div className="gi-container">
        <div className="flex gap-6 items-start flex-col md:flex-row">
          
          {/* Left Column: Our Key Documents / Offerings */}
          <div className="flex-[1_1_68%] w-full flex flex-col">
            <div className="flex gap-3 items-center mb-3">
              <div className="[&>svg]:block" aria-hidden>
                <Offering />
              </div>
              <h3 className="main-heading">
                {USE_DUMMY_DATA ? t('our_key_offerings') : t('our_offerings')}
              </h3>
            </div>

            {!USE_DUMMY_DATA && (
              <div className="flex mb-2.5 border border-[#162f6a] rounded overflow-hidden w-full max-w-full">
                <button
                  className={`${activeTab === "vacancies" ? 'text-white bg-[#222e4c] font-semibold' : 'text-[#222e4c] bg-white font-normal'} flex-1 text-center py-3 border-0 cursor-pointer select-none text-[1.2rem]`}
                  onClick={() => handleTabClick("vacancies")}
                  aria-selected={activeTab === "vacancies"}
                >
                  {t('vacancies')}
                </button>
              </div>
            )}

            <div className={`bg-white ${USE_DUMMY_DATA ? 'rounded-[6px] border border-[#162f6a]' : 'rounded-b-[6px] border-t-0'} p-0 shadow-[0_1px_0_rgba(0,0,0,0.04)] h-[260px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#123a6b_#f1f1f1]`}>
              <ul className="list-none m-0 py-2">
                {displayList.map((item, index) => {
                  const isObj = item && typeof item === 'object';
                  const title = isObj ? item.title : item;
                  const url = USE_DUMMY_DATA 
                    ? (item.url || "#") 
                    : (isObj && item.file_name ? `/uploads/${activeTab}/${item.file_name}` : null);
                  return (
                    <li key={index} className="py-[14px] px-5 border-b border-[#e8eefc] flex justify-between items-center text-[#150202] font-normal text-[1.1rem] leading-[1.5] whitespace-normal overflow-hidden text-ellipsis [display:-webkit-box] [line-clamp:3] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] max-w-full last:border-b-0">
                      {url ? (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="no-underline text-inherit hover:text-[#123a6b]">
                          {title}
                        </a>
                      ) : (
                        <span>{title}</span>
                      )}
                      <span className="text-[#123a6b] font-bold">
                        <FiChevronRight />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="p-3 px-0 flex justify-end rounded-b-[6px] max-w-full mt-auto">
              <a
                href={USE_DUMMY_DATA ? "/documents" : (activeTab === "vacancies" ? "/offerings/vacancies" : "/offerings/tenders")}
                className="view-btn"
              >
                 {t('view_more')}
                <FiChevronRight />
              </a>
            </div>
          </div>

          {/* Right Column: What's New */}
          <aside className="flex-[0_0_30%] w-full flex flex-col">
            <div className="flex gap-3 items-center mb-3">
              <div className="[&>svg]:block" aria-hidden>
                <WhatsNew />
              </div>
              <h3 className="main-heading">{t('whats_new')}</h3>
            </div>

            <div className="bg-[#162f6a] text-white rounded-[6px] p-0 shadow-[0_1px_0_rgba(0,0,0,0.04)] h-[260px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#e6ecff_#162f6a]">
              {whatsNewLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-pulse flex flex-col space-y-2 w-full px-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-4 bg-white/20 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <ul className="list-none m-0 py-2">
                  {whatsNewList.map((item, idx) => {
                    const isObj = item && typeof item === 'object';
                    const title = isObj ? item.title : item;
                    const url = isObj ? item.link_url : null;
                    return (
                      <li key={idx} className="py-[14px] px-5 border-b border-[#3b5390] last:border-b-0 flex justify-between items-center text-white font-normal text-[1.1rem] leading-[1.5]">
                        {url ? (
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="no-underline text-white hover:underline flex-1 pr-3"
                            onClick={(e) => {
                              e.preventDefault();
                              const confirmed = window.confirm('This would take you to an external website that opens in a new tab. Do you want to continue anyway?');
                              if (confirmed) {
                                window.open(url, '_blank', 'noopener,noreferrer');
                              }
                            }}
                          >
                            {title}
                          </a>
                        ) : (
                          <span className="flex-1 pr-3">{title}</span>
                        )}
                        <span className="text-white/80 font-bold">
                          <FiChevronRight />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="p-3 px-0 flex justify-end rounded-b-[6px] max-w-full mt-auto">
              <button className="view-btn">
                {t('view_more')}
                <FiChevronRight />
              </button>
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}