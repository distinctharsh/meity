import Offerings from "@/components/Offerings";
import Footer from "@/components/Footer";

export default function OfferingsPage() {
  return (
    <>
      <main id="main">
        {/* Offerings Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Our Offerings
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Comprehensive Digital Solutions for Citizens and Businesses
              </p>
            </div>
          </div>
        </section>

        {/* Main Offerings Component */}
        <Offerings />

        {/* Additional Services */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Digital Services
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
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                Success Stories
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white p-8 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Digital India Impact</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Digital Transactions</span>
                      <span className="text-2xl font-bold">₹100+ Cr</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Citizens Served</span>
                      <span className="text-2xl font-bold">50+ Cr</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Services Online</span>
                      <span className="text-2xl font-bold">3000+</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold mb-4 text-[#123a6b]">Key Achievements</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="material-symbols-outlined text-green-500 mr-3 mt-1">check_circle</span>
                      <span>100% Digital Payment Infrastructure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="material-symbols-outlined text-green-500 mr-3 mt-1">check_circle</span>
                      <span>Universal Internet Connectivity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="material-symbols-outlined text-green-500 mr-3 mt-1">check_circle</span>
                      <span>Digital Literacy Programs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="material-symbols-outlined text-green-500 mr-3 mt-1">check_circle</span>
                      <span>E-Governance Excellence</span>
                    </li>
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
