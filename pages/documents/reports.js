import Footer from "@/components/Footer";
import { useMemo, useState } from "react";
import Image from "next/image";
export default function Reports() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("Newest");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [yearFilter, setYearFilter] = useState("");

  const items = [
    { id: 1, title: "Integrated Finances", count: 18, year: 2025, size: "", type: "group" },
    { id: 2, title: "Announcement of Selected Projects of Responsible AI themed Projects under Safe & Trusted AI Pillar", year: 2024, size: "37.15 KB", type: "pdf" },
    { id: 3, title: "Major achievement of MeitY for the month of September 2024", year: 2024, size: "77.15 KB", type: "pdf" },
  ];

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
        {/* Hero Section */}
        <section
          className="bg-[#123a6b] text-white px-4 hero-before"
          style={{
            background: `url('/images/reports/banner.jpg') no-repeat center center`,
            backgroundSize: 'cover',
            paddingTop: '90px',
            paddingBottom: '90px',
            position: 'relative'
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="overlay" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, rgb(22, 47, 106) 20%, transparent 70%)'
            }}></div>
            <p className=" opacity-99 mb-4">
              <a href="/" className="hover:underline">Home</a> / <a href="/documents" className="underline hover:decoration-yellow-400 hover:decoration-2 hover:underline-offset-2">Documents</a>
            </p>
            <h1 className="text-4xl font-bold opacity-99 text-white">Reports</h1>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-white " style={{ marginTop: '-10px', position: 'absolute', width: '100%' }}>
          <div className="max-w-7xl mx-auto">
            <div
              className="bg-[#162f6a] rounded-xl px-6 py-4 flex items-center space-x-6 overflow-x-auto"
              style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}
            >
              <a href="/documents/reports" className="text-white font-bold relative pl-3 dot-before" style={{ color: '#fff', fontSize: '1.4rem', fontStyle: 'normal', fontWeight: 800, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}>Reports</a>
              <a href="/documents/act-and-policies" className="text-white/80 hover:text-white whitespace-nowrap" style={{ color: '#fff', fontSize: '1.4rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}>Act and Policies</a>
              <a href="/documents/orders-and-notices" className="text-white/80 hover:text-white whitespace-nowrap" style={{ color: '#fff', fontSize: '1.4rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}>Orders and Notices</a>
              <a href="/documents/publications" className="text-white/80 hover:text-white whitespace-nowrap" style={{ color: '#fff', fontSize: '1.3rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}>Publications</a>
              <a href="/documents/press-release" className="text-white/80 hover:text-white whitespace-nowrap" style={{ color: '#fff', fontSize: '1.3rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}>Press Release</a>
              <a href="/documents/gazettes-notifications" className="text-white/80 hover:text-white whitespace-nowrap" style={{ color: '#fff', fontSize: '1.3rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}>Gazettes Notifications</a>
              <a href="/documents/guidelines" className="text-white/80 hover:text-white whitespace-nowrap" style={{ color: '#fff', fontSize: '1.4rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}>Guidelines</a>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mt-10 py-10 mx-4 sm:mx-8 md:mx-12" style={{ borderRadius: '20px' }}>
          <div className="max-w-7xl mx-auto">
            {/* Toolbar row */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 mb-4">
              {/* Search */}
              <div className="w-full">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">search</span>
                  </span>
                  <input type="search" placeholder="Search..." className="flex-1 px-3 py-2 outline-none" value={query} onChange={(e) => setQuery(e.target.value)} />
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
                {/* Per page */}
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

            {/* Table header */}
            <div className="grid grid-cols-[7fr_2fr_3fr] bg-blue-200 text-blue-900 font-semibold rounded-t-md px-4 py-2 text-xs">
              <div>Title</div>
              <div className="text-center">Published Year</div>
              <div className="text-center">Type/Size</div>
            </div>

            {/* List */}
            <div className="divide-y border border-t-0 rounded-b-md">
              {pagedItems.map((item) => (
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
                    <a href="#" className="inline-flex items-center gap-2 uppercase text-sm px-3 py-1.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200">
                      <span aria-hidden="true" className="material-symbols-outlined">visibility</span>
                      {item.type === 'group' ? 'View All' : 'View'}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination & Archive */}
            <div className="row items-center mt-8 grid grid-cols-1 md:grid-cols-2">
              {/* <div className="flex md:justify-start justify-center mb-3 md:mb-0">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span className="material-symbols-outlined">calendar_month</span>
                  </span>
                  <select
                    className="px-3 py-2 bg-white outline-none"
                    aria-label="Archive by year"
                    value={yearFilter}
                    onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="">All Years</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div> */}
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
