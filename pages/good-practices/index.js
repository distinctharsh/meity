import Footer from "@/components/Footer";
import { useState, useEffect, useMemo } from "react";
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "next/router";

export default function GoodPractices() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchPractices = async () => {
      try {
        const response = await fetch("/api/good-practices");

        if (response.ok) {
          const data = await response.json();
          setPractices(data);
        }
      } catch (error) {
        console.error("Failed to fetch practices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPractices();
  }, []);

  const featured = practices.length
    ? practices[activeSlide % practices.length]
    : null;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % Math.max(practices.length, 1));
  };

  const prevSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + practices.length) % Math.max(practices.length, 1),
    );
  };

  const states = [
    ...new Set(practices.map((item) => item.state).filter(Boolean)),
  ];

  const categories = [
    "Health",
    "Education",
    "Citizen Services",
    "Digitisation",
    "Infrastructure",
    "Digital Governance",
    "Rural Development",
  ];

  const filtered = useMemo(() => {
    let list = [...practices];

    if (query.trim()) {
      const q = query.toLowerCase();

      list = list.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.state?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q),
      );
    }

    if (category) {
      list = list.filter(
        (item) => item.category?.toLowerCase() === category.toLowerCase(),
      );
    }

    if (state) {
      list = list.filter((item) => item.state === state);
    }

    list.sort((a, b) => {
      return sort === "Oldest"
        ? Number(a.year) - Number(b.year)
        : Number(b.year) - Number(a.year);
    });

    return list;
  }, [practices, query, category, state, sort]);

  return (
    <>
      <main id="main" className="min-h-screen bg-[#f8faff]">
        {/* EXISTING HEADER */}
        <PageHeader />

        <div className="gi-container py-6">

          {/* FEATURED PRACTICES SLIDER */}

          {featured && (
            <section className="mb-10">
              <div className="relative overflow-hidden rounded-2xl h-[250px] md:h-[320px]">
                {/* Background Image */}
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white max-w-xl">
                  <span className="inline-block bg-white text-[#123a6b] text-xs font-bold px-3 py-1 rounded-full">
                    {featured.category}
                  </span>

                  <h2 className="text-2xl md:text-3xl font-bold mt-3">
                    {featured.title}
                  </h2>

                  <p className="text-sm md:text-base mt-2 text-white">
                    {featured.description}
                  </p>

                  <button
                    onClick={() =>
                      router.push(`/good-practices/${featured.id}`)
                    }
                    className="mt-4 bg-white text-orange-600 w-10 h-10 rounded-full font-bold hover:bg-orange-600 hover:text-white transition"
                  >
                    →
                  </button>
                </div>

                {/* Previous Button */}
                {practices.length > 1 && (
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-orange-600 text-white w-10 h-10 rounded-lg hover:bg-orange-700 transition"
                  >
                    ❮
                  </button>
                )}

                {/* Next Button */}
                {practices.length > 1 && (
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-600 text-white w-10 h-10 rounded-lg hover:bg-orange-700 transition"
                  >
                    ❯
                  </button>
                )}
              </div>

              {/* Slider Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {practices.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition ${
                      activeSlide === index ? "bg-orange-500" : "bg-gray-300"
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </section>
          )}

          {/* SEARCH AND FILTER SECTION */}

          <section className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_180px_220px_110px] gap-3">
              {/* SEARCH */}
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 shadow-sm">
                <span className="material-symbols-outlined text-gray-500">
                  search
                </span>

                <input
                  type="search"
                  placeholder="Search practices..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-3 py-3 outline-none text-sm"
                />
              </div>

              {/* STATE FILTER */}
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-3 outline-none text-sm"
              >
                <option value="">State/UT</option>

                {states.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* CATEGORY FILTER */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white border border-orange-400 rounded-xl px-3 py-3 outline-none text-sm"
              >
                <option value="">Category</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* SEARCH BUTTON */}
              <button
                onClick={() => {
                  setQuery(query.trim());
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-5 py-3 text-sm font-semibold transition"
              >
                Search
              </button>
            </div>

            {/* SORT */}
            <div className="flex justify-end mt-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-sm text-gray-600 outline-none cursor-pointer"
              >
                <option value="Newest">Latest First</option>
                <option value="Oldest">Oldest First</option>
              </select>
            </div>
          </section>

          {/* ABOUT THIS INITIATIVE */}

          <section className="mb-10">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-[#123a6b]">
                About this initiative
              </h2>

              <p className="text-gray-600 text-sm mt-2">
                Promoting excellence and innovation in public administration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* ABOUT CARD */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-blue-600 text-3xl">
                    layers
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#123a6b] mb-3">About</h3>

                <p className="text-sm text-gray-600 leading-7">
                  A collection of good practices and innovative initiatives in
                  public administration, shared by Central and State Governments
                  for cross-learning and replication.
                </p>

                <a
                  href="#featured-practices"
                  className="inline-block mt-4 text-sm font-bold text-blue-700 hover:text-orange-600"
                >
                  Read More →
                </a>
              </div>

              {/* MISSION CARD */}
              <div className="bg-[#fff5ed] border border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-orange-600 text-3xl">
                    track_changes
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#123a6b] mb-3">
                  Mission
                </h3>

                <p className="text-sm text-gray-600 leading-7">
                  To identify, document, validate and share good practices in
                  public administration, fostering cross-learning and
                  replication across departments and regions.
                </p>
              </div>

              {/* VISION CARD */}
              <div className="bg-[#f0f9ef] border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-green-600 text-3xl">
                    visibility
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#123a6b] mb-3">
                  Vision
                </h3>

                <p className="text-sm text-gray-600 leading-7">
                  A public administration that learns from its own best work,
                  with effective practices shared and adopted across the
                  country.
                </p>
              </div>
            </div>
          </section>

          {/* BROWSE BY CATEGORY */}

          <section className="mb-10">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-[#123a6b]">
                Browse by category
              </h2>

              <p className="text-sm text-gray-600 mt-2">
                Explore governance initiatives across different sectors.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* HEALTH */}
              <button
                onClick={() =>
                  setCategory(category === "Health" ? "" : "Health")
                }
                className={`rounded-xl p-5 min-h-[135px] flex flex-col items-center justify-center transition hover:-translate-y-1 hover:shadow-md ${
                  category === "Health"
                    ? "bg-red-100 ring-2 ring-red-500"
                    : "bg-[#fff1f0]"
                }`}
              >
                <span className="material-symbols-outlined text-red-500 text-4xl">
                  favorite
                </span>
                <span className="font-semibold text-gray-800 text-sm mt-3">
                  Health
                </span>
              </button>

              {/* EDUCATION */}
              <button
                onClick={() =>
                  setCategory(category === "Education" ? "" : "Education")
                }
                className={`rounded-xl p-5 min-h-[135px] flex flex-col items-center justify-center transition hover:-translate-y-1 hover:shadow-md ${
                  category === "Education"
                    ? "bg-blue-100 ring-2 ring-blue-500"
                    : "bg-[#edf5ff]"
                }`}
              >
                <span className="material-symbols-outlined text-blue-600 text-4xl">
                  school
                </span>
                <span className="font-semibold text-gray-800 text-sm mt-3">
                  Education
                </span>
              </button>

              {/* CITIZEN SERVICES */}
              <button
                onClick={() =>
                  setCategory(
                    category === "Citizen Services" ? "" : "Citizen Services",
                  )
                }
                className={`rounded-xl p-5 min-h-[135px] flex flex-col items-center justify-center transition hover:-translate-y-1 hover:shadow-md ${
                  category === "Citizen Services"
                    ? "bg-purple-100 ring-2 ring-purple-500"
                    : "bg-[#f5efff]"
                }`}
              >
                <span className="material-symbols-outlined text-purple-600 text-4xl">
                  groups
                </span>
                <span className="font-semibold text-gray-800 text-sm mt-3 text-center">
                  Citizen Services
                </span>
              </button>

              {/* DIGITISATION */}
              <button
                onClick={() =>
                  setCategory(category === "Digitisation" ? "" : "Digitisation")
                }
                className={`rounded-xl p-5 min-h-[135px] flex flex-col items-center justify-center transition hover:-translate-y-1 hover:shadow-md ${
                  category === "Digitisation"
                    ? "bg-teal-100 ring-2 ring-teal-500"
                    : "bg-[#eafaf7]"
                }`}
              >
                <span className="material-symbols-outlined text-teal-600 text-4xl">
                  computer
                </span>
                <span className="font-semibold text-gray-800 text-sm mt-3">
                  Digitisation
                </span>
              </button>

              {/* INFRASTRUCTURE */}
              <button
                onClick={() =>
                  setCategory(
                    category === "Infrastructure" ? "" : "Infrastructure",
                  )
                }
                className={`rounded-xl p-5 min-h-[135px] flex flex-col items-center justify-center transition hover:-translate-y-1 hover:shadow-md ${
                  category === "Infrastructure"
                    ? "bg-green-100 ring-2 ring-green-500"
                    : "bg-[#eff8ed]"
                }`}
              >
                <span className="material-symbols-outlined text-green-600 text-4xl">
                  apartment
                </span>
                <span className="font-semibold text-gray-800 text-sm mt-3">
                  Infrastructure
                </span>
              </button>

              {/* RURAL DEVELOPMENT */}
              <button
                onClick={() =>
                  setCategory(
                    category === "Rural Development" ? "" : "Rural Development",
                  )
                }
                className={`rounded-xl p-5 min-h-[135px] flex flex-col items-center justify-center transition hover:-translate-y-1 hover:shadow-md ${
                  category === "Rural Development"
                    ? "bg-orange-100 ring-2 ring-orange-500"
                    : "bg-[#fff5e9]"
                }`}
              >
                <span className="material-symbols-outlined text-orange-600 text-4xl">
                  agriculture
                </span>
                <span className="font-semibold text-gray-800 text-sm mt-3 text-center">
                  Rural Development
                </span>
              </button>
            </div>
          </section>

          {/* FEATURED PRACTICES */}

          <section id="featured-practices" className="mb-10">
            {/* SECTION HEADING */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
              <div>
                <h2 className="text-2xl font-bold text-[#123a6b]">
                  Featured Practices
                </h2>

                <p className="text-sm text-gray-600 mt-2">
                  Discover innovative governance initiatives from across India.
                </p>
              </div>

              <button
                onClick={() => {
                  setQuery("");
                  setCategory("");
                  setState("");
                  setSort("Newest");
                }}
                className="text-blue-700 font-semibold text-sm hover:text-orange-600"
              >
                View All →
              </button>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-72 bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              /* NO RESULTS */
              <div className="bg-white rounded-xl border border-gray-200 text-center py-14">
                <span className="material-symbols-outlined text-5xl text-gray-400">
                  search_off
                </span>

                <h3 className="text-lg font-semibold text-gray-700 mt-3">
                  No Practices Found
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Try changing your search or filters.
                </p>

                <button
                  onClick={() => {
                    setQuery("");
                    setCategory("");
                    setState("");
                  }}
                  className="mt-4 bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              /* PRACTICE CARDS */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition group"
                  >
                    {/* IMAGE */}
                    <div className="h-52 overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />

                      <span className="absolute top-3 left-3 bg-white text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow">
                        {item.category}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-[#123a6b] leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>

                      {/* STATE AND YEAR */}
                      <div className="flex justify-between items-center mt-5 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">
                            location_on
                          </span>

                          {item.state}
                        </div>

                        <span className="text-xs font-semibold text-gray-500">
                          {item.year}
                        </span>
                      </div>

                      {/* READ MORE */}
                      <button
                        onClick={() =>
                          router.push(`/good-practices/${item.id}`)
                        }
                        className="mt-4 text-sm font-bold text-orange-600 hover:text-orange-800 transition"
                      >
                        Read More →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* EXISTING FOOTER */}
        <Footer />
      </main>
    </>
  );
}
