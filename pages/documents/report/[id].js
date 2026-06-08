import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router';
import PageHeader from "@/components/PageHeader";
import SubNavTabs from "@/components/SubNavTabs";

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
  const [totalPages, setTotalPages] = useState(1);
  const tableHostRef = useRef(null);
  const tableElRef = useRef(null);
  const dataTableRef = useRef(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [reportTitle, setReportTitle] = useState("");

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '';

    const kb = bytes / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDate = (date) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id) return;
      try {
        setLoading(true);
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
    load();
    return () => { mounted = false; };
  }, [id, archived]);

  // Fetch breadcrumb data from API
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
    loadBreadcrumb();
    return () => { mounted = false; };
  }, [id]);

  // Initialize DataTable
  useEffect(() => {
    if (loading || error) return;
    if (!tableHostRef.current) return;
    if (typeof window === 'undefined') return;
    if (!files || files.length === 0) return;

    let cancelled = false;
    let attemptTimer;

    const tryInit = () => {
      if (cancelled) return;
      const $ = window.jQuery;
      if (!$ || !$.fn || !$.fn.DataTable) {
        attemptTimer = setTimeout(tryInit, 50);
        return;
      }

      if (dataTableRef.current) {
        try {
          dataTableRef.current.clear();
          dataTableRef.current.rows.add(files);
          dataTableRef.current.draw(false);
        } catch (err) {
          console.error('DataTable update error:', err);
        }
        return;
      }

      if (!tableElRef.current) {
        try {
          const tbl = document.createElement('table');
          tbl.className = 'w-full';
          tbl.innerHTML = `
            <thead class="hidden">
              <tr>
                <th>File Name</th>
                <th>Date</th>
                <th>Year</th>
                <th>Type + Size</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody></tbody>
          `;
          tableHostRef.current.innerHTML = '';
          tableHostRef.current.appendChild(tbl);
          tableElRef.current = tbl;
        } catch {
          return;
        }
      }

      const dt = $(tableElRef.current).DataTable({
        data: files,
        columns: [
          {
            data: null,
            orderable: false,
            render: (data) => `
              <p class="mb-0 font-16-400 text-[#1a1a1a]">${data.original_name || ''}</p>
            `
          },
          {
            data: null,
            render: (data) => {
              const year = new Date(data.publish_date || data.created_at).getFullYear();

              return `
                <div class="text-center">
                  <span style="display:none">${year}</span>
                  <p class="text-[13px] font-semibold text-[#2c3e66] mb-0">
                    ${new Date(data.publish_date || data.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
              `;
            }
          },
          {
            data: null,
            orderable: false,
            render: (data) => `
              <div class="flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[#1d3f91] text-[20px]">draft</span>
                <small className="text-[#1d3f91] font-semibold">${data.file_size || '-'}</small>
              </div>
            `
          },
          {
            data: null,
            orderable: false,
            render: (data) => `
              <div class="flex justify-end">
                <a
                  href="${data.file_url || '#'}"
                  target="${data.file_url ? '_blank' : undefined}"
                  rel="${data.file_url ? 'noreferrer' : undefined}"
                  class="inline-flex items-center gap-2 uppercase px-4 py-2 rounded bg-[#dfe8ff] text-[#163d8f] hover:bg-[#cfdbff] font-semibold text-sm"
                >
                  <span aria-hidden="true" class="material-symbols-outlined">visibility</span>
                  VIEW
                </a>
              </div>
            `
          }
        ],
        searching: true,
        paging: true,
        info: false,
        lengthChange: false,
        pageLength: perPage,
        ordering: true,
        order: sort === 'Oldest' ? [[1, 'asc']] : [[1, 'desc']],
        dom: 'rtip',
        autoWidth: false,
        drawCallback: function () {
          const info = this.api().page.info();
          setTotalPages(Math.max(1, info.pages || 1));
          setCurrentPage((info.page || 0) + 1);
        },
        createdRow: function (row) {
          row.className = 'items-center px-6 py-4 bg-white border border-[#dbe4ff] rounded-[8px] mb-3 shadow-sm';
          try {
            row.style.display = 'grid';
            row.style.gridTemplateColumns = '5fr 1fr 1fr 1fr';
            row.style.alignItems = 'center';
          } catch {
          }
        },
        language: {
          emptyTable: 'No files found for this report.'
        }
      });

      try {
        $(tableElRef.current).find('tbody').addClass('divide-y');
      } catch {
      }

      dataTableRef.current = dt;

      return () => {
        try {
          dt.destroy(false);
          try {
            $(tableElRef.current).find('tbody').empty();
          } catch {
          }
          try {
            if (tableElRef.current && tableElRef.current.parentNode) {
              tableElRef.current.parentNode.removeChild(tableElRef.current);
            }
          } catch {
          } finally {
            tableElRef.current = null;
          }
        } catch {
        } finally {
          dataTableRef.current = null;
        }
      };
    };

    const cleanup = tryInit();

    return () => {
      cancelled = true;
      if (attemptTimer) clearTimeout(attemptTimer);
      if (typeof cleanup === 'function') cleanup();
    };
  }, [loading, error, files]);

  // Apply year filter
  useEffect(() => {
    const dt = dataTableRef.current;
    if (!dt) return;
    if (yearFilter) {
      dt.column(1).search(yearFilter).draw();
    } else {
      dt.column(1).search('').draw();
    }
  }, [yearFilter]);

  // Handle search query changes
  useEffect(() => {
    const dt = dataTableRef.current;
    if (!dt) return;
    dt.search(query || '').draw();
    // Reset to first page when search changes
    if (query) {
      dt.page(0).draw(false);
      setCurrentPage(1);
    }
  }, [query]);

  // Handle sort changes
  useEffect(() => {
    const dt = dataTableRef.current;
    if (!dt) return;
    dt.order(sort === 'Oldest' ? [1, 'asc'] : [1, 'desc']).draw();
    // Reset to first page when sorting changes
    dt.page(0).draw(false);
    setCurrentPage(1);
  }, [sort]);

  // Handle per page changes
  useEffect(() => {
    const dt = dataTableRef.current;
    if (!dt) return;
    dt.page.len(perPage);
    // Reset to first page when per page changes
    dt.page(0).draw(false);
    setCurrentPage(1);
  }, [perPage]);

  // Extract unique years from files
  const years = files ? Array.from(new Set(files.map(f => new Date(f.publish_date || f.created_at).getFullYear()))).sort((a, b) => b - a) : [];

  return (
    <>
      <main id="main">
        <PageHeader
          fallbackHeading={reportTitle}
          breadcrumbPath={breadcrumb}
        />
        {/* <SubNavTabs /> */}

        <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>
          <div className="gi-container">

            {/* Toolbar & filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
              <div className="w-full lg:w-[320px]">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">search</span>
                  </span>
                  <input type="search" placeholder="Search..." className="flex-1 px-3 py-2 outline-none" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {/* Year Filter */}
                {years.length > 0 && (
                  <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                    <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                      <span aria-hidden="true" className="material-symbols-outlined">calendar_month</span>
                    </span>
                    <select
                      className="px-3 py-2 bg-white outline-none"
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
                {/* Sort Dropdown */}
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">sort</span>
                  </span>
                  <select className="px-3 py-2 bg-white outline-none" role="listbox" aria-label="select" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="Newest">Latest</option>
                    <option value="Oldest">Oldest</option>
                  </select>
                </div>
                {/* Items per page */}
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white" role="combobox">
                  <label htmlFor="pageLimitSelect" className="sr-only">Items per page</label>
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span className="material-symbols-outlined">list_alt</span>
                  </span>
                  <select id="pageLimitSelect" className="px-3 py-2 bg-white outline-none" role="combobox" aria-label="pages" value={perPage} onChange={(e) => setPerPage(parseInt(e.target.value, 10))}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="-1">All</option>
                  </select>
                </div>
              </div>
            </div>

            {/* DataTable */}
            <div className="">
              {loading ? (
                <div className="px-4 py-6 text-center text-gray-500">Loading files...</div>
              ) : error ? (
                <div className="px-4 py-6 text-center text-red-600">{error}</div>
              ) : files.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500">No files found for this report.</div>
              ) : (
                <div ref={tableHostRef} />
              )}
            </div>

          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
