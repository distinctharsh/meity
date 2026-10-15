import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";
import { t } from '@/lib/translations';

export default function Tenders() {
  const router = useRouter();
  const effectivePath =
    (router?.asPath && String(router.asPath).split("?")[0]) ||
    "/offerings/tenders";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Fetch data
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const url = "/api/offerings/tenders";

        const res = await fetch(url);
        const data = await res.json();

        const mapped = (data || []).map((item) => ({
          id: item.id,
          tender_id: item.tender_id || "",
          title: item.title || "",
          description: item.description || "",
          published_date: item.published_date,
          due_date: item.due_date || item.closing_date,
          file_url: item.file_name
            ? `/uploads/tenders/${item.file_name}`
            : null,
          file_size: item.file_size || item.size || "-",
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

  // Search filter
  const filtered = useMemo(() => {
    return items.filter((i) =>
      i.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.published_date || 0);
      const dateB = new Date(b.published_date || 0);
      if (sort === "Oldest") return dateA - dateB;
      return dateB - dateA;
    });
  }, [filtered, sort]);

  // Reset to page 1 on query/sort/perPage change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, sort, perPage]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / perPage) || 1;
  const paginated = sorted.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <>
      <main id="main">
        {/* Dynamic Page Header */}
        <PageHeader pagePath={effectivePath} />

        {/* Tabs (DB-driven for current route) */}
        <SubNavTabs pagePath={effectivePath} />

        {/* Main Content */}
        <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>
          <div className="gi-container">
            {/* SEARCH + FILTERS TOOLBAR */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
              {/* Search Bar */}
              <div className="w-full lg:w-[320px]">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">search</span>
                  </span>
                  <input
                    type="search"
                    placeholder={t('search_tenders')}
                    className="flex-1 px-3 py-2 outline-none text-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Sort & Limit Dropdowns */}
              <div className="flex flex-wrap items-center justify-end gap-2">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">sort</span>
                  </span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="px-3 py-2 bg-white outline-none text-sm cursor-pointer"
                  >
                    <option value="Newest">{t('latest')}</option>
                    <option value="Oldest">{t('oldest')}</option>
                  </select>
                </div>

                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">list_alt</span>
                  </span>
                  <select
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="px-3 py-2 bg-white outline-none text-sm cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TABLE HEADER */}
            <div
              className="hidden lg:grid grid-cols-[2fr_2fr_2fr_2fr_2fr_2fr] bg-[#a3bbf3] text-[#162f6a] rounded-[8px] px-6 py-4 mb-3 uppercase text-[12px] font-semibold tracking-[1px]"
            >
              <div>{t('tender_id')}</div>
              <div>{t('title_label')}</div>
              <div className="text-center">{t('published_date')}</div>
              <div className="text-center">{t('due_date')}</div>
              <div className="text-center">{t('size')}</div>
              <div className="text-center">{t('action')}</div>
            </div>

            {/* TABLE BODY (Card-Style List) */}
            <div className="space-y-3">
              {loading ? (
                <div className="p-8 text-center bg-white rounded-[8px] border border-[#dbe4ff] text-gray-500 font-medium">
                  {t('loading_text')}
                </div>
              ) : paginated.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-[8px] border border-[#dbe4ff] text-gray-500 font-medium">
                  {t('no_tenders_found')}
                </div>
              ) : (
                paginated.map((item) => {
                  const dueDate = item.due_date
                    ? new Date(item.due_date)
                    : null;
                  const today = new Date();
                  const isExpired = dueDate && dueDate < today;
                  const isUrgent =
                    dueDate &&
                    dueDate <
                    new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

                  let badgeClass = "text-xs font-semibold px-2.5 py-1 rounded-full inline-block ";
                  if (isExpired) {
                    badgeClass += "bg-red-100 text-red-700";
                  } else if (isUrgent) {
                    badgeClass += "bg-orange-100 text-orange-700";
                  } else {
                    badgeClass += "bg-blue-100 text-blue-700";
                  }

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_2fr_2fr_2fr_2fr] items-center bg-white rounded-[8px] border border-[#dbe4ff] px-6 py-4 shadow-sm hover:shadow-md transition-shadow gap-3 lg:gap-0"
                    >
                      {/* Tender ID */}
                      <div className="text-sm font-semibold text-[#1a1a1a]">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal">{t('tender_id')}</span>
                        {item.tender_id || "-"}
                      </div>

                      {/* Title & Description */}
                      <div className="text-sm pr-2">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal">{t('title_label')}</span>
                        <div className="font-semibold text-[#1d3f91]">{item.title}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {item.description}
                          </div>
                        )}
                      </div>

                      {/* Published Date */}
                      <div className="lg:text-center text-sm">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal">{t('published_date')}</span>
                        <span className="font-medium text-[#2c3e66]">
                          {item.published_date
                            ? new Date(item.published_date).toLocaleDateString("en-GB")
                            : "-"}
                        </span>
                      </div>

                      {/* Due Date Badge */}
                      <div className="lg:text-center text-sm">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal mb-1">{t('due_date')}</span>
                        {dueDate ? (
                          <span className={badgeClass}>
                            {dueDate.toLocaleDateString("en-GB")}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>

                      {/* Size / Type */}
                      <div className="lg:text-center text-sm font-medium text-[#1d3f91]">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal">{t('size')}</span>
                        <div className="inline-flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px]">draft</span>
                          <span>{item.file_size || "-"}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="lg:text-center flex lg:justify-center items-center">
                        <a
                          href={item.file_url || "#"}
                          target={item.file_url ? "_blank" : undefined}
                          rel={item.file_url ? "noreferrer" : undefined}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase px-3 py-1.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors view-btn-all"
                        >
                          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">visibility</span>
                          {t('view')}
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* REFERENCE DESIGN PAGINATION & ARCHIVE SECTION */}
            <div className="row items-center mt-8 grid grid-cols-1 md:grid-cols-2">
              {/* Reference Pagination UI */}
              <div className="flex justify-start md:justify-end">
                <nav aria-label="Page navigation">
                  <ul className="flex items-center gap-3">
                    <li>
                      <button
                        className="w-8 h-8 inline-flex items-center justify-center rounded-full border text-[#123a6b] disabled:opacity-40"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <li key={p}>
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={
                            p === currentPage
                              ? "w-8 h-8 rounded-full bg-[#c7d7ff] text-[#123a6b] font-semibold"
                              : "w-8 h-8 rounded-full text-[#123a6b] hover:bg-[#e8efff]"
                          }
                          aria-current={p === currentPage ? "page" : undefined}
                        >
                          {p}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        className="w-8 h-8 inline-flex items-center justify-center rounded-full border text-[#123a6b] disabled:opacity-40"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>

              {/* Reference View Archive Button UI */}
              <div className="flex justify-end mt-4 md:mt-0">
                <a
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded border text-blue-800 border-blue-300 hover:bg-blue-50 view-btn-all text-sm font-medium"
                  href="/archives?page=tenders"
                >
                  <span aria-hidden="true" className="material-symbols-outlined">archive</span>
                  {t('view_archive')}
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}