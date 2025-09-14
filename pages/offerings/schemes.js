import Footer from "@/components/Footer";

export default function Schemes() {
  return (
    <>
      <main id="main">
        {/* Schemes Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Government Schemes
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Empowering citizens and businesses through innovative schemes
              </p>
            </div>
          </div>
        </section>

        {/* Featured Schemes */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Featured Schemes
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mr-4">
                        <span className="material-symbols-outlined text-white text-xl">rocket_launch</span>
                      </div>
                      <h3 className="text-2xl font-bold text-[#123a6b]">Startup India</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      A flagship initiative to build a strong ecosystem for nurturing innovation and startups.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1 mb-6">
                      <li>• Startup Registration</li>
                      <li>• Tax Benefits</li>
                      <li>• Funding Support</li>
                      <li>• Mentorship Programs</li>
                    </ul>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">1 Lakh+ Startups Registered</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mr-4">
                        <span className="material-symbols-outlined text-white text-xl">factory</span>
                      </div>
                      <h3 className="text-2xl font-bold text-[#123a6b]">Make in India</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Promoting domestic manufacturing and reducing import dependency in electronics.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1 mb-6">
                      <li>• PLI Schemes</li>
                      <li>• Manufacturing Incentives</li>
                      <li>• Export Promotion</li>
                      <li>• Skill Development</li>
                    </ul>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">₹50,000 Cr Investment</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mr-4">
                        <span className="material-symbols-outlined text-white text-xl">computer</span>
                      </div>
                      <h3 className="text-2xl font-bold text-[#123a6b]">Digital India</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Transforming India into a digitally empowered society and knowledge economy.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1 mb-6">
                      <li>• Digital Infrastructure</li>
                      <li>• Digital Services</li>
                      <li>• Digital Literacy</li>
                      <li>• E-Governance</li>
                    </ul>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">3000+ Services Online</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mr-4">
                        <span className="material-symbols-outlined text-white text-xl">school</span>
                      </div>
                      <h3 className="text-2xl font-bold text-[#123a6b]">Skill India</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Enhancing digital literacy and technology skills across India.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1 mb-6">
                      <li>• Digital Literacy Programs</li>
                      <li>• Skill Development</li>
                      <li>• Training Centers</li>
                      <li>• Certification Programs</li>
                    </ul>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">10 Cr+ Trained</span>
                      <button className="bg-[#123a6b] text-white px-4 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scheme Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Scheme Categories
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-[#123a6b]">For Citizens</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Digital Literacy Programs</li>
                    <li>• E-Governance Services</li>
                    <li>• Digital Identity</li>
                    <li>• Online Education</li>
                    <li>• Telemedicine Services</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-[#123a6b]">For Businesses</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Startup India</li>
                    <li>• Make in India</li>
                    <li>• PLI Schemes</li>
                    <li>• Export Promotion</li>
                    <li>• Technology Adoption</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-[#123a6b]">For Government</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Digital Infrastructure</li>
                    <li>• Cybersecurity Framework</li>
                    <li>• E-Governance Platforms</li>
                    <li>• Data Management</li>
                    <li>• Policy Implementation</li>
                  </ul>
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
