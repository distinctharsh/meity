import Footer from "@/components/Footer";

export default function Circulars() {
  return (
    <>
      <main id="main">
        {/* Circulars Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Circulars & Notifications
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Official circulars, notifications, and administrative orders
              </p>
            </div>
          </div>
        </section>

        {/* Recent Circulars */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Recent Circulars
              </h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        Circular No. 15/2024 - Digital India Guidelines Update
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Updated guidelines for Digital India initiative implementation across all government departments and agencies.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 25, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Circular</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 1.2 MB</span>
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
                        Notification No. 12/2024 - Cybersecurity Compliance Requirements
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Mandatory cybersecurity compliance requirements for all government IT systems and data centers.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 22, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Notification</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 0.8 MB</span>
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
                        Circular No. 14/2024 - Startup India Registration Process
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Updated registration process and eligibility criteria for Startup India initiative participation.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 20, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Circular</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 1.5 MB</span>
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
                        Notification No. 11/2024 - E-Governance Standards Update
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Updated technical standards and specifications for e-governance applications and services.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 18, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Notification</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 2.1 MB</span>
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

        {/* Circular Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Circular Categories
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-[#123a6b]">Administrative</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Office Orders</li>
                    <li>• Staff Notifications</li>
                    <li>• Administrative Guidelines</li>
                    <li>• Process Updates</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-[#123a6b]">Technical</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Technical Standards</li>
                    <li>• Implementation Guidelines</li>
                    <li>• Security Protocols</li>
                    <li>• System Requirements</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-[#123a6b]">Policy</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Policy Updates</li>
                    <li>• Compliance Requirements</li>
                    <li>• Regulatory Changes</li>
                    <li>• Implementation Directives</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-[#123a6b]">
                Search Circulars
              </h2>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search circulars..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123a6b]"
                  />
                  <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123a6b]">
                    <option>All Categories</option>
                    <option>Administrative</option>
                    <option>Technical</option>
                    <option>Policy</option>
                  </select>
                  <button className="bg-[#123a6b] text-white px-6 py-3 rounded-lg hover:bg-[#0f2d52] transition-colors">
                    Search
                  </button>
                </div>
                <div className="text-center text-gray-600">
                  <span className="material-symbols-outlined text-4xl mb-2 block">search</span>
                  <p>Enter keywords to search through our circular library</p>
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
