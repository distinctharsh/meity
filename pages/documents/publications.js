import Footer from "@/components/Footer";

export default function Publications() {
  return (
    <>
      <main id="main">
        {/* Publications Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Publications
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Research papers, white papers, and technical publications
              </p>
            </div>
          </div>
        </section>

        {/* Featured Publications */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Featured Publications
              </h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        "Digital Transformation in India: A Comprehensive Analysis"
                      </h3>
                      <p className="text-gray-600 mb-3">
                        A detailed analysis of India's digital transformation journey, covering key initiatives, 
                        challenges, and future opportunities in the technology sector.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 20, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Research Paper</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 2.8 MB</span>
                      </div>
                    </div>
                    <button className="ml-4 bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                      Download
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        "Cybersecurity Framework for Digital India"
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Technical white paper outlining the comprehensive cybersecurity framework implemented 
                        to protect India's digital infrastructure and citizen data.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 15, 2024</span>
                        <span className="mx-2">•</span>
                        <span>White Paper</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 1.9 MB</span>
                      </div>
                    </div>
                    <button className="ml-4 bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                      Download
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        "AI and Machine Learning in Government Services"
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Research paper exploring the implementation of artificial intelligence and machine 
                        learning technologies in government service delivery and citizen engagement.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 10, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Research Paper</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 3.2 MB</span>
                      </div>
                    </div>
                    <button className="ml-4 bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                      Download
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        "Blockchain Technology in E-Governance"
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Technical publication examining the potential and implementation of blockchain 
                        technology in government processes and citizen services.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 5, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Technical Paper</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 2.5 MB</span>
                      </div>
                    </div>
                    <button className="ml-4 bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Publication Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Publication Categories
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">science</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Research Papers</h3>
                  <p className="text-gray-600 mb-4">
                    Academic research and analysis on technology trends and digital transformation.
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">50+</span> papers
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">description</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">White Papers</h3>
                  <p className="text-gray-600 mb-4">
                    Technical documents outlining policies, frameworks, and implementation strategies.
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">25+</span> papers
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">engineering</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Technical Papers</h3>
                  <p className="text-gray-600 mb-4">
                    Detailed technical documentation and implementation guides for various technologies.
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">75+</span> papers
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">trending_up</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Case Studies</h3>
                  <p className="text-gray-600 mb-4">
                    Real-world case studies and success stories from digital transformation initiatives.
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">30+</span> studies
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
