import RecentDocs from "@/components/RecentDocs";
import Footer from "@/components/Footer";

export default function Documents() {
  return (
    <>
      <main id="main">
        {/* Documents Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Documents & Resources
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Access official documents, policies, reports, and publications
              </p>
            </div>
          </div>
        </section>

        {/* Main Recent Docs Component */}
        <RecentDocs />

        {/* Document Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Document Categories
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">policy</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Policies</h3>
                  <p className="text-gray-600 mb-4">
                    Official government policies and guidelines
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">150+</span> documents
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">gavel</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Acts & Rules</h3>
                  <p className="text-gray-600 mb-4">
                    Legal frameworks and regulatory documents
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">75+</span> documents
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">assessment</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Reports</h3>
                  <p className="text-gray-600 mb-4">
                    Annual reports and performance assessments
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">200+</span> documents
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">campaign</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Circulars</h3>
                  <p className="text-gray-600 mb-4">
                    Official circulars and notifications
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">300+</span> documents
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Documents */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Featured Documents
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mr-6">
                      <span className="material-symbols-outlined text-red-600 text-2xl">description</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        Digital India Policy 2024
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Comprehensive policy framework for India's digital transformation
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 15, 2024</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 2.5 MB</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-[#123a6b] text-white py-2 px-4 rounded-lg hover:bg-[#0f2d52] transition-colors">
                    Download Document
                  </button>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-6">
                      <span className="material-symbols-outlined text-blue-600 text-2xl">security</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        Cybersecurity Guidelines 2024
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Updated security protocols and best practices for digital infrastructure
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: February 28, 2024</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 1.8 MB</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-[#123a6b] text-white py-2 px-4 rounded-lg hover:bg-[#0f2d52] transition-colors">
                    Download Document
                  </button>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mr-6">
                      <span className="material-symbols-outlined text-green-600 text-2xl">trending_up</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        Annual Report 2023-24
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Comprehensive annual performance report of MEITY initiatives
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: April 1, 2024</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 5.2 MB</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-[#123a6b] text-white py-2 px-4 rounded-lg hover:bg-[#0f2d52] transition-colors">
                    Download Document
                  </button>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mr-6">
                      <span className="material-symbols-outlined text-purple-600 text-2xl">rocket_launch</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        Startup India Action Plan
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Detailed action plan for promoting startup ecosystem in India
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: January 20, 2024</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 3.1 MB</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-[#123a6b] text-white py-2 px-4 rounded-lg hover:bg-[#0f2d52] transition-colors">
                    Download Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-[#123a6b]">
                Search Documents
              </h2>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123a6b]"
                  />
                  <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123a6b]">
                    <option>All Categories</option>
                    <option>Policies</option>
                    <option>Acts & Rules</option>
                    <option>Reports</option>
                    <option>Circulars</option>
                  </select>
                  <button className="bg-[#123a6b] text-white px-6 py-3 rounded-lg hover:bg-[#0f2d52] transition-colors">
                    Search
                  </button>
                </div>
                <div className="text-center text-gray-600">
                  <span className="material-symbols-outlined text-4xl mb-2 block">search</span>
                  <p>Enter keywords to search through our document library</p>
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
