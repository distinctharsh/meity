import Footer from "@/components/Footer";
import Pdf from "@/components/icons/Pdf";
import Image from "next/image";

export default function OurTeam() {

  const data = [
    {
      section: "HON'BLE MINISTER (E&IT)",
      people: [
        {
          name: "Shri Ashwini Vaishnaw",
          designation: "Hon'ble Minister of Railways; Information and Broadcasting; and Electronics and Information Technology",
          contact: [
            { type: "phone", value: "+91-11-24369191 (Office)" },
            { type: "phone", value: "+91-11-24362626 (Office)" },
            { type: "fax", value: "+91-11-24366070" },
            { type: "email", value: "moeit[at]gov[dot]in" },
          ],
          address: "1st Floor, Electronics Niketan, 6, CGO Complex, Lodhi Road, New Delhi: 110003",
        },
      ],
    },
    {
      section: "OFFICE OF MINISTER (E&IT)",
      people: [
        {
          name: "Shri Abhas Katra Singh",
          designation: "OSD",
          contact: [
            { type: "phone", value: "+91-11-24369191(Office)" },
            { type: "phone", value: "+91-11-24362626(Office)" },
            { type: "fax", value: "+91-11-24366070(Fax)" },
            { type: "email", value: "moeit[at]gov[dot]in, abhas[dot]24[at]gov[dot]in" },
          ],
          address: "Electronics Niketan, 6, CGO Complex, Lodhi Road, New Delhi: 110003",
        },
      ],
    },
    {
      section: "HON'BLE MINISTER OF STATE (E&IT)",
      people: [
        {
          name: "Shri Jitin Prasada",
          designation: "Hon'ble Minister of State in the Ministry of Commerce and Industry; and Electronics and Information Technology",
          contact: [
            { type: "phone", value: "+91-11-24368757 (Office)" },
            { type: "phone", value: "+91-11-24368758 (Office)" },
            { type: "fax", value: "+91-11-24360958" },
            { type: "email", value: "mos-eit[at]gov[dot]in, test[at]nic[dot]in" },
          ],
          address: "1st Floor, Electronics Niketan, 6, CGO Complex, Lodhi Road, New Delhi: 110003",
        },
      ],
    },
  ];

  function PdfButton({ label, size, href }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 border border-blue-700 rounded-md px-3 py-1.5 text-blue-800 text-[11px] font-semibold tracking-wide hover:bg-blue-50 transition-colors bg-white"
      >
        <span className="whitespace-nowrap">{label}</span>
        <div className="w-px h-4 bg-blue-700" />
        <div className="flex items-center gap-1">
          <Pdf className="w-3.5 h-3.5 text-blue-700" />
        </div>
        <span className="text-gray-600 font-normal">{size}</span>
      </a>
    );
  }



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
            <h1 className="text-4xl font-bold">Our Team</h1>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-white " style={{ marginTop: '-10px', position: 'absolute', width: '100%' }}>
          <div className="gi-container">
            <div
              className="bg-[#162f6a] rounded-xl px-6 py-4 flex items-center space-x-6 overflow-x-auto"
              style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}
            >
              {/* Tabs: mark Our Team as active on this page */}
              <a
                href="/ministry/about"
                className="text-white/80 hover:text-white whitespace-nowrap"
                style={{ color: '#fff', fontSize: '1.3rem', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}
              >
                About Us
              </a>
              <div className="relative flex items-center">
                <a
                  href="/ministry/ourteam"
                  className="text-white font-bold relative pl-3 dot-before"
                  style={{ color: '#fff', fontSize: '1.3rem', fontStyle: 'normal', fontWeight: 800, lineHeight: 'normal', letterSpacing: '-0.1px', textTransform: 'none', position: 'relative' }}
                >
                  Our Team
                </a>
              </div>
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
        <section className=" mt-10 py-12" style={{ backgroundColor: '#d2dfff', borderRadius: '20px' }}>

          <div className="gi-container p-8 flex flex-col items-center min-h-[300px] rounded-md">
            {/* Cards container */}
            <div className="flex flex-col items-center relative">
              {/* Top Card with overlapping avatar */}
              <div className="relative bg-white rounded-xl shadow-md w-full max-w-[320px] sm:max-w-[340px] md:max-w-[360px] p-10 sm:p-12 px-6 flex flex-col items-center z-10">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                  <div className="w-20 h-20 rounded-full ring-4 ring-[#d2dfff] bg-white shadow-md overflow-hidden">
                    <Image
                      src="/images/our-team/a.jpg"
                      alt="Shri Ashwini Vaishnaw"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-[10px] sm:text-[11px] tracking-wide text-[#3a5a97] font-semibold mb-1">HON'BLE MINISTER</p>
                <p className="font-semibold text-center text-[15px] sm:text-[16px] text-gray-800">Shri Ashwini Vaishnaw</p>
              </div>

              {/* Vertical Line */}
              <div className="w-px bg-black h-24 sm:h-32 md:h-[150px] lg:h-48"></div>



              {/* Bottom Card with overlapping avatar */}
              <div className="relative bg-white rounded-xl shadow-md w-full max-w-[320px] sm:max-w-[340px] md:max-w-[360px] p-10 sm:p-12 px-6 flex flex-col items-center z-10">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                  <div className="w-20 h-20 rounded-full ring-4 ring-[#d2dfff] bg-white shadow-md overflow-hidden">
                    <Image
                      src="/images/our-team/b.jpg"
                      width={80}
                      height={80}
                      alt="Shri Jitin Prasada"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-[10px] sm:text-[11px] tracking-wide text-[#3a5a97] font-semibold mb-1">HON'BLE MINISTER OF STATE</p>
                <p className="font-semibold text-center text-[15px] sm:text-[16px] text-gray-800">Shri Jitin Prasada</p>
              </div>
            </div>


          </div>

          <hr className="mx-auto" style={{ width: '97.5%' }} />



          {/* PDF Buttons container outside the blue background */}
          <div className=" px-4 py-10 flex gap-3 sm:gap-4 flex-wrap">
            <PdfButton label="FORMER MINISTERS" size="66.37 KB" href="#" />
            <PdfButton label="LIST OF COUNCIL OF MINISTERS" size="3.30 MB" href="#" />
            <PdfButton label="LIST OF OFFICERS/STAFF" size="461.13 KB" href="#" />
            <PdfButton label="FOREIGN DEPUTATION JS LEVEL AND ABOVE" size="365.60 KB" href="#" />
          </div>
        </section>


        <div className="gi-container py-10">
          {data.map((section) => (
            <div key={section.section} className="mb-10">
              <div className="bg-blue-800 text-white font-semibold rounded-t-md px-4 py-2 flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/20">
                  {/* section icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10M7 12h10M7 17h6" />
                  </svg>
                </span>
                <span>{section.section}</span>
              </div>
              <div className="bg-blue-300 text-blue-900 font-semibold grid grid-cols-[2fr_2fr_3fr] px-4 py-1 text-xs">
                <div>NAME AND DESIGNATION</div>
                <div>CONTACT</div>
                <div>ADDRESS</div>
              </div>

              {section.people.map((person, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[2fr_2fr_3fr] border border-t-0 border-gray-300 px-4 py-4 text-sm"
                >
                  <div>
                    <p className="font-bold">{person.name}</p>
                    <p>{person.designation}</p>
                  </div>
                  <div className="space-y-1">
                    {person.contact.map((contact, i) => (
                      <p key={i} className="flex items-center gap-2">
                        {contact.type === "phone" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M2.003 5.884c-.09-1.04.71-1.93 1.75-2.02l2.51-.22c.87-.08 1.66.46 1.9 1.3l.57 2.07c.2.74-.04 1.53-.62 2.05l-1.12.98a14.99 14.99 0 007.58 7.58l.98-1.12c.52-.58 1.31-.82 2.05-.62l2.07.57c.84.24 1.38 1.03 1.3 1.9l-.22 2.51c-.09 1.04-.98 1.84-2.02 1.75-9.9-.85-17.8-8.74-18.66-18.64z" />
                          </svg>
                        )}
                        {contact.type === "fax" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M6 3h12v5H6V3zm-2 6h16a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V11a2 2 0 012-2zm4 2v6h8v-6H8z" />
                          </svg>
                        )}
                        {contact.type === "email" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm-1.4 4.25l-6.13 4.09a1 1 0 01-1.06 0L5.28 8.25a1 1 0 111.1-1.66L12 10.3l5.62-3.7a1 1 0 111.1 1.66z" />
                          </svg>
                        )}
                        {contact.type === "email" ? (
                          <a className="hover:underline" href={`mailto:${contact.value.replace(/\[at\]/g, '@').replace(/\[dot\]/g, '.')}`}>{contact.value}</a>
                        ) : contact.type === "phone" ? (
                          <a className="hover:underline" href={`tel:${contact.value.replace(/[^+\d]/g, '')}`}>{contact.value}</a>
                        ) : (
                          <span>{contact.value}</span>
                        )}
                      </p>
                    ))}
                  </div>
                  <div>{person.address}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <Footer />
      </main >
    </>
  );
}
