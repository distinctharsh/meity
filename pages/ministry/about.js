import Footer from "@/components/Footer";

export default function AboutUs() {
  return (
    <>
      <main id="main">
        {/* Hero Section */}
        <section
          className="bg-[#123a6b] text-white pt-10 pb-8"
          style={{
            background: `url('/images/about-page/head-background.jpg') no-repeat center center`,
            backgroundSize: 'cover',
          }}
        >
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-sm opacity-80 mb-4">
              <a href="/" className="hover:underline">Home</a> / <a href="/ministry" className="hover:underline">Ministry</a>
            </p>
            <h1 className="text-4xl font-bold">About Us</h1>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-[#123a6b]">
          <div className="max-w-6xl mx-auto px-4 -mt-6 pb-6">
            <div className="bg-[#1c3769] rounded-[14px] px-4 py-2 overflow-x-auto">
              <ul className="flex items-center gap-2 whitespace-nowrap text-white">
                {[
                  { label: 'About Us', href: '/ministry/about', active: true },
                  { label: 'Our Team', href: '/ministry/our-team' },
                  { label: 'Our Organisations', href: '/ministry/our-organisation' },
                  { label: 'Our Performance', href: '/ministry/our-performance' },
                  { label: 'Our Groups', href: '/ministry/our-groups' },
                  { label: 'Directory', href: '/ministry/directory' },
                ].map((tab) => (
                  <li key={tab.label}>
                    <a
                      href={tab.href}
                      className={`inline-block px-4 py-2 rounded-[10px] font-semibold text-sm md:text-base ${tab.active ? 'bg-white text-[#123a6b]' : 'hover:text-[#d2e1ff]'}`}
                    >
                      {tab.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            {/* Left Box - Vision */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-xl text-[#123a6b] font-semibold mb-4">
                e-Development of India as the engine for transition into a developed nation and an empowered society.
              </p>
              <p className="uppercase text-sm text-[#3b3b3b] tracking-wide">Vision Statement</p>
            </div>

            {/* Right Content - About, Mission, Objectives */}
            <div className="text-[#333] space-y-6">
              <p>
                The Ministry of Electronics and Information Technology (MeitY), under Government of India,
                is a stand-alone ministerial agency, responsible for formulating and implementing national
                policies and programs aimed at enabling the continuous development of the electronics and IT industry.
                MeitY’s focus areas include the development, promotion, and regulation of the electronics and IT industry in India,
                fostering digital governance, enabling innovation in emerging technologies and promoting cybersecurity
                initiatives within the country.
              </p>

              <div>
                <h2 className="text-xl font-semibold text-[#123a6b] mb-2">Mission</h2>
                <p>
                  To promote Digital Governance for empowering citizens, promoting the inclusive and sustainable growth
                  of the Electronics, IT & ITeS industries, enhancing India’s role in Internet Governance, adopting
                  a multipronged approach that includes development of human resources, promoting R&D and innovation,
                  enhancing efficiency through digital services and ensuring a secure cyber space.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#123a6b] mb-2">Objectives</h2>
                <p>
                  The Ministry is dedicated to a multifaceted set of objectives, aligning with the dynamic landscape
                  of technology and its impact on society:
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
