import Footer from "@/components/Footer";

export default function Initiatives() {
  return (
    <>
      <main id="main">
        {/* Initiatives Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Digital Initiatives
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Innovative programs driving India's digital transformation
              </p>
            </div>
          </div>
        </section>

        {/* Key Initiatives */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Key Initiatives
              </h2>
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <div className="h-64 bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-6xl">smartphone</span>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-8">
                      <h3 className="text-2xl font-bold text-[#123a6b] mb-4">Digital India Mission</h3>
                      <p className="text-gray-600 mb-4">
                        A flagship program to transform India into a digitally empowered society and knowledge economy.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-[#123a6b] mb-2">Key Components</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Digital Infrastructure</li>
                            <li>• Digital Services</li>
                            <li>• Digital Literacy</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#123a6b] mb-2">Impact</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 3000+ Services Online</li>
                            <li>• 50+ Cr Citizens Served</li>
                            <li>• 99.9% Uptime</li>
                          </ul>
                        </div>
                      </div>
                      <button className="bg-[#123a6b] text-white px-6 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <div className="h-64 bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-6xl">security</span>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-8">
                      <h3 className="text-2xl font-bold text-[#123a6b] mb-4">Cybersecurity Initiative</h3>
                      <p className="text-gray-600 mb-4">
                        Comprehensive cybersecurity framework to protect India's digital infrastructure and data.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-[#123a6b] mb-2">Key Features</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Threat Detection</li>
                            <li>• Incident Response</li>
                            <li>• Security Audits</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#123a6b] mb-2">Benefits</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Data Protection</li>
                            <li>• System Security</li>
                            <li>• Risk Mitigation</li>
                          </ul>
                        </div>
                      </div>
                      <button className="bg-[#123a6b] text-white px-6 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <div className="h-64 bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-6xl">rocket_launch</span>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-8">
                      <h3 className="text-2xl font-bold text-[#123a6b] mb-4">Startup India Initiative</h3>
                      <p className="text-gray-600 mb-4">
                        Building a strong ecosystem for nurturing innovation and startups in the technology sector.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-[#123a6b] mb-2">Support Programs</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Startup Registration</li>
                            <li>• Funding Support</li>
                            <li>• Mentorship</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#123a6b] mb-2">Achievements</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 1 Lakh+ Startups</li>
                            <li>• ₹50,000 Cr Investment</li>
                            <li>• 500+ Incubators</li>
                          </ul>
                        </div>
                      </div>
                      <button className="bg-[#123a6b] text-white px-6 py-2 rounded-lg hover:bg-[#0f2d52] transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Initiative Statistics */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Initiative Impact
              </h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#123a6b] mb-2">100+</div>
                  <p className="text-gray-600">Active Initiatives</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#123a6b] mb-2">50+ Cr</div>
                  <p className="text-gray-600">Citizens Benefited</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#123a6b] mb-2">₹1 Lakh Cr</div>
                  <p className="text-gray-600">Investment Generated</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#123a6b] mb-2">99%</div>
                  <p className="text-gray-600">Success Rate</p>
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
