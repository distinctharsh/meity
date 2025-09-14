import Footer from "@/components/Footer";

export default function Services() {
  return (
    <>
      <main id="main">
        {/* Services Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Digital Services
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Comprehensive digital solutions for citizens and businesses
              </p>
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Our Service Categories
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">account_balance</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Digital Governance</h3>
                  <p className="text-gray-600 mb-4">
                    Streamlined government services accessible online for all citizens.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Online Application Processing</li>
                    <li>• Digital Document Verification</li>
                    <li>• E-Governance Portals</li>
                    <li>• Digital Identity Services</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">school</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Digital Education</h3>
                  <p className="text-gray-600 mb-4">
                    Technology-enabled learning solutions for students and educators.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Online Learning Platforms</li>
                    <li>• Digital Classrooms</li>
                    <li>• E-Library Resources</li>
                    <li>• Skill Development Programs</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">health_and_safety</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Digital Health</h3>
                  <p className="text-gray-600 mb-4">
                    Healthcare solutions powered by digital technology.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Telemedicine Services</li>
                    <li>• Digital Health Records</li>
                    <li>• Health Monitoring Apps</li>
                    <li>• Online Consultation</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">business</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Digital Commerce</h3>
                  <p className="text-gray-600 mb-4">
                    E-commerce and digital payment solutions for businesses.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Online Marketplaces</li>
                    <li>• Digital Payment Systems</li>
                    <li>• E-Invoicing Solutions</li>
                    <li>• Digital Banking</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">security</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">Cybersecurity</h3>
                  <p className="text-gray-600 mb-4">
                    Comprehensive security solutions for digital infrastructure.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Threat Detection</li>
                    <li>• Data Protection</li>
                    <li>• Security Audits</li>
                    <li>• Incident Response</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">smart_toy</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">AI & Innovation</h3>
                  <p className="text-gray-600 mb-4">
                    Artificial Intelligence and emerging technology solutions.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• AI-Powered Services</li>
                    <li>• Machine Learning Tools</li>
                    <li>• Innovation Labs</li>
                    <li>• Research & Development</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Statistics */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Service Impact
              </h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#123a6b] mb-2">50+ Cr</div>
                  <p className="text-gray-600">Citizens Served</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#123a6b] mb-2">3000+</div>
                  <p className="text-gray-600">Services Online</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#123a6b] mb-2">₹100+ Cr</div>
                  <p className="text-gray-600">Digital Transactions</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#123a6b] mb-2">99.9%</div>
                  <p className="text-gray-600">Uptime</p>
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
