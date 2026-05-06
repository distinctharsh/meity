import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";

export default function Tenders() {
  const router = useRouter();
  const effectivePath =
    (router?.asPath && String(router.asPath).split("?")[0]) ||
    "/offerings/tenders";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showArchived, setShowArchived] = useState(false);

  // Fetch data
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        let url = "/api/offerings/tenders";
        if (showArchived) url += "?archived=true";

        const res = await fetch(url);
        const data = await res.json();

        const mapped = (data || []).map((item) => ({
          id: item.id,
          tender_id: item.tender_id || "",
          title: item.title || "",
          description: item.description || "",
          published_date: item.published_date,
          due_date: item.due_date || item.closing_date,
          file_url: item.file_name
            ? `/uploads/tenders/${item.file_name}`
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

  // Search filter
  const filtered = useMemo(() => {
    return items.filter((i) =>
      i.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.published_date || 0);
      const dateB = new Date(b.published_date || 0);
      if (sort === "Oldest") return dateA - dateB;
      return dateB - dateA;
    });
  }, [filtered, sort]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / perPage) || 1;
  const paginated = sorted.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <>
      <main id="main">
        {/* Dynamic Page Header */}
        <PageHeader pagePath={effectivePath} />

        {/* Tabs (DB-driven for current route) */}
        <SubNavTabs pagePath={effectivePath} />

        {/* Main Content */}
        <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>
          <div className="gi-container">
            {/* SEARCH + FILTERS */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <input
                placeholder="Search tenders..."
                className="border px-3 py-2 flex-1 min-w-[200px]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border px-2"
              >
                <option value="Newest">Latest</option>
                <option value="Oldest">Oldest</option>
              </select>

              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="border px-2"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            {/* TABLE HEADER */}
            <div
              className="grid grid-cols-[2fr_4fr_2fr_2fr_2fr_2fr] font-semibold rounded-t-md px-4 py-2 text-xs"
              style={{ background: "#a3bbf3", color: "#162f6a" }}
            >
              <div>Tender ID</div>
              <div>Title</div>
              <div className="text-center">Published Date</div>
              <div className="text-center">Due Date</div>
              <div className="text-center">Size</div>
              <div className="text-center">Action</div>
            </div>

            {/* TABLE BODY */}
            <div className="border rounded-b-md bg-white">
              {loading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : paginated.length === 0 ? (
                <div className="p-4 text-center">No tenders found</div>
              ) : (
                paginated.map((item) => {
                  const dueDate = item.due_date
                    ? new Date(item.due_date)
                    : null;
                  const today = new Date();
                  const isExpired = dueDate && dueDate < today;
                  const isUrgent =
                    dueDate &&
                    dueDate <
                      new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

                  let badgeClass = "text-[10px] px-1.5 py-0.5 rounded ";
                  if (isExpired) {
                    badgeClass += "bg-red-100 text-red-700";
                  } else if (isUrgent) {
                    badgeClass += "bg-orange-100 text-orange-700";
                  } else {
                    badgeClass += "bg-blue-100 text-blue-700";
                  }

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[2fr_4fr_2fr_2fr_2fr_2fr] px-4 py-3 border-t items-center"
                    >
                      <div className="text-sm font-medium">
                        {item.tender_id || "-"}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">{item.title}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500">
                            {item.description}
                          </div>
                        )}
                      </div>
                      <div className="text-center text-sm">
                        {item.published_date
                          ? new Date(
                              item.published_date
                            ).toLocaleDateString("en-GB")
                          : "-"}
                      </div>
                      <div className="text-center text-sm">
                        {dueDate ? (
                          <span className={badgeClass}>
                            {dueDate.toLocaleDateString("en-GB")}
                          </span>
                        ) : (
                          "-"
                        )}
                      </div>
                      <div className="text-center text-sm">
                        {item.file_size || "-"}
                      </div>
                      <div className="text-center w-full">
                        <a
                          href={item.file_url || "#"}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          <span aria-hidden="true" class="material-symbols-outlined">visibility</span>
                          View
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-6">
              <div>
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Prev
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, i) => i + 1
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-full ${
                      p === currentPage
                        ? "bg-[#c7d7ff] text-[#123a6b] font-semibold"
                        : "text-[#123a6b] hover:bg-[#e8efff]"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>

            {/* ARCHIVE TOGGLE */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowArchived(!showArchived)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded border text-orange-800 border-orange-300 hover:bg-orange-50"
              >
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined"
                >
                  archive
                </span>
                {showArchived ? "View Active" : "View Archive"}
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
