import Footer from "@/components/Footer";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from 'next/router';
import Image from "next/image";
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";

export default function VacanciesTenders() {
  const router = useRouter();
  const effectivePath = (router && router.asPath && String(router.asPath).split('?')[0]) || '/offerings/vacancies-tenders';
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("Newest");
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
        // Build API URL for vacancies and tenders
        let apiUrl = '/api/offerings/vacancies-tenders';
        
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to load vacancies and tenders');
        const data = await res.json();
        
        // Normalize to existing UI shape
        const mapped = (data || []).map(item => ({
          id: item.id,
          title: item.title,
          type: item.type || 'vacancy', // vacancy, tender, or group
          year: item.year || null,
          size: item.size || '',
          count: (typeof item.files_count === 'number' ? item.files_count : (item.item_count || null)),
          file_url: item.file_url || null,
          first_file_url: item.first_file_url || null,
          closing_date: item.closing_date || null,
        }));
        if (mounted) setItems(mapped);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load vacancies and tenders');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; }
  }, [router?.asPath]);

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
        attemptTimer = setTimeout(tryInit, 100);
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
                <th>Type/Closing Date</th>
                <th>Published Date</th>
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
        data: items,
        columns: [
          {
            data: null,
            orderable: false,
            render: (data, type, row) => {
              const icon = row.type === 'tender' ? 'description' : row.type === 'group' ? 'file_copy' : 'work';
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
            data: null,
            render: (data, type, row) => {
              const typeBadge = row.type === 'tender' 
                ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">Tender</span>'
                : row.type === 'vacancy' 
                ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700">Vacancy</span>'
                : '<span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Group</span>';
              
              const closingDate = row.closing_date ? `<small class="text-gray-600 ml-2">Closes: ${row.closing_date}</small>` : '';
              
              return `<div class="text-center text-sm">${typeBadge}${closingDate}</div>`;
            }
          },
          {
            data: 'year',
            render: (data) => `<div class="text-center ">${data || '-'}</div>`
          },
          {
            data: null,
            orderable: false,
            render: (data, type, row) => {
              const isGroup = row.type === 'group';
              const href = isGroup ? (row.first_file_url || row.file_url || '#') : (row.file_url || '#');
              const target = href && href !== '#' ? ' target="_blank" rel="noreferrer"' : '';
              const viewText = isGroup ? 'View All' : 'View';
              return `
                <div class="flex items-center justify-center w-full">
                  <a href="${href}"${target} class="inline-flex items-center gap-2 uppercase text-sm px-3 py-1.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200">
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
        order: sort === 'Oldest' ? [[2, 'asc']] : [[2, 'desc']],
        dom: 't',
        autoWidth: false,
        drawCallback: function () {
          const info = this.api().page.info();
          setTotalPages(Math.max(1, info.pages || 1));
          setCurrentPage((info.page || 0) + 1);
        },
        createdRow: function (row) {
          row.className = 'items-center px-4 py-3 bg-white';
          try {
            row.style.display = 'grid';
            row.style.gridTemplateColumns = '5fr 3fr 2fr 2fr';
            row.style.alignItems = 'center';
          } catch {
          }
          try {
            const $cells = $('td', row);
            $cells.eq(1).addClass('text-center');
            $cells.eq(2).addClass('text-center');
          } catch {
          }
        },
        language: {
          emptyTable: 'No vacancies or tenders found.'
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
          if (cat === 'Vacancy') return rowData.type === 'vacancy';
          if (cat === 'Tender') return rowData.type === 'tender';
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
  }, [query]);

  useEffect(() => {
    const dt = dataTableRef.current;
    if (!dt) return;
    dt.page.len(perPage);
    dt.draw(false);
  }, [perPage]);

  useEffect(() => {
    const dt = dataTableRef.current;
    if (!dt) return;
    dt.order(sort === 'Oldest' ? [2, 'asc'] : [2, 'desc']).draw();
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
        {/* Dynamic Page Header */}
        <PageHeader pagePath={effectivePath} />

        {/* Tabs (DB-driven for current route) */}
        <SubNavTabs pagePath={effectivePath} />

        {/* Main Content */}
        <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>
          <div className="gi-container">
            {/* Toolbar row */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 mb-4">
              {/* Search */}
              <div className="w-full">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">search</span>
                  </span>
                  <input type="search" placeholder="Search vacancies and tenders..." className="flex-1 px-3 py-2 outline-none" value={query} onChange={(e) => setQuery(e.target.value)} />
                  {/* mobile filter icon */}
                  <span className="flex items-center px-2 border-l border-gray-300 text-gray-600 lg:hidden">
                    <span aria-hidden="true" className="material-symbols-outlined">filter_alt</span>
                  </span>
                </div>
              </div>
              {/* Filters (hidden on small) */}
              <div className="hidden lg:flex items-center justify-end flex-wrap gap-2">
                {/* Sort */}
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
                {/* Category */}
                {/* <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white" role="combobox">
                  <label htmlFor="categorySelect" className="sr-only">Filter by Category</label>
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">filter_alt</span>
                  </span>
                  <select id="categorySelect" className="px-3 py-2 bg-white outline-none" role="combobox" aria-label="Filter by Category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="Vacancy">Vacancies</option>
                    <option value="Tender">Tenders</option>
                    <option value="Group">Group</option>
                  </select>
                </div> */}
                {/* Per page */}
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white" role="combobox">
                  <label htmlFor="pageLimitSelect" className="sr-only">Items per page</label>
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">list_alt</span>
                  </span>
                  <select id="pageLimitSelect" className="px-3 py-2 bg-white outline-none" role="combobox" aria-label="pages" value={perPage} onChange={(e) => setPerPage(parseInt(e.target.value, 10))}>
                    <option value={10}>10 per page</option>
                    <option value={15}>15 per page</option>
                    <option value={20}>20 per page</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[5fr_3fr_2fr_2fr] bg-blue-200 text-blue-900 font-semibold rounded-t-md px-4 py-2 text-xs">
              <div>Title</div>
              <div className="text-center">Type/Closing Date</div>
              <div className="text-center">Published Date</div>
              <div className="text-center">Action</div>
            </div>

            {/* List */}
            <div className="divide-y border border-t-0 rounded-b-md bg-white">
              {loading ? (
                <div className="px-4 py-6 text-center text-gray-500">Loading vacancies and tenders...</div>
              ) : error ? (
                <div className="px-4 py-6 text-center text-red-600">{error}</div>
              ) : (
                <div ref={tableHostRef} />
              )}
            </div>

            {/* Pagination & Archive */}
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
                <a className="inline-flex items-center gap-2 px-3 py-1.5 rounded border text-blue-800 border-blue-300 hover:bg-blue-50" href="/archives?page=vacancies-tenders">
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
