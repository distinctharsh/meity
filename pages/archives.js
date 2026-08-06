import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";
import { t } from "@/lib/translations";

export default function Archives() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get page type from URL query
  const pageType = router.query?.page || "reports";

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError("");

        const qs = ["archived_only=1"];
        let apiEndpoint = "/api/documents/reports";

        if (pageType === "vacancies") {
          apiEndpoint = "/api/offerings/vacancies";
          qs.push("archived=true");
        } else if (pageType === "tenders") {
          apiEndpoint = "/api/offerings/tenders";
          qs.push("archived=true");
        } else if (pageType === "photos") {
          const nav = "/documents/photos";
          qs.push("nav=" + encodeURIComponent(nav));
        } else if (pageType === "reports") {
          // Default reports
        } else {
          const nav = "/documents/" + String(pageType);
          qs.push("nav=" + encodeURIComponent(nav));
        }

        const res = await fetch(apiEndpoint + "?" + qs.join("&"));
        if (!res.ok) throw new Error("Failed to load archived " + pageType);
        const data = await res.json();

        let mapped = [];

        if (pageType === "vacancies") {
          mapped = (data || []).map((r) => ({
            id: r.id,
            title: r.title || "",
            type: "vacancy",
            year: r.year || (r.published_date ? new Date(r.published_date).getFullYear() : "-"),
            size: r.file_size || r.size || "-",
            description: r.description || "",
            published_date: r.published_date || "",
            due_date: r.due_date || "",
            file_url: r.file_name ? `/uploads/vacancies/${r.file_name}` : null,
          }));
        } else if (pageType === "tenders") {
          mapped = (data || []).map((r) => ({
            id: r.id,
            title: r.title || "",
            type: "tender",
            year: r.published_date ? new Date(r.published_date).getFullYear() : "-",
            size: r.file_size || r.size || "-",
            description: r.description || "",
            published_date: r.published_date || "",
            due_date: r.due_date || r.closing_date || "",
            tender_id: r.tender_id || "",
            file_url: r.file_name ? `/uploads/tenders/${r.file_name}` : null,
          }));
        } else {
          mapped = (data || []).map((r) => ({
            id: r.id,
            title: r.title || "",
            type: r.type || "pdf",
            year: r.year || (r.published_date ? new Date(r.published_date).getFullYear() : "-"),
            size: r.size || r.file_size || "-",
            count: typeof r.files_count === "number" ? r.files_count : r.item_count || null,
            file_url: r.file_url || null,
            first_file_url: r.first_file_url || null,
          }));
        }

        if (mounted) setItems(mapped);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load archived " + pageType);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (router.isReady) {
      load();
    }
    return () => {
      mounted = false;
    };
  }, [router.isReady, router?.query?.page, pageType]);

  // Search filter
  const filtered = useMemo(() => {
    return items.filter((i) =>
      i.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  // Sort logic
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const valA = a.published_date || a.year || 0;
      const valB = b.published_date || b.year || 0;
      const dateA = new Date(valA);
      const dateB = new Date(valB);

      if (sort === "Oldest") return dateA - dateB;
      return dateB - dateA;
    });
  }, [filtered, sort]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, sort, perPage]);

  // Pagination calculation
  const effectivePerPage = perPage === -1 ? sorted.length || 1 : perPage;
  const totalPages = Math.ceil(sorted.length / effectivePerPage) || 1;
  const paginated = sorted.slice(
    (currentPage - 1) * effectivePerPage,
    currentPage * effectivePerPage
  );

  return (
    <>
      <main id="main">
        <PageHeader
          pagePath={
            pageType === "vacancies"
              ? "/vacancies"
              : pageType === "tenders"
              ? "/tenders"
              : "/documents/" + String(pageType)
          }
        />
        <SubNavTabs pagePath="/archives/all" />

        <section className="mt-10 py-10" style={{ borderRadius: "20px" }}>
          <div className="gi-container">
            {/* SEARCH + FILTERS TOOLBAR */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
              {/* Search Bar */}
              <div className="w-full lg:w-[320px]">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">
                      search
                    </span>
                  </span>
                  <input
                    type="search"
                    placeholder={t("search_tenders") || "Search..."}
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
                    <span aria-hidden="true" className="material-symbols-outlined">
                      sort
                    </span>
                  </span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="px-3 py-2 bg-white outline-none text-sm cursor-pointer"
                  >
                    <option value="Newest">{t("latest") || "Latest"}</option>
                    <option value="Oldest">{t("oldest") || "Oldest"}</option>
                  </select>
                </div>

                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span className="material-symbols-outlined">list_alt</span>
                  </span>
                  <select
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="px-3 py-2 bg-white outline-none text-sm cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={-1}>All</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TABLE HEADER - EXACT TENDER STYLE */}
            <div className="hidden lg:grid grid-cols-[7fr_2fr_3fr] bg-[#a3bbf3] text-[#162f6a] rounded-[8px] px-6 py-4 mb-3 uppercase text-[12px] font-semibold tracking-[1px]">
              <div>{t("title_label") || "Title"}</div>
              <div className="text-center">{t("published_year") || "Published Year"}</div>
              <div className="text-center">{t("size") || "Type/Size"}</div>
            </div>

            {/* TABLE BODY (Card-Style List) */}
            <div className="space-y-3">
              {loading ? (
                <div className="p-8 text-center bg-white rounded-[8px] border border-[#dbe4ff] text-gray-500 font-medium">
                  {t("loading_text") || "Loading archive..."}
                </div>
              ) : error ? (
                <div className="p-8 text-center bg-white rounded-[8px] border border-[#dbe4ff] text-red-600 font-medium">
                  {error}
                </div>
              ) : paginated.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-[8px] border border-[#dbe4ff] text-gray-500 font-medium">
                  {t("no_files_attached") || "No archived items found."}
                </div>
              ) : (
                paginated.map((item) => {
                  const isGroup = item.type === "group";
                  const viewHref = isGroup
                    ? `/documents/report/${item.id}?archived=1`
                    : item.file_url || "#";
                  const viewAttrs = isGroup
                    ? {}
                    : { target: item.file_url ? "_blank" : undefined, rel: item.file_url ? "noreferrer" : undefined };
                  const viewText = isGroup ? "View All" : t("view") || "View";
                  const icon = isGroup ? "file_copy" : "draft";

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 lg:grid-cols-[7fr_2fr_3fr] items-center bg-white rounded-[8px] border border-[#dbe4ff] px-6 py-4 shadow-sm hover:shadow-md transition-shadow gap-3 lg:gap-0"
                    >
                      {/* Title Column */}
                      <div className="text-sm pr-2">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal">
                          {t("title_label") || "Title"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#1d3f91]">
                            {icon}
                          </span>
                          <span className="font-semibold text-[#1d3f91]">
                            {item.title}
                          </span>
                          {item.count && (
                            <span className="ml-1 inline-flex justify-center items-center w-6 h-6 text-[11px] rounded bg-blue-100 text-blue-700 font-medium">
                              {item.count}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2 pl-8">
                            {item.description}
                          </div>
                        )}
                      </div>

                      {/* Published Year Column */}
                      <div className="lg:text-center text-sm">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal">
                          {t("published_year") || "Published Year"}
                        </span>
                        <span className="font-medium text-[#2c3e66]">
                          {item.year || "-"}
                        </span>
                      </div>

                      {/* Type/Size + Action Column */}
                      <div className="flex items-center justify-between lg:justify-end gap-4 w-full">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal">
                          {t("action") || "Action"}
                        </span>
                        {!isGroup && (
                          <div className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1d3f91]">
                            <span className="material-symbols-outlined text-[18px]">
                              draft
                            </span>
                            <span>{item.size || "-"}</span>
                          </div>
                        )}
                        <a
                          href={viewHref}
                          {...viewAttrs}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase px-3 py-1.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors view-btn-all"
                        >
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[16px]"
                          >
                            visibility
                          </span>
                          {viewText}
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* PAGINATION SECTION - EXACT TENDER STYLE */}
            {!loading && sorted.length > 0 && (
              <div className="row items-center mt-8 grid grid-cols-1 md:grid-cols-2">
                <div className="flex justify-start md:justify-center md:col-span-2">
                  <nav aria-label="Page navigation">
                    <ul className="flex items-center gap-3">
                      <li>
                        <button
                          type="button"
                          className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-gray-300 text-[#123a6b] disabled:opacity-40 hover:bg-gray-50 transition-colors"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          aria-label="Previous page"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            chevron_left
                          </span>
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <li key={p}>
                          <button
                            type="button"
                            onClick={() => setCurrentPage(p)}
                            className={
                              p === currentPage
                                ? "w-8 h-8 rounded-full bg-[#c7d7ff] text-[#123a6b] font-bold shadow-sm"
                                : "w-8 h-8 rounded-full text-[#123a6b] hover:bg-[#e8efff] transition-colors"
                            }
                            aria-current={p === currentPage ? "page" : undefined}
                          >
                            {p}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          type="button"
                          className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-gray-300 text-[#123a6b] disabled:opacity-40 hover:bg-gray-50 transition-colors"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          aria-label="Next page"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            chevron_right
                          </span>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}