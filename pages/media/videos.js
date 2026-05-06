import Footer from "@/components/Footer";
import { useMemo, useState, useEffect } from "react";
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";

export default function Videos() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/admin/videos');
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = videos.map(video => ({
      id: video.id,
      title: video.title,
      dateLabel: video.date ? new Date(video.date).toLocaleDateString('en-GB') : '',
      date: video.date ? new Date(video.date).getTime() : 0,
      count: video.duration || '',
      videoUrl: video.video_url,
      alt: video.alt_text || video.title
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
  }, [videos, query, sort]);

  if (loading) {
    return (
      <>
        <main id="main">
          <PageHeader pagePath="/media/videos" />
          <SubNavTabs />
          <section className="mt-8 py-1" style={{ borderRadius: '20px' }}>
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
        <PageHeader pagePath="/media/videos" />
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
