import Footer from "@/components/Footer";

export default function Organization() {
  return (
    <>
      <main id="main">
        {/* Organization Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Organization Structure
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Ministry of Electronics & Information Technology
              </p>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-2xl">computer</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Digital India</h3>
                  <p className="text-gray-600 mb-4">
                    Transforming India into a digitally empowered society and knowledge economy.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Digital Infrastructure</li>
                    <li>• Digital Services</li>
                    <li>• Digital Literacy</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-2xl">security</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Cybersecurity</h3>
                  <p className="text-gray-600 mb-4">
                    Protecting India's digital infrastructure and ensuring cyber security.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Cyber Security Policy</li>
                    <li>• Incident Response</li>
                    <li>• Security Audits</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-2xl">rocket_launch</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Startup India</h3>
                  <p className="text-gray-600 mb-4">
                    Fostering innovation and entrepreneurship in the technology sector.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Startup Registration</li>
                    <li>• Funding Support</li>
                    <li>• Mentorship Programs</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-2xl">factory</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Electronics Manufacturing</h3>
                  <p className="text-gray-600 mb-4">
                    Promoting domestic electronics manufacturing and reducing imports.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• PLI Schemes</li>
                    <li>• Manufacturing Hubs</li>
                    <li>• Export Promotion</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-2xl">school</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Digital Education</h3>
                  <p className="text-gray-600 mb-4">
                    Enhancing digital literacy and technology education across India.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Digital Literacy Programs</li>
                    <li>• Online Learning Platforms</li>
                    <li>• Skill Development</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-2xl">policy</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Policy & Planning</h3>
                  <p className="text-gray-600 mb-4">
                    Formulating policies for electronics and IT sector development.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Policy Formulation</li>
                    <li>• Strategic Planning</li>
                    <li>• International Cooperation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Organizational Chart */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Organizational Structure
              </h2>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center mb-8">
                  <div className="w-32 h-32 bg-[#123a6b] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-white text-4xl">person</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#123a6b]">Hon'ble Minister</h3>
                  <p className="text-gray-600">Shri Ashwini Vaishnaw</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-[#123a6b] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-white text-2xl">person</span>
                    </div>
                    <h4 className="text-lg font-semibold text-[#123a6b]">Minister of State</h4>
                    <p className="text-gray-600">Shri Jitin Prasada</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-24 h-24 bg-[#123a6b] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
                    </div>
                    <h4 className="text-lg font-semibold text-[#123a6b]">Secretary</h4>
                    <p className="text-gray-600">Shri S. Krishnan</p>
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
