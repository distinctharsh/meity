import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ReportForm from '@/components/admin/ReportForm';

export default function AdminReportsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dtRef = useRef(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/reports');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setItems(data);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Initialize jQuery DataTable when items are loaded and not in form mode
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!items || items.length === 0) return;
    if (creating || editing) return;

    let cancelled = false;
    let attemptTimer;

    const tryInit = () => {
      if (cancelled) return;
      const $ = window.jQuery;
      if (!$ || !$.fn || !$.fn.DataTable) {
        attemptTimer = setTimeout(tryInit, 50);
        return;
      }

      const selector = '#reports-table';
      try {
        if ($.fn.dataTable.isDataTable(selector)) {
          try {
            $(selector).DataTable().destroy(false);
          } catch {
          }
        }

        const dt = $(selector).DataTable({
          paging: true,
          searching: true,
          info: false,
          lengthChange: false,
          pageLength: perPage,
          order: [[2, 'desc']],
          autoWidth: false,
          responsive: true,
          dom: 't',
          columnDefs: [
            { orderable: false, targets: -1 },
          ],
          drawCallback: function () {
            const info = this.api().page.info();
            setTotalPages(Math.max(1, info.pages || 1));
            setCurrentPage((info.page || 0) + 1);
          },
        });

        dtRef.current = dt;
        dt.search(query || '');
        dt.draw();
      } catch (e) {
        console.error('DataTable init failed', e);
      }
    };

    tryInit();

    return () => {
      cancelled = true;
      if (attemptTimer) clearTimeout(attemptTimer);
      try {
        const $ = window.jQuery;
        const selector = '#reports-table';
        if ($ && $.fn && $.fn.dataTable && $.fn.dataTable.isDataTable(selector)) {
          $(selector).DataTable().destroy(false);
        }
      } catch {
      } finally {
        dtRef.current = null;
      }
    };
  }, [items, creating, editing]);

  useEffect(() => {
    const dt = dtRef.current;
    if (!dt) return;
    dt.search(query || '').draw();
  }, [query]);

  useEffect(() => {
    const dt = dtRef.current;
    if (!dt) return;
    dt.page.len(perPage);
    dt.draw(false);
  }, [perPage]);

  const onSaved = async () => {
    setCreating(false);
    setEditing(null);
    await load();
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this report?')) return;
    const res = await fetch(`/api/admin/reports/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Delete failed');
    } else {
      await load();
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-600 mt-1">Total: <span className="font-semibold text-slate-800">{items.length}</span></p>
        </div>
        <button
          onClick={() => {
            if (creating || editing) {
              setCreating(false);
              setEditing(null);
            } else {
              setCreating(true);
              setEditing(null);
            }
          }}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow cursor-pointer"
        >
            {creating ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
            )}
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !creating && !editing && (
        <div className="space-y-4">
          <div className="bg-white rounded-md p-4 border border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-center">
              <div className="w-full">
                <div className="flex items-stretch rounded-md overflow-hidden border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-slate-200 focus-within:border-slate-400">
                  <span className="flex items-center px-2 border-r border-slate-300 text-slate-600">
                    <span aria-hidden="true" className="material-symbols-outlined">search</span>
                  </span>
                  <input
                    type="search"
                    placeholder="Search reports..."
                    className="flex-1 px-3 py-2 outline-none text-sm text-slate-900 placeholder:text-slate-400"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <div className="flex items-stretch rounded-md overflow-hidden border border-slate-300 bg-white" role="combobox">
                  <label htmlFor="pageLimitSelect" className="sr-only">Items per page</label>
                  <span className="flex items-center px-2 border-r border-slate-300 text-slate-600">
                    <span className="material-symbols-outlined">list_alt</span>
                  </span>
                  <select
                    id="pageLimitSelect"
                    className="px-3 py-2 bg-white outline-none text-sm text-slate-900"
                    aria-label="pages"
                    value={perPage}
                    onChange={(e) => setPerPage(parseInt(e.target.value, 10))}
                  >
                    <option value={10}>10 per page</option>
                    <option value={15}>15 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-md border border-slate-200">
            <table id="reports-table" className="min-w-full divide-y divide-slate-200 table-fixed">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">Type</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">Year</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider w-24">Size</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider w-24">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-48">Nav Name</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">Nav ID</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">Archived</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">Status</th>
                <th className="px-4 py-3 w-28"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {items.map((r) => (
                <tr key={r.id} className="odd:bg-slate-50/40 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-800 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize border border-slate-200">
                      {r.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800 text-center whitespace-nowrap">{r.year || '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 text-center whitespace-nowrap">{r.size || '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 text-center whitespace-nowrap">{r.title || '-'}</td>
                  <td
                    className="px-4 py-3 text-sm text-slate-800 max-w-[20rem] whitespace-normal break-words"
                    title={(r.nav_name || r.nav_link || '-') || ''}
                  >
                    {r.nav_name || r.nav_link || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800 text-center whitespace-nowrap">{(typeof r.nav_item_id !== 'undefined' && r.nav_item_id !== null) ? r.nav_item_id : '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 text-center whitespace-nowrap">{(typeof r.display_order !== 'undefined' && r.display_order !== null) ? r.display_order : '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 whitespace-nowrap">
                    <span className={r.is_archived ? "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200" : "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"}>
                      {r.is_archived ? 'Archived' : 'Live'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800 whitespace-nowrap">
                    <span className={r.is_active ? "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white" : "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700"}>
                      {r.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right space-x-2 w-28 whitespace-nowrap">
                    <button
                      onClick={() => { setEditing(r); setCreating(false); }}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-blue-200 text-blue-600  cursor-pointer"
                      aria-label="Edit report"
                      title="Edit report"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(r.id)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-red-200 text-red-700 hover:bg-red-50 cursor-pointer"
                      aria-label="Delete report"
                      title="Delete report"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          <div className="bg-white rounded-md p-4 border border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Page <span className="font-semibold text-slate-800">{currentPage}</span> of <span className="font-semibold text-slate-800">{totalPages}</span>
            </div>
            <nav aria-label="Page navigation">
              <ul className="flex items-center gap-2">
                <li>
                  <button
                    className="h-9 px-3 inline-flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 disabled:opacity-40"
                    onClick={() => {
                      const dt = dtRef.current;
                      if (dt) dt.page('previous').draw('page');
                    }}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                </li>
                {(() => {
                  const pages = [];
                  const max = totalPages;
                  const push = (x) => pages.push(x);
                  const range = (s, e) => { for (let i = s; i <= e; i++) push(i); };
                  if (max <= 7) {
                    range(1, max);
                  } else {
                    const start = Math.max(1, currentPage - 1);
                    const end = Math.min(max, currentPage + 1);
                    push(1);
                    if (start > 2) push('...');
                    range(Math.max(2, start), Math.min(max - 1, end));
                    if (end < max - 1) push('...');
                    push(max);
                  }
                  return pages.map((p, idx) => (
                    <li key={`${p}-${idx}`}>
                      {p === '...' ? (
                        <span className="h-9 px-2 inline-flex items-center justify-center text-slate-500">…</span>
                      ) : (
                        <button
                          onClick={() => {
                            const dt = dtRef.current;
                            if (dt) dt.page(Number(p) - 1).draw('page');
                          }}
                          className={
                            Number(p) === currentPage
                              ? "h-9 min-w-9 px-3 rounded-md bg-blue-600 text-white font-semibold"
                              : "h-9 min-w-9 px-3 rounded-md text-slate-700 hover:bg-slate-100"
                          }
                          aria-current={Number(p) === currentPage ? "page" : undefined}
                        >
                          {p}
                        </button>
                      )}
                    </li>
                  ));
                })()}
                <li>
                  <button
                    className="h-9 px-3 inline-flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 disabled:opacity-40"
                    onClick={() => {
                      const dt = dtRef.current;
                      if (dt) dt.page('next').draw('page');
                    }}
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

      {(creating || editing) && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-300">
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Report' : 'Add Report'}</h2>
          <ReportForm
            initial={editing}
            onCancel={() => { setCreating(false); setEditing(null); }}
            onSaved={onSaved}
          />
        </div>
      )}
    </AdminLayout>
  );
}
