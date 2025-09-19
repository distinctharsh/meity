"use client";
import React from "react";
import GovImage from "./GovImage";

/* sizes per DBIM Table 9 */
const FULL_SIZES = [
  { w: 1800, h: 338 },
  { w: 1800, h: 500 },
  { w: 1800, h: 600 },
];
const SHORT_SIZES = [
  { w: 320, h: 245 },
  { w: 640, h: 245 },
];

export default function CCPSBanner({ variant = "full", index = 0, src, alt }) {
  const list = variant === "short" ? SHORT_SIZES : FULL_SIZES;
  const size = list[Math.max(0, Math.min(index, list.length - 1))];
  return (
    <div className="w-full flex justify-center">
      <GovImage src={src} alt={alt} width={size.w} height={size.h} className="rounded-md" />
    </div>
  );
}


