'use client';

import { useEffect, useState } from "react";
import Offering from "./icons/Offering";
import { FiChevronRight } from 'react-icons/fi';
import WhatsNew from "../components/icons/whats-new";
import { t } from '@/lib/translations';

const USE_DUMMY_DATA = true;

const dummyKeyDocumentsEn = [
  {
    title: "Allocation of Business Rules (AOB)",
    url: "/report_document/allocationbusinessrule/completeaobrules/english/1_Upload_4265.pdf"
  },
  {
    title: "Transaction of Business Rules (TOB)",
    url: "/report_document/transactionofbusinessrulescomplete/completeaobrules/english/1_Upload_3983.pdf"
  },
  {
    title: "Handbook on Cabinet Notes",
    url: "/report_document/handbook/english/1_Upload_3722.pdf"
  },
  {
    title: "CABINET COMMITTEES",
    url: "/report_document/cabinetcommittees/english/1_Upload_4300.pdf"
  }
];

const dummyKeyDocumentsHi = [
  {
    title: "कार्य आबंटन नियम (AOB)",
    url: "/report_document/allocationbusinessrule/completeaobrules/english/1_Upload_4265.pdf"
  },
  {
    title: "कार्यकरण नियम(TOB)",
    url: "/report_document/transactionofbusinessrulescomplete/completeaobrules/english/1_Upload_3983.pdf"
  },
  {
    title: "मंत्रिमंडल नोट संबंधी नियमपर पुस्तिका",
    url: "/report_document/handbook/hindi/1_Upload_1158.pdf"
  },
  {
    title: "मंत्रिमंडल समितियां",
    url: "/report_document/cabinetcommittees/hindi/1_Upload_4302.pdf"
  }
];

const currentLang = process.env.NEXT_PUBLIC_LANGUAGE;

const dummyKeyDocuments =
  currentLang === '2'
    ? dummyKeyDocumentsHi
    : dummyKeyDocumentsEn;


