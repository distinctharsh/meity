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

  useEffect(() => {
    try {
      const m = document.cookie.match(/cookie_prefs=([^;]+)/);
      if (m) {
        const parsed = JSON.parse(decodeURIComponent(m[1]));
        setPrefs({ ...defaultPrefs, ...parsed });
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 id="cookie_title" className="gi-h3 gi-w-bold text-deep-blue">Cookie Settings</h2>
            <p className="gi-p2">We use cookies to improve your experience. Choose your preferences.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 gi-p2"><input type="checkbox" checked readOnly /> Essential</label>
            <label className="flex items-center gap-2 gi-p2"><input type="checkbox" checked={prefs.functionality} onChange={e => setPrefs(p => ({ ...p, functionality: e.target.checked }))} /> Functionality</label>
            <label className="flex items-center gap-2 gi-p2"><input type="checkbox" checked={prefs.analytics} onChange={e => setPrefs(p => ({ ...p, analytics: e.target.checked }))} /> Analytics</label>
            <label className="flex items-center gap-2 gi-p2"><input type="checkbox" checked={prefs.social} onChange={e => setPrefs(p => ({ ...p, social: e.target.checked }))} /> Social</label>
          </div>
          <div className="flex gap-2 justify-end">
            <button className="px-4 py-2 bg-linen" onClick={() => save({ ...defaultPrefs })}>Reject Optional</button>
            <button className="px-4 py-2 bg-deep-blue text-white" onClick={() => save({ ...defaultPrefs, functionality: true, analytics: true, social: true })}>Accept All</button>
            <button className="px-4 py-2 border border-deep-blue" onClick={() => save(prefs)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}


