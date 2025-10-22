import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SubNavTabs from "@/components/SubNavTabs";
import { useEffect, useMemo, useState } from "react";

export default function DirectoryPage() {
  const [query, setQuery] = useState("");
  const [alpha, setAlpha] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const ALPHAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Temporary placeholder data (we will wire API later)
  const data = [
    {
      role: "MINISTER (E&IT)",
      name: "Shri Ashwini Vaishnaw",
      tags: [
        "Hon'ble Minister of Railways",
        "Information and Broadcasting",
        "Electronics and Information Technology",
      ],
      phones: ["+91-11-24366191(Office)", "+91-11-243666700(Fax)"],
      emails: ["moeit[at]gov[dot]in"],
      address:
        "Electronics Niketan, 6, CGO Complex, Lodhi Road, New Delhi: 110003",
    },
    {
      role: "MINISTER OF STATE (E&IT)",
      name: "Shri Jitin Prasada",
      tags: [
        "Hon'ble Minister of State in the Ministry of Commerce and Industry",
        "Electronics and Information Technology",
      ],
      phones: ["+91-11-24368757(Office)", "+91-11-24368758(Office)", "+91-11-24366958(Fax)"],
      emails: ["mos-eit[at]gov[dot]in"],
      address:
        "Electronics Niketan, 6, CGO Complex, Lodhi Road, New Delhi: 110003",
    },
    {
      role: "DEPUTY DIRECTOR, UNDER SECRETARY",
      name: "Smt. Jacqueline Lall",
      tags: ["Cyber Laws and Data Governance Group", "Cyber Security Division"],
      phones: ["011-24301319"],
      emails: ["jacqueline[dot]lall[at]meity[dot]gov[dot]in"],
      address: "Room No. 3018, Electronics Niketan, 6, CGO Complex, Lodhi Road, New Delhi: 110003",
    },
    {
      role: "STENOGRAPHER",
      name: "Shri Jai Singh",
      tags: ["Cyber Security Division"],
      phones: ["+91-11-24301877"],
      emails: ["jai[dot]singh95[at]gov[dot]in"],
      address: "Outside Room No. 3291, Electronics Niketan, 6, CGO Complex, Lodhi Road, New Delhi: 110003",
    },
  ];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((r) =>
      [
        r.role,
        r.name,
        Array.isArray(r.tags) ? r.tags.join(" ") : r.description,
        Array.isArray(r.phones) ? r.phones.join(" ") : r.phone,
        Array.isArray(r.emails) ? r.emails.join(" ") : r.email,
        r.address,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, data]);

  const filteredByAlpha = useMemo(() => {
    if (!alpha) return results;
    return results.filter((r) => String(r.name || "").trim().toUpperCase().startsWith(alpha));
  }, [results, alpha]);

  const totalPages = Math.max(1, Math.ceil(filteredByAlpha.length / perPage));
  const pageItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredByAlpha.slice(start, start + perPage);
  }, [filteredByAlpha, page, perPage]);

  useEffect(() => {
    setPage(1);
  }, [alpha, perPage, query]);

  return (
    <>
      <main id="main">
        <PageHeader  />
        <SubNavTabs />

        <section className="gi-container mt-12 py-10">
         

          <div className=" mt-0 flex items-center justify-between gap-4 px-0">
            <div className="relative w-full max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5 1.5-1.5-5-5zM4 9.5C4 6.46 6.46 4 9.5 4S15 6.46 15 9.5 12.54 15 9.5 15 4 12.54 4 9.5z"/></svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
              >
                {[10,20,50].map(n => (
                  <option key={n} value={n}>{n} per page</option>
                ))}
              </select>
            </div>
          </div>

          <div className=" mt-4 px-0">
            <div className="w-full bg-gray-200 rounded-md overflow-x-auto">
              <div className="flex items-center justify-center gap-2 px-3 py-2">
                {ALPHAS.map((ch) => {
                  const active = alpha === ch;
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setAlpha(a => a === ch ? "" : ch)}
                      className={`px-2 py-1 text-sm rounded ${active ? "bg-blue-600 text-white" : "text-[#123a6b] hover:bg-white"}`}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 px-0">
            <div className="space-y-6">
              {pageItems.map((row, idx) => (
                <div key={idx} className="pb-6 border-b-2" style={{ borderColor: '#b6c9ff' }}>
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_3fr] gap-4">
                    {/* Left: role, name, chips */}
                    <div>
                      <p className="text-[10px] font-extrabold tracking-wide text-[#123a6b] uppercase">{row.role || " "}</p>
                      <p className="text-lg font-semibold text-[#123a6b]">{row.name}</p>
                      {(row.tags?.length || row.description) && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(row.tags && row.tags.length ? row.tags : [row.description]).filter(Boolean).map((t, i) => (
                            <span key={i} className="inline-block bg-[#cfe0ff] text-[#123a6b] text-xs font-semibold px-3 py-1.5 rounded-md">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Middle: phone(s) then email(s) */}
                    <div className="space-y-2 text-sm text-gray-800">
                      <div className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-gray-700 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M2.003 5.884c-.09-1.04.71-1.93 1.75-2.02l2.51-.22c.87-.08 1.66.46 1.9 1.3l.57 2.07c.2.74-.04 1.53-.62 2.05l-1.12.98a14.99 14.99 0 007.58 7.58l.98-1.12c.52-.58 1.31-.82 2.05-.62l2.07.57c.84.24 1.38 1.03 1.3 1.9l-.22 2.51c-.09 1.04-.98 1.84-2.02 1.75-9.9-.85-17.8-8.74-18.66-18.64z"/></svg>
                        <div className="flex flex-wrap gap-x-2 gap-y-1">
                          {(row.phones || [row.phone]).filter(Boolean).map((p, i) => (
                            <a key={i} className="hover:underline" href={`tel:${String(p).replace(/[^+\\d]/g, "")}`}>{p}{i < (row.phones?.length||1)-1 ? ',' : ''}</a>
                          ))}
                          {row.fax && <span>, {row.fax}(Fax)</span>}
                        </div>
                      </div>
                      {(row.emails?.length || row.email) && (
                        <div className="flex items-start gap-2">
                          <svg className="h-5 w-5 text-gray-700 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm-1.4 4.25l-6.13 4.09a1 1 0 01-1.06 0L5.28 8.25a1 1 0 111.1-1.66L12 10.3l5.62-3.7a1 1 0 111.1 1.66z"/></svg>
                          <div className="flex flex-wrap gap-x-2 gap-y-1">
                            {(row.emails || [row.email]).filter(Boolean).map((e, i) => (
                              <a key={i} className="hover:underline" href={`mailto:${String(e).replace(/\[at\]/g,'@').replace(/\[dot\]/g,'.')}`}>{e}{i < (row.emails?.length||1)-1 ? ',' : ''}</a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: address */}
                    {row.address && (
                      <div className="text-sm text-gray-800 flex items-start gap-2">
                        <svg className="h-5 w-5 text-gray-700 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"/></svg>
                        <span>{row.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredByAlpha.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-600 text-sm">No results found.</div>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 select-none px-0">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`px-2 py-1 text-[#123a6b] ${page === 1 ? "opacity-30 cursor-not-allowed" : "hover:underline"}`}
              disabled={page === 1}
              aria-label="Previous page"
            >
              ‹
            </button>

            {(() => {
              const items = [];
              const max = totalPages;
              const push = (x) => items.push(x);
              const range = (s, e) => { for (let i = s; i <= e; i++) push(i); };
              if (max <= 7) {
                range(1, max);
              } else {
                const start = Math.max(1, page - 1);
                const end = Math.min(max, page + 1);
                push(1);
                if (start > 2) push("...");
                range(start, end);
                if (end < max - 1) push("...");
                push(max);
              }
              return items.map((p, idx) =>
                p === "..." ? (
                  <span key={`e-${idx}`} className="px-2 py-1 text-gray-500">…</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(Number(p))}
                    className={`px-3 py-1 rounded-full ${page === p ? "bg-[#bacbff] text-[#123a6b] font-bold" : "text-[#123a6b] hover:underline"}`}
                  >
                    {p}
                  </button>
                )
              );
            })()}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={`px-2 py-1 text-[#123a6b] ${page === totalPages ? "opacity-30 cursor-not-allowed" : "hover:underline"}`}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}