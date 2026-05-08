import Footer from "@/components/Footer";
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "next/router";

export default function Photos() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await fetch('/api/admin/photos');
      if (response.ok) {
        const data = await response.json();
        setGalleries(data);
      }
    } catch (error) {
      console.error('Failed to fetch galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryClick = (galleryId) => {
    router.push(`/media/photos/${galleryId}`);
  };

  const filtered = useMemo(() => {
    let list = galleries.map(gallery => ({
      id: gallery.id,
      title: gallery.title,
      dateLabel: gallery.date ? new Date(gallery.date).toLocaleDateString('en-GB') : '',
      date: gallery.date ? new Date(gallery.date).getTime() : 0,
      count: gallery.images ? gallery.images.length : 0,
      img: gallery.images && gallery.images.length > 0 ? gallery.images[0].url : '',
      alt: gallery.title
    }));
    
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((i) => i.title.toLowerCase().includes(q));
    }
    if (sort === "Oldest") {
      list = [...list].sort((a, b) => a.date - b.date);
    } else {
      list = [...list].sort((a, b) => b.date - a.date);
    }
    return list;
  }, [galleries, query, sort]);

  if (loading) {
    return (
      <>
        <main id="main">
          <PageHeader pagePath="/media/photos" />
          <SubNavTabs />
          <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>
            <div className="gi-container">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </main>
      </>
    );
  }

  return (
    <>
      <main id="main">
        {/* Dynamic Page Header */}
        <PageHeader pagePath="/media/photos" />

        {/* Tabs (DB-driven for current route) */}
        <SubNavTabs />

        {/* Main Content */}
        <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>
          <div className="gi-container">
            {/* Toolbar row */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 mb-6">
              {/* Search */}
              <div className="w-full">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white" style={{ borderColor: '#5279d7', width: '33%' }}>
                  <span className="flex items-center px-2  border-gray-300 ">
                    <span aria-hidden="true" className="material-symbols-outlined" style={{ color: '#5279d7' }}>search</span>
                  </span>
                  <input type="search" placeholder="Search..." className="flex-1 px-3 py-2 outline-none" value={query} onChange={(e) => setQuery(e.target.value)} />
                  <span className="flex items-center px-2 border-l border-gray-300 text-gray-600 lg:hidden">
                    <span aria-hidden="true" className="material-symbols-outlined">filter_alt</span>
                  </span>
                </div>
              </div>
              {/* Sort */}
              <div className="hidden lg:flex items-center justify-end flex-wrap gap-2">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white" style={{ borderColor: '#5279d7' }}>
                  <span className="flex items-center px-2  border-gray-300 ">
                    <span aria-hidden="true" className="material-symbols-outlined" style={{ color: '#5279d7' }}>sort</span>
                  </span>
                  <select className="px-3 py-2 bg-white outline-none" role="listbox" aria-label="select" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="Latest">Latest</option>
                    <option value="Sort by">Sort by</option>
                    <option value="Oldest">Oldest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 photos-row-gap">
              {filtered.map((item) => (
                <div key={item.id} className="">
                  <div className=" overflow-hidden  photos-card bg-white">
                    <div className="relative">
                      <img
                        src={item.img}
                        alt={item.alt}
                        className="w-full object-cover object-top photos-img"
                        style={{ height: '220px' }}
                        width={100}
                        height={100}
                    />
                      <button className="absolute right-3 bottom-3 bg-dark/90 text-[#123a6b] rounded-md w-9 h-9 flex items-center justify-center photos-btn" aria-label="view more items" style={{ background: 'rgba(0, 0, 0, .6196078431)' }}>
                        <span className="material-symbols-outlined" style={{ color: '#fff', cursor: 'pointer' }} onClick={() => handleGalleryClick(item.id)}>arrow_right_alt</span>
                      </button>
                    </div>
                    <div className="p-1 photos-card-body">
                      <p className="mb-0 photos-card-title font-14-400">{item.title}</p>
                    </div>
                    <div className="px-1 py-1  flex items-center justify-between uppercase photos-card-footer">
                      <small className="ptype" aria-label={item.dateLabel} font-12-600>{item.dateLabel}</small>
                      <small 
                        className="ptype cursor-pointer hover:text-blue-600 font-12-600" 
                      >
                        {item.count} Items
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom spacer to mirror reference layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 mt-8">
              <div />
              <div className="flex justify-center md:justify-center" />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
