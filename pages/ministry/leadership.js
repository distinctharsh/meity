import Footer from "@/components/Footer";

export default function Leadership() {
  return (
    <>
      <main id="main">
        {/* Leadership Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Leadership
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Meet our visionary leaders driving India's digital transformation
              </p>
            </div>
          </div>
        </section>

        {/* Minister */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Hon'ble Minister
              </h2>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src="/images/about/ashwini.jpg" 
                      alt="Shri Ashwini Vaishnaw" 
                      className="w-full h-96 object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-8">
                    <h3 className="text-3xl font-bold text-[#123a6b] mb-4">
                      Shri Ashwini Vaishnaw
                    </h3>
                    <p className="text-xl text-gray-600 mb-6">Hon'ble Minister</p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Shri Ashwini Vaishnaw is the Hon'ble Minister of Electronics and Information Technology, 
                      Railways, and Communications. He has been instrumental in driving India's digital 
                      transformation and has played a key role in implementing various flagship programs 
                      including Digital India and Make in India.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-[#123a6b] mb-2">Key Achievements</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Launched 5G services in India</li>
                          <li>• Promoted semiconductor manufacturing</li>
                          <li>• Enhanced digital infrastructure</li>
                          <li>• Strengthened cybersecurity framework</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#123a6b] mb-2">Education</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• B.Tech from IIT Kanpur</li>
                          <li>• MBA from Wharton School</li>
                          <li>• M.Tech from IIT Kanpur</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Minister of State */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Minister of State
              </h2>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src="/images/about/jitin.jpg" 
                      alt="Shri Jitin Prasada" 
                      className="w-full h-96 object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-8">
                    <h3 className="text-3xl font-bold text-[#123a6b] mb-4">
                      Shri Jitin Prasada
                    </h3>
                    <p className="text-xl text-gray-600 mb-6">Hon'ble Minister of State</p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Shri Jitin Prasada serves as the Minister of State for Electronics and Information 
                      Technology. He has been actively involved in promoting digital governance and 
                      supporting various IT initiatives across the country.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-[#123a6b] mb-2">Key Focus Areas</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Digital Governance</li>
                          <li>• IT Infrastructure Development</li>
                          <li>• E-Governance Initiatives</li>
                          <li>• Technology Adoption</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#123a6b] mb-2">Background</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Political Leader</li>
                          <li>• Technology Advocate</li>
                          <li>• Governance Expert</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Senior Officials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Senior Officials
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 bg-[#123a6b] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
                  </div>
                  <h3 className="text-xl font-semibold text-center text-[#123a6b] mb-2">
                    Shri S. Krishnan
                  </h3>
                  <p className="text-center text-gray-600 mb-4">Secretary</p>
                  <p className="text-sm text-gray-700 text-center">
                    Leading the administrative and policy implementation for the Ministry.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 bg-[#123a6b] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-white text-2xl">engineering</span>
                  </div>
                  <h3 className="text-xl font-semibold text-center text-[#123a6b] mb-2">
                    Shri Rajesh Kumar
                  </h3>
                  <p className="text-center text-gray-600 mb-4">Additional Secretary</p>
                  <p className="text-sm text-gray-700 text-center">
                    Overseeing technical initiatives and digital infrastructure development.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 bg-[#123a6b] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-white text-2xl">security</span>
                  </div>
                  <h3 className="text-xl font-semibold text-center text-[#123a6b] mb-2">
                    Dr. Rajendra Kumar
                  </h3>
                  <p className="text-center text-gray-600 mb-4">Joint Secretary (Cybersecurity)</p>
                  <p className="text-sm text-gray-700 text-center">
                    Leading cybersecurity initiatives and digital security frameworks.
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
