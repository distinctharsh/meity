
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

export default function EducationPage() {
  const router = useRouter();

  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [state, setState] = useState("");
  const [level, setLevel] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);

  const perPage = 6;

  useEffect(() => {
    const fetchPractices = async () => {
      try {
        const response = await fetch("/api/good-practices");

        if (!response.ok) {
          throw new Error("Failed to fetch practices");
        }

        const data = await response.json();

        setPractices(
          data.filter(
            (item) =>
              item.category?.toLowerCase() === "education"
          )
        );
      } catch (error) {
        console.error("Education fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPractices();
  }, []);

  const states = [
    ...new Set(practices.map((item) => item.state).filter(Boolean)),
  ];

  const levels = [
    ...new Set(practices.map((item) => item.level).filter(Boolean)),
  ];

  const beneficiaries = [
    ...new Set(
      practices.map((item) => item.beneficiaries).filter(Boolean)
    ),
  ];

  const filtered = useMemo(() => {
    let list = [...practices];

    if (query.trim()) {
      const q = query.toLowerCase();

      list = list.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.state?.toLowerCase().includes(q)
      );
    }

    if (state) {
      list = list.filter((item) => item.state === state);
    }

    if (level) {
      list = list.filter((item) => item.level === level);
    }

    if (beneficiary) {
      list = list.filter(
        (item) => item.beneficiaries === beneficiary
      );
    }

    if (sort === "Newest") {
      list.sort((a, b) => Number(b.year) - Number(a.year));
    } else if (sort === "Oldest") {
      list.sort((a, b) => Number(a.year) - Number(b.year));
    } else {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [practices, query, state, level, beneficiary, sort]);

  const totalPages = Math.ceil(filtered.length / perPage);

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const clearFilters = () => {
    setQuery("");
    setState("");
    setLevel("");
    setBeneficiary("");
    setSort("Newest");
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <>

      <main className="education-page">

        {/* HERO */}
        <header className="education-hero">
          <div className="education-hero-art" />

          <div className="education-hero-inner">
            <div className="education-book-icon">◫</div>

            <div>
              <h1>Education</h1>
              <p>
                Showcasing education initiatives that strengthen
                learning, expand opportunity, and improve delivery
                through inclusive, evidence-informed approaches.
              </p>
            </div>
          </div>
        </header>

        <div className="education-container">

          {/* FILTERS */}
          <form className="education-filters" onSubmit={handleSearch}>

            <label className="education-search">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search in Education"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </label>

            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setPage(1);
              }}
            >
              <option value="">State/UT</option>
              {states.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Level of government</option>
              <option value="Central">Central</option>
              <option value="State/UT">State/UT</option>
              <option value="District">District</option>
              {levels
                .filter((item) => !["Central", "State/UT", "District"].includes(item))
                .map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
            </select>

            <select
              value={beneficiary}
              onChange={(e) => {
                setBeneficiary(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Beneficiary group</option>
              {beneficiaries.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <button className="education-search-button" type="submit">
              ⌕ &nbsp; Search
            </button>
          </form>

          {/* TOOLBAR */}
          <div className="education-toolbar">
            <strong>
              {loading
                ? "Loading practices..."
                : `Showing ${
                    filtered.length ? (page - 1) * perPage + 1 : 0
                  }–${Math.min(page * perPage, filtered.length)} of ${
                    filtered.length
                  } practices`}
            </strong>

            <label>
              Sort by:
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="Alphabetical">Alphabetical</option>
              </select>
            </label>
          </div>

          {/* CARDS */}
          {loading ? (
            <div className="education-cards">
              {[1, 2, 3].map((item) => (
                <div className="education-skeleton" key={item} />
              ))}
            </div>
          ) : paginated.length > 0 ? (
            <section className="education-cards">

              {paginated.map((item) => (
                <article className="education-card" key={item.id}>

                  <div className="education-card-image">
                    <img
                      src={item.image}
                      alt={item.title}
                    />
                  </div>

                  <div className="education-card-body">

                    <span className="education-category">
                      Education
                    </span>

                    <h2>{item.title}</h2>

                    <p className="education-location">
                      <span>●</span>
                      {item.state}
                    </p>

                    <p className="education-description">
                      {item.description}
                    </p>

                    <button
                      className="education-card-arrow"
                      onClick={() =>
                        router.push(`/good-practices/${item.id}`)
                      }
                      aria-label={`View ${item.title}`}
                    >
                      →
                    </button>

                  </div>
                </article>
              ))}

            </section>
          ) : (
            <div className="education-empty">
              <h2>No Education Practices Found</h2>
              <p>Try changing your search or filters.</p>
              <button onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}

          {/* PAGINATION */}
          {!loading && totalPages > 1 && (
            <nav className="education-pagination">

              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ‹ Previous
              </button>

              <span>{page}</span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next ›
              </button>

            </nav>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
