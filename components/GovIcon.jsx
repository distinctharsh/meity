"use client";
import React from "react";

export default function GovIcon({
  title,
  ariaLabel,
  size = 24, // 24 | 32 | 48 | 64
  style = "line", // 'line' | 'filled'
  color = "deep-blue", // 'deep-blue' | 'white'
  children, // pass SVG path(s) only
  className = "",
}) {
  const sizeClass = size === 32 ? "gi-icon--32" : size === 48 ? "gi-icon--48" : size === 64 ? "gi-icon--64" : "gi-icon--24";
  const styleClass = style === "filled" ? "gi-icon--filled" : "gi-icon--line";
  const colorClass = color === "white" ? "gi-icon--white" : "gi-icon--deep-blue";

  return (
    <span className={`gi-icon ${sizeClass} ${colorClass} ${className}`} role="img" aria-label={ariaLabel || title} title={title}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styleClass}>
        {children}
      </svg>
    </span>
  );
}

// Example usage:
// <GovIcon title="Search" size={32} style="line"><path d="M10 4a6 6 0 104.472 10.03l4.25 4.25 1.414-1.414-4.25-4.25A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z"/></GovIcon>

