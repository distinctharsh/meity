import SocialMediaFeed from "@/components/SocialMediaFeed";
import Footer from "@/components/Footer";

export default function Media() {
  return (
    <>
      <main id="main">
        {/* Media Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Media & Communications
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Stay updated with latest news, press releases, and multimedia content
              </p>
            </div>
          </div>
        </section>

        {/* Main Social Media Feed Component */}
        <SocialMediaFeed />

        {/* Media Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Media Resources
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">newspaper</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Press Releases</h3>
                  <p className="text-gray-600 mb-4">
                    Official announcements and press statements
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">50+</span> this month
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">photo_library</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Photo Gallery</h3>
                  <p className="text-gray-600 mb-4">
                    Official photographs and event coverage
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">500+</span> photos
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">play_circle</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Videos</h3>
                  <p className="text-gray-600 mb-4">
                    Speeches, interviews, and promotional content
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">100+</span> videos
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">podcast</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Podcasts</h3>
                  <p className="text-gray-600 mb-4">
                    Audio content and interviews
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">25+</span> episodes
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">event</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Events</h3>
                  <p className="text-gray-600 mb-4">
                    Upcoming and past event information
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">20+</span> events
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">download</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Downloads</h3>
                  <p className="text-gray-600 mb-4">
                    Logos, templates, and media assets
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">100+</span> assets
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Featured Content
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-video bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-6xl">play_circle</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                      Digital India Summit 2024
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Watch the highlights from the annual Digital India Summit featuring key announcements and policy updates.
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
                    <span className="material-symbols-outlined text-white text-6xl">photo_library</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                      Minister's Visit to Tech Hub
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Photo gallery from the Hon'ble Minister's visit to the new technology innovation center.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">25 photos</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        View Gallery
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Latest Press Releases
              </h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                        Cabinet Secretariat Launches New Digital Governance Initiative
                      </h3>
                      <p className="text-gray-600 mb-3">
                        The Ministry announces a comprehensive digital governance framework to enhance citizen services and government efficiency.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 20, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Press Release</span>
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
                        New cybersecurity guidelines and protocols announced to strengthen India's digital infrastructure protection.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 18, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Press Release</span>
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
                        Over 1 lakh startups registered under the Startup India initiative, marking a significant achievement in entrepreneurship promotion.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                        <span>Published: March 15, 2024</span>
                        <span className="mx-2">•</span>
                        <span>Press Release</span>
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
      </main>
      <Footer />
    </>
  );
}
