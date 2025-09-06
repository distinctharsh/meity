"use client";
import styles from "../styles/AboutSection.module.css";
import { FaSitemap, FaUsers, FaThLarge, FaChartBar } from "react-icons/fa";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className="container">
        <div className={styles.aboutContainer}>
          {/* Left Column - Text */}
          <div className={styles.aboutContent}>
            <div className={styles.sectionHeader}>
              <FaSitemap className={styles.icon} />
              <h2 className={styles.title}>About Us</h2>
            </div>
            <p className={styles.description}>
              The Ministry of Electronics and Information Technology (MeitY), under Government of India,
              is a stand‑alone ministerial agency, responsible for formulating and implementing national
              policies and programs aimed at enabling the continuous development of the electronics and IT
              industry. MeitY's focus areas include the development, promotion, and regulation of the electronics
              and IT industry in India, fostering digital governance, enabling innovation in emerging technologies
              and promoting cybersecurity initiatives within country.
            </p>

            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                <FaUsers className={styles.infoIcon} />
                </div>
                <span>Our Team</span>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                <FaThLarge className={styles.infoIcon} />
                </div>
                <span>Our Organisations</span>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                <FaChartBar className={styles.infoIcon} />
                </div>
                <span>Our Performance</span>
              </div>
            </div>
          </div>

          {/* Right Column - Ministers */}
          <div className={styles.ministerSection}>
            <div className={styles.ministerGrid}>
              <div className={styles.ministerCard}>
                <div className={styles.ministerImage}>
                  <Image
                    src="/images/about/vaishnaw.jpg"
                    alt="Shri Ashwini Vaishnaw"
                    width={150}
                    height={180}
                    className={styles.image}
                  />
                </div>
                <div className={styles.ministerInfo}>
                  <div className={styles.ministerName}>Shri Ashwini Vaishnaw</div>
                  <div className={styles.ministerRole}>HON'BLE MINISTER</div>
                </div>
              </div>
              <div className={styles.ministerCard}>
                <div className={styles.ministerImage}>
                  <Image
                    src="/images/about/jitin.jpg"
                    alt="Shri Jitin Prasada"
                    width={150}
                    height={180}
                    className={styles.image}
                  />
                </div>
                <div className={styles.ministerInfo}>
                  <div className={styles.ministerName}>Shri Jitin Prasada</div>
                  <div className={styles.ministerRole}>HON'BLE MINISTER OF STATE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
