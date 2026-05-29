import Footer from "@/components/Footer";
import Pdf from "@/components/icons/Pdf";
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";
import Skeleton, { SkeletonText, SkeletonSection, SkeletonDownloadCard } from "@/components/Skeleton";
import { useEffect, useState } from "react";
import { t } from '@/lib/translations';

export default function AboutUs() {
  const [aboutContent, setAboutContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/about');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setAboutContent(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load about content:', e);
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

  const getSectionByKey = (key) => {
    return aboutContent.find(c => c.section_key === key);
  };

  const renderContent = (content) => {
    if (!content) return '';
    return content.split('\n').map((line, index) => (
      <p key={index} className="mb-4">{line}</p>
    ));
  };
  return (
    <>


      {/* Inline CSS for the ::before dot */}
      <style>{`
        .dot-before::before {
          content: "";
          position: absolute;
          left: -8px;
          top: 5px;
          width: 12px;
          height: 28px;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='28' viewBox='0 0 12 28' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_1293_43610)'%3E%3Cpath d='M8.35593 3.06788C8.35593 4.07416 9.17168 4.88992 10.178 4.88992C11.1842 4.88992 12 4.07417 12 3.06788C12 2.0616 11.1842 1.24585 10.178 1.24585C9.17168 1.24585 8.35593 2.0616 8.35593 3.06788Z' fill='white'/%3E%3Cpath d='M8.35593 10.356C8.35593 11.3623 9.17168 12.178 10.178 12.178C11.1842 12.178 12 11.3623 12 10.356C12 9.34969 11.1842 8.53394 10.178 8.53394C9.17168 8.53394 8.35593 9.34969 8.35593 10.356Z' fill='white'/%3E%3Cpath d='M8.35593 17.6441C8.35593 18.6503 9.17168 19.4661 10.178 19.4661C11.1842 19.4661 12 18.6503 12 17.6441C12 16.6378 11.1842 15.822 10.178 15.822C9.17168 15.822 8.35593 16.6378 8.35593 17.6441Z' fill='white'/%3E%3Cpath d='M8.35593 24.9321C8.35593 25.9384 9.17168 26.7542 10.178 26.7542C11.1842 26.7542 12 25.9384 12 24.9321C12 23.9259 11.1842 23.1101 10.178 23.1101C9.17168 23.1101 8.35593 23.9259 8.35593 24.9321Z' fill='white'/%3E%3Cpath d='M1.06785 3.06788C1.06785 4.07416 1.8836 4.88992 2.88988 4.88992C3.89616 4.88992 4.71191 4.07417 4.71191 3.06788C4.71191 2.0616 3.89616 1.24585 2.88988 1.24585C1.8836 1.24585 1.06785 2.0616 1.06785 3.06788Z' fill='white'/%3E%3Cpath d='M1.06785 10.356C1.06785 11.3623 1.8836 12.178 2.88988 12.178C3.89616 12.178 4.71191 11.3623 4.71191 10.356C4.71191 9.34969 3.89616 8.53394 2.88988 8.53394C1.8836 8.53394 1.06785 9.34969 1.06785 10.356Z' fill='white'/%3E%3Cpath d='M1.06785 17.6441C1.06785 18.6503 1.8836 19.4661 2.88988 19.4661C3.89616 19.4661 4.71191 18.6503 4.71191 17.6441C4.71191 16.6378 3.89616 15.822 2.88988 15.822C1.8836 15.822 1.06785 16.6378 1.06785 17.6441Z' fill='white'/%3E%3Cpath d='M1.06785 24.9321C1.06785 25.9384 1.8836 26.7542 2.88988 26.7542C3.89616 26.7542 4.71191 25.9384 4.71191 24.9321C4.71191 23.9259 3.89616 23.1101 2.88988 23.1101C1.8836 23.1101 1.06785 23.9259 1.06785 24.9321Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_1293_43610'%3E%3Crect width='27' height='12' fill='white' transform='translate(12 0.5) rotate(90)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }
      `}</style>



      <main id="main">
        {/* Dynamic Page Header */}
        <PageHeader pagePath="/cabinet-secretariat/about" />


        {/* Tabs (DB-driven) */}
        <SubNavTabs />


        {/* Main Content */}
        <section className="bg-white py-12">
          <div className="gi-container flex flex-col md:grid md:grid-cols-[280px_minmax(0,1fr)] gap-6 md:gap-10">
            {/* Left Box - Vision (shrink to content height) */}
            <div
              className="bg-gray-100 p-6 rounded-lg inline-block align-top md:sticky md:top-[250px]"
              style={{ height: 'fit-content' }}
            >
              {loading ? (
                <div className="space-y-3">
                  <Skeleton variant="title" />
                  <SkeletonText lines={4} />
                </div>
              ) : (
                <div className="text-[#123a6b] font-16-400 mb-4">
                  {renderContent(getContentByKey('vision'))}
                </div>
              )}
              {/* <p className="uppercase text-sm text-[#3b3b3b] tracking-wide">Vision Statement</p> */}
            </div>

            {/* Right Content - About, Mission, Objectives */}
            <div className="text-[#333] space-y-6">
              {/* <p>
                The Cabinet Secretariat, under Government of India,
                is a stand-alone ministerial agency, responsible for formulating and implementing national
                policies and programs aimed at enabling the continuous development of the electronics and IT industry.
                Cabinet Secretariat’s focus areas include the development, promotion, and regulation of the electronics and IT industry in India,
                fostering digital governance, enabling innovation in emerging technologies and promoting cybersecurity
                initiatives within the country.
              </p> */}

              <div>
                <h2 className=" text-[#123a6b] mb-2 font-24-700"> {t('functions')}</h2>
                {loading ? (
                  <SkeletonText lines={3} />
                ) : (
                  <div>
                    {renderContent(getContentByKey('functions'))}
                  </div>
                )}


                <div className="mt-10">
                  <h2 className=" text-[#123a6b] mb-2 font-24-700">{t('allocation_disposal')}</h2>
                  {loading ? (
                    <SkeletonText lines={3} />
                  ) : (
                    <div>
                      {renderContent(getContentByKey('allocation_disposal'))}
                    </div>
                  )}
                </div>
                <div className="mt-10">
                  <h2 className=" text-[#123a6b] mb-2 font-24-700">{t('support_cabinet_committees')}</h2>
                  {loading ? (
                    <SkeletonText lines={3} />
                  ) : (
                    <div>
                      {renderContent(getContentByKey('support_cabinet_committees'))}
                    </div>
                  )}
                </div>
                <div className="mt-10">
                  <h2 className=" text-[#123a6b] mb-2 font-24-700">{t('inter_ministerial_coordination')}</h2>
                  {loading ? (
                    <SkeletonText lines={3} />
                  ) : (
                    <div>
                      {renderContent(getContentByKey('inter_ministerial_coordination'))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className=" text-[#123a6b] mb-2 font-24-700">{t('objectives')}</h2>
                {loading ? (
                  <SkeletonText lines={4} />
                ) : (
                  <div>
                    {renderContent(getContentByKey('objectives'))}
                  </div>
                )}

                {/* <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
                  {[
                    {
                      num: 1,
                      title: "e-Government",
                      desc: "Providing e-infrastructure for delivery of e-services",
                    },
                    {
                      num: 2,
                      title: "e-Industry",
                      desc: "Promotion of electronics hardware manufacturing and IT-ITeS industry",
                    },
                    {
                      num: 3,
                      title: "e-Innovation / R&D",
                      desc: "Implementation of R&D Framework: Enabling creation of Innovation/ R&D Infrastructure",
                    },
                    {
                      num: 4,
                      title: "e-Learning",
                      desc: "Providing support for development of e-Skills and Knowledge network",
                    },
                    {
                      num: 5,
                      title: "e-Security",
                      desc: "Securing India’s cyber space",
                    },
                    {
                      num: 6,
                      title: "e-Inclusion",
                      desc: "Promoting the use of ICT for more inclusive growth",
                    },
                    {
                      num: 7,
                      title: "e-Diplomacy",
                      desc: "Promoting the use of ICT in international cooperation",
                    },
                    {
                      num: 8,
                      title: "Internet Governance",
                      desc: "Enhancing India's role in global Internet Governance",
                    },
                    {
                      num: 9,
                      title: "Human Resource Development",
                      desc: "Development of skilled human resources in ICT",
                    },
                  ].map((item) => (
                    <div key={item.num} className="bg-[#e6edff] p-4 rounded-md">
                      <div className="text-2xl font-bold text-[#123a6b] mb-1">{item.num}</div>
                      <div className="font-semibold text-[#123a6b] mb-1">{item.title}</div>
                      <p className="text-sm text-gray-700">{item.desc}</p>
                    </div>
                  ))}
                </div> */}
              </div>


              <div>
                <h2 className=" text-[#123a6b] mb-2 font-24-700">{t('development')}</h2>
                {loading ? (
                  <SkeletonText lines={3} />
                ) : (
                  <div>
                    {renderContent(getContentByKey('development'))}
                  </div>
                )}
              </div>



              <div className="mt-10">
                <h2 className=" text-[#123a6b] mb-2 font-24-700"> {t('june_1970_departments')}:</h2>
                {loading ? (
                  <SkeletonText lines={3} />
                ) : (
                  <div>
                    {renderContent(getContentByKey('development_history'))}
                  </div>
                )}
              </div>

              <div className="mt-10">
                <h2 className=" text-[#123a6b] mb-2 font-24-700">{t('dpg')}</h2>
                {loading ? (
                  <SkeletonText lines={3} />
                ) : (
                  <div>
                    {renderContent(getContentByKey('dpg'))}
                  </div>
                )}
              </div>
              <div className="mt-10">
                <h2 className=" text-[#123a6b] mb-2 font-24-700">{t('nacwc')}</h2>
                {loading ? (
                  <SkeletonText lines={3} />
                ) : (
                  <div>
                    {renderContent(getContentByKey('nacwc'))}
                  </div>
                )}
              </div>
              <div className="mt-10">
                <h2 className=" text-[#123a6b] mb-2 font-24-700">{t('dbt_mission')}</h2>
                {loading ? (
                  <SkeletonText lines={3} />
                ) : (
                  <div>
                    {renderContent(getContentByKey('dbt_mission'))}
                  </div>
                )}
              </div>
              <div className="mt-10">
                <h2 className=" text-[#123a6b] mb-2 font-24-700">{t('psa_office')}</h2>
                {loading ? (
                  <SkeletonText lines={3} />
                ) : (
                  <div>
                    {renderContent(getContentByKey('psa_office'))}
                  </div>
                )}
              </div>

              {/* Download Sections */}
              {getSectionByKey('cabinet_secretaries') && (
                <div>
                  <h2 className=" text-[#123a6b] mb-2 font-24-700">{getSectionByKey('cabinet_secretaries').title}</h2>
                  <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
                    <p className="mb-2 md:mb-0 flex items-center gap-2 text-gray-900 font-medium">
                      <span className="material-symbols-outlined text-[#0f3c82]">draft</span>
                      {getSectionByKey('cabinet_secretaries').title}
                    </p>
                    <a
                      href={getSectionByKey('cabinet_secretaries').file_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background: '#a3bbf3', color: '#162f6a', padding: '4px 8px', cursor: 'pointer', textDecoration: 'none' }}
                    >
                      <span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation" style={{ fontSize: '15px' }}>arrow_right_alt</span>
                    </a>
                  </div>
                </div>
              )}


              {getSectionByKey('work_distribution') && (
                <div className="   ">
                  <div>
                    <h2 className=" text-[#123a6b] mb-2 font-24-700">{getSectionByKey('work_distribution').title}</h2>
                    <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
                      <div className="flex items-center gap-2">
                        <p className="mb-2 md:mb-0 flex items-center gap-2 text-gray-900 font-medium">
                          <span className="material-symbols-outlined text-[#0f3c82]">draft</span>
                          {getSectionByKey('work_distribution').title}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Pdf />
                        <span className="text-xs text-gray-600">{getSectionByKey('work_distribution').file_size || '0 KB'}</span>
                        <a
                          href={getSectionByKey('work_distribution').file_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-100 text-blue-600 px-3 pt-1 rounded hover:bg-blue-200 inline-flex items-center"
                          style={{ textDecoration: 'none' }}
                        >
                          <span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation" style={{ fontSize: '17px', cursor: 'pointer' }}>visibility</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {getSectionByKey('organization_chart') && (
                <div className="   ">
                  <div>
                    <h2 className=" text-[#123a6b] mb-2 font-24-700">{getSectionByKey('organization_chart').title}</h2>
                    <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
                      <div className="flex items-center gap-2">
                        <p className="mb-2 md:mb-0 flex items-center gap-2 text-gray-900 font-medium">
                          <span className="material-symbols-outlined text-[#0f3c82]">draft</span>
                          {getSectionByKey('organization_chart').title}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Pdf />
                        <span className="text-xs text-gray-600">{getSectionByKey('organization_chart').file_size || '0 KB'}</span>
                        <a
                          href={getSectionByKey('organization_chart').file_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-100 text-blue-600 px-3 pt-1 rounded hover:bg-blue-200 inline-flex items-center"
                          style={{ textDecoration: 'none' }}
                        >
                          <span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation" style={{ fontSize: '17px', cursor: 'pointer' }}>visibility</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}








            </div>
          </div>
        </section>









        <Footer />
      </main >
    </>
  );
}
