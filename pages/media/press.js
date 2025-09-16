import Footer from "@/components/Footer";

export default function PressReleases() {
  return (
    <>
      <main id="main">
        {/* Press Releases Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Press Releases
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Official announcements and press statements
              </p>
            </div>
          </div>
        </section>

        {/* Recent Press Releases */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Recent Press Releases
              </h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        MEITY Launches New Digital Governance Initiative
                      </h3>
                      <p className="text-gray-600 mb-3">
                        The Cabinet Secretariat announces a comprehensive digital governance framework to enhance citizen services and government efficiency across all departments.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 25, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Press Release</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 0.5 MB</span>
                      </div>
                    </div>
                    <button className="ml-4 bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                      Read More
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        Cybersecurity Framework Updated for 2024
                      </h3>
                      <p className="text-gray-600 mb-3">
                        New cybersecurity guidelines and protocols announced to strengthen India's digital infrastructure protection and ensure data sovereignty.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 22, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Press Release</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 0.8 MB</span>
                      </div>
                    </div>
                    <button className="ml-4 bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                      Read More
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        Startup India Program Reaches New Milestone
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Over 1 lakh startups registered under the Startup India initiative, marking a significant achievement in entrepreneurship promotion and innovation ecosystem development.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 20, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Press Release</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 0.6 MB</span>
                      </div>
                    </div>
                    <button className="ml-4 bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                      Read More
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        Digital India Mission Achieves 99.9% Uptime
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Digital India Mission achieves 99.9% uptime across all services, demonstrating the robustness and reliability of India's digital infrastructure.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 18, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Press Release</span>
                        <span className="mx-2">•</span>
                        <span>PDF • 0.4 MB</span>
                      </div>
                    </div>
                    <button className="ml-4 bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Press Release Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Press Release Categories
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">newspaper</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">General</h3>
                  <p className="text-gray-600 mb-4">
                    General announcements and updates
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">100+</span> releases
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">policy</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Policy</h3>
                  <p className="text-gray-600 mb-4">
                    Policy announcements and updates
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">50+</span> releases
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">event</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Events</h3>
                  <p className="text-gray-600 mb-4">
                    Event announcements and coverage
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">75+</span> releases
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">trending_up</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Achievements</h3>
                  <p className="text-gray-600 mb-4">
                    Milestone achievements and success stories
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">60+</span> releases
                  </div>
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
                Search Press Releases
              </h2>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search press releases..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123a6b]"
                  />
                  <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123a6b]">
                    <option>All Categories</option>
                    <option>General</option>
                    <option>Policy</option>
                    <option>Events</option>
                    <option>Achievements</option>
                  </select>
                  <button className="bg-[#123a6b] text-white px-6 py-3 rounded-lg hover:bg-[#0f2d52] transition-colors">
                    Search
                  </button>
                </div>
                <div className="text-center text-gray-600">
                  <span className="material-symbols-outlined text-4xl mb-2 block">search</span>
                  <p>Enter keywords to search through our press release archive</p>
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
