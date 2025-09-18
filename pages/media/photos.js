import Footer from "@/components/Footer";
import { useMemo, useState } from "react";
import Image from "next/image";
export default function Photos() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");

  const items = [
    {
      id: 1,
      title: "Special Campaign",
      dateLabel: "16.03.2024",
      date: new Date(2024, 2, 16).getTime(),
      count: 6,
      img: "https://www.meity.gov.in/static/uploads/2024/02/WhatsApp-Image-2022-10-28-at-3.10.46-PM-768x512.jpeg",
      alt: "Special Campaign Image having Minsiter of Cabinet Secretariat"
    },
    {
      id: 2,
      title: "FIT India Freedom Run 2.0",
      dateLabel: "03.11.2022",
      date: new Date(2022, 10, 3).getTime(),
      count: 6,
      img: "https://www.meity.gov.in/static/uploads/2024/02/WhatsApp-Image-2022-10-4-768x512.jpeg",
      alt: "FIT India Freedom Run 2.0"
    },
    {
      id: 3,
      title: "Fire Hydrant Check",
      dateLabel: "01.11.2022",
      date: new Date(2022, 10, 1).getTime(),
      count: 10,
      img: "https://www.meity.gov.in/static/uploads/2024/02/WhatsApp-Image-2022-10-29--768x432.jpeg",
      alt: "Fire Hydrant Check"
    },
    {
      id: 4,
      title: "Dengue Smoke Fogging",
      dateLabel: "01.11.2022",
      date: new Date(2022, 10, 1).getTime(),
      count: 4,
      img: "https://www.meity.gov.in/static/uploads/2024/02/ba2f00d153a139202836b88804bc7ab9-768x432.jpeg",
      alt: "Dengue Smoke Fogging"
    },
    {
      id: 5,
      title: "Blood Donation Camp",
      dateLabel: "01.11.2022",
      date: new Date(2022, 10, 1).getTime(),
      count: 5,
      img: "https://www.meity.gov.in/static/uploads/2024/02/WhatsApp-Image-2022-10-28-at-5.3-768x512.jpeg",
      alt: "Blood Donation Camp"
    }
  ];

  const filtered = useMemo(() => {
    let list = items;
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
  }, [items, query, sort]);

  return (
    <>
      <main id="main">
        {/* Hero Section */}
        <section
          className="bg-[#123a6b] text-white px-4 hero-before"
          style={{
            background: `url('/images/media/banner.jpg') no-repeat center center`,
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
              <a href="/" className="hover:underline">Home</a> / <a href="/media" className="underline hover:decoration-yellow-400 hover:decoration-2 hover:underline-offset-2">Media</a>
            </p>
            <h1 className="text-4xl font-bold opacity-99 text-white">Photos</h1>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-white " style={{ marginTop: '-10px', position: 'absolute', width: '100%' }}>
          <div className="max-w-7xl mx-auto">
            <div
              className="bg-[#162f6a] rounded-xl px-6 py-4 flex items-center space-x-6 overflow-x-auto"
              style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}
            >
              <a href="/documents/photos" className="text-white font-bold relative pl-3 dot-before" style={{ color: '#fff', fontSize: '1.4rem', fontStyle: 'normal', fontWeight: 800, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}>Photos</a>
              <a href="/documents/videos" className="text-white/80 hover:text-white whitespace-nowrap" style={{ color: '#fff', fontSize: '1.4rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}>Videos</a>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mt-10 py-10 mx-4 sm:mx-8 md:mx-12" style={{ borderRadius: '20px' }}>
          <div className="max-w-7xl mx-auto">
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
                        className="w-full h-48 object-cover photos-img"
                        width={100}
                        height={100}
                      />
                      <button className="absolute right-3 bottom-3 bg-dark/90 text-[#123a6b] rounded-md w-9 h-9 flex items-center justify-center photos-btn" aria-label="view more items" style={{ background: 'rgba(0, 0, 0, .6196078431)' }}>
                        <span className="material-symbols-outlined" style={{ color: '#fff' }}>arrow_right_alt</span>
                      </button>
                    </div>
                    <div className="p-1 photos-card-body">
                      <p className="mb-0 text-lg font-semibold photos-card-title">{item.title}</p>
                    </div>
                    <div className="px-1 py-1  flex items-center justify-between uppercase photos-card-footer">
                      <small className="ptype" aria-label={item.dateLabel}>{item.dateLabel}</small>
                      <small className="ptype">{item.count} Items</small>
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
