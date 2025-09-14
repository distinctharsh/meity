import AboutSection from "@/components/AboutSection";
import PmQuote from "@/components/PmQuote";
import Footer from "@/components/Footer";

export default function Ministry() {
  return (
    <>
      <main id="main">
        {/* Ministry Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Ministry of Electronics & Information Technology
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Driving India's Digital Transformation
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
                  <h3 className="text-2xl font-bold">2016</h3>
                  <p className="text-sm opacity-80">Established</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
                  <h3 className="text-2xl font-bold">₹10,000+ Cr</h3>
                  <p className="text-sm opacity-80">Budget 2024-25</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
                  <h3 className="text-2xl font-bold">50+</h3>
                  <p className="text-sm opacity-80">Schemes & Programs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <AboutSection />

        {/* PM Quote */}
        <PmQuote />

        {/* Mission & Vision */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mr-4">
                      <span className="material-symbols-outlined text-white text-2xl">visibility</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#123a6b]">Our Vision</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    To make India a global leader in electronics and IT, fostering innovation, 
                    entrepreneurship, and digital inclusion for all citizens while ensuring 
                    cybersecurity and data sovereignty.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mr-4">
                      <span className="material-symbols-outlined text-white text-2xl">flag</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#123a6b]">Our Mission</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    To promote e-governance for empowering citizens, promote the electronics 
                    and IT industry, enhance India's role in Internet Governance, and strengthen 
                    the cyber security framework of India.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Departments */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Key Departments & Organizations
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-[#123a6b] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-white text-2xl">computer</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Digital India</h3>
                  <p className="text-gray-600">Transforming India into a digitally empowered society</p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-[#123a6b] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-white text-2xl">security</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Cybersecurity</h3>
                  <p className="text-gray-600">Protecting India's digital infrastructure and data</p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-[#123a6b] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-white text-2xl">rocket_launch</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Startup India</h3>
                  <p className="text-gray-600">Fostering innovation and entrepreneurship</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Leadership
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex items-center mb-6">
                    <img 
                      src="/images/about/ashwini.jpg" 
                      alt="Ashwini Vaishnaw" 
                      className="w-20 h-20 rounded-full object-cover mr-6"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-[#123a6b]">Shri Ashwini Vaishnaw</h3>
                      <p className="text-gray-600">Hon'ble Minister</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Leading India's digital transformation initiatives and electronics manufacturing sector.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex items-center mb-6">
                    <img 
                      src="/images/about/jitin.jpg" 
                      alt="Jitin Prasada" 
                      className="w-20 h-20 rounded-full object-cover mr-6"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-[#123a6b]">Shri Jitin Prasada</h3>
                      <p className="text-gray-600">Hon'ble Minister of State</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Supporting digital governance and IT infrastructure development across India.
                  </p>
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
