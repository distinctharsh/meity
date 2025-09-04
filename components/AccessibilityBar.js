"use client";
import { useState, useEffect } from "react";

export default function AccessibilityBar() {
  const [scale, setScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  // Apply font scaling
  useEffect(() => {
    document.documentElement.style.fontSize = `${scale}%`;
  }, [scale]);

  // Apply high contrast mode
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  return (
    <div className="bg-gray-100 text-sm flex items-center justify-end gap-4 px-4 py-1">
      {/* Skip link */}
      <a href="#main" className="underline hover:text-blue-700">
        Skip to main content
      </a>

      {/* Font size controls */}
      <div className="flex items-center gap-2">
        <button onClick={() => setScale(s => Math.min(s + 10, 150))}>A+</button>
        <button onClick={() => setScale(100)}>A</button>
        <button onClick={() => setScale(s => Math.max(s - 10, 80))}>A-</button>
      </div>

      {/* High contrast toggle */}
      <button onClick={() => setHighContrast(!highContrast)}>
        {highContrast ? "Normal Contrast" : "High Contrast"}
      </button>

      {/* Language switch (placeholder) */}
      <button className="hover:text-blue-700">English / हिंदी</button>
    </div>
  );
}
