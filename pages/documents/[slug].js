import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("Newest");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [yearFilter, setYearFilter] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        // Build API url: prefer explicit nav query if present, else map slug back to nav path
        let apiUrl = '/api/documents/reports';
        const navQuery = router.query?.nav;
        const navItem = router.query?.nav_item;
        if (navQuery) {
          apiUrl += '?nav=' + encodeURIComponent(String(navQuery));
        } else if (navItem) {
          apiUrl += '?nav_item=' + encodeURIComponent(String(navItem));
        } else if (slug) {
          // slug like 'reports' -> map back to '/documents/reports'
          const raw = Array.isArray(slug) ? slug.join('/') : String(slug);
          const decoded = decodeURIComponent(raw);
          const navPath = '/documents/' + decoded.replace(/^\//, '');
          apiUrl += '?nav=' + encodeURIComponent(navPath);
        } else {
          const nav = (router && router.asPath) || (typeof window !== 'undefined' ? window.location.pathname : '/documents/reports');
          apiUrl += '?nav=' + encodeURIComponent(nav.split('?')[0]);
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
  }, [router?.asPath, router?.query?.nav_item, router?.query?.nav, slug]);

  const filtered = useMemo(() => {
    let list = items;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((i) => i.title.toLowerCase().includes(q));
    }
    if (category) {
      list = list.filter((i) => (category === "Group" ? i.type === "group" : i.type !== "group"));
    }
    if (yearFilter) {
      list = list.filter((i) => String(i.year || "") === String(yearFilter));
    }
    if (sort === "Oldest") {
      list = [...list].sort((a, b) => (a.year || 0) - (b.year || 0));
    } else {
      list = [...list].sort((a, b) => (b.year || 0) - (a.year || 0));
    }
    return list;
  }, [items, query, category, sort, yearFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentSafePage = Math.min(currentPage, totalPages);
  const startIdx = (currentSafePage - 1) * perPage;
  const endIdx = startIdx + perPage;
  const pagedItems = filtered.slice(startIdx, endIdx);

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
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 mb-4">
              <div className="w-full">
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
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white" role="combobox">
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
                </div>
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

            <div className="grid grid-cols-[7fr_2fr_3fr] bg-blue-200 text-blue-900 font-semibold rounded-t-md px-4 py-2 text-xs">
              <div>Title</div>
              <div className="text-center">Published Year</div>
              <div className="text-center">Type/Size</div>
            </div>

            <div className="divide-y border border-t-0 rounded-b-md">
              {loading ? (
                <div className="px-4 py-6 text-center text-gray-500">Loading reports...</div>
              ) : error ? (
                <div className="px-4 py-6 text-center text-red-600">{error}</div>
              ) : pagedItems.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500">No reports found.</div>
              ) : pagedItems.map((item) => (
                <div key={item.id} className="grid grid-cols-[7fr_2fr_3fr] items-center px-4 py-3 bg-white">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-700">{item.type === 'group' ? 'file_copy' : 'draft'}</span>
                    <p className="mb-0 text-sm text-gray-800">{item.title}</p>
                    {item.count ? <span className="ml-1 inline-flex justify-center items-center w-6 h-6 text-[11px] rounded bg-blue-100 text-blue-700">{item.count}</span> : null}
                  </div>
                  <div className="text-center text-sm text-gray-700">{item.year || '-'}</div>
                  <div className="flex items-center gap-2 justify-between w-full">
                    {item.type !== 'group' ? (
                      <div className="flex items-center gap-2 mx-auto">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100">PDF</span>
                        <small className="text-gray-700">{item.size}</small>
                      </div>
                    ) : <span />}
                    {item.type === 'group' ? (
                      <a href={`/documents/report/${item.id}`} className="inline-flex items-center gap-2 uppercase text-sm px-3 py-1.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200">
                        <span aria-hidden="true" className="material-symbols-outlined">visibility</span>
                        View All
                      </a>
                    ) : (
                      <a href={item.file_url || '#'} target={item.file_url ? '_blank' : undefined} rel={item.file_url ? 'noreferrer' : undefined} className="inline-flex items-center gap-2 uppercase text-sm px-3 py-1.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200">
                        <span aria-hidden="true" className="material-symbols-outlined">visibility</span>
                        View
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="row items-center mt-8 grid grid-cols-1 md:grid-cols-2">
              <div className="flex justify-end">
                <nav aria-label="Page navigation">
                  <ul className="flex items-center gap-3">
                    <li>
                      <button
                        className="w-8 h-8 inline-flex items-center justify-center rounded-full border text-[#123a6b] disabled:opacity-40"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentSafePage === 1}
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
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
                <a className="inline-flex items-center gap-2 px-3 py-1.5 rounded border text-blue-800 border-blue-300 hover:bg-blue-50" href="/archives?page=reports">
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
