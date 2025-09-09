"use client";
import styles from "../styles/AboutSection.module.css";
import { FaSitemap, FaUsers, FaThLarge, FaChartBar } from "react-icons/fa";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className={`container ${styles.aboutContainer}`}>
        {/* Left Column - Content */}
        <div className={styles.aboutContent}>
          <div className={styles.sectionHeader}>
            <FaSitemap className={styles.icon} />
            <h2 className={styles.title}>About Us</h2>
          </div>
          <p className={styles.description}>
            The Ministry of Electronics and Information Technology (MeitY), under Government of India, is a
            stand-alone ministerial agency, responsible for formulating and implementing national policies
            and programs aimed at enabling the continuous development of the electronics and IT industry.
            MeitY’s focus areas include the development, promotion, and regulation of the electronics and IT
            industry in India, fostering digital governance, enabling innovation in emerging technologies and
            promoting cybersecurity initiatives within country.
          </p>

          <div className={styles.infoFlex}>
            <div className={styles.infoCard}>
              <FaUsers className={styles.infoIcon} />
              <span>Our Team</span>
            </div>
            <div className={styles.infoCard}>
              <FaThLarge className={styles.infoIcon} />
              <span>Our Organisations</span>
            </div>
            <div className={styles.infoCard}>
              <FaChartBar className={styles.infoIcon} />
              <span>Our Performance</span>
            </div>
          </div>
        </div>

        {/* Right Column - Ministers */}
        <div className={styles.ministerSection}>
          <div className={styles.ministerFlex}>
            {/* Minister 1 */}
            <div className={styles.ministerWrapper}>
              <div className={styles.ministerImageBox}>
                <Image
                  src="/images/about/ashwini.jpg"
                  alt="Shri Ashwini Vaishnaw"
                  width={215}
                  height={200}
                  className={styles.image}
                />
              </div>
              <div className={styles.ministerInfo}>
                <h3 className={styles.ministerName}>Shri Ashwini Vaishnaw</h3>
                <div className={styles.ministerRole}>HON’BLE MINISTER</div>
              </div>
            </div>

            {/* Minister 2 */}
            <div className={styles.ministerWrapper}>
              <div className={styles.ministerImageBox}>
                <Image
                  src="/images/about/jitin.jpg"
                  alt="Shri Jitin Prasada"
                  width={215}
                  height={200}
                  className={styles.image}
                />
              </div>
              <div className={styles.ministerInfo}>
                <h3 className={styles.ministerName}>Shri Jitin Prasada</h3>
                <div className={styles.ministerRole}>HON’BLE MINISTER OF STATE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
