"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function EventQuote() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDDMMYYYY = (val) => {
    if (!val) return '';
    try {
      if (val instanceof Date) {
        const d = val;
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const y = d.getUTCFullYear();
        return `${dd}.${mm}.${y}`;
      }
      const s = String(val);
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        const [y, m, d] = s.split('-');
        return `${d}.${m}.${y}`;
      }
      const d2 = new Date(s);
      if (!isNaN(d2.getTime())) {
        const dd = String(d2.getUTCDate()).padStart(2, '0');
        const mm = String(d2.getUTCMonth() + 1).padStart(2, '0');
        const y = d2.getUTCFullYear();
        return `${dd}.${mm}.${y}`;
      }
      return s;
    } catch {
      return String(val);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/pm-quotes');
        if (res.ok) {
          const data = await res.json();
          if (mounted) setQuote(data);
        }
      } catch (e) {
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="w-full bg-[#ebeaea]">
      <div className="gi-container flex flex-wrap rounded-[8px] overflow-hidden">
        {/* Left Column - Image */}
        <div className="flex-[0_0_300px] p-[30px] flex justify-center items-center w-full md:w-auto">
          <div className="relative w-[260px] h-[260px] rounded-full overflow-hidden bg-white shadow-[0_2px_4px_rgba(35,35,47,0.06),_0_6px_12px_rgba(35,35,47,0.08)]">
            <img
              src={quote?.image_url || "./images/pm/pm-modi.jpg"}
              alt="PM"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="flex-1 p-[30px] flex flex-col justify-center">
          <div className="max-w-full">
            <p
              className="text-[1.25rem] leading-[1.6] text-[#162f6a] font-medium tracking-[-0.12px]"
              style={{ color: '#162f6a', fontSize: '1.7rem', fontStyle: 'normal', fontWeight: 500, lineHeight: '29px', letterSpacing: '-0.12px', whiteSpace: 'pre-line' }}
            >
              <span
                className="block text-[4.4rem] text-[#162f6a] leading-none mb-5"
                style={{ fontSize: '4.4rem', color: '#162f6a', display: 'block', maxHeight: '40px', fontFamily: 'Material Symbols Outlined' }}
                aria-hidden="true"
              >
                “
              </span>

              {quote?.quote_text || 'PM emphasises that democracy and technology together can ensure the welfare of humanity.'}
            </p>

            <hr className="border-0 h-[1px] bg-[#0b3a82] my-5" />

            <div className="flex justify-between items-center mb-6 flex-wrap gap-4 text-[#162f6a]">
              <span className="uppercase text-[0.9rem] tracking-[0.5px] font-medium">
                {quote?.author || "PRIME MINISTER"}
                <br />
                <span className="text-[0.85rem] text-[#0b3a82] font-medium">{formatDDMMYYYY(quote?.quote_date)}</span>
              </span>

              <a
                href={quote?.event_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#0b3a82] border border-[#0b3a82] py-[10px] px-5 rounded-[6px] no-underline font-semibold text-[0.9rem] transition-all hover:bg-[#f5f9ff] hover:shadow"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0b3a82]">
                  <path d="M14 3h7v7" stroke="#0b3a82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14L21 3" stroke="#0b3a82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 14v7H3V3h7" stroke="#0b3a82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                VIEW EVENT
              </a>
            </div>

            <div className="mt-2 flex justify-start md:justify-end"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
