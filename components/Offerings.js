import styles from '../styles/Offerings.module.css';
import Offering from "./icons/Offering";
import WhatsNew from './icons/WhatsNew';
export default function Offerings() {
  return (
    <section className={styles.offeringSection}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.colLeft}>
            <div className={styles.headerWithIcon}>
              <div className={styles.icon} aria-hidden>
                {/* placeholder icon */}
                <Offering/>
              </div>
              <h3 className={styles.title}>Key Offerings</h3>
            </div>

            <div className={styles.tabs}>
              <button className={styles.tabActive}>Schemes</button>
              <button className={styles.tab}>Vacancies</button>
            </div>

            <div className={styles.listBox}>
              <ul className={styles.list}>
                <li className={styles.item}>Guidelines for implementation of Scheme for reimbursement of Testing and Certification Charges</li>
                <li className={styles.item}>TECHNICAL INTERNSHIP PROGRAMME 2025</li>
                <li className={styles.item}>Electronics Component Manufacturing Scheme</li>
                <li className={styles.item}>Digital India Internship Scheme-2025</li>
              </ul>

              <div className={styles.viewMoreWrap}>
                <button className={styles.viewMore}>VIEW MORE</button>
              </div>
            </div>
          </div>

          <aside className={styles.colRight}>
            <div className={styles.headerWithIconRight}>
              <div className={styles.icon} aria-hidden>
                <WhatsNew/>
              </div>
              <h3 className={styles.title}>What's New</h3>
            </div>

            <div className={styles.newsCard}>
              <div className={styles.newsItem}>MeitY Performance Smartboard</div>
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









