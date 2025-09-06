"use client";
import { useState } from "react";
import styles from "../styles/AnnouncementBar.module.css";

export default function AnnouncementBar() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className={styles.bar}>
      {/* Left side: Title + Sound icon */}
      <div className={styles.left}>
     <span className={styles.title}>Announcements</span>
        <span className={styles.sound}>{isPaused ? "🔇" : "🔊"}</span>
      </div>

      {/* Marquee text */}
      <div className={styles.marquee}>
        <div className={`${styles.track} ${isPaused ? styles.paused : ""}`}>
          <span>Call for 2D Innovation Hub coming soon</span>
          <span>Ten Years of Digital Progress - Building an Inclusive and Future-Ready India</span>
          <span>Electronics Component</span>
        </div>
      </div>

      {/* Right side: Play/Pause Button */}
      <button
        className={styles.playPause}
        onClick={() => setIsPaused(!isPaused)}
      >
        {isPaused ? "▶" : "⏸"}
      </button>
    </div>
  );
}
