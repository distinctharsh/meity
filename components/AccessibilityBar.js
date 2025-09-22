"use client";
import { useState, useEffect, useRef } from "react";
import Accessibility from "./icons/Accessibility";
import Image from "next/image";

const DEFAULT_OPTIONS = [
  { name: "Dark Contrast", active: false, icon: `images/icons/accessibility/dark-contrast.svg` },
  { name: "Invert", active: false, icon: `images/icons/accessibility/invert.svg` },
  { name: "Saturation", active: false, icon: `images/icons/accessibility/saturation.svg` },
  { name: "Text Size Increase", active: false, icon: `images/icons/accessibility/text-size-increase.svg` },
  { name: "Text Size Decrease", active: false, icon: `images/icons/accessibility/text-size-decrease.svg` },
  { name: "Highlight Links", active: false, icon: `images/icons/accessibility/highlight-links.svg` },
  { name: "Hide Images", active: false, icon: `images/icons/accessibility/hide-images.svg` },
  { name: "Default Cursor", active: false, icon: `images/icons/accessibility/default-cursor.svg` }
];

export default function AccessibilityBar() {
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const panelRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setShow(false);
    }
    if (show) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "";
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("a11y_options");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setOptions(parsed);
      }
    } catch { }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("a11y_options", JSON.stringify(options));
    } catch { }

    const root = document.documentElement;
    const map = new Map(options.map(o => [o.name, !!o.active]));

    root.classList.toggle("a11y-dark-contrast", !!map.get("Dark Contrast"));
    root.classList.toggle("a11y-invert", !!map.get("Invert"));
    root.classList.toggle("a11y-low-saturation", !!map.get("Saturation"));
    const inc = !!map.get("Text Size Increase");
    const dec = !!map.get("Text Size Decrease");
    root.classList.toggle("a11y-text-lg", inc);
    root.classList.toggle("a11y-text-sm", dec && !inc);
    root.classList.toggle("a11y-highlight-links", !!map.get("Highlight Links"));
    root.classList.toggle("a11y-hide-images", !!map.get("Hide Images"));
    root.classList.toggle("a11y-default-cursor", !!map.get("Default Cursor"));
  }, [options]);

  useEffect(() => {
    if (show) {
      lastFocusedRef.current = document.activeElement;
      setTimeout(() => {
        const el = panelRef.current;
        if (!el) return;
        const focusable = el.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable && focusable.focus) focusable.focus();
      }, 0);

      function trap(e) {
        if (e.key !== "Tab") return;
        const el = panelRef.current;
        if (!el) return;
        const focusables = el.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      window.addEventListener("keydown", trap);
      return () => window.removeEventListener("keydown", trap);
    } else if (lastFocusedRef.current && lastFocusedRef.current.focus) {
      lastFocusedRef.current.focus();
    }
  }, [show]);

  function toggleOption(idx) {
    setOptions(prev => prev.map((o, i) => {
      if (i !== idx) {
        if ((prev[idx].name === "Text Size Increase" && o.name === "Text Size Decrease") ||
          (prev[idx].name === "Text Size Decrease" && o.name === "Text Size Increase")) {
          return { ...o, active: false };
        }
        return o;
      }
      return { ...o, active: !o.active };
    }));
  }

  function resetFilters() {
    setOptions(DEFAULT_OPTIONS.map(o => ({ ...o, active: false })));
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="action-btn" aria-label="Accessibility panel" onClick={() => setShow(true)} title="Accessibility" >
          <img src="/images/icons/accessibility/accessibility.svg" alt="Accessibility" />
        </button>
      </div>

      {show && (
        <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="accessibility_panel" style={{ position: 'fixed', right: 0, top: 0, height: '100vh', width: 360, background: '#fff', boxShadow: '-6px 0 30px rgba(0,0,0,0.15)', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/images/icons/accessibility/accessibility.svg" alt="Accessibility" />
              <h2 id="accessibility_panel" style={{ margin: 0, fontSize: 18 }}>Accessibility Controls</h2>
            </div>
            <button aria-label="Close accessibility panel" onClick={() => setShow(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 20 }}>✕</button>
          </div>

          <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Accessibility Options</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {options.some(o => o.name.includes('Invert') || o.name.includes('Saturation')) && (
                  <button onClick={resetFilters} style={{ padding: '6px 10px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Reset Filter</button>
                )}
                {(options.some(o => o.name.includes('Text Size') && o.active)) && (
                  <button onClick={() => setOptions(prev => prev.map(o => ({ ...o, active: false })))} style={{ padding: '6px 10px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Resize Text</button>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
              {options.map((opt, idx) => (
                <div key={opt.name} className={`option-card ${opt.active ? 'active' : ''}`} role="button" tabIndex={0} aria-pressed={opt.active} aria-label={opt.name} onClick={() => toggleOption(idx)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleOption(idx) }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 12, border: '1px solid #e6e6e6', borderRadius: 8, cursor: 'pointer' }}>
                  <img src={`/${opt.icon}`} alt={opt.name} />
                  <p aria-hidden style={{ marginTop: 8, textTransform: 'uppercase', fontSize: 12, textAlign: 'center' }}>{opt.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
