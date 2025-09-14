import Footer from "@/components/Footer";

export default function Reports() {
  return (
    <>
      <main id="main">
        {/* Reports Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Reports & Publications
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Comprehensive reports and analysis on India's digital transformation
              </p>
            </div>
          </div>
        </section>

        {/* Featured Reports */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Featured Reports
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="material-symbols-outlined text-red-600 text-xl">description</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#123a6b]">Annual Report 2023-24</h3>
                        <p className="text-sm text-gray-500">Published: April 1, 2024</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Comprehensive annual performance report covering all major initiatives and achievements of the Ministry.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">PDF • 5.2 MB</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="material-symbols-outlined text-blue-600 text-xl">trending_up</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#123a6b]">Digital India Progress Report</h3>
                        <p className="text-sm text-gray-500">Published: March 15, 2024</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Detailed analysis of Digital India initiative progress and impact across various sectors.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">PDF • 3.8 MB</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="material-symbols-outlined text-green-600 text-xl">security</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#123a6b]">Cybersecurity Assessment 2024</h3>
                        <p className="text-sm text-gray-500">Published: February 28, 2024</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Comprehensive assessment of India's cybersecurity posture and recommendations for improvement.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">PDF • 2.1 MB</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="material-symbols-outlined text-purple-600 text-xl">rocket_launch</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#123a6b]">Startup India Impact Report</h3>
                        <p className="text-sm text-gray-500">Published: January 20, 2024</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Analysis of Startup India initiative impact on entrepreneurship and innovation ecosystem.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">PDF • 4.5 MB</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Report Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Report Categories
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-[#123a6b]">Annual Reports</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Annual Performance Report</li>
                    <li>• Financial Statements</li>
                    <li>• Audit Reports</li>
                    <li>• Compliance Reports</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-[#123a6b]">Policy Reports</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Policy Impact Analysis</li>
                    <li>• Implementation Reports</li>
                    <li>• Stakeholder Feedback</li>
                    <li>• Review Reports</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-[#123a6b]">Research Reports</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Technology Trends</li>
                    <li>• Market Analysis</li>
                    <li>• Innovation Studies</li>
                    <li>• Future Outlook</li>
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
                Search Reports
              </h2>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123a6b]"
                  />
                  <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123a6b]">
                    <option>All Categories</option>
                    <option>Annual Reports</option>
                    <option>Policy Reports</option>
                    <option>Research Reports</option>
                  </select>
                  <button className="bg-[#123a6b] text-white px-6 py-3 rounded-lg hover:bg-[#0f2d52] transition-colors">
                    Search
                  </button>
                </div>
                <div className="text-center text-gray-600">
                  <span className="material-symbols-outlined text-4xl mb-2 block">search</span>
                  <p>Enter keywords to search through our report library</p>
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
