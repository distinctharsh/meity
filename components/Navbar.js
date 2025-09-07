"use client";
import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/NewNavbar.module.css';

export default function NewNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const navItems = [
    { 
      text: 'Home', 
      href: '#',
      active: true,
      dropdown: false 
    },
    { 
      text: 'Ministry', 
      href: '#',
      dropdown: true,
      items: [
        { text: 'About Us', href: '#' },
        { text: 'Organization', href: '#' },
        { text: 'Policies', href: '#' },
      ]
    },
    { 
      text: 'Offerings', 
      href: '#',
      dropdown: true,
      items: [
        { text: 'Services', href: '#' },
        { text: 'Schemes', href: '#' },
        { text: 'Initiatives', href: '#' },
      ]
    },
    { 
      text: 'Documents', 
      href: '#',
      dropdown: true,
      items: [
        { text: 'Reports', href: '#' },
        { text: 'Publications', href: '#' },
        { text: 'Circulars', href: '#' },
      ]
    },
    { 
      text: 'Media', 
      href: '#',
      dropdown: true,
      items: [
        { text: 'Gallery', href: '#' },
        { text: 'Videos', href: '#' },
        { text: 'Press Releases', href: '#' },
      ]
    },
    { 
      text: 'Connect', 
      href: '#',
      dropdown: true,
      items: [
        { text: 'Contact Us', href: '#' },
        { text: 'Directory', href: '#' },
        { text: 'RTI', href: '#' },
        { text: 'Grievance Redressal', href: '#' },
        { text: "Visitor's Pass", href: '#' },
        { text: 'Citizen Engagement', href: '#' },
        { text: 'Parliament Questions', href: '#' },
      ]
    }
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navRow}>
          {/* Mobile Menu Toggle */}
          <button 
            className={styles.mobileMenuToggle}
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Navigation Links */}
          <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.active : ''}`}>
            <ul className={styles.navList}>
              {navItems.map((item, index) => (
                <li 
                  key={index} 
                  className={`${styles.navItem} ${item.active ? styles.active : ''} ${item.dropdown ? styles.hasDropdown : ''} ${activeDropdown === index ? styles.open : ''}`}
                >
                  <Link 
                    href={item.href}
                    className={styles.navLink}
                    onClick={(e) => {
                      // On mobile (small screens) we want click/tap to toggle the dropdown.
                      // On desktop allow hover to open the menu, so don't intercept the click.
                      if (item.dropdown && typeof window !== 'undefined' && window.innerWidth < 769) {
                        e.preventDefault();
                        toggleDropdown(index);
                      }
                    }}
                  >
                    {item.text}
                    {item.dropdown && (
                      <span className={`material-symbols-outlined ${styles.dropdownIcon}`}>
                        expand_more
                      </span>
                    )}
                  </Link>
                  
                  {item.dropdown && item.items && (
                    <div 
                      className={styles.dropdown}
                    >
                      <ul className={styles.dropdownList}>
                        {item.items.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link href={subItem.href} className={styles.dropdownLink}>
                              {subItem.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
