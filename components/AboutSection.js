"use client";
import styles from "../styles/AboutSection.module.css";
import { FaSitemap, FaUsers, FaThLarge, FaChartBar } from "react-icons/fa";

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className="container">
        {/* Top Content */}
        <div className="row align-items-start gy-4">
          {/* Left Column - Text */}
          <div className="col-lg-8">
            <div className="d-flex align-items-center mb-3">
              <FaSitemap className={styles.icon} />
              <h2 className={`${styles.title} mb-0 ms-2`}>About Us</h2>
            </div>
            <p className={styles.description}>
              The Ministry of Electronics and Information Technology (MeitY), under Government of India,
              is a stand‑alone ministerial agency, responsible for formulating and implementing national
              policies and programs aimed at enabling the continuous development of the electronics and IT
              industry. MeitY’s focus areas include the development, promotion, and regulation of the electronics
              and IT industry in India, fostering digital governance, enabling innovation in emerging technologies
              and promoting cybersecurity initiatives within country.
            </p>

            <div className="row g-3 mt-4">
              <div className="col-md-4">
                <div className={styles.infoCard}>
                  <FaUsers className={styles.infoIcon} />
                  <span>Our Team</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className={styles.infoCard}>
                  <FaThLarge className={styles.infoIcon} />
                  <span>Our Organisations</span>
                </div>
              </div>
              <div className="col-md-4">
                <div className={styles.infoCard}>
                  <FaChartBar className={styles.infoIcon} />
                  <span>Our Performance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Ministers */}
          <div className="col-lg-4">
            <div className="row gy-4">
              <div className="col-6 text-center">
                <div className={styles.ministerCard}>
                  <img
                    src="/images/vaishnaw.jpg"
                    alt="Shri Ashwini Vaishnaw"
                    className={`img-fluid ${styles.ministerImage}`}
                  />
                  <div className={styles.ministerName}>Shri Ashwini Vaishnaw</div>
                  <div className={styles.ministerRole}>HON’BLE MINISTER</div>
                </div>
              </div>
              <div className="col-6 text-center">
                <div className={styles.ministerCard}>
                  <img
                    src="/images/jitin.jpg"
                    alt="Shri Jitin Prasada"
                    className={`img-fluid ${styles.ministerImage}`}
                  />
                  <div className={styles.ministerName}>Shri Jitin Prasada</div>
                  <div className={styles.ministerRole}>HON’BLE MINISTER OF STATE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
