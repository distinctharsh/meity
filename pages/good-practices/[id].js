
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

export default function GoodPracticeDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [practice, setPractice] = useState(null);
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchPractice = async () => {
      try {
        const response = await fetch("/api/good-practices");

        if (!response.ok) {
          throw new Error("Failed to fetch practices");
        }

        const data = await response.json();

        setPractices(data);

        const selected = data.find(
          (item) => String(item.id) === String(id)
        );

        setPractice(selected || null);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPractice();
  }, [router.isReady, id]);

  if (!router.isReady || loading) {
    return (
      <>
        <PageHeader pagePath="/good-practices" />
        <div className="practice-page">
          <p className="practice-loading">Loading practice details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!practice) {
    return (
      <>
        <PageHeader pagePath="/good-practices" />

        <div className="practice-page">
          <div className="practice-not-found">
            <h2>Practice Not Found</h2>

            <button
              onClick={() => router.push("/good-practices")}
            >
              Back to Good Practices
            </button>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  const galleryImages = practice.gallery?.length
    ? practice.gallery
    : [practice.image];

  const impact = practice.impact || {};
  const contact = practice.contact || {};

  const similarPractices = practices.filter(
    (item) =>
      String(item.id) !== String(practice.id) &&
      item.category === practice.category
  );

  const stats = [
    {
      value: impact.numeracy,
      suffix: "%",
      label: "of assessed students improved in Numeracy",
      note: impact.assessment || "Assessment data",
      className: "stat-green",
      icon: "◎",
    },
    {
      value: impact.literacy,
      suffix: "%",
      label: "of assessed students improved in Literacy",
      note: impact.assessment || "Assessment data",
      className: "stat-blue",
      icon: "▱",
    },
    {
      value: impact.cases,
      suffix: "",
      label: "student cases identified for support",
      note: impact.baseline || "Baseline data",
      className: "stat-orange",
      icon: "♟",
    },
    {
      value: impact.statesCovered,
      suffix: "",
      label: "States/UTs at foundational stage",
      note: impact.source || "Coverage data",
      className: "stat-violet",
      icon: "♜",
    },
  ];

  const numeracy = Math.min(
    Math.max(Number(impact.numeracy) || 0, 0),
    100
  );

  const literacy = Math.min(
    Math.max(Number(impact.literacy) || 0, 0),
    100
  );

  return (
    <>
      <PageHeader pagePath="/good-practices" />

      <main className="practice-page">

        {/* DETAIL CHIPS */}

        <nav className="chips" aria-label="Practice details">

          <span className="chip chip-purple">
            <span className="chip-icon">▣</span>
            {practice.category}
          </span>

          <span className="chip">
            <span className="chip-icon">⌖</span>
            {practice.state}
          </span>

          <span className="chip">
            <span className="chip-icon purple">♙</span>
            {practice.level || "State/UT"}
          </span>

          <span className="chip">
            <span className="chip-icon">♧</span>
            {practice.beneficiaries || "Beneficiaries"}
          </span>

        </nav>

        {/* HERO */}

        <header className="practice-hero">

          <div className="hero-copy">

            <h1>{practice.title}</h1>

            <p>{practice.description}</p>

          </div>

          <img
            src={practice.image}
            alt={practice.title}
          />

        </header>

        {/* GALLERY */}

        <section className="section gallery-section" id="gallery">

          <h2>
            <span className="section-icon">▧</span>
            Gallery
          </h2>

          <div className="gallery">

            <figure className="gallery-main">

              <img
                src={galleryImages[0]}
                alt={practice.title}
                onClick={() => setSelectedImage(galleryImages[0])}
              />

              <button
                className="expand"
                onClick={() => setSelectedImage(galleryImages[0])}
                aria-label="Expand image"
              >
                ⛶
              </button>

              <figcaption>
                {practice.galleryCaptions?.[0] || practice.title}
              </figcaption>

            </figure>

            <div className="gallery-side">

              {[1, 2].map((index) => (
                <figure key={index}>

                  {galleryImages[index] ? (
                    <>
                      <img
                        src={galleryImages[index]}
                        alt={`${practice.title} gallery ${index}`}
                        onClick={() =>
                          setSelectedImage(galleryImages[index])
                        }
                      />

                      <button
                        className="expand"
                        onClick={() =>
                          setSelectedImage(galleryImages[index])
                        }
                        aria-label="Expand image"
                      >
                        ⛶
                      </button>

                      <figcaption>
                        {practice.galleryCaptions?.[index] ||
                          `Gallery image ${index + 1}`}
                      </figcaption>
                    </>
                  ) : (
                    <div className="gallery-placeholder">
                      Image coming soon
                    </div>
                  )}

                </figure>
              ))}

            </div>

          </div>

        </section>

        {/* IMPACT */}

        <section className="section impact-section" id="impact">

          <h2>
            <span className="section-icon">▥</span>
            Impact at a glance
          </h2>

          <div className="stats">

            {stats.map((stat, index) => (

              <article
                className={`stat ${stat.className}`}
                key={index}
              >

                <div className="stat-icon">
                  {stat.icon}
                </div>

                <div>

                  <strong>
                    {stat.value ?? "—"}
                    {stat.value != null ? stat.suffix : ""}
                  </strong>

                  <b>{stat.label}</b>

                  <small>{stat.note}</small>

                </div>

              </article>

            ))}

          </div>

          {/* CHART */}

          <div className="chart-card">

            <div className="chart-area">

              <h3>
                Share of assessed students who improved
              </h3>

              <div className="bar-row">

                <span>Numeracy</span>

                <div className="bar-track">

                  <div
                    className="bar green"
                    style={{ width: `${numeracy}%` }}
                  >
                    {impact.numeracy != null && (
                      <b>{impact.numeracy}%</b>
                    )}
                  </div>

                </div>

              </div>

              <div className="bar-row">

                <span>Literacy</span>

                <div className="bar-track">

                  <div
                    className="bar orange"
                    style={{ width: `${literacy}%` }}
                  >
                    {impact.literacy != null && (
                      <b>{impact.literacy}%</b>
                    )}
                  </div>

                </div>

              </div>

              <div className="axis">
                <span>0%</span>
                <span>20%</span>
                <span>40%</span>
                <span>60%</span>
                <span>80%</span>
                <span>100%</span>
              </div>

            </div>

            <aside className="chart-note">

              <b>
                <span>ⓘ</span>
                Chart: Text version
              </b>

              <p>
                {impact.chartDescription ||
                  "Impact data will be displayed here when available."}
              </p>

            </aside>

          </div>

        </section>

        {/* CONTACT AND REPORT */}

        <div className="two-columns">

          <section className="section" id="contact">

            <h2>
              <span className="section-icon">♙</span>
              Contact the nodal officer
            </h2>

            <div className="contact-card">

              <div className="avatar">♙</div>

              <div className="contact-details">

                <h3>{contact.name || "Nodal Officer"}</h3>

                <p>
                  {contact.designation || "Programme Officer"}
                  <br />
                  {contact.department || practice.state}
                </p>

                <div className="contact-links">

                  {contact.email && (
                    <a href={`mailto:${contact.email}`}>
                      ✉ &nbsp;{contact.email}
                    </a>
                  )}

                  {contact.phone && (
                    <a href={`tel:${contact.phone}`}>
                      ♧ &nbsp;{contact.phone}
                    </a>
                  )}

                </div>

              </div>

            </div>

          </section>

          <section className="section" id="report">

            <h2>
              <span className="section-icon">▤</span>
              Report
            </h2>

            <div className="report-card">

              {practice.reportUrl ? (

                <a
                  className="download"
                  href={practice.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>⇩</span>
                  Download detailed report (PDF)
                </a>

              ) : (

                <p>Report will be available soon.</p>

              )}

            </div>

          </section>

        </div>

        {/* SIMILAR PRACTICES */}

        <section className="section similar-section">

          <h2>
            <span className="section-icon">▱</span>
            Similar practices
          </h2>

          {similarPractices.length > 0 ? (

            similarPractices.map((item) => (

              <article className="similar-card" key={item.id}>

                <img
                  src={item.image}
                  alt={item.title}
                />

                <div className="similar-content">

                  <span className="tag">
                    {item.category}
                  </span>

                  <h3>{item.title}</h3>

                  <p className="location">
                    ⌖ &nbsp;{item.state}
                  </p>

                  <p>{item.description}</p>

                </div>

                <button
                  className="arrow"
                  onClick={() =>
                    router.push(`/good-practices/${item.id}`)
                  }
                  aria-label={`View ${item.title}`}
                >
                  →
                </button>

              </article>

            ))

          ) : (

            <p className="similar-empty">
              No similar practices available.
            </p>

          )}

        </section>

      </main>

      {/* FULLSCREEN GALLERY */}

      {selectedImage && (

        <div
          className="image-lightbox"
          onClick={() => setSelectedImage(null)}
        >

          <button
            className="lightbox-close"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>

          <img
            src={selectedImage}
            alt="Full size gallery"
            onClick={(e) => e.stopPropagation()}
          />

        </div>

      )}

      <Footer />

    </>
  );
}