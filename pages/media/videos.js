import Footer from "@/components/Footer";
import { useMemo, useState } from "react";
import SubNavTabs from "@/components/SubNavTabs";

export default function Videos() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");

  const items = [
    {
      id: 1,
      title: "Kaushal Deekshant Samaroh",
      dateLabel: "16.03.2024",
      date: new Date(2024, 2, 16).getTime(),
      count: '1H 30Mins',
      videoUrl: "https://www.youtube.com/embed/kAKsKu_cy2k",
      alt: "Special Campaign Video"
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
          <div className="gi-container">
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
            <h1 className="text-4xl font-bold opacity-99 text-white">Videos</h1>
          </div>
        </section>
        {/* Tabs (DB-driven for current route) */}
        <SubNavTabs />

        {/* Main Content */}
        <section className="mt-8 py-1" style={{ borderRadius: '20px' }}>
          <div className="gi-container">
            {/* Toolbar row */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 mb-6">

              {/* Sort */}
              <div className="hidden lg:flex items-center justify-end flex-wrap gap-2">
                <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white" style={{ borderColor: '#5279d7' }}>
                  <span className="flex items-center px-2  border-gray-300 ">
                    <span aria-hidden="true" className="material-symbols-outlined" style={{ color: '#5279d7' }}>sort</span>
                  </span>
                  <select className="px-3 py-2 bg-white outline-none" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="">Sort By</option>
                    <option value="Latest">Latest</option>
                    <option value="Oldest">Oldest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Video Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <div key={item.id}>
                  <div className="overflow-hidden  rounded-lg ">
                    <div className="relative">
                      <iframe
                        src={item.videoUrl}
                        title={item.title}
                        className="w-full h-56 sm:h-64 lg:h-72"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>

                    </div>
                    <div className="p-0">
                      <p className="mb-0 text-sm font-sm">{item.title}</p>
                    </div>
                    <div className="px-0 py-1 flex items-center justify-between text-sm text-gray-500">
                      <small>{item.dateLabel}</small>
                      <small>{item.count}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom spacer */}
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
