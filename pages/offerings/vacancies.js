import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";

export default function Vacancies() {
  const router = useRouter();

  const effectivePath =
    (router?.asPath && String(router.asPath).split("?")[0]) ||
    "/offerings/vacancies";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);

  // FETCH DATA
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await fetch("/api/offerings/vacancies");
        const data = await res.json();

        const mapped = (data || []).map((item) => ({
          id: item.id,
          title: item.title || "",
          description: item.description || "",
          year: item.year || "",
          published_date: item.published_date || "",
          start_date: item.start_date || "",
          due_date: item.due_date || "",
          file_url: item.file_name
            ? `/uploads/vacancies/${item.file_name}`
            : null,
          file_size: item.file_size || item.size || "-",
        }));

        setItems(mapped);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // SEARCH
  const filtered = useMemo(() => {
    return items.filter((i) =>
      i.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  // SORT
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "Oldest") {
        return Number(a.year || 0) - Number(b.year || 0);
      }

      return Number(b.year || 0) - Number(a.year || 0);
    });
  }, [filtered, sort]);

  // PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(sorted.length / perPage)
  );

  const paginated = sorted.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <main id="main">
      <PageHeader pagePath={effectivePath} />
      <SubNavTabs pagePath={effectivePath} />

      <section className="mt-10 py-10">
        <div className="gi-container">

          {/* SEARCH + FILTER TOOLBAR */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">

            {/* SEARCH */}
            <div className="w-full lg:w-[320px]">
              <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">

                <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined"
                  >
                    search
                  </span>
                </span>

                <input
                  type="search"
                  placeholder="Search..."
                  className="flex-1 px-3 py-2 outline-none"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />

              </div>
            </div>

            {/* RIGHT FILTERS */}
            <div className="flex flex-wrap items-center justify-end gap-2">

              {/* SORT */}
              <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">

                <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined"
                  >
                    sort
                  </span>
                </span>

                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-white outline-none"
                >
                  <option value="Newest">Latest</option>
                  <option value="Oldest">Oldest</option>
                </select>

              </div>

              {/* PER PAGE */}
              <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">

                <span className="flex items-center px-2 border-r border-gray-300 text-gray-600">
                  <span className="material-symbols-outlined">
                    list_alt
                  </span>
                </span>

                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-white outline-none"
                >
                  <option value={6}>6 per page</option>
                  <option value={9}>9 per page</option>
                  <option value={12}>12 per page</option>
                </select>

              </div>

            </div>
          </div>

          {/* CARD GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {loading ? (
              <div className="col-span-3 text-center py-10 text-gray-500">
                Loading...
              </div>
            ) : paginated.length === 0 ? (
              <div className="col-span-3 text-center py-10 text-gray-500">
                No data found
              </div>
            ) : (
              paginated.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[14px] border border-[#d2dfff] shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full"
                >

                  {/* CARD HEADER */}
                  <div className="bg-[#a3bbf3] text-[#162f6a] text-center font-semibold px-5 py-4 text-[14px] uppercase tracking-[0.5px] min-h-[70px] flex items-center justify-center">
                    {item.title}
                  </div>

                  {/* CARD BODY */}
                  <div className="p-5 flex flex-col flex-grow">

                    {/* DESCRIPTION */}
                    <p className="text-[13px] text-gray-700 leading-relaxed line-clamp-3 min-h-[60px] mb-5">
                      {item.description || "No description available."}
                    </p>

                    {/* DETAILS */}
                    <div className="space-y-3 text-[13px] flex-grow">

                      {/* PUBLISHED DATE */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="font-medium text-gray-700">
                          Published Date
                        </span>

                        <span className="text-gray-600">
                          {item.published_date || "-"}
                        </span>
                      </div>

                      {/* DUE DATE */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="font-medium text-gray-700">
                          Due Date
                        </span>

                        <span className="text-red-600 font-semibold">
                          {item.due_date || "-"}
                        </span>
                      </div>

                    </div>

                    {/* BUTTON */}
                    <div className="mt-6 pt-4 border-t border-gray-100">

                      <a
                        href={item.file_url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-md bg-[#d2dfff] text-[#162f6a] font-semibold text-[13px] uppercase hover:bg-[#bfd0ff] transition"
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[18px]"
                        >
                          visibility
                        </span>

                        View Document
                      </a>

                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION + ARCHIVE */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-5">

            {/* PAGINATION */}
            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
                className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-[#c7d7ff] text-[#123a6b] disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_left
                </span>
              </button>

              <div className="text-[14px] text-[#123a6b] font-medium">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-[#c7d7ff] text-[#123a6b] disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>

            </div>

            {/* ARCHIVE */}
            <a
              href="/archives?page=vacancies"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[#bfd0ff] text-[#162f6a] hover:bg-[#edf2ff] transition"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined"
              >
                archive
              </span>

              View Archive
            </a>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}