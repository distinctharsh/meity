import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/router';
import PageHeader from "@/components/PageHeader";

export default function ReportDetail() {
  const router = useRouter();
  const { id, archived } = router.query;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [reportTitle, setReportTitle] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id) return;
      try {
        setLoading(true);
        setError("");
        const archivedParam = archived === '1' ? '?archived=1' : '';
        const res = await fetch(`/api/documents/${encodeURIComponent(String(id))}/files${archivedParam}`);
        if (!res.ok) throw new Error('Failed to load report files');
        const data = await res.json();
        if (mounted) setFiles((data && data.files) || []);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load report files');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    if (router.isReady) {
      load();
    }
    return () => { mounted = false; };
  }, [router.isReady, id, archived]);

  useEffect(() => {
    let mounted = true;
    async function loadBreadcrumb() {
      if (!id) return;
      try {
        const res = await fetch(`/api/documents/${encodeURIComponent(String(id))}/breadcrumb`);
        const data = await res.json();

        if (res.ok && data.success) {
          if (mounted) setBreadcrumb(data.breadcrumb || []);
          if (mounted) setReportTitle(data.reportTitle || '');
        } else {
          if (mounted) setBreadcrumb([]);
          if (mounted) setReportTitle('');
        }
      } catch (e) {
        console.error('Error loading breadcrumb:', e);
        if (mounted) setBreadcrumb([]);
        if (mounted) setReportTitle('');
      }
    }
    
    if (router.isReady) {
      loadBreadcrumb();
    }
    return () => { mounted = false; };
  }, [router.isReady, id]);

  // Unique years for filtering
  const years = useMemo(() => {
    if (!files || files.length === 0) return [];
    const set = new Set();
    files.forEach((f) => {
      const dateVal = f.publish_date || f.created_at;
      if (dateVal) {
        const y = new Date(dateVal).getFullYear();
        if (!isNaN(y)) set.add(y);
      }
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [files]);

  // Search & Year filter
  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchesSearch = (f.original_name || "")
        .toLowerCase()
        .includes(query.toLowerCase());

      if (!yearFilter) return matchesSearch;

      const fileYear = new Date(f.publish_date || f.created_at).getFullYear();
      return matchesSearch && String(fileYear) === String(yearFilter);
    });
  }, [files, query, yearFilter]);

  // Sorting
  const sortedFiles = useMemo(() => {
    return [...filteredFiles].sort((a, b) => {
      const dateA = new Date(a.publish_date || a.created_at).getTime();
      const dateB = new Date(b.publish_date || b.created_at).getTime();

      if (sort === "Oldest") return dateA - dateB;
      return dateB - dateA;
    });
  }, [filteredFiles, sort]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, yearFilter, sort, perPage]);

  // Pagination calculation
  const effectivePerPage = perPage === -1 ? sortedFiles.length || 1 : perPage;
  const totalPages = Math.ceil(sortedFiles.length / effectivePerPage) || 1;
  const paginatedFiles = sortedFiles.slice(
    (currentPage - 1) * effectivePerPage,
    currentPage * effectivePerPage
  );

  return (
    <>
      <main id="main">
        <PageHeader
          fallbackHeading={reportTitle}
          breadcrumbPath={breadcrumb}
        />

        <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>
          <div className="gi-container">

            {/* TOOLBAR & FILTERS */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
              {/* Search Box */}
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

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center justify-end gap-2">
                {years.length > 0 && (
                  <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                    <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                      <span aria-hidden="true" className="material-symbols-outlined">calendar_month</span>
                    </span>
                    <select
                      className="px-3 py-2 bg-white outline-none text-sm cursor-pointer"
                      aria-label="Filter by year"
                      value={yearFilter}
                      onChange={(e) => setYearFilter(e.target.value)}
                    >
                      <option value="">All Years</option>
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">sort</span>
                  </span>
                  <select
                    className="px-3 py-2 bg-white outline-none text-sm cursor-pointer"
                    role="listbox"
                    aria-label="select"
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
                    role="combobox"
                    aria-label="pages"
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

            {/* TABLE HEADER - EXACT TENDER STYLE */}
            <div className="hidden lg:grid grid-cols-[5fr_2fr_2fr_3fr] bg-[#a3bbf3] text-[#162f6a] rounded-[8px] px-6 py-4 mb-3 uppercase text-[12px] font-semibold tracking-[1px]">
              <div>Title</div>
              <div className="text-center">Published Date</div>
              <div className="text-center">Type/Size</div>
              <div className="text-right pr-2">Action</div>
            </div>

            {/* TABLE BODY (Card-Style List) */}
            <div className="space-y-3">
              {loading ? (
                <div className="p-8 text-center bg-white rounded-[8px] border border-[#dbe4ff] text-gray-500 font-medium">
                  Loading files...
                </div>
              ) : error ? (
                <div className="p-8 text-center bg-white rounded-[8px] border border-[#dbe4ff] text-red-600 font-medium">
                  {error}
                </div>
              ) : paginatedFiles.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-[8px] border border-[#dbe4ff] text-gray-500 font-medium">
                  No files found for this report.
                </div>
              ) : (
                paginatedFiles.map((file, idx) => {
                  const publishDateStr = file.publish_date || file.created_at;
                  const formattedDate = publishDateStr
                    ? new Date(publishDateStr).toLocaleDateString('en-GB')
                    : '-';

                  return (
                    <div
                      key={file.id || idx}
                      className="grid grid-cols-1 lg:grid-cols-[5fr_2fr_2fr_3fr] items-center bg-white rounded-[8px] border border-[#dbe4ff] px-6 py-4 shadow-sm hover:shadow-md transition-shadow gap-3 lg:gap-0"
                    >
                      {/* Title Column */}
                      <div className="text-sm pr-2">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal mb-1">Title</span>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#1d3f91]">draft</span>
                          <span className="font-semibold text-[#1d3f91]">
                            {file.original_name || 'Untitled File'}
                          </span>
                        </div>
                      </div>

                      {/* Published Date Column */}
                      <div className="lg:text-center text-sm">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal mb-1">Published Date</span>
                        <span className="font-medium text-[#2c3e66]">
                          {formattedDate}
                        </span>
                      </div>

                      {/* Type/Size Column */}
                      <div className="lg:text-center text-sm">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal mb-1">Type/Size</span>
                        <div className="inline-flex items-center gap-1.5 font-medium text-[#1d3f91]">
                          <span className="material-symbols-outlined text-[18px]">draft</span>
                          <span>{file.file_size || '-'}</span>
                        </div>
                      </div>

                      {/* Action Column */}
                      <div className="flex items-center justify-between lg:justify-end gap-4 w-full">
                        <span className="lg:hidden text-xs text-gray-400 block uppercase font-normal">Action</span>
                        <a
                          href={file.file_url || '#'}
                          target={file.file_url ? "_blank" : undefined}
                          rel={file.file_url ? "noreferrer" : undefined}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase px-3 py-1.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors view-btn-all"
                        >
                          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">visibility</span>
                          VIEW
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* PAGINATION SECTION - EXACT TENDER STYLE */}
            {!loading && !error && sortedFiles.length > 0 && (
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
              </div>
            )}

          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}