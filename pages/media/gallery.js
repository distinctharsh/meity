import Footer from "@/components/Footer";

export default function Gallery() {
  return (
    <>
      <main id="main">
        {/* Gallery Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Photo Gallery
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Capturing moments from India's digital transformation journey
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Gallery Categories
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">event</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Events</h3>
                  <p className="text-gray-600 mb-4">
                    Official events, conferences, and ceremonies
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">200+</span> photos
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">person</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Leadership</h3>
                  <p className="text-gray-600 mb-4">
                    Photos of ministers and senior officials
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">150+</span> photos
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">computer</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Technology</h3>
                  <p className="text-gray-600 mb-4">
                    Technology demonstrations and innovations
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">300+</span> photos
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">groups</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Citizen Engagement</h3>
                  <p className="text-gray-600 mb-4">
                    Citizen interactions and public programs
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">250+</span> photos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Photos */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Featured Photos
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-video bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-6xl">photo_library</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#123a6b] mb-2">
                      Digital India Summit 2024
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Highlights from the annual Digital India Summit featuring key announcements and policy updates.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">25 photos</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        View Gallery
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
                      <span className="text-sm text-gray-500">18 photos</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        View Gallery
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
                      Startup India Showcase
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Showcase of innovative startups and their solutions at the Startup India exhibition.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">32 photos</span>
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

        {/* Recent Photos */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Recent Photos
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-square bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-4xl">photo_library</span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-[#123a6b] mb-1">Event Photo 1</h4>
                    <p className="text-sm text-gray-500">March 25, 2024</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-square bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-4xl">photo_library</span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-[#123a6b] mb-1">Event Photo 2</h4>
                    <p className="text-sm text-gray-500">March 22, 2024</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-square bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-4xl">photo_library</span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-[#123a6b] mb-1">Event Photo 3</h4>
                    <p className="text-sm text-gray-500">March 20, 2024</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-square bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-4xl">photo_library</span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-[#123a6b] mb-1">Event Photo 4</h4>
                    <p className="text-sm text-gray-500">March 18, 2024</p>
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
