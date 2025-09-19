"use client";
import React from "react";
import Emblem from "./icons/Emblem";

/*
Props:
 - variant: '1-center' | '1-left' | '2' | '3A' | '3B'
 - orgName: required for 2/3A/3B
 - ministryName: optional second line for 2
 - tagline: optional small text below name (for 3A/3B)
 - color: 'deep-blue' | 'white' (controls emblem/text color variant)
*/
export default function LogoLockup({
  variant = "2",
  orgName = "Government of India",
  ministryName,
  tagline,
  color = "deep-blue",
  className = "",
}) {
  const textColor = color === "white" ? "text-white" : "text-deep-blue";

  if (variant === "1-center") {
    return (
      <div className={`flex flex-col items-center gap-1 ${className} ${textColor}`}>
        <Emblem />
        <div className="gi-h3 gi-w-semi">भारत सरकार</div>
        <div className="gi-h3 gi-w-bold uppercase tracking-wide">GOVERNMENT OF INDIA</div>
      </div>
    );
  }

  if (variant === "1-left") {
    return (
      <div className={`flex items-center gap-3 ${className} ${textColor}`}>
        <Emblem />
        <div>
          <div className="gi-h3 gi-w-semi">भारत सरकार</div>
          <div className="gi-h3 gi-w-bold uppercase tracking-wide">GOVERNMENT OF INDIA</div>
        </div>
      </div>
    );
  }

  if (variant === "2") {
    return (
      <div className={`flex items-center gap-3 ${className} ${textColor}`}>
        <Emblem />
        <div>
          <div className="gi-p1 gi-w-regular">Government of India</div>
          <div className="gi-h3 gi-w-bold">{orgName}</div>
          {ministryName && <div className="gi-p2 gi-w-semi">{ministryName}</div>}
        </div>
      </div>
    );
  }

  if (variant === "3A") {
    return (
      <div className={`flex items-center gap-3 ${className} ${textColor}`}>
        <Emblem />
        <div>
          <div className="gi-h3 gi-w-bold">{orgName}</div>
          {tagline && <div className="gi-small gi-w-regular opacity-80">{tagline}</div>}
        </div>
      </div>
    );
  }

  if (variant === "3B") {
    return (
      <div className={`flex items-center gap-3 ${className} ${textColor}`}>
        <div>
          <div className="gi-h3 gi-w-bold">{orgName}</div>
          {tagline && <div className="gi-small gi-w-regular opacity-80">{tagline}</div>}
        </div>
      </div>
    );
  }

  return null;
}


