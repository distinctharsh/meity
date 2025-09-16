import Footer from "@/components/Footer";

export default function AboutUs() {
  return (
    <>


      {/* Inline CSS for the ::before dot */}
      <style>{`

    

        .dot-before::before {
          content: "";
          position: absolute;
          left: -8px;
          top: 5px;
          width: 12px;
          height: 28px;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='28' viewBox='0 0 12 28' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_1293_43610)'%3E%3Cpath d='M8.35593 3.06788C8.35593 4.07416 9.17168 4.88992 10.178 4.88992C11.1842 4.88992 12 4.07417 12 3.06788C12 2.0616 11.1842 1.24585 10.178 1.24585C9.17168 1.24585 8.35593 2.0616 8.35593 3.06788Z' fill='white'/%3E%3Cpath d='M8.35593 10.356C8.35593 11.3623 9.17168 12.178 10.178 12.178C11.1842 12.178 12 11.3623 12 10.356C12 9.34969 11.1842 8.53394 10.178 8.53394C9.17168 8.53394 8.35593 9.34969 8.35593 10.356Z' fill='white'/%3E%3Cpath d='M8.35593 17.6441C8.35593 18.6503 9.17168 19.4661 10.178 19.4661C11.1842 19.4661 12 18.6503 12 17.6441C12 16.6378 11.1842 15.822 10.178 15.822C9.17168 15.822 8.35593 16.6378 8.35593 17.6441Z' fill='white'/%3E%3Cpath d='M8.35593 24.9321C8.35593 25.9384 9.17168 26.7542 10.178 26.7542C11.1842 26.7542 12 25.9384 12 24.9321C12 23.9259 11.1842 23.1101 10.178 23.1101C9.17168 23.1101 8.35593 23.9259 8.35593 24.9321Z' fill='white'/%3E%3Cpath d='M1.06785 3.06788C1.06785 4.07416 1.8836 4.88992 2.88988 4.88992C3.89616 4.88992 4.71191 4.07417 4.71191 3.06788C4.71191 2.0616 3.89616 1.24585 2.88988 1.24585C1.8836 1.24585 1.06785 2.0616 1.06785 3.06788Z' fill='white'/%3E%3Cpath d='M1.06785 10.356C1.06785 11.3623 1.8836 12.178 2.88988 12.178C3.89616 12.178 4.71191 11.3623 4.71191 10.356C4.71191 9.34969 3.89616 8.53394 2.88988 8.53394C1.8836 8.53394 1.06785 9.34969 1.06785 10.356Z' fill='white'/%3E%3Cpath d='M1.06785 17.6441C1.06785 18.6503 1.8836 19.4661 2.88988 19.4661C3.89616 19.4661 4.71191 18.6503 4.71191 17.6441C4.71191 16.6378 3.89616 15.822 2.88988 15.822C1.8836 15.822 1.06785 16.6378 1.06785 17.6441Z' fill='white'/%3E%3Cpath d='M1.06785 24.9321C1.06785 25.9384 1.8836 26.7542 2.88988 26.7542C3.89616 26.7542 4.71191 25.9384 4.71191 24.9321C4.71191 23.9259 3.89616 23.1101 2.88988 23.1101C1.8836 23.1101 1.06785 23.9259 1.06785 24.9321Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_1293_43610'%3E%3Crect width='27' height='12' fill='white' transform='translate(12 0.5) rotate(90)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }
      `}</style>



      <main id="main">
        {/* Hero Section */}
        <section
          className="bg-[#123a6b] text-white px-4 hero-before"
          style={{
            background: `url('/images/about-page/head-background.jpg') no-repeat center center`,
            backgroundSize: 'cover',
            paddingTop: '90px',
            paddingBottom: '90px',
            position: 'relative'
          }}
        >
          <div className="max-w-6xl mx-auto">
            <p className="text-sm opacity-80 mb-4">
              <a href="/" className="hover:underline">Home</a> / <a href="/ministry" className="hover:underline">Ministry</a>
            </p>
            <h1 className="text-4xl font-bold">About Us</h1>
          </div>
        </section>


        {/* Tabs */}
        <section className="bg-white " style={{ marginTop: '-10px', position: 'absolute', width: '100%' }}>
          <div className="max-w-6xl mx-auto px-4">
            <div
              className="bg-[#162f6a] rounded-xl px-6 py-4 flex items-center space-x-6 overflow-x-auto"
              style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}
            >
              {/* Dot SVG Icon – shown ONLY on the active tab */}
              <div className="relative flex items-center">
                <a
                  href="/ministry/about"
                  className="text-white font-bold underline relative pl-3 dot-before"
                  style={{ color: '#fff', fontSize: '1.3rem', fontStyle: 'normal', fontWeight: 800, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}
                >
                  About Us
                </a>
              </div>

              {/* Other Tabs */}
              <a
                href="/ministry/leadership"
                className="text-white/80 hover:text-white whitespace-nowrap" style={{ color: '#fff', fontSize: '1.3rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}
              >
                Our Team
              </a>
              <a
                href="/ministry/organization"
                className="text-white/80 hover:text-white whitespace-nowrap" style={{ color: '#fff', fontSize: '1.3rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}
              >
                Our Organisations
              </a>
              <a
                href="/ministry/our-performance"
                className="text-white/80 hover:text-white whitespace-nowrap" style={{ color: '#fff', fontSize: '1.3rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}
              >
                Our Performance
              </a>
              <a
                href="/ministry/our-groups"
                className="text-white/80 hover:text-white whitespace-nowrap" style={{ color: '#fff', fontSize: '1.3rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}
              >
                Our Groups
              </a>
              <a
                href="/ministry/directory"
                className="text-white/80 hover:text-white whitespace-nowrap" style={{ color: '#fff', fontSize: '1.6rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}
              >
                Directory
              </a>
            </div>
          </div>
        </section>


        {/* Main Content */}
        <section className="bg-white py-12" >
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            {/* Left Box - Vision (shrink to content height) */}
            <div className="bg-gray-100 p-6 rounded-lg inline-block align-top" style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
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
      </main >
    </>
  );
}
