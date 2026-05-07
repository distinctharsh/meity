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
  // 🔥 FETCH DATA
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const url = "/api/offerings/vacancies";

        const res = await fetch(url);
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

  // 🔍 SEARCH
  const filtered = useMemo(() => {
    return items.filter((i) =>
      i.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  // 🔃 SORT
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "Oldest") return a.year - b.year;
      return b.year - a.year;
    });
  }, [filtered, sort]);

  // 📄 PAGINATION
  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <main>
      <PageHeader pagePath={effectivePath} />
      <SubNavTabs pagePath={effectivePath} />

      <section className="mt-10 py-10">
        <div className="gi-container">

          {/* SEARCH + FILTER */}
          <div className="flex flex-wrap gap-2 mb-6">
            <input
              placeholder="Search..."
              className="border px-3 py-2 w-full md:w-[300px] rounded"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border px-2 py-2 rounded"
            >
              <option value="Newest">Latest</option>
              <option value="Oldest">Oldest</option>
            </select>

            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="border px-2 py-2 rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>

          {/* CARD GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center py-10">Loading...</div>
            ) : paginated.length === 0 ? (
              <div className="col-span-3 text-center py-10">No data found</div>
            ) : (
              paginated.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full"
                >
                  {/* TOP HEADER - Fixed Height */}
                  <div className="bg-[#8ea2d8] text-center text-[#1a2e6c] font-semibold py-3 px-4 text-[15px] min-h-[50px] flex items-center justify-center">
                    {item.title}
                  </div>

                  {/* CONTENT AREA - flex-grow ensures this fills space */}
                  <div className="p-5 flex flex-col flex-grow">
                    
                    {/* DESCRIPTION - Restricted height for symmetry */}
                    <p className="text-[13px] text-gray-700 leading-relaxed line-clamp-3 mb-4">
                      {item.description || "No description available."}
                    </p>

                    {/* DETAILS - middle section */}
                    <div className="space-y-2 text-[13px] text-gray-700 flex-grow">
                      {/* Published Date */}
                      <div className="flex items-center gap-2">
                        
                        <span className="font-medium">Published Date</span>
                        <span className="ml-auto text-gray-600">{item.published_date || "-"}</span>
                      </div>

                      {/* Due Date */}
                      <div className="flex items-center gap-2">
                        
                        <span className="font-medium">Due Date</span>
                        <span className="ml-auto text-gray-600 font-semibold text-red-600">{item.due_date || "-"}</span>
                      </div>
                      
                      
                    </div>

                    {/* BUTTON - Hamesha bottom par rahega */}
                    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                      <a
                        href={item.file_url || "#"}
                        target="_blank"
                        className="inline-block w-full py-2.5 text-[13px] rounded-md bg-[#dbe4ff] text-[#1a2e6c] font-bold hover:bg-[#b8c9ff] transition"
                      >
                        VIEW DOCUMENT
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-8">
            <div>
              Page {currentPage} of {totalPages || 1}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* ARCHIVE LINK */}
          <div className="flex justify-end mt-6">
            <a
              href="/archives?page=vacancies"
              className="inline-flex items-center gap-2 px-4 py-2 border rounded bg-white text-[#162f6a] hover:bg-[#a3bbf3] transition"
            >
              <span aria-hidden="true" className="material-symbols-outlined">archive</span>
              View Archive
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}