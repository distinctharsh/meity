"use client";
import React, { useEffect, useState } from "react";

const defaultPrefs = {
  essential: true,
  functionality: false,
  analytics: false,
  social: false,
};

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [mode, setMode] = useState("notice"); // kept for backward compatibility

  useEffect(() => {
    try {
      const m = document.cookie.match(/cookie_prefs=([^;]+)/);
      if (m) {
        const parsed = JSON.parse(decodeURIComponent(m[1]));
        setPrefs({ ...defaultPrefs, ...parsed });
        // If user already set prefs, do not show banner
      } else {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  async function save(next) {
    try {
      await fetch('/api/cookies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) });
    } catch { }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="cookie_title" className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e6e6e6] shadow-[0_-6px_20px_rgba(0,0,0,0.08)] z-[2000]">
      <div className="px-[7%] py-4">
        {mode === "notice" ? (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="max-w-[900px]">
              <h2 id="cookie_title" className="gi-h3 gi-w-bold text-deep-blue">This website uses cookies to provide a better user experience.</h2>
              <p className="gi-p2">
                By clicking accept, you agree to the policies outlined in the{' '}
                <a className="underline text-deep-blue" href="/cookies" aria-label="Open cookie settings page">Cookie Settings</a>.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <a className="px-4 py-2 bg-[#e9f0ff] text-deep-blue inline-block text-center" href="/cookies">Customize Cookies</a>
              <button className="px-4 py-2 bg-[#e9f0ff] text-deep-blue" onClick={() => save({ ...defaultPrefs })}>Decline Optional Cookies</button>
              <button className="px-4 py-2 bg-deep-blue text-white" onClick={() => save({ ...defaultPrefs, functionality: true, analytics: true, social: true })}>Accept All Cookies</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}


