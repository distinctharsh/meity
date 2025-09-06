"use client";
import Image from "next/image";
import styles from "../styles/PmQuote.module.css";

export default function EventQuote() {
  return (
    <div className={styles.wrapper}>
      {/* Left Image */}
      <div className={styles.imageBox}>
        <img
          src="./images/pm/pm-modi.jpg"   // <-- अपनी image यहां रखो (public/ folder में)
          alt="PM"
          className={styles.image}
        />
      </div>

      {/* Right Content */}
      <div className={styles.content}>
        <p className={styles.quote}>
          <span className={styles.quoteMark}>“</span>
          
          PM emphasises that democracy and technology together can ensure the
          welfare of humanity.
        </p>
        <hr className={styles.hr} />


        <div className={styles.meta}>
          <span className={styles.event}>SEMICONDUCTOR EXECUTIVES’ ROUNDTABLE</span>
          <span className={styles.date}>10.09.2024</span>
        </div>

        <a href="#" className={styles.button}>
        <span aria-hidden="true" class="material-symbols-outlined bhashini-skip-translation ">open_in_new</span>
          VIEW EVENT
        </a>
      </div>
    </div>
  );
}
