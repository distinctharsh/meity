'use client';

import { useEffect, useState } from 'react';
import Offering from './icons/Offering';
import { FiChevronRight } from 'react-icons/fi';
import WhatsNew from '../components/icons/whats-new';
import { t } from '@/lib/translations';

export default function Offerings() {
  const [whatsNewList, setWhatsNewList] = useState([]);
  const [keyDocumentsList, setKeyDocumentsList] = useState([]);
  const [whatsNewLoading, setWhatsNewLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const response = await fetch('/api/home', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Home API failed: ${response.status}`);
        }

        const result = await response.json();
        const data = result.whatsNew || [];

        if (!Array.isArray(data)) {
          throw new Error("What's New data did not return an array");
        }

        // Only active records
        const activeItems = data
          .filter(item => Number(item.is_active) === 1)
          .sort(
            (a, b) =>
              Number(a.display_order || 0) -
              Number(b.display_order || 0)
          );

        // Key Documents: is_key_document = 1
        const keyDocuments = activeItems
          .filter(
            item => Number(item.is_key_document) === 1
          )
          .map(item => ({
            id: item.id,
            title: item.title,
            url:
              item.type === 'link'
                ? item.external_url
                : item.file_url,
          }));

        // What's New: is_key_document = 0
        const whatsNew = activeItems
          .filter(
            item => Number(item.is_key_document) !== 1
          )
          .map(item => ({
            id: item.id,
            title: item.title,
            link_url:
              item.type === 'link'
                ? item.external_url
                : item.file_url,
          }));

        if (mounted) {
          setKeyDocumentsList(keyDocuments);
          setWhatsNewList(whatsNew);
        }
      } catch (error) {
        console.error(
          "Failed to fetch What's New and Key Documents:",
          error
        );

        if (mounted) {
          setKeyDocumentsList([]);
          setWhatsNewList([]);
        }
      } finally {
        if (mounted) {
          setWhatsNewLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-9 bg-[#f1f1f2]">
      <div className="gi-container">
        <div className="flex gap-6 items-start flex-col md:flex-row">

          {/* LEFT COLUMN - OUR KEY DOCUMENTS */}

          <div className="flex-[1_1_68%] w-full flex flex-col">
            <div className="flex gap-3 items-center mb-3">
              <div className="[&>svg]:block" aria-hidden>
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
              {whatsNewLoading ? (
                <div className="px-5 py-4 text-gray-500">
                  Loading key documents...
                </div>
              ) : keyDocumentsList.length === 0 ? (
                <div className="px-5 py-4 text-gray-500">
                  No key documents available.
                </div>
              ) : (
                <ul className="list-none m-0 py-2">
                  {keyDocumentsList.map(item => (
                    <li
                      key={item.id}
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
                        last:border-b-0
                      "
                    >
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            flex-1
                            min-w-0
                            no-underline
                            text-inherit
                            hover:text-[#123a6b]
                          "
                        >
                          {item.title}
                        </a>
                      ) : (
                        <span className="flex-1 min-w-0">
                          {item.title}
                        </span>
                      )}

                      <span className="ml-3 shrink-0 text-[#123a6b] font-bold">
                        <FiChevronRight />
                      </span>
                    </li>
                  ))}
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
              <a
                href="/documents/council-of-ministers-portfolio-allocations"
                className="view-btn"
              >
                {t('view_more')}
                <FiChevronRight />
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN - WHAT'S NEW */}

          <aside className="flex-[0_0_30%] w-full flex flex-col">
            <div className="flex gap-3 items-center mb-3">
              <div className="[&>svg]:block" aria-hidden>
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
              {whatsNewLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-pulse flex flex-col space-y-2 w-full px-6">
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="h-4 bg-white/20 rounded"
                      />
                    ))}
                  </div>
                </div>
              ) : whatsNewList.length === 0 ? (
                <div className="flex justify-center items-center h-32 px-6">
                  <span className="text-white/80">
                    No new items available.
                  </span>
                </div>
              ) : (
                <ul className="list-none m-0 py-2">
                  {whatsNewList.map(item => (
                    <li
                      key={item.id}
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
                      {item.link_url ? (
                        <a
                          href={item.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            no-underline
                            text-white
                            hover:underline
                            flex-1
                            min-w-0
                            pr-3
                          "
                          onClick={event => {
                            event.preventDefault();

                            const confirmed = window.confirm(
                              'This would take you to an external website that opens in a new tab. Do you want to continue anyway?'
                            );

                            if (confirmed) {
                              window.open(
                                item.link_url,
                                '_blank',
                                'noopener,noreferrer'
                              );
                            }
                          }}
                        >
                          {item.title}
                        </a>
                      ) : (
                        <span className="flex-1 min-w-0 pr-3">
                          {item.title}
                        </span>
                      )}

                      <span className="shrink-0 text-white/80 font-bold">
                        <FiChevronRight />
                      </span>
                    </li>
                  ))}
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
            />
          </aside>

        </div>
      </div>
    </section>
  );
}