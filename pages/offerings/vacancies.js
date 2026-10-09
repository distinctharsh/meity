import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";
import { t } from '@/lib/translations';

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString('en-GB').replace(/\//g, '.');
};

export default function Vacancies() {
  const router = useRouter();

  const effectivePath =
    (router?.asPath && String(router.asPath).split("?")[0]) ||
    "/offerings/vacancies";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);

  // FETCH DATA
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/offerings/vacancies");
        const data = await res.json();

        const mapped = (data || []).map((item) => ({
          id: item.id,
          title: item.title || "",
          description: item.description || "",
          year: item.year || "",
          published_date: item.published_date || "",
          start_date: item.start_date || item.published_date || "", 
          due_date: item.due_date || item.closing_date || "",
          file_url: item.file_url || (item.file_name ? `/uploads/${item.file_name}` : null),
          file_size: item.size || "-"
        }));

        setItems(mapped);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // SEARCH
  const filtered = useMemo(() => {
    return items.filter((i) =>
      i.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  // SORT
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "Oldest") {
        return Number(a.year || 0) - Number(b.year || 0);
      }
      return Number(b.year || 0) - Number(a.year || 0);
    });
  }, [filtered, sort]);

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const paginated = sorted.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <main id="main" className="bg-[#f8fafc]">
      <PageHeader pagePath={effectivePath} />
      <SubNavTabs pagePath={effectivePath} />

      <section className="mt-10 py-10">
        <div className="gi-container">

          {/* SEARCH + FILTER TOOLBAR */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
            {/* SEARCH */}
            <div className="w-full lg:w-[360px]">
              <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white shadow-sm">
                <span className="flex items-center px-3 border-r border-gray-200 text-blue-800">
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]">search</span>
                </span>
                <input
                  type="search"
                  placeholder={t('search_placeholder')}
                  className="flex-1 px-3 py-2 outline-none text-[16px]"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* RIGHT FILTERS */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              {/* SORT */}
              <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white shadow-sm">
                <span className="flex items-center px-3 border-r border-gray-200 text-blue-800">
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]">sort</span>
                </span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-white outline-none text-[16px] font-medium text-gray-700 cursor-pointer"
                >
                  <option value="Newest">{t('latest')}</option>
                  <option value="Oldest">{t('oldest')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* CARD GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-10 text-gray-600 text-[16px]">{t('loading_text')}</div>
            ) : paginated.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-600 text-[16px]">{t('no_data_found')}</div>
            ) : (
              paginated.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[12px] border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full p-5"
                >
                  {/* CARD HEADER - Light Blue Banner (DBIM Title: 18px Bold) */}
                  <div className="bg-[#a3bbf3] text-[#162f6a] text-center font-bold px-4 py-3 rounded-md text-[18px] min-h-[60px] flex items-center justify-center mb-4 leading-snug">
                    {item.title}
                  </div>

                  {/* CARD BODY */}
                  <div className="flex flex-col flex-grow">
                    {/* DESCRIPTION (DBIM Body: 16px) */}
                    <p className="text-[16px] text-gray-800 font-normal leading-relaxed line-clamp-3 mb-5">
                      {item.description || t('no_description_available')}
                    </p>

                    {/* DETAILS GRID - DBIM Paragraph 1: 16px */}
                    <div className="space-y-3 text-[16px] text-gray-700 flex-grow border-t border-gray-100 pt-4">
                      
                      {/* PUBLISHED DATE */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-medium">
                          <span className="material-symbols-outlined text-[20px] text-blue-900">feed</span>
                          {t('published_date')}
                        </span>
                        <span className="text-gray-600 font-mono text-[16px]">{formatDate(item.published_date)}</span>
                      </div>

                      {/* START DATE */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-medium">
                          <span className="material-symbols-outlined text-[20px] text-blue-900">calendar_month</span>
                          {t('start_date')}
                        </span>
                        <span className="text-gray-600 font-mono text-[16px]">{formatDate(item.start_date)}</span>
                      </div>

                      {/* DUE DATE */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-medium">
                          <span className="material-symbols-outlined text-[20px] text-blue-900">event_busy</span>
                          {t('due_date')}
                        </span>
                        <span className="text-gray-600 font-mono text-[16px]">{formatDate(item.due_date)}</span>
                      </div>

                      {/* LATEST UPDATE */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-medium">
                          <span className="material-symbols-outlined text-[20px] text-blue-900">update</span>
                          {t('latest_update')}
                        </span>
                        <span className="text-blue-600 underline text-[14px] max-w-[140px] truncate" title={item.file_url}>
                          {item.file_url}
                        </span>
                      </div>
                    </div>

                    {/* ACTION BUTTON - DBIM Standard Action Button (16px) */}
                    <div className="mt-6 text-center">
                      {item.file_url ? (
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block bg-[#c7d7ff] text-[#123a6b] font-bold text-[16px] px-5 py-2.5 rounded shadow-sm hover:bg-[#b0c7ff] transition uppercase"
                        >
                          {t('view_document')}
                        </a>
                      ) : (
                        <button
                          onClick={() => router.push(`/offerings/vacancies/${item.id}`)}
                          className="inline-block bg-[#c7d7ff] text-[#123a6b] font-bold text-[16px] px-5 py-2.5 rounded shadow-sm hover:bg-[#b0c7ff] transition uppercase"
                        >
                          {t('view_document')}
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION + ARCHIVE */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-5 border-t border-gray-200 pt-6">
            <div></div>
            {/* PAGINATION (16px font size) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-gray-300 bg-white text-[#123a6b] disabled:opacity-40 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>

              <div className="text-[16px] text-[#123a6b] font-semibold">
                {t('page')} {currentPage} {t('of')} {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-gray-300 bg-white text-[#123a6b] disabled:opacity-40 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>

            {/* ARCHIVE BUTTON (16px) */}
            <a
              href="/archives?page=vacancies"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#bfd0ff] bg-white text-[#162f6a] font-semibold text-[16px] hover:bg-[#edf2ff] transition shadow-sm"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">archive</span>
              {t('view_archive')}
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}