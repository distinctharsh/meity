import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
 useEffect(() => {
  if (!router.isReady) return;
  const searchTerm = (q || "").toString().trim();
  if (!searchTerm) {
    setResults([]);
    setLoading(false);
    return;
  }
  loadData(searchTerm);
}, [router.isReady, q]);

  async function loadData(searchTerm) {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
        console.log("SEARCH RESPONSE =>", data);
      setResults(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  const filtered = useMemo(() => {
  return results.filter((item) => {
    const searchText = (
      item.matched_file_name ||
      item.title ||
      ""
    ).toLowerCase();

    return searchText.includes(
      query.toLowerCase()
    );
  });
}, [results, query]);
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "Newest") {
      arr.sort((a, b) =>
        String(b.year || "").localeCompare(
          String(a.year || "")
        )
      );
    } else {
      arr.sort((a, b) =>
        String(a.year || "").localeCompare(
          String(b.year || "")
        )
      );
    }
    return arr;
  }, [filtered, sort]);
  const totalPages = Math.ceil(
    sorted.length / perPage
  );
  const paginated = sorted.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  return (
    <main id="main">
      <PageHeader
        pageTitle={`Search Results : ${q || ""}`}
      />
      <section className="mt-10 py-10">
        <div className="gi-container">
          {/* TOOLBAR */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
            <div className="w-full lg:w-[320px]">
              <div className="flex items-stretch rounded-md overflow-hidden border border-gray-300 bg-white">
                <span className="flex items-center px-3 border-r border-gray-300 text-gray-600">
                  <span className="material-symbols-outlined">
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
            <div className="flex gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2"
              >
                <option value="Newest">
                  Latest
                </option>
                <option value="Oldest">
                  Oldest
                </option>
              </select>
              <select
                value={perPage}
                onChange={(e) =>
                  setPerPage(Number(e.target.value))
                }
                className="border border-gray-300 rounded-md px-4 py-2"
              >
                <option value={10}>
                  10 per page
                </option>
                <option value={20}>
                  20 per page
                </option>
                <option value={50}>
                  50 per page
                </option>
              </select>
            </div>
          </div>

          {/* HEADER */}
          <div className="grid grid-cols-12 bg-[#a3bbf3] text-[#123a6b] font-semibold text-[13px] uppercase tracking-[1px] px-6 py-4 rounded-[12px]">
            <div className="col-span-6">
              Title
            </div>
            <div className="col-span-3 text-center">
              Published Year
            </div>
            <div className="col-span-3 text-right">
              View
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-center py-10">
              Loading...
            </div>
          )}

          {/* NO DATA */}
          {!loading &&
            paginated.length === 0 && (
              <div className="text-center py-10">
                No Record Found
              </div>
            )}

         
          {/* DATA */}
          {!loading &&
            paginated.map((item) => (
              <div
                key={`${item.source}-${item.id}`}
                className="grid grid-cols-12 items-center bg-white border border-[#d7e3ff] rounded-[12px] px-6 py-5 mt-3 shadow-sm"
              >
                {/* TITLE */}
                <div className="col-span-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#123a6b]">
                    description
                  </span>

                  <div>
                    <div className="text-[16px] font-medium flex items-center gap-2 flex-wrap">
                      <span>
                        {item.matched_file_name || item.title}
                      </span>

                      {item.source === "report_group" &&
                        item.files_count > 0 && (
                          <span className="px-2 py-1 text-[11px] font-semibold bg-[#d2dfff] text-[#123a6b] rounded-md">
                            {item.files_count}
                          </span>
                        )}

                        {item.is_archived === 1 ? (
                          <span className="ml-2 px-2 py-1 text-[11px] font-semibold bg-red-100 text-red-700 rounded-md">
                            ARCHIVED
                          </span>
                        ) : (
                          <span className="ml-2 px-2 py-1 text-[11px] font-semibold bg-green-100 text-green-700 rounded-md">
                            ACTIVE
                          </span>
                        )}
                        
                    </div>
                  </div>
                </div>

                {/* YEAR */}
                <div className="col-span-3 text-center">
                  {item.year || item.published_date || "-"}
                </div>

                {/* VIEW BUTTON */}
                <div className="col-span-3 flex justify-end">
                  <a
                    href={
                      item.source === "report_file"
                        ? item.file_url
                        : item.type === "group"
                        ? `/documents/report/${item.id}`
                        : `/uploads/${item.type}/${item.file_url.replace(/^\/+/, "")}`
                    }
                    target={
                      item.source === "report_file"
                        ? "_blank"
                        : item.type === "group"
                        ? "_self"
                        : "_blank"
                    }
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#EAF2FF] text-[#0A4CC5] px-4 py-2 rounded font-semibold text-sm hover:bg-[#DCEAFF] transition-all duration-200"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      visibility
                    </span>

                    {item.source === "report_file" ? "VIEW FILE" : "VIEW ALL"}
                  </a>
                </div>

              </div>
            ))}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
                className="px-4 py-2 border rounded"
              >
                Prev
              </button>
              <span className="px-4 py-2">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
                className="px-4 py-2 border rounded"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );

}