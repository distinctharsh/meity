import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/router';
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";

export default function DocumentsSlug() {
  const router = useRouter();
  const { slug } = router.query;

  // derive an effective path from the slug so PageHeader/SubNavTabs can pick the correct navigation
  const effectivePath = slug
    ? '/documents/' + (Array.isArray(slug) ? slug.join('/') : String(slug))
    : '/documents';

  // Generate archive page URL based on current slug
  const getArchiveUrl = () => {
    const pageName = slug
      ? (Array.isArray(slug) ? slug.join('-') : String(slug))
      : 'reports';
    return `/archives?page=${encodeURIComponent(pageName)}`;
  };

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError("");

        let apiUrl = '/api/documents/reports';
        const navQuery = router.query?.nav;
        const navItem = router.query?.nav_item;
        const archivedOnly = router.query?.archived_only;
        const qs = [];

        if (archivedOnly) {
          qs.push('archived_only=1');
        }

        if (navQuery) {
          qs.push('nav=' + encodeURIComponent(String(navQuery)));
        } else if (navItem) {
          qs.push('nav_item=' + encodeURIComponent(String(navItem)));
        } else if (slug) {
          const raw = Array.isArray(slug) ? slug.join('/') : String(slug);
          const decoded = decodeURIComponent(raw);
          const navPath = '/documents/' + decoded.replace(/^\//, '');
          qs.push('nav=' + encodeURIComponent(navPath));
        } else {
          const nav = (router && router.asPath) || (typeof window !== 'undefined' ? window.location.pathname : '/documents/reports');
          qs.push('nav=' + encodeURIComponent(nav.split('?')[0]));
        }

        if (qs.length > 0) {
          apiUrl += '?' + qs.join('&');
        }

        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to load reports');
        const data = await res.json();
        const mapped = (data || []).map(r => ({
          id: r.id,
          title: r.title,
          type: r.type || 'pdf',
          year: r.year || null,
          size: r.size || r.file_size || '-',
          count: r.files_count !== undefined ? r.files_count : (r.item_count || null),
          file_url: r.file_url || null,
          first_file_url: r.first_file_url || null,
          publish_date: r.publish_date || null,
          created_at: r.created_at || null,
          isDirectFile: r.files_count === undefined && (r.publish_date || r.file_size !== undefined),
          view_type: r.view_type,
        }));
        if (mounted) setItems(mapped);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load reports');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (router.isReady) {
      load();
    }
    return () => { mounted = false; }
  }, [router.isReady, router?.asPath, router?.query?.nav_item, router?.query?.nav, router?.query?.archived_only, slug]);

  // Search filter
  const filtered = useMemo(() => {
    return items.filter((i) =>
      (i.title || "").toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  // Sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.publish_date || a.created_at || a.year).getTime() || 0;
      const dateB = new Date(b.publish_date || b.created_at || b.year).getTime() || 0;
      if (sort === "Oldest") return dateA - dateB;
      return dateB - dateA;
    });
  }, [filtered, sort]);

  // Reset page number on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, sort, perPage]);

  // Pagination logic
  const effectivePerPage = perPage === -1 ? sorted.length || 1 : perPage;
  const totalPages = Math.ceil(sorted.length / effectivePerPage) || 1;
  const paginated = sorted.slice(
    (currentPage - 1) * effectivePerPage,
    currentPage * effectivePerPage
  );

  return (
    <>
      <main id="main">
        <PageHeader pagePath={effectivePath} />
        <SubNavTabs pagePath={effectivePath} />

        <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>
          <div className="gi-container">
            {/* SEARCH & FILTERS TOOLBAR */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
              <div className="w-full lg:w-[320px]">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">search</span>
                  </span>
                  <input
                    type="search"
                    placeholder="Search..."
                    className="flex-1 px-3 py-2 outline-none text-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">sort</span>
                  </span>
                  <select
                    className="px-3 py-2 bg-white outline-none text-sm cursor-pointer"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="Newest">Latest</option>
                    <option value="Oldest">Oldest</option>
                  </select>
                </div>

                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span className="material-symbols-outlined">list_alt</span>
                  </span>
                  <select
                    className="px-3 py-2 bg-white outline-none text-sm cursor-pointer"
                    value={perPage}
                    onChange={(e) => setPerPage(parseInt(e.target.value, 10))}
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

            {/* TABLE HEADER - 4 COLUMNS (REPORT DETAIL STYLE) */}
            <div
              className={`hidden lg:grid ${ items.some(item => Number(item.view_type) === 1) ? 'grid-cols-[7fr_3fr]' : 'grid-cols-[5fr_2fr_2fr_3fr]' } bg-[#a3bbf3] text-[#162f6a] rounded-[8px] px-6 py-4 mb-3 uppercase text-[12px] font-semibold tracking-[1px]`}
            >
              <div>Title</div>
              {items.every(item => Number(item.view_type) !== 1) && (
                <>
                  <div className="text-center">Published Date</div>
                  <div className="text-center">Type/Size</div>
                </>
              )}

              <div className="text-right pr-2">Action</div>
            </div>

            {/* TABLE BODY (Card-Style List) */}
            <div className="space-y-3">
              {loading ? (
                <div className="p-8 text-center bg-white rounded-[8px] border border-[#dbe4ff] text-gray-500 font-medium">
                  Loading reports...
                </div>
              ) : error ? (
                <div className="p-8 text-center bg-white rounded-[8px] border border-[#dbe4ff] text-red-600 font-medium">
                  {error}
                </div>
              ) : paginated.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-[8px] border border-[#dbe4ff] text-gray-500 font-medium">
                  No reports found.
                </div>
              ) : (
                paginated.map((item) => {
                  const isGroup = item.type === 'group' && !item.isDirectFile;
                  const viewHref = isGroup ? `/documents/report/${item.id}` : (item.file_url || '#');
                  const viewAttrs = isGroup ? {} : { target: item.file_url ? '_blank' : undefined, rel: item.file_url ? 'noreferrer' : undefined };
                  const viewText = isGroup ? 'View All' : 'VIEW';
                  const icon = isGroup ? 'file_copy' : 'draft';

                  const publishDateStr = item.publish_date || item.created_at;
                  const formattedDate = publishDateStr
                    ? new Date(publishDateStr).toLocaleDateString('en-GB')
                    : (item.year || '-');

                  return (
                    <div
                      key={item.id}
                      className={`grid grid-cols-1 ${
                          Number(item.view_type) === 1
                            ? 'lg:grid-cols-[7fr_3fr]'
                            : 'lg:grid-cols-[5fr_2fr_2fr_3fr]'
                        } items-center bg-white rounded-[8px] border border-[#dbe4ff] px-6 py-4 shadow-sm hover:shadow-md transition-shadow gap-3 lg:gap-0`}
                    >
                      {/* Title Column */}
                      <div className="text-sm pr-2">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal mb-1">Title</span>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#1d3f91]">{icon}</span>
                          <span className="font-semibold text-[#1d3f91]">{item.title}</span>
                          {/* show when normal group report */}
                          {isGroup && item.count && (
                            <span className="ml-1 inline-flex justify-center items-center w-6 h-6 text-[11px] rounded bg-blue-100 text-blue-700 font-medium">
                              {item.count}
                            </span>
                          )}
                        </div>
                      </div>

                    {Number(item.view_type) !== 1 && (
                      <>
                      {/* Published Date Column - Normal group - hide, Direct file - show */}
                      <div className="lg:text-center text-sm">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal mb-1">Published Date</span>
                        <span className="font-medium text-[#2c3e66]">
                          {isGroup ? '-' : formattedDate}
                        </span>
                      </div>

                      {/* Type/Size Column - Normal group - hide, Direct file - show */}
                      <div className="lg:text-center text-sm">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal mb-1">Type/Size</span>
                        <div className="inline-flex items-center justify-center gap-1.5 font-medium text-[#1d3f91]">
                          {isGroup ? (
                            <span>-</span>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[18px]">draft</span>
                              <span>{item.size || '-'}</span>
                            </>
                          )}
                        </div>
                      </div>
                      </>
                    )}

                      {/* Action Column */}
                      <div className="flex items-center justify-between lg:justify-end gap-4 w-full">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal">Action</span>
                        <a
                          href={viewHref}
                          {...viewAttrs}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase px-3 py-1.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors view-btn-all"
                        >
                          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">visibility</span>
                          {viewText}
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* PAGINATION & ARCHIVE SECTION */}
            <div className="row items-center mt-8 grid grid-cols-1 md:grid-cols-2">
              <div className="flex justify-start md:justify-end">
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
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
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
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>

              <div className="flex justify-end mt-4 md:mt-0">
                <a
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded border text-blue-800 border-blue-300 hover:bg-blue-50 view-btn-all text-sm font-medium"
                  href={getArchiveUrl()}
                >
                  <span aria-hidden="true" className="material-symbols-outlined">archive</span>
                  View Archive
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