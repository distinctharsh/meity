import React, { useState } from 'react';
import { FiArrowRight, FiUsers, FiFileText, FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import styles from '../styles/RecentDoc.module.css';
import Document from './icons/Document';
import ImportantLink from './icons/ImportantLink';
import UserPersonas from './icons/UserPersonas';

const recentDocs = [
  {
    title: "Orders And Notices",
    description: "Observance of Vigilance Awareness Week-2025-Digital Initiatives-reg",
  },
  {
    title: "Act And Policies",
    description: "Promotion and Regulation of Online Gaming Act, 2025 and its Corrigenda",
  },
  {
    title: "Gazettes Notifications",
    description:
      "Notification (Extraordinary) regarding declaration of certain computer resources relating to identified Critical Information Infrastructures (CIIs) of the Delhi International Airport Ltd (DIAL) and the computer resources of their associated dependencies as protected systems",
  },
  {
    title: "Gazettes Notifications",
    description:
      "Notification (Extraordinary) regarding declaration of certain computer resources relating to identified Critical Information Infrastructures (CIIs) of the GMR Hyderabad International Airport Ltd (GHIAL) and the computer resources of their associated dependencies as protected systems",
  },
];

const importantLinks = [
  "MeitY Dashboard",
  "Interested in Applying for Tender?",
  "Public Grievances",
  "Section 69A of IT Act",
  "Explore What's new",
];

const personas = [
    {
      img: "/images/user-personas/it-professional.jpg", 
      label: "FOR IT PROFESSIONAL",
    },
    {
      img: "/images/user-personas/researcher.jpg",
      label: "FOR RESEARCHER",
    },
    {
      img: "/images/user-personas/media.jpg",
      label: "FOR MEDIA",
    },
    {
      img: "/images/user-personas/business-owner.jpg",
      label: "FOR BUSINESS OWNER",
    },
  ];
  

const RecentDocs = () => {
  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0);

  const prevPersona = () => {
    setCurrentPersonaIndex((prev) => (prev === 0 ? personas.length - 1 : prev - 1));
  };

  const nextPersona = () => {
    setCurrentPersonaIndex((prev) => (prev === personas.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.container}>
      {/* Recent Documents Section */}
      <div className={styles.section}>
        <div className={styles.header}>
          <Document className={styles.icon}/>
          <h3>Recent Documents</h3>
        </div>
        <div className={styles.docsGrid}>
          {recentDocs.map((doc, i) => (
            <div key={i} className={styles.docCard}>
              <h4>{doc.title}</h4>
              <p>{doc.description}</p>
            </div>
          ))}
        </div>
        <button className={styles.viewMoreBtn}>
          VIEW MORE <FiArrowRight />
        </button>
      </div>

      {/* User Personas Section */}
      <div className={styles.sectionCenter}>
        <div className={styles.header}>
          <UserPersonas className={styles.icon}/>
          <h3>Explore User Personas</h3>
        </div>

        <div className={styles.personaImageWrapper}>
          <div className={styles.personaImageCircle}>
            <Image
              src={personas[currentPersonaIndex].img}
              alt={personas[currentPersonaIndex].label}
              width={140}
              height={140}
              style={{ borderRadius: "50%" }}
            />
          </div>
        </div>
        <div className={styles.personaText}>{personas[currentPersonaIndex].label}</div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <span className={styles.arrow} onClick={prevPersona}>&lt;</span>
          {personas.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${idx === currentPersonaIndex ? styles.activeDot : ''}`}
              onClick={() => setCurrentPersonaIndex(idx)}
            />
          ))}
          <span className={styles.arrow} onClick={nextPersona}>&gt;</span>
        </div>
      </div>

      {/* Important Links Section */}
      <div className={styles.section}>
        <div className={styles.header}>
          <ImportantLink className={styles.icon}/>
          <h3>Important Links</h3>
        </div>
        <ul className={styles.linksList}>
          {importantLinks.map((link, i) => (
            <li key={i} className={styles.linkItem}>
              {link}
              <FiArrowRight className={styles.linkArrow} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentDocs;
