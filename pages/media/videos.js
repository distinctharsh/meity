import Footer from "@/components/Footer";

export default function Videos() {
  return (
    <>
      <main id="main">
        {/* Videos Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Video Gallery
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Speeches, interviews, and promotional content
              </p>
            </div>
          </div>
        </section>

        {/* Featured Videos */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Featured Videos
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-video bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-6xl">play_circle</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                      Digital India Summit 2024 - Keynote Address
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Hon'ble Minister's keynote address at the Digital India Summit 2024, outlining the vision for India's digital future.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Duration: 45 minutes</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Watch Now
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-video bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-6xl">play_circle</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                      Cybersecurity Framework Launch
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Official launch of the new cybersecurity framework with detailed explanation of its components and benefits.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Duration: 30 minutes</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Watch Now
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-video bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-6xl">play_circle</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                      Startup India Success Stories
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Inspiring success stories of startups that have benefited from the Startup India initiative.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Duration: 25 minutes</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Watch Now
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-video bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-6xl">play_circle</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                      E-Governance Transformation
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Documentary showcasing the transformation of government services through digital technology.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Duration: 40 minutes</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Watch Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Video Categories
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">mic</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Speeches</h3>
                  <p className="text-gray-600 mb-4">
                    Official speeches and addresses by ministers and officials
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">50+</span> videos
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">interview</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Interviews</h3>
                  <p className="text-gray-600 mb-4">
                    Media interviews and press conferences
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">75+</span> videos
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">campaign</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Promotional</h3>
                  <p className="text-gray-600 mb-4">
                    Promotional videos and awareness campaigns
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">100+</span> videos
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">event</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Events</h3>
                  <p className="text-gray-600 mb-4">
                    Event coverage and highlights
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">200+</span> videos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Videos */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Recent Videos
              </h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        Digital India Progress Update - March 2024
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Monthly progress update on Digital India initiatives and achievements.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 25, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Duration: 15 minutes</span>
                      </div>
                    </div>
                    <button className="ml-4 bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                      Watch
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        Startup India Success Story - TechCorp
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Success story of TechCorp, a startup that has grown from a small idea to a major technology company.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 22, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Duration: 20 minutes</span>
                      </div>
                    </div>
                    <button className="ml-4 bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                      Watch
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        Cybersecurity Awareness Campaign
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Educational video on cybersecurity best practices for citizens and businesses.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 20, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Duration: 10 minutes</span>
                      </div>
                    </div>
                    <button className="ml-4 bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                      Watch
                    </button>
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
