import Footer from "@/components/Footer";
import Image from "next/image";
import { useMemo, useState } from "react";

export default function SchemesAndServices() {
  const [category, setCategory] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const items = [
    {
      id: 1,
      title: "Guidelines for Implementation of Scheme for reimbursement of Testing and Certification Charges",
      excerpt:
        "This Scheme aims to facilitate MSMEs by reimbursing charges for testing and certification...",
      img: "/images/schemes-services/reimbursement.jpg",
      type: "Scheme",
    },
    {
      id: 2,
      title: "Technical Internship Programme 2025",
      excerpt:
        "The Technical Internship Scheme offers undergraduate students hands-on experience in key areas...",
      img: "/images/schemes-services/b.jpg",
      type: "Service",
    },
    {
      id: 3,
      title: "Electronics Component Manufacturing Scheme",
      excerpt:
        "Scheme to scale domestic component manufacturing by supporting investments and capacity building...",
      img: "/images/schemes-services/c.jpg",
      type: "Scheme",
    },
    {
      id: 4,
      title: "Digital India Internship Scheme 2025",
      excerpt:
        "A structured internship program for students to work with various divisions on digital initiatives...",
      img: "/images/schemes-services/d.jpg",
      type: "Service",
    },
  ];

  const filteredItems = useMemo(() => {
    const byCategory = !category ? items : items.filter((i) => i.type === category);
    if (!searchQuery) return byCategory;
    const q = searchQuery.toLowerCase();
    return byCategory.filter(
      (i) => i.title.toLowerCase().includes(q) || i.excerpt.toLowerCase().includes(q)
    );
  }, [items, category, searchQuery]);

  const displayedItems = useMemo(() => filteredItems.slice(0, perPage), [filteredItems, perPage]);

  return (
    <>
      <main id="main">
        {/* Hero Section */}
        <section
          className="bg-[#123a6b] text-white px-4 hero-before"
          style={{
            background: `url('/images/schemes-services/banner.jpg') no-repeat center center`,
            backgroundSize: 'cover',
            paddingTop: '90px',
            paddingBottom: '90px',
            position: 'relative'
          }}
        >
          <div className="gi-container">
            <p className="text-sm opacity-80 mb-4">
              <a href="/" className="hover:underline">Home</a> / <a href="/offerings" className="hover:underline">Offerings</a>
            </p>
            <h1 className="text-4xl font-bold">Schemes and Services</h1>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-white " style={{ marginTop: '-10px', position: 'absolute', width: '100%' }}>
          <div className="gi-container">
            <div
              className="bg-[#162f6a] rounded-xl px-6 py-4 flex items-center space-x-6 overflow-x-auto"
              style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}
            >
              <a
                href="/offerings/schemes-and-services"
                className="text-white font-bold relative pl-3 dot-before"
                style={{ color: '#fff', fontSize: '1.3rem', fontStyle: 'normal', fontWeight: 800, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}
              >
                Schemes and Services
              </a>
              <a
                href="/offerings/vacancies"
                className="text-white/80 hover:text-white whitespace-nowrap"
                style={{ color: '#fff', fontSize: '1.3rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}
              >
                Vacancies
              </a>
              <a
                href="/offerings/tenders"
                className="text-white/80 hover:text-white whitespace-nowrap"
                style={{ color: '#fff', fontSize: '1.3rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}
              >
                Tenders
              </a>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>
          <div className="gi-container p-4 sm:p-6 md:p-8">
            {/* Toolbar: Search left, Filters right */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              {/* Search (left) */}
              <div className="w-full sm:max-w-sm">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">search</span>
                  </span>
                  <input
                    type="search"
                    role="searchbox"
                    name="scheme"
                    aria-label="search"
                    placeholder="Search..."
                    className="flex-1 px-3 py-2 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <span className="flex items-center px-2 border-l border-gray-300 text-gray-600 sm:hidden">
                    <span aria-hidden="true" className="material-symbols-outlined">filter_alt</span>
                  </span>
                </div>
              </div>

              {/* Filters (right) */}
              <div className="flex items-center justify-end flex-wrap gap-2">
                {/* Category */}
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span aria-hidden="true" className="material-symbols-outlined">filter_alt</span>
                  </span>
                  <select
                    className="px-3 py-2 bg-white outline-none"
                    role="combobox"
                    aria-label="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Schemes and Services</option>
                    <option value="Service">Services</option>
                    <option value="Scheme">Schemes</option>
                  </select>
                </div>
                {/* Per page */}
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white" role="combobox">
                  <label htmlFor="pageLimitSelect" className="sr-only">Items per page</label>
                  <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                    <span className="material-symbols-outlined">list_alt</span>
                  </span>
                  <select
                    id="pageLimitSelect"
                    className="px-3 py-2 bg-white outline-none"
                    role="combobox"
                    aria-label="pages"
                    value={perPage}
                    onChange={(e) => setPerPage(parseInt(e.target.value, 10))}
                  >
                    <option value="10">10 per page</option>
                    <option value="15">15 per page</option>
                    <option value="20">20 per page</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
              {displayedItems.map((card) => (
                <article key={card.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                  <div className="relative h-36 sm:h-40 md:h-44 w-full">
                    <Image src={card.img} alt={card.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 leading-6">{card.title}</h3>
                    <p className="text-sm md:text-[15px] text-gray-600 line-clamp-2">{card.excerpt}</p>
                  </div>
                  <div className="px-4 pb-4 flex justify-end">
                    <a href="#" className="inline-flex items-center justify-center w-7 h-7 rounded border border-gray-300 hover:bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main >
    </>
  );
}


