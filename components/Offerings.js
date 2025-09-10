import { useState } from "react";
import styles from '../styles/Offerings.module.css';
import Offering from "./icons/Offering";
import WhatsNew from './icons/WhatsNew';
import { FiChevronRight } from 'react-icons/fi';

export default function Offerings() {
  const [activeTab, setActiveTab] = useState("schemes");

  // Data for Schemes & Vacancies
  const schemesList = [
    "Guidelines for implementation of Scheme for reimbursement of Testing and Certification Charges",
    "TECHNICAL INTERNSHIP PROGRAMME 2025",
    "Electronics Component Manufacturing Scheme",
    "Digital India Internship Scheme-2025"
  ];

  const vacanciesList = [
    "Vacancy 1: Technical Assistant",
    "Vacancy 2: Junior Engineer",
    "Vacancy 3: Project Manager",
    "Vacancy 4: Data Analyst"
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section className={styles.offeringSection}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.colLeft}>
            <div className={styles.headerWithIcon}>
              <div className={styles.icon} aria-hidden>
                <Offering />
              </div>
              <h3 className={styles.title}>Key Offerings</h3>
            </div>

            <div className={styles.tabs}>
              <button
                className={activeTab === "schemes" ? styles.tabActive : styles.tab}
                onClick={() => handleTabClick("schemes")}
                aria-selected={activeTab === "schemes"}
              >
                Schemes
              </button>
              <button
                className={activeTab === "vacancies" ? styles.tabActive : styles.tab}
                onClick={() => handleTabClick("vacancies")}
                aria-selected={activeTab === "vacancies"}
              >
                Vacancies
              </button>
            </div>

            <div className={styles.listBox}>
              <ul className={styles.list}>
                {(activeTab === "schemes" ? schemesList : vacanciesList).map((item, index) => (
                  <li key={index} className={styles.listItem}>
                    {item}
                    <span className={styles.arrow}>
                      <FiChevronRight />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.viewMoreWrap}>
              <button className={styles.viewMore}>VIEW MORE</button>
            </div>
          </div>

          <aside className={styles.colRight}>
            <div className={styles.headerWithIconRight}>
              <div className={styles.icon} aria-hidden>
                <WhatsNew />
              </div>
              <h3 className={styles.title}>What's New</h3>
            </div>

            <div className={styles.newsCard}>
              <div className={styles.newsItem}>MeitY Performance Smartboard 
                <FiChevronRight />
              </div>
            </div>

            <div className={styles.viewMoreWrapRight}>
              <button className={styles.viewMore}>VIEW MORE</button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
