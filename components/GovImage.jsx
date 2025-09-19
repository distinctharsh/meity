"use client";
import React, { useEffect } from "react";
import Image from "next/image";

function warnOnce(msg) {
  if (typeof window === "undefined") return;
  if (!window.__gov_img_warns) window.__gov_img_warns = new Set();
  if (!window.__gov_img_warns.has(msg)) {
    console.warn(msg);
    window.__gov_img_warns.add(msg);
  }
}

/*
Props:
 - alt (required, <=140 chars recommended)
 - src, width, height
 - type: 'background' | 'banner' | 'thumbnail' | 'photo'
 - format hint via src extension (prefer webp/png for transparency)
*/
export default function GovImage({ alt, src, width, height, type = "photo", priority = false, className = "", ...rest }) {
  useEffect(() => {
    if (!alt || typeof alt !== "string" || alt.trim().length === 0) {
      warnOnce("[GovImage] alt text is required by GIGW/DBIM.");
    } else if (alt.length > 140) {
      warnOnce("[GovImage] alt text exceeds 140 characters (recommendation).");
    }

    try {
      const url = new URL(src, typeof window !== "undefined" ? window.location.href : "http://localhost");
      const ext = (url.pathname.split(".").pop() || "").toLowerCase();
      if (!/(webp|png|jpg|jpeg)$/i.test(ext)) {
        warnOnce(`[GovImage] Use WEBP/PNG/JPG recommended formats. Got: .${ext}`);
      }
    } catch { }
  }, [alt, src]);

  // Lazy by default, decode async
  const loading = priority ? undefined : "lazy";
  const decoding = "async";

  return (
    <Image
      alt={alt}
      src={src}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      sizes="(max-width: 768px) 100vw, 50vw"
      className={className}
      {...rest}
    />
  );
}