export default function Offerings() {

  const [whatsNewList, setWhatsNewList] = useState([]);
  const [whatsNewLoading, setWhatsNewLoading] = useState(true);


  /*
   * Load What's New
   *
   * This is completely independent of Key Documents.
   */
  useEffect(() => {

    let mounted = true;

    const loadWhatsNew = async () => {

      try {

        console.log("Loading What's New...");

        const whatsNewRes = await fetch(
          '/api/adm/whats-new',
          {
            method: 'GET',
            cache: 'no-store'
          }
        );

        console.log(
          "What's New API status:",
          whatsNewRes.status
        );


        if (!whatsNewRes.ok) {

          throw new Error(
            `What's New API failed: ${whatsNewRes.status}`
          );

        }


        const whatsNewData = await whatsNewRes.json();


        console.log(
          "What's New API data:",
          whatsNewData
        );


        if (!Array.isArray(whatsNewData)) {

          throw new Error(
            "What's New API did not return an array"
          );

        }


        /*
         * Keep only active records.
         *
         * Number() handles both:
         *
         * 1
         *
         * and
         *
         * "1"
         */
        const activeItems = whatsNewData

          .filter(
            item => Number(item.is_active) === 1
          )

          .sort(
            (a, b) =>
              Number(a.display_order || 0) -
              Number(b.display_order || 0)
          )

          .map(item => ({

            title: item.title,

            link_url:
              item.type === 'link'
                ? item.external_url
                : item.file_url

          }));


        console.log(
          "What's New active items:",
          activeItems
        );


        if (mounted) {

          setWhatsNewList(activeItems);

        }


      } catch (error) {

        console.error(
          "Failed to fetch What's New:",
          error
        );


        if (mounted) {

          setWhatsNewList([]);

        }


      } finally {

        if (mounted) {

          setWhatsNewLoading(false);

        }

      }

    };


    loadWhatsNew();


    return () => {

      mounted = false;

    };

  }, []);


  /*
   * Key Documents remain fixed/static.
   */
  const displayList = USE_DUMMY_DATA
    ? dummyKeyDocuments
    : [];


  return (

    <section className="py-9 bg-[#f1f1f2]">

      <div className="gi-container">

        <div className="flex gap-6 items-start flex-col md:flex-row">


          {/* =====================================================
              LEFT COLUMN - OUR KEY DOCUMENTS
              ===================================================== */}

          <div className="flex-[1_1_68%] w-full flex flex-col">

            <div className="flex gap-3 items-center mb-3">

              <div
                className="[&>svg]:block"
                aria-hidden
              >

                <Offering />

              </div>


              <h3 className="main-heading">

                {t('our_key_offerings')}

              </h3>

            </div>


            <div
              className="
                bg-white
                rounded-[6px]
                border
                border-[#162f6a]
                p-0
                shadow-[0_1px_0_rgba(0,0,0,0.04)]
                h-[260px]
                overflow-y-auto
                [scrollbar-width:thin]
                [scrollbar-color:#123a6b_#f1f1f1]
              "
            >

              <ul className="list-none m-0 py-2">

                {displayList.map((item, index) => {

                  const title = item.title;

                  const url = item.url || "#";


                  return (

                    <li
                      key={index}
                      className="
                        py-[14px]
                        px-5
                        border-b
                        border-[#e8eefc]
                        flex
                        justify-between
                        items-center
                        text-[#150202]
                        font-normal
                        text-[1.1rem]
                        leading-[1.5]
                        whitespace-normal
                        overflow-hidden
                        text-ellipsis
                        [display:-webkit-box]
                        [line-clamp:3]
                        [-webkit-line-clamp:3]
                        [-webkit-box-orient:vertical]
                        max-w-full
                        last:border-b-0
                      "
                    >

                      {url ? (

                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            no-underline
                            text-inherit
                            hover:text-[#123a6b]
                          "
                        >

                          {title}

                        </a>

                      ) : (

                        <span>

                          {title}

                        </span>

                      )}


                      <span className="text-[#123a6b] font-bold">

                        <FiChevronRight />

                      </span>

                    </li>

                  );

                })}

              </ul>

            </div>


            <div
              className="
                p-3
                px-0
                flex
                justify-end
                rounded-b-[6px]
                max-w-full
                mt-auto
              "
            >

              <a
                href="/documents/council-of-ministers-portfolio-allocations"
                className="view-btn"
              >

                {t('view_more')}

                <FiChevronRight />

              </a>

            </div>

          </div>


          {/* =====================================================
              RIGHT COLUMN - WHAT'S NEW
              ===================================================== */}

          <aside className="flex-[0_0_30%] w-full flex flex-col">

            <div className="flex gap-3 items-center mb-3">

              <div
                className="[&>svg]:block"
                aria-hidden
              >

                <WhatsNew />

              </div>


              <h3 className="main-heading">

                {t('whats_new')}

              </h3>

            </div>


            <div
              className="
                bg-[#162f6a]
                text-white
                rounded-[6px]
                p-0
                shadow-[0_1px_0_rgba(0,0,0,0.04)]
                h-[260px]
                overflow-y-auto
                [scrollbar-width:thin]
                [scrollbar-color:#e6ecff_#162f6a]
              "
            >

              {/* ===========================
                  LOADING
                  =========================== */}

              {whatsNewLoading ? (

                <div
                  className="
                    flex
                    justify-center
                    items-center
                    h-32
                  "
                >

                  <div
                    className="
                      animate-pulse
                      flex
                      flex-col
                      space-y-2
                      w-full
                      px-6
                    "
                  >

                    {[...Array(3)].map((_, i) => (

                      <div
                        key={i}
                        className="
                          h-4
                          bg-white/20
                          rounded
                        "
                      />

                    ))}

                  </div>

                </div>


              ) : whatsNewList.length === 0 ? (

                /* ===========================
                   NO DATA
                   =========================== */

                <div
                  className="
                    flex
                    justify-center
                    items-center
                    h-32
                    px-6
                  "
                >

                  <span className="text-white/80">

                    No new items available.

                  </span>

                </div>


              ) : (

                /* ===========================
                   WHAT'S NEW LIST
                   =========================== */

                <ul className="list-none m-0 py-2">

                  {whatsNewList.map((item, idx) => {

                    const title =
                      item?.title || '';

                    const url =
                      item?.link_url || null;


                    return (

                      <li
                        key={idx}
                        className="
                          py-[14px]
                          px-5
                          border-b
                          border-[#3b5390]
                          last:border-b-0
                          flex
                          justify-between
                          items-center
                          text-white
                          font-normal
                          text-[1.1rem]
                          leading-[1.5]
                        "
                      >

                        {url ? (

                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              no-underline
                              text-white
                              hover:underline
                              flex-1
                              pr-3
                            "
                            onClick={(e) => {

                              e.preventDefault();


                              const confirmed =
                                window.confirm(
                                  'This would take you to an external website that opens in a new tab. Do you want to continue anyway?'
                                );


                              if (confirmed) {

                                window.open(
                                  url,
                                  '_blank',
                                  'noopener,noreferrer'
                                );

                              }

                            }}
                          >

                            {title}

                          </a>

                        ) : (

                          <span className="flex-1 pr-3">

                            {title}

                          </span>

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


            <div
              className="
                p-3
                px-0
                flex
                justify-end
                rounded-b-[6px]
                max-w-full
                mt-auto
              "
            >
            </div>

          </aside>

        </div>

      </div>

    </section>

  );

}