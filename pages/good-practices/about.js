
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

export default function AboutGoodPractices() {
  const steps = [
    {
      title: "Step 1",
      description: "Notes on good practices are received through NCGG.",
      color: "bg-sky-50",
      iconColor: "text-sky-600",
      icon: "description",
    },
    {
      title: "Step 2",
      description: "NCGG examines each note for relevance and significance.",
      color: "bg-orange-50",
      iconColor: "text-orange-600",
      icon: "search",
    },
    {
      title: "Step 3",
      description: "External validation is undertaken.",
      color: "bg-green-50",
      iconColor: "text-green-600",
      icon: "verified_user",
    },
    {
      title: "Step 4",
      description:
        "A Scrutiny Committee in the Cabinet Secretariat selects the practices to be published on this portal.",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      icon: "groups",
    },
  ];

  return (
    <>

      <main className="bg-white min-h-screen text-[#07183f]">
        {/* HERO */}
        <section className="hero relative overflow-hidden text-white">

          {/* Background image from CSS */}
          <div className="hero-background"></div>

          <div className="hero-inner">
            <div className="hero-icon">
              <span>i</span>
            </div>

            <div className="hero-heading">
              <h1>About</h1>
              <p>
                About the Good Practices of Governance initiative
              </p>
            </div>
          </div>

          {/* Decorative waves */}
          <div className="wave wave-orange"></div>
          <div className="wave wave-blue"></div>

        </section>

        <div className="max-w-7xl mx-auto px-5 md:px-8">
          {/* INTRODUCTION */}
          <section className="grid grid-cols-[4px_1fr] gap-5 md:gap-12 py-10 md:py-12 md:px-[8%]">
            <div className="bg-orange-500 rounded-full" />

            <div className="space-y-5 text-[#10172b] text-sm md:text-lg font-medium leading-relaxed">
              <p>
                Public administration in the Centre, the States and the Union
                Territories has produced a wealth of experience, innovation
                and practical learning. When such experience is documented
                and shared, officers and institutions can learn from one
                another, and governance improves.
              </p>

              <p>
                Officers of the Central and State Governments were invited
                and encouraged to submit notes on good practices and
                innovative initiatives in public administration through the
                National Centre for Good Governance (NCGG). The initiative
                covers any area of public administration, from simple
                procedural improvements to complex systemic reforms.
              </p>

              <p>
                The notes received are examined by NCGG for relevance and
                significance, and are then subjected to external validation.
                They are thereafter placed before a Scrutiny Committee of
                senior officers in the Cabinet Secretariat. The practices
                finally selected are published on this portal.
              </p>

              <p>
                Each practice is presented in brief, with its category, key
                figures, photographs, the contact details of the nodal
                officer and a detailed report, so that other officers,
                departments and regions as well as interested citizens may
                study it and, where suitable, adapt it to their own context.
              </p>
            </div>
          </section>

          {/* SELECTION PROCESS */}
          <section className="border-t border-gray-200 py-8">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 flex items-center gap-4">
              <span className="text-orange-500 text-4xl">▱</span>
              Selection process
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className={`${step.color} min-h-[185px] rounded-2xl p-6 relative`}
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-14 h-14 rounded-xl bg-white flex items-center justify-center ${step.iconColor}`}>
                      <span className="material-symbols-outlined text-4xl">
                        {step.icon}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-[#080f23] text-base leading-relaxed font-medium">
                    {step.description}
                  </p>

                  {index !== 3 && (
                    <span className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-orange-500 text-orange-600 items-center justify-center text-2xl">
                      →
                    </span>
                  )}
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
