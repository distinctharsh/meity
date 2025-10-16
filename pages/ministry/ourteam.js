import Footer from "@/components/Footer";
import Pdf from "@/components/icons/Pdf";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import PageHeader from "@/components/PageHeader";
import SubNavTabs from "@/components/SubNavTabs";

export default function OurTeam() {
  // Load admin-managed team for dynamic top cards (Minister / MoS)
  const [team, setTeam] = useState([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/our-team');
        if (!res.ok) return;
        const rows = await res.json();
        if (mounted) setTeam(Array.isArray(rows) ? rows.filter(r => r && r.is_active) : []);
      } catch {}
    })();
    return () => { mounted = false; };
  }, []);

  const minister = team.find(r => (r.role || '').toLowerCase() === 'minister');
  const mos = team.find(r => (r.role || '').toLowerCase() === 'mos');
  const orderedTeam = useMemo(() => {
    const arr = Array.isArray(team) ? [...team] : [];
    arr.sort((a, b) => {
      const ao = typeof a.display_order === 'number' ? a.display_order : 0;
      const bo = typeof b.display_order === 'number' ? b.display_order : 0;
      if (ao !== bo) return ao - bo;
      return String(a.name || '').localeCompare(String(b.name || ''));
    });
    return arr;
  }, [team]);

  const roleLabel = (role) => {
    const r = String(role || '').toLowerCase();
    if (r === 'minister') return "HON'BLE MINISTER";
    if (r === 'mos' || r === 'minister of state') return "HON'BLE MINISTER OF STATE";
    if (r === 'official') return 'OFFICIAL';
    return r.toUpperCase();
  };

  // Sections/People/Contacts from Admin
  const [sections, setSections] = useState([]);
  const [people, setPeople] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loadingSections, setLoadingSections] = useState(true);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [s, p, c] = await Promise.all([
          fetch('/api/admin/our-team/sections'),
          fetch('/api/admin/our-team/people'),
          fetch('/api/admin/our-team/contacts'),
        ]);
        const [sv, pv, cv] = await Promise.all([
          s.ok ? s.json() : [],
          p.ok ? p.json() : [],
          c.ok ? c.json() : [],
        ]);
        if (!mounted) return;
        setSections(Array.isArray(sv) ? sv.filter(x => x?.is_active) : []);
        setPeople(Array.isArray(pv) ? pv.filter(x => x?.is_active) : []);
        setContacts(Array.isArray(cv) ? cv.filter(x => x?.is_active) : []);
      } catch { /* ignore */ }
      finally { if (mounted) setLoadingSections(false); }
    })();
    return () => { mounted = false; };
  }, []);

  const composedData = useMemo(() => {
    const byPerson = new Map();
    for (const p of people) byPerson.set(p.id, p);
    const contactsByPerson = new Map();
    for (const ct of contacts) {
      if (!contactsByPerson.has(ct.person_id)) contactsByPerson.set(ct.person_id, []);
      contactsByPerson.get(ct.person_id).push({ type: ct.type, value: ct.value });
    }
    const peopleBySection = new Map();
    for (const p of people) {
      if (!peopleBySection.has(p.section_id)) peopleBySection.set(p.section_id, []);
      peopleBySection.get(p.section_id).push({
        name: p.name,
        designation: p.designation || '',
        contact: contactsByPerson.get(p.id) || [],
        address: p.address || '',
      });
    }
    const out = [];
    for (const s of sections.sort((a,b) => (a.display_order??0)-(b.display_order??0))) {
      out.push({ section: s.title, people: peopleBySection.get(s.id) || [] });
    }
    return out;
  }, [sections, people, contacts]);

  // Modal state for top cards
  const [selectedMember, setSelectedMember] = useState(null);
  const closeModal = () => setSelectedMember(null);

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
        {/* Dynamic Page Header (default) */}
        <PageHeader pagePath="/ministry/ourteam" />

        {/* Tabs (default DB-driven) */}
        <SubNavTabs />

        {/* Main Content */}
        <section className=" mt-10 py-12" style={{ backgroundColor: '#d2dfff', borderRadius: '20px' }}>

          <div className="gi-container p-8 flex flex-col items-center min-h-[300px] rounded-md">
            {/* Cards container */}
            <div className="flex flex-col items-center relative">
              {orderedTeam && orderedTeam.length > 0 ? (
                orderedTeam.map((m, idx) => (
                  <div key={m.id || idx} className="flex flex-col items-center">
                    {/* Card */}
                    <button type="button" onClick={() => setSelectedMember(m)} className="relative bg-white rounded-xl shadow-md w-[320px] min-h-[136px] px-5 pt-16 pb-4 sm:pt-20 sm:pb-5 flex flex-col items-center z-10 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition" aria-label={`Open profile of ${m.name || 'member'}`}>
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                        <div className="w-[88px] h-[88px] rounded-full bg-white shadow-md overflow-hidden">
                          <Image
                            src={(m.photo_url) || "/images/our-team/a.jpg"}
                            width={88}
                            height={88}
                            alt={m.name || 'Profile photo'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <p className="text-[8px] sm:text-[9px] tracking-wide text-[#3a5a97] font-semibold mb-0">{m.designation || ''}</p>
                      <p className="font-semibold text-center text-[13px] sm:text-[14px] text-gray-800">{m.name || '-'}</p>
                    </button>
                    {/* Connector (skip after last) */}
                    {idx < orderedTeam.length - 1 ? (
                      <div className="w-px bg-black h-24 sm:h-32 md:h-[150px] lg:h-48"></div>
                    ) : null}
                  </div>
                ))
              ) : (
                <>
                  {/* Fallback two cards when no admin data */}
                  <div className="relative bg-white rounded-xl shadow-md w-[320px] min-h-[136px] px-5 pt-16 pb-4 sm:pt-20 sm:pb-5 flex flex-col items-center z-10">
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                      <div className="w-[88px] h-[88px] rounded-full shadow-md overflow-hidden">
                        <Image src="/images/our-team/a.jpg" alt="Hon'ble Minister" width={88} height={88} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <p className="text-[8px] sm:text-[9px] tracking-wide text-[#3a5a97] font-semibold mb-0">HON'BLE MINISTER</p>
                    <p className="font-semibold text-center text-[13px] sm:text-[14px] text-gray-800">Shri Ashwini Vaishnaw</p>
                  </div>
                  <div className="w-px bg-black h-24 sm:h-32 md:h-[150px] lg:h-48"></div>
                  <div className="relative bg-white rounded-xl shadow-md w-[320px] min-h-[136px] px-5 pt-16 pb-4 sm:pt-20 sm:pb-5 flex flex-col items-center z-10">
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                      <div className="w-[88px] h-[88px] rounded-full bg-white shadow-md overflow-hidden">
                        <Image src="/images/our-team/b.jpg" width={88} height={88} alt="Hon'ble Minister of State" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <p className="text-[8px] sm:text-[9px] tracking-wide text-[#3a5a97] font-semibold mb-0">HON'BLE MINISTER OF STATE</p>
                    <p className="font-semibold text-center text-[13px] sm:text-[14px] text-gray-800">Shri Jitin Prasada</p>
                  </div>
                </>
              )}
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

        {/* Profile Modal (Portal) */}
        {selectedMember && typeof window !== 'undefined' && createPortal(
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 100000 }}>
            <div className="fixed inset-0 bg-black/60" onClick={closeModal} style={{ zIndex: 99999 }} />
            <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl ring-1 ring-black/10 p-6 sm:p-8" style={{ zIndex: 100001 }}>
              <button onClick={closeModal} className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-600"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd"/></svg>
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full overflow-hidden mb-4 ring-2 ring-blue-300">
                  <Image src={selectedMember.photo_url || "/images/our-team/a.jpg"} alt={selectedMember.name || 'Profile photo'} width={112} height={112} className="w-full h-full object-cover" />
                </div>
                <p className="text-[11px] tracking-wide text-[#3a5a97] font-semibold uppercase mb-1">{selectedMember.designation || ''}</p>
                <p className="text-[22px] font-semibold text-gray-900">{selectedMember.name}</p>
                {selectedMember.about_text && (
                  <p className="mt-2 text-[13px] text-gray-700 max-w-[36rem]">{selectedMember.about_text}</p>
                )}
                <div className="mt-3 flex flex-col gap-2 text-sm text-gray-800">
                  <div className="flex items-center justify-center gap-6">
                    {selectedMember.phone_primary && (
                      <p className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M2.003 5.884c-.09-1.04.71-1.93 1.75-2.02l2.51-.22c.87-.08 1.66.46 1.9 1.3l.57 2.07c.2.74-.04 1.53-.62 2.05l-1.12.98a14.99 14.99 0 007.58 7.58l.98-1.12c.52-.58 1.31-.82 2.05-.62l2.07.57c.84.24 1.38 1.03 1.3 1.9l-.22 2.51c-.09 1.04-.98 1.84-2.02 1.75-9.9-.85-17.8-8.74-18.66-18.64z"/></svg>
                        <a className="hover:underline" href={`tel:${selectedMember.phone_primary.replace(/[^+\d]/g, '')}`}>{selectedMember.phone_primary}</a>
                      </p>
                    )}
                    {selectedMember.email && (
                      <p className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm-1.4 4.25l-6.13 4.09a1 1 0 01-1.06 0L5.28 8.25a1 1 0 111.1-1.66L12 10.3l5.62-3.7a1 1 0 111.1 1.66z"/></svg>
                        <a className="hover:underline" href={`mailto:${selectedMember.email}`}>{selectedMember.email}</a>
                      </p>
                    )}
                  </div>
                  {selectedMember.phone_secondary && (
                    <div className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M2.003 5.884c-.09-1.04.71-1.93 1.75-2.02l2.51-.22c.87-.08 1.66.46 1.9 1.3l.57 2.07c.2.74-.04 1.53-.62 2.05l-1.12.98a14.99 14.99 0 007.58 7.58l.98-1.12c.52-.58 1.31-.82 2.05-.62l2.07.57c.84.24 1.38 1.03 1.3 1.9l-.22 2.51c-.09 1.04-.98 1.84-2.02 1.75-9.9-.85-17.8-8.74-18.66-18.64z"/></svg>
                      <a className="hover:underline" href={`tel:${selectedMember.phone_secondary.replace(/[^+\d]/g, '')}`}>{selectedMember.phone_secondary}</a>
                    </div>
                  )}
                </div>
                {selectedMember.profile_url && (
                  <a href={selectedMember.profile_url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-100 text-blue-900 text-[12px] font-semibold tracking-wide hover:bg-blue-200 uppercase">
                    View Profile
                  </a>
                )}
              </div>
              {(selectedMember.office_title || selectedMember.office_name || selectedMember.office_phone1 || selectedMember.office_email1 || selectedMember.office_fax) && (
                <div className="mt-7 text-left w-full">
                  {selectedMember.office_title && (
                    <p className="text-[12px] font-semibold text-[#3a5a97] mb-3 uppercase">{selectedMember.office_title}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      {selectedMember.office_name && (<p className="text-[15px] font-semibold text-gray-900">{selectedMember.office_name}</p>)}
                      {selectedMember.office_designation && (<p className="text-[13px] text-gray-700">{selectedMember.office_designation}</p>)}
                    </div>
                    <div className="space-y-1 text-[13px] text-gray-800">
                      {selectedMember.office_phone1 && (
                        <p className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M2.003 5.884c-.09-1.04.71-1.93 1.75-2.02l2.51-.22c.87-.08 1.66.46 1.9 1.3l.57 2.07c.2.74-.04 1.53-.62 2.05l-1.12.98a14.99 14.99 0 007.58 7.58l.98-1.12c.52-.58 1.31-.82 2.05-.62l2.07.57c.84.24 1.38 1.03 1.3 1.9l-.22 2.51c-.09 1.04-.98 1.84-2.02 1.75-9.9-.85-17.8-8.74-18.66-18.64z"/></svg>
                          <a className="hover:underline" href={`tel:${selectedMember.office_phone1.replace(/[^+\\d]/g, '')}`}>{selectedMember.office_phone1}</a>
                        </p>
                      )}
                      {selectedMember.office_phone2 && (
                        <p className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M2.003 5.884c-.09-1.04.71-1.93 1.75-2.02l2.51-.22c.87-.08 1.66.46 1.9 1.3l.57 2.07c.2.74-.04 1.53-.62 2.05l-1.12.98a14.99 14.99 0 007.58 7.58l.98-1.12c.52-.58 1.31-.82 2.05-.62l2.07.57c.84.24 1.38 1.03 1.3 1.9l-.22 2.51c-.09 1.04-.98 1.84-2.02 1.75-9.9-.85-17.8-8.74-18.66-18.64z"/></svg>
                          <a className="hover:underline" href={`tel:${selectedMember.office_phone2.replace(/[^+\\d]/g, '')}`}>{selectedMember.office_phone2}</a>
                        </p>
                      )}
                      {selectedMember.office_email1 && (
                        <p className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm-1.4 4.25l-6.13 4.09a1 1 0 01-1.06 0L5.28 8.25a1 1 0 111.1-1.66L12 10.3l5.62-3.7a1 1 0 111.1 1.66z"/></svg>
                          <a className="hover:underline" href={`mailto:${selectedMember.office_email1}`}>{selectedMember.office_email1}</a>
                        </p>
                      )}
                      {selectedMember.office_email2 && (
                        <p className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm-1.4 4.25l-6.13 4.09a1 1 0 01-1.06 0L5.28 8.25a1 1 0 111.1-1.66L12 10.3l5.62-3.7a1 1 0 111.1 1.66z"/></svg>
                          <a className="hover:underline" href={`mailto:${selectedMember.office_email2}`}>{selectedMember.office_email2}</a>
                        </p>
                      )}
                      {selectedMember.office_fax && (
                        <p className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3h12v5H6V3zm-2 6h16a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V11a2 2 0 012-2zm4 2v6h8v-6H8z"/></svg>
                          <span>{selectedMember.office_fax}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
        <div className="gi-container py-10">
          {composedData.map((section) => (
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
