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
  const [showArchived, setShowArchived] = useState(false);

  // 🔥 FETCH DATA
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        let url = "/api/offerings/vacancies";
        if (showArchived) url += "?archived=true";

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
  }, [showArchived]);

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
              <option value={9}>9</option>
              <option value={12}>12</option>
              <option value={18}>18</option>
            </select>
          </div>

          {/* CARD GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 text-center py-10">
                Loading...
              </div>
            ) : paginated.length === 0 ? (
              <div className="col-span-3 text-center py-10">
                No data found
              </div>
            ) : (
              paginated.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between"
                >
                  {/* HEADER */}
                  <div className="bg-[#a3bbf3] text-[#162f6a] text-center font-semibold py-2 rounded-md">
                    {item.title}
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mt-3 text-sm text-gray-600 line-clamp-3">
                    {item.description}
                  </div>

                  {/* DETAILS */}
                  <div className="mt-4 text-xs text-gray-600 space-y-1">
                    <div>📅 Published: {item.published_date || "-"}</div>
                    <div>▶ Start: {item.start_date || "-"}</div>
                    <div>⏳ Due: {item.due_date || "-"}</div>
                    <div>📆 Year: {item.year || "-"}</div>
                    <div>📦 Size: {item.file_size}</div>
                  </div>

                  {/* BUTTON */}
                  <div className="mt-4 text-center">
                    <a
                      href={item.file_url || "#"}
                      target="_blank"
                      className="inline-block px-4 py-2 text-sm rounded bg-[#a3bbf3] text-[#162f6a] hover:bg-[#8ea9e8]"
                    >
                      VIEW ALL DOCUMENT
                    </a>
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

          {/* ARCHIVE TOGGLE */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                setShowArchived(!showArchived);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border rounded bg-white text-[#162f6a] hover:bg-[#a3bbf3] transition"
            >
              {showArchived ? "View Active" : "View Archive"}
            </button>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}