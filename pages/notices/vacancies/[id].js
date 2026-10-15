import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";
import { t } from '@/lib/translations';

export default function VacancyDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;

      try {
        setLoading(true);
        const res = await fetch("/api/offerings/vacancies");
        const data = await res.json();

        const found = (data || []).find(
          (item) => Number(item.id) === Number(id)
        );

        if (found) {
          setItem({
            id: found.id,
            title: found.title || "",
            description: found.description || "",
            year: found.year || "",
            published_date: found.published_date || "",
            start_date: found.start_date || "",
            due_date: found.due_date || "",
            file_url: found.file_url || null,
            file_size: found.file_size || found.size || "-",
          });
        } else {
          setItem(null);
        }
      } catch {
        setItem(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const effectivePath = "/offerings/vacancies";

  return (
    <main id="main">
      <PageHeader pagePath={effectivePath} />
      <SubNavTabs pagePath={effectivePath} />

      <section className="mt-10 py-10">
        <div className="gi-container">

          {loading ? (
            <div className="text-center py-10 text-gray-500">
              {t('loading_text')}
            </div>
          ) : !item ? (
            <div className="text-center py-10 text-gray-500">
              {t('no_data_found')}
            </div>
          ) : (
            <div className="bg-white rounded-[14px] border border-[#d2dfff] shadow-sm overflow-hidden">

              {/* HEADER */}
              <div className="bg-[#a3bbf3] text-[#162f6a] text-center font-semibold px-5 py-6 text-[16px] uppercase tracking-[0.5px]">
                {item.title}
              </div>

              {/* BODY */}
              <div className="p-8">

                {/* DESCRIPTION */}
                <div className="mb-8">
                  <h3 className="text-[15px] font-semibold text-[#162f6a] mb-3 uppercase tracking-[0.5px]">
                    {t('description')}
                  </h3>
                  <p className="text-[14px] text-gray-700 leading-relaxed">
                    {item.description || t('no_description_available')}
                  </p>
                </div>

                {/* DETAILS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                  {/* YEAR */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-[13px] font-medium text-gray-600 mb-1">
                      {t('year')}
                    </div>
                    <div className="text-[15px] font-semibold text-[#162f6a]">
                      {item.year || "-"}
                    </div>
                  </div>

                  {/* PUBLISHED DATE */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-[13px] font-medium text-gray-600 mb-1">
                      {t('published_date')}
                    </div>
                    <div className="text-[15px] font-semibold text-[#162f6a]">
                      {item.published_date || "-"}
                    </div>
                  </div>

                  {/* START DATE */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-[13px] font-medium text-gray-600 mb-1">
                      {t('start_date')}
                    </div>
                    <div className="text-[15px] font-semibold text-[#162f6a]">
                      {item.start_date || "-"}
                    </div>
                  </div>

                  {/* DUE DATE */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-[13px] font-medium text-gray-600 mb-1">
                      {t('due_date')}
                    </div>
                    <div className="text-[15px] font-semibold text-red-600">
                      {item.due_date || "-"}
                    </div>
                  </div>

                </div>

                {/* FILE INFO */}
                {item.file_url && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-8">
                    <div className="text-[13px] font-medium text-gray-600 mb-1">
                      {t('file_size')}
                    </div>
                    <div className="text-[15px] font-semibold text-[#162f6a]">
                      {item.file_size}
                    </div>
                  </div>
                )}

                {/* DOWNLOAD BUTTON */}
                {item.file_url && (
                  <div className="flex justify-center">
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-md bg-[#d2dfff] text-[#162f6a] font-semibold text-[14px] uppercase hover:bg-[#bfd0ff] transition"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        download
                      </span>
                      {t('download_document')}
                    </a>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
