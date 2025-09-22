import Footer from "@/components/Footer";
import Pdf from "@/components/icons/Pdf";

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
          <div className="gi-container">
            <p className="text-sm opacity-80 mb-4">
              <a href="/" className="hover:underline">Home</a> / <a href="/ministry" className="hover:underline">Ministry</a>
            </p>
            <h1 className="text-4xl font-bold">About Us</h1>
          </div>
        </section>


        {/* Tabs */}
        <section className="bg-white " style={{ marginTop: '-10px', position: 'absolute', width: '100%' }}>
          <div className="gi-container">
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
        <section className="bg-white py-12">
          <div className="gi-container grid md:grid-cols-[1fr_2fr] gap-10">
            {/* Left Box - Vision (shrink to content height) */}
            <div className="bg-gray-100 p-6 rounded-lg inline-block align-top" style={{ height: 'fit-content', position: 'sticky', top: '250px' }}>
              <p className="text-xl text-[#123a6b] font-semibold mb-4">
                e-Development of India as the engine for transition into a developed nation and an empowered society.
              </p>
              <p className="uppercase text-sm text-[#3b3b3b] tracking-wide">Vision Statement</p>
            </div>

            {/* Right Content - About, Mission, Objectives */}
            <div className="text-[#333] space-y-6">
              <p>
                The Cabinet Secretariat, under Government of India,
                is a stand-alone ministerial agency, responsible for formulating and implementing national
                policies and programs aimed at enabling the continuous development of the electronics and IT industry.
                Cabinet Secretariat’s focus areas include the development, promotion, and regulation of the electronics and IT industry in India,
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

              <div>
                <h2 className="text-xl font-semibold text-[#123a6b] mb-2">Functions</h2>
                <p>
                  Cabinet Secretariat<br />
                  (Electroniki aur Soochana Praudyogiki Mantralaya)<sup>1</sup>
                </p>
                <ol className="list-decimal list-inside space-y-2 mt-4 text-sm text-gray-800">
                  <li>Policy matters relating to information technology; Electronics; and Internet (all matters other than licensing of Internet Service Provider).</li>
                  <li>
                    Promotion of internet, IT and IT enabled services.
                    <ul className="list-[upper-alpha] list-inside ml-5">
                      <li>Promotion of Digital Transactions excluding Digital Payments.<sup>2</sup></li>
                    </ul>
                  </li>
                  <li>Assistance to other departments in the promotion of E-Governance, E-Commerce, E-Medicine, E-Infrastructure, etc.</li>
                  <li>Promotion of Information Technology education and Information Technology-based education.</li>
                  <li>
                    Matters relating to Cyber Laws, administration of the Information Technology Act. 2000 (21 of 2000) and other IT related laws.
                    <ul className="list-[upper-alpha] list-inside ml-5">
                      <li>Matters relating to online gaming.<sup>3</sup></li>
                      <li>Matters relating to Cyber Security as assigned in the Information Technology Act, 2000 (21 of 2000) (as amended from time to time) and support to other Ministries / Departments on Cyber Security.<sup>4</sup></li>
                    </ul>
                  </li>
                  <li>Matters relating to promotion and manufacturing of Semiconductor Devices in the country.<sup>5</sup></li>
                  <li>Interaction in IT related matters with international agencies and bodies e.g. Internet for Business Limited (IFB), Institute for Education in Information Society (IBI) and International Code Council — online (ICC).</li>
                  <li>Initiative on bridging the Digital Divide: Matters relating to Digital India Corporation.<sup>6</sup></li>
                  <li>Promotion of Standardization, Testing and Quality in IT and standardization of procedure for IT application and Tasks.</li>
                  <li>Electronics Export and Computer Software Promotion Council (ESC).</li>
                  <li>National Informatics Centre (NIC).</li>
                  <li>Initiatives for development of Hardware/Software industry including knowledge-based enterprises, measures for promoting IT exports and competitiveness of the industry.</li>
                  <li>All matters relating to personnel under the control of the Ministry.<sup>7</sup></li>
                  <li>Unique Identification Authority of India (UIDAI).<sup>8</sup></li>
                  <li>Semi-Conductor Laboratory, Mohali.<sup>9</sup></li>
                </ol>
              </div>


              <div className="mt-10">
                <h2 className="text-xl font-semibold text-[#123a6b] mb-2">Amendments to Functions</h2>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-800">
                  <li>
                    Modified vide Amendment series no. 243 dated 15.10.1999, 257 dated 21.12.2001, 300 dated 26.02.2012 and 327 dated 16.07.2016.
                  </li>
                  <li>
                    Modified vide Amendment series no. 371 dated 17.07.2023.
                  </li>
                  <li>
                    Inserted vide Amendment series no. 370 dated 23.12.2022.
                  </li>
                  <li>
                    Inserted vide Amendment series no. 377 dated 27.09.2024.
                  </li>
                  <li>
                    Modified vide Amendment series no. 368 dated 07.02.2022 (earlier inserted vide no. 279 dated 01.03.2005 and modified vide no. 322 dated 17.03.2016).
                  </li>
                  <li>
                    Modified vide Amendment series no. 345 dated 17.10.2018.
                  </li>
                  <li>
                    Modified vide Amendment series no. 281 dated 01.09.2005, Further modified vide amendment series no. 327 dated 16.07.2016.
                  </li>
                  <li>
                    Inserted vide Amendment series no. 318 dated 12.09.2015 (Earlier inserted under Planning Commission vide Amendment Series no.296 dated 22.02.2010, and in NITI Aayog vide series no.312).
                  </li>
                  <li>
                    Inserted vide Amendment series no. 368 dated 07.02.2022.
                  </li>
                </ol>
              </div>




              <div className="max-w-4xl mx-auto px-4 space-y-10">

                {/* Citizens' Charter */}
                <div>
                  <h2 className="text-xl font-semibold text-[#123a6b] mb-2">Citizens' Charter</h2>
                  <p className="text-gray-700 text-sm mb-4">
                    A Citizens' Charter represents the commitment of the Organisation towards standard, quality and time frame of
                    service delivery, grievance redress mechanism, transparency and accountability. Nodal Officers have been appointed
                    with a view to ensure effective implementation of Citizens’ Charter.
                  </p>

                  {/* Document Card */}
                  <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
                    <div className="flex items-center gap-2">
                      <p className="mb-2 md:mb-0 flex items-center gap-2 text-gray-900 font-medium">
                        <span className="material-symbols-outlined text-[#0f3c82]">draft</span>
                        Citizens' Charter
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Pdf />
                      <span className="text-xs text-gray-600">439.35 KB</span>
                      <button className="bg-blue-100 text-blue-600 px-3 pt-1 rounded hover:bg-blue-200"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation " style={{ fontSize: '17px', cursor: 'pointer', cursor: 'pointer' }}>visibility</span></button>
                    </div>
                  </div>
                </div>

                {/* Other Documents */}
                <div>
                  <h2 className="text-xl font-semibold text-[#123a6b] mb-4">Other Documents</h2>

                  {/* Document Cards */}
                  <div className="space-y-3">
                    {/* Document 1 */}
                    <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
                      <p className="mb-2 md:mb-0 flex items-center gap-2 text-gray-900 font-medium">
                        <span className="material-symbols-outlined text-[#0f3c82]">draft</span>
                        Organisational Chart of Cabinet Secretariat
                      </p>
                      <div className="flex items-center gap-3">
                        <Pdf />
                        <span className="text-xs text-gray-600">28.74 KB</span>
                        <button className="bg-blue-100 text-blue-600 px-3 pt-1 rounded hover:bg-blue-200"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation " style={{ fontSize: '17px', cursor: 'pointer' }}>visibility</span></button>
                      </div>
                    </div>

                    {/* Document 2 */}
                    <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
                      <p className="mb-2 md:mb-0 flex items-center gap-2 text-gray-900 font-medium">
                        <span className="material-symbols-outlined text-[#0f3c82]">draft</span>
                        Groups and their respective Heads/Group Coordinators
                      </p>
                      <div className="flex items-center gap-3">
                        <Pdf />
                        <span className="text-xs text-gray-600">107.25 KB</span>
                        <button className="bg-blue-100 text-blue-600 px-3 pt-1 rounded hover:bg-blue-200"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation " style={{ fontSize: '17px', cursor: 'pointer' }}>visibility</span></button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Abbreviations Section */}
                <div>
                  <h2 className="text-xl font-semibold text-[#123a6b] mb-2">Other Documents</h2>
                  <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">

                    <p className="mb-2 md:mb-0 flex items-center gap-2 text-gray-900 font-medium">
                      <span className="material-symbols-outlined text-[#0f3c82]">draft</span>
                      Abbreviations
                    </p>
                    <button style={{ background: '#a3bbf3', color: '#162f6a', padding: '4px 8px', cursor: 'pointer' }}>

                      <span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation" style={{ fontSize: '15px' }}>arrow_right_alt</span>
                    </button>
                  </div>
                </div>

              </div>




              <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-lg font-semibold text-[#0f3c82] mb-4">Official Language Activities</h2>
                <p className="text-gray-700 mb-6">
                  Hindi unit of the Cabinet Secretariat is responsible for implementation of Official
                  Language Policy of the Union and the progressive use of Official Language, Hindi in the Ministry and the Offices/Autonomous
                  Societies under its control.
                </p>

                <div className="space-y-4">
                  {[
                    { text: "Background", href: "/ministry/about-us/details/Title=Background-AzN4AjMtQWa" },
                    { text: "Official Language Policy of the Union", href: "/ministry/about-us/details/Title=Official-Language-Policy-of-the-Union-AzN4AjMtQWa" },
                    { text: "Constitutional Provisions", href: "/ministry/about-us/details/Title=Constitutional-Provisions-AzN4AjMtQWa" },
                    { text: "Official Language Act", href: "/ministry/about-us/details/Title=Official-Language-Act-AzN4AjMtQWa" },
                    { text: "The Official Languages (Use for Official Purpose of the Union)", href: "/ministry/about-us/details/Title=The-Official-Languages-(Use-for-Official-Purpose-of-the-Union)-AzN4AjMtQWa" },
                    { text: "Official Language activities of the Ministry", href: "/ministry/about-us/details/Title=Official-Language-activities-of-the-Ministry-AzN4AjMtQWa" },
                  ].map(({ text, href }) => (
                    <div
                      key={text}
                      className="flex flex-col md:flex-row items-center justify-between border border-gray-300 rounded-md p-3"
                    >
                      <p className="mb-2 md:mb-0 flex items-center gap-2 text-gray-900 font-medium">
                        <span className="material-symbols-outlined text-[#0f3c82]">draft</span>
                        {text}
                      </p>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#0f3c82] font-semibold hover:text-blue-700"
                        style={{ background: '#a3bbf3', color: '#162f6a', padding: '8px' }}
                        aria-label={`Know More about ${text}`}
                        title={`Know More about ${text}`}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation" style={{ fontSize: '15px' }}>arrow_right_alt</span>
                      </a>
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
