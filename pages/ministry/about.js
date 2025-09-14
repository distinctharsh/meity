import AboutSection from "@/components/AboutSection";
import PmQuote from "@/components/PmQuote";
import Footer from "@/components/Footer";

export default function AboutUs() {
  return (
    <>
      <main id="main">
        {/* About Us Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Us
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Ministry of Electronics & Information Technology
              </p>
            </div>
          </div>
        </section>

        {/* Main About Section */}
        <AboutSection />

        {/* PM Quote */}
        <PmQuote />

        {/* Detailed About Content */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold text-[#123a6b] mb-6">Our History</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    The Ministry of Electronics and Information Technology (MeitY) was established in 2016 
                    to promote e-governance and give a boost to the electronics and IT industry. The Ministry 
                    has been instrumental in driving India's digital transformation through various initiatives 
                    and policies.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Over the years, MeitY has launched several flagship programs including Digital India, 
                    Make in India, Startup India, and Skill India, which have collectively transformed 
                    India's digital landscape and positioned the country as a global leader in technology.
                  </p>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#123a6b] mb-6">Our Achievements</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="material-symbols-outlined text-green-500 mr-3">check_circle</span>
                      <span>100+ Crore Digital Transactions</span>
                    </div>
                    <div className="flex items-center">
                      <span className="material-symbols-outlined text-green-500 mr-3">check_circle</span>
                      <span>50+ Crore Citizens Served</span>
                    </div>
                    <div className="flex items-center">
                      <span className="material-symbols-outlined text-green-500 mr-3">check_circle</span>
                      <span>3000+ Government Services Online</span>
                    </div>
                    <div className="flex items-center">
                      <span className="material-symbols-outlined text-green-500 mr-3">check_circle</span>
                      <span>1 Lakh+ Startups Registered</span>
                    </div>
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
