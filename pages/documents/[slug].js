import Footer from "@/components/Footer";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from 'next/router';
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";

export default function DocumentsSlug() {
  const router = useRouter();
  const { slug } = router.query;
  // derive an effective path from the slug so PageHeader/SubNavTabs can
  // pick the correct navigation section (e.g. '/documents/rules-of-business')
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
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("Latest");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [yearFilter, setYearFilter] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const tableHostRef = useRef(null);
  const tableElRef = useRef(null);
  const dataTableRef = useRef(null);
  const filterFnRef = useRef(null);
  const categoryRef = useRef("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    categoryRef.current = category;
  }, [category]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        // Build API url: prefer explicit nav query if present, else map slug back to nav path
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
          // slug like 'reports' -> map back to '/documents/reports'
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
          size: r.size || '',
          count: (typeof r.files_count === 'number' ? r.files_count : (r.item_count || null)),
          file_url: r.file_url || null,
          first_file_url: r.first_file_url || null,
        }));
        if (mounted) setItems(mapped);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load reports');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; }
  }, [router?.asPath, router?.query?.nav_item, router?.query?.nav, router?.query?.archived_only, slug]);

  useEffect(() => {
    if (loading || error) return;
    if (!tableHostRef.current) return;
    if (typeof window === 'undefined') return;
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
          dataTableRef.current.rows.add(items);
          dataTableRef.current.draw(false);
        } catch {
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
                <th>Title</th>
                <th>Published Year</th>
                <th>Type/Size</th>
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
        data: items,
        columns: [
          {
            data: null,
            orderable: false,
            render: (data, type, row) => {
              const icon = row.type === 'group' ? 'file_copy' : 'draft';
              const count = row.count ? `<span class="ml-1 inline-flex justify-center items-center w-6 h-6 text-[11px] rounded bg-blue-100 text-blue-700">${row.count}</span>` : '';
              return `
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-gray-700">${icon}</span>
                <p class="mb-0 font-16-400">${row.title ?? ''}</p>
                ${count}
              </div>
            `;
            }
          },
          {
            data: 'year',
            render: (data) => `<div class="text-center font-12-600">${data || '-'}</div>`
          },
          {
            data: null,
            orderable: false,
            render: (data, type, row) => {
              const isGroup = row.type === 'group';
              const fileUrl = row.file_url || '#';
              const target = row.file_url ? ' target="_blank" rel="noreferrer"' : '';
              const typeSize = !isGroup
                ? `
                <div class="flex items-center gap-2 mx-auto">
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-gray-100">PDF</span>
                  <small class="text-gray-700">${row.size || ''}</small>
                </div>
              `
                : '<span></span>';
              const viewHref = isGroup ? `/documents/report/${row.id}` : fileUrl;
              const viewAttrs = isGroup ? '' : target;
              const viewText = isGroup ? 'View All' : 'View';
              return `
              <div class="flex items-center gap-2 justify-between w-full">
                ${typeSize}
                <a href="${viewHref}"${viewAttrs} class="inline-flex items-center gap-2 uppercase  px-3 py-1.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 view-btn-all">
                  <span aria-hidden="true" class="material-symbols-outlined">visibility</span>
                  ${viewText}
                </a>
              </div>
            `;
            }
          }
        ],
        searching: true,
        paging: true,
        info: false,
        lengthChange: false,
        pageLength: perPage,
        ordering: true,
        order: sort === 'Oldest' ? [[1, 'asc']] : [[1, 'desc']],
        dom: 't',
        autoWidth: false,
        drawCallback: function () {
          const info = this.api().page.info();
          setTotalPages(Math.max(1, info.pages || 1));
          setCurrentPage((info.page || 0) + 1);
        },
        createdRow: function (row) {
          row.className = 'items-center bg-white rounded-[8px] border border-[#dbe4ff] px-6  mb-3 shadow-sm';
          try {
            row.style.display = 'grid';
            row.style.gridTemplateColumns = '2fr 2fr 2fr';
            row.style.alignItems = 'center';
          } catch {
          }
          try {
            const $cells = $('td', row);

            $cells.css({
              width: '100%',
              padding: '16px 12px',
              display: 'flex',
              alignItems: 'center'
            });

            $cells.eq(0).css({
              justifyContent: 'flex-start'
            });

            $cells.eq(1).css({
              justifyContent: 'center'
            });

            $cells.eq(2).css({
              justifyContent: 'center'
            });
          } catch {
          }
        },
        language: {
          emptyTable: 'No reports found.'
        }
      });

      try {
        $(tableElRef.current).find('tbody').addClass('divide-y');
      } catch {
      }

      dataTableRef.current = dt;

      filterFnRef.current = function (settings, data, dataIndex) {
        const api = new $.fn.dataTable.Api(settings);
        const rowData = api.row(dataIndex).data();
        if (!rowData) return true;
        const cat = categoryRef.current;
        if (cat) {
          if (cat === 'Group') return rowData.type === 'group';
          return rowData.type !== 'group';
        }
        return true;
      };
      $.fn.dataTable.ext.search.push(filterFnRef.current);

      return () => {
        try {
          if (filterFnRef.current) {
            $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter((fn) => fn !== filterFnRef.current);
          }
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
          filterFnRef.current = null;
        }
      };
    };

    const cleanup = tryInit();
    return () => {
      cancelled = true;
      if (attemptTimer) clearTimeout(attemptTimer);
      if (typeof cleanup === 'function') cleanup();
    };
  }, [loading, error, items]);

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

  useEffect(() => {
    const dt = dataTableRef.current;
    if (!dt) return;
    dt.page.len(perPage);
    // Reset to first page when per page changes
    dt.page(0).draw(false);
    setCurrentPage(1);
  }, [perPage]);

  useEffect(() => {
    const dt = dataTableRef.current;
    if (!dt) return;
    dt.order(sort === 'Oldest' ? [1, 'asc'] : [1, 'desc']).draw();
    // Reset to first page when sorting changes
    dt.page(0).draw(false);
    setCurrentPage(1);
  }, [sort]);

  useEffect(() => {
    const dt = dataTableRef.current;
    if (!dt) return;
    dt.draw();
  }, [category]);

  const currentSafePage = Math.min(currentPage, totalPages);

  const years = useMemo(() => {
    const set = new Set();
    items.forEach((i) => { if (i.year) set.add(i.year); });
    return Array.from(set).sort((a, b) => b - a);
  }, [items]);

  return (
    <>
      <main id="main">
        <PageHeader pagePath={effectivePath} />
        <SubNavTabs pagePath={effectivePath} />

        <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>
          <div className="gi-container">
            {/* Toolbar & filters (same UI as reports) */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
              <div className="w-full lg:w-[320px]">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">search</span>
                  </span>
                  <input type="search" placeholder="Search..." className="flex-1 px-3 py-2 outline-none" value={query} onChange={(e) => setQuery(e.target.value)} />
                  <span className="flex items-center px-2 border-l border-gray-300 text-gray-600 lg:hidden">
                    <span aria-hidden="true" className="material-symbols-outlined">filter_alt</span>
                  </span>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-end flex-wrap gap-2">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">sort</span>
                  </span>
                  <select className="px-3 py-2 bg-white outline-none" role="listbox" aria-label="select" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="">Sort by</option>
                    <option value="Newest">Latest</option>
                    <option value="Oldest">Oldest</option>
                  </select>
                </div>
                {/* <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white" role="combobox">
                  <label htmlFor="categorySelect" className="sr-only">Filter by Category</label>
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">sort</span>
                  </span>
                  <select id="categorySelect" className="px-3 py-2 bg-white outline-none" role="combobox" aria-label="Filter by Category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Category</option>
                    <option value="General">General</option>
                    <option value="Group">Group</option>
                    <option value="Single">Single</option>
                  </select>
                </div> */}
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white" role="combobox">
                  <label htmlFor="pageLimitSelect" className="sr-only">Items per page</label>
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span className="material-symbols-outlined">list_alt</span>
                  </span>
                  <select id="pageLimitSelect" className="px-3 py-2 bg-white outline-none" role="combobox" aria-label="pages" value={perPage} onChange={(e) => setPerPage(parseInt(e.target.value, 10))}>
                    <option value={10}>10 per page</option>
                    <option value={15}>15 per page</option>
                    <option value={20}>20 per page</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              // className="grid grid-cols-[7fr_2fr_3fr] bg-blue-200 text-blue-900 font-semibold rounded-t-md px-4 py-2 text-xs"

              className="hidden lg:grid grid-cols-[2fr_2fr_2fr] bg-[#a3bbf3] text-[#162f6a] rounded-[8px] px-6 py-4 mb-3 uppercase text-[12px] font-semibold tracking-[1px]"

            >
              <div>Title</div>
              <div className="text-center">Published Year</div>
              <div className="text-center">Type/Size</div>
            </div>
            {/* <div className="grid grid-cols-[7fr_2fr_3fr] bg-blue-200 text-blue-900 font-semibold rounded-t-md px-4 py-2 text-xs">
              <div>Title</div>
              <div className="text-center">Published Year</div>
              <div className="text-center">Type/Size</div>
            </div> */}

            <div className="divide-y">
              {loading ? (
                <div className="px-4 py-6 text-center text-gray-500">Loading reports...</div>
              ) : error ? (
                <div className="px-4 py-6 text-center text-red-600">{error}</div>
              ) : (
                <div ref={tableHostRef} />
              )}
            </div>

            <div className="row items-center mt-8 grid grid-cols-1 md:grid-cols-2">
              <div className="flex justify-end">
                <nav aria-label="Page navigation">
                  <ul className="flex items-center gap-3">
                    <li>
                      <button
                        className="w-8 h-8 inline-flex items-center justify-center rounded-full border text-[#123a6b] disabled:opacity-40"
                        onClick={() => {
                          const dt = dataTableRef.current;
                          if (dt) dt.page('previous').draw('page');
                          else setCurrentPage((p) => Math.max(1, p - 1));
                        }}
                        disabled={currentSafePage === 1}
                        aria-label="Previous page"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <li key={p}>
                        <button
                          onClick={() => {
                            const dt = dataTableRef.current;
                            if (dt) dt.page(p - 1).draw('page');
                            else setCurrentPage(p);
                          }}
                          className={
                            p === currentSafePage
                              ? "w-8 h-8 rounded-full bg-[#c7d7ff] text-[#123a6b] font-semibold"
                              : "w-8 h-8 rounded-full text-[#123a6b] hover:bg-[#e8efff]"
                          }
                          aria-current={p === currentSafePage ? "page" : undefined}
                        >
                          {p}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        className="w-8 h-8 inline-flex items-center justify-center rounded-full border text-[#123a6b] disabled:opacity-40"
                        onClick={() => {
                          const dt = dataTableRef.current;
                          if (dt) dt.page('next').draw('page');
                          else setCurrentPage((p) => Math.min(totalPages, p + 1));
                        }}
                        disabled={currentSafePage === totalPages}
                        aria-label="Next page"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="flex justify-end">
                <a className="inline-flex items-center gap-2 px-3 py-1.5 rounded border text-blue-800 border-blue-300 hover:bg-blue-50 view-btn-all" href={getArchiveUrl()}>
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
