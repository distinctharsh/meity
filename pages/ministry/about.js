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
        {/* Tab Navigation Section (Fixed to match screenshot) */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 -mt-6">
            <div className="bg-[#0c2a5d] rounded-md inline-block px-4 py-2">
              <ul className="flex flex-wrap items-center space-x-4 text-white text-sm font-medium">
                <li className="flex items-center space-x-2">
                  {/* 3-dot vertical icon */}
                  <span className="flex flex-col justify-center items-center text-white text-xs">
                    <span className="w-[3px] h-[3px] rounded-full bg-white mb-[2px]"></span>
                    <span className="w-[3px] h-[3px] rounded-full bg-white mb-[2px]"></span>
                    <span className="w-[3px] h-[3px] rounded-full bg-white"></span>
                  </span>
                  <a href="/ministry/about" className="font-semibold underline">About Us</a>
                </li>
                <li><a href="/ministry/our-team" className="hover:underline">Our Team</a></li>
                <li><a href="/ministry/our-organisation" className="hover:underline">Our Organisations</a></li>
                <li><a href="/ministry/our-performance" className="hover:underline">Our Performance</a></li>
                <li><a href="/ministry/our-groups" className="hover:underline">Our Groups</a></li>
                <li><a href="/ministry/directory" className="hover:underline">Directory</a></li>
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

                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
                  {[
                    {
                      num: 1,
                      title: "e-Government",
                      desc: "Providing e-infrastructure for delivery of e-services",
                    },
                    {
                      num: 2,
                      title: "e-Industry",
                      desc: "Promotion of electronics hardware manufacturing and IT-ITeS industry",
                    },
                    {
                      num: 3,
                      title: "e-Innovation / R&D",
                      desc: "Implementation of R&D Framework: Enabling creation of Innovation/ R&D Infrastructure",
                    },
                    {
                      num: 4,
                      title: "e-Learning",
                      desc: "Providing support for development of e-Skills and Knowledge network",
                    },
                    {
                      num: 5,
                      title: "e-Security",
                      desc: "Securing India’s cyber space",
                    },
                    {
                      num: 6,
                      title: "e-Inclusion",
                      desc: "Promoting the use of ICT for more inclusive growth",
                    },
                    {
                      num: 7,
                      title: "e-Diplomacy",
                      desc: "Promoting the use of ICT in international cooperation",
                    },
                    {
                      num: 8,
                      title: "Internet Governance",
                      desc: "Enhancing India's role in global Internet Governance",
                    },
                    {
                      num: 9,
                      title: "Human Resource Development",
                      desc: "Development of skilled human resources in ICT",
                    },
                  ].map((item) => (
                    <div key={item.num} className="bg-[#e6edff] p-4 rounded-md">
                      <div className="text-2xl font-bold text-[#123a6b] mb-1">{item.num}</div>
                      <div className="font-semibold text-[#123a6b] mb-1">{item.title}</div>
                      <p className="text-sm text-gray-700">{item.desc}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>






        <Footer />
      </main>
    </>
  );
}
