"use client";
import Image from "next/image";
import styles from "../styles/PmQuote.module.css";

export default function EventQuote() {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {/* Left Column - Image */}
        <div className={styles.imageColumn}>
          <div className={styles.imageBox}>
            <img
              src="./images/pm/pm-modi.jpg"
              alt="PM"
              className={styles.image}
            />
          </div>
        </div>

        {/* Right Column - Content */}
        <div className={styles.contentColumn}>
          <div className={styles.content}>
            <p className={styles.quote}>
              <span className={styles.quoteMark}>“</span>
              PM emphasises that democracy and technology together can ensure the
              welfare of humanity.
            </p>
            
            <hr className={styles.hr} />

            <div className={styles.meta}>
              <span className={styles.event}>SEMICONDUCTOR EXECUTIVES' ROUNDTABLE</span>
              <span className={styles.date}>10.09.2024</span>
            </div>

            <div className={styles.buttonContainer}>
              <a href="#" className={styles.button}>
                <span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation ">open_in_new</span>
                VIEW EVENT
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
