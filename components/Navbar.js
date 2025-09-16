"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NewNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const navItems = [
    { text: 'Home', href: '/', active: router.pathname === '/', dropdown: false },
    {
      text: 'Ministry', href: '/ministry', active: router.pathname === '/ministry', dropdown: true, items: [
        { text: 'About Us', href: '/ministry/about' },
        { text: 'Organization', href: '/ministry/organization' },
        { text: 'Leadership', href: '/ministry/leadership' },
      ]
    },
    {
      text: 'Offerings', href: '/offerings', active: router.pathname === '/offerings', dropdown: true, items: [
        { text: 'Services', href: '/offerings/services' },
        { text: 'Schemes', href: '/offerings/schemes' },
        { text: 'Initiatives', href: '/offerings/initiatives' },
      ]
    },
    {
      text: 'Documents', href: '/documents', active: router.pathname === '/documents', dropdown: true, items: [
        { text: 'Reports', href: '/documents/reports' },
        { text: 'Publications', href: '/documents/publications' },
        { text: 'Circulars', href: '/documents/circulars' },
      ]
    },
    {
      text: 'Media', href: '/media', active: router.pathname === '/media', dropdown: true, items: [
        { text: 'Gallery', href: '/media/gallery' },
        { text: 'Videos', href: '/media/videos' },
        { text: 'Press Releases', href: '/media/press' },
      ]
    },
    {
      text: 'Connect', href: '#', dropdown: true, items: [
        { text: 'Contact Us', href: '#' },
        { text: 'Directory', href: '#' },
        { text: 'RTI', href: '#' },
        { text: 'Grievance Redressal', href: '#' },
        { text: "Visitor's Pass", href: '#' },
        { text: 'Citizen Engagement', href: '#' },
        { text: 'Parliament Questions', href: '#' },
      ]
    },
  ];

  return (
    <nav className="bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] border-t border-[#d0d0d0] sticky top-[120px] z-[999]">
      <div className="px-[4%]">
        {/* Bar container */}
        <div className="flex items-center justify-between h-14">
          {/* Left: Mobile toggle (shown on small screens) */}
          <button
            className="bg-transparent border-0 text-[24px] cursor-pointer p-2 text-[#333] md:hidden"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Center/Right: Links container */}
          <div
            className={`flex-1 md:flex  ${mobileMenuOpen ? 'block' : 'hidden'} md:block`}
          >
            <ul className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 m-0 p-0">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className={`group relative md:w-auto w-full`}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between md:justify-start no-underline rounded-md px-4 py-2 text-[16px] font-semibold transition-colors duration-200 ${item.active
                      ? `text-[#123a6b] border-b-8 border-[#123a6b] ${item.text !== 'Home' ? 'bg-[#d2dfff]' : ''}`
                      : `text-[#1b1b1b] hover:text-[#123a6b] ${item.text !== 'Home' ? 'hover:bg-[#d2dfff]' : ''}`
                      }`}


                    onClick={(e) => {
                      if (item.dropdown && typeof window !== 'undefined' && window.innerWidth < 769) {
                        e.preventDefault();
                        toggleDropdown(index);
                      }
                    }}
                  >
                    <span className="leading-none">{item.text}</span>
                    {item.dropdown && (
                      <span className="material-symbols-outlined ml-2 text-[20px] md:transform md:transition-transform md:duration-200 md:group-hover:rotate-180">expand_more</span>
                    )}
                  </Link>

                  {/* Dropdown */}
                  {item.dropdown && item.items && (
                    <div
                      className={`md:absolute md:top-[calc(100%+6px)] md:left-0 md:min-w-[220px] md:rounded-[8px] md:py-2 md:bg-[linear-gradient(180deg,rgba(0,0,0,0.9),rgba(0,0,0,0.85))] md:shadow-[0_6px_20px_rgba(0,0,0,0.3)] md:opacity-0 md:invisible md:translate-y-2 md:transition-all md:duration-200 md:group-hover:opacity-100 md:group-hover:visible md:group-hover:translate-y-0 ${activeDropdown === index ? 'block' : 'hidden'} md:block`}
                    >
                      <ul className="list-none m-0 p-0 md:bg-transparent bg-[#f9f9f9] md:shadow-none md:pl-0 pl-6">
                        {item.items.map((subItem, subIndex) => (
                          <li key={subIndex} className="p-0">
                            <Link
                              href={subItem.href}
                              className="block no-underline text-[14.5px] font-medium text-white md:text-white py-3 px-5 hover:bg-[rgba(255,255,255,0.08)]"
                            >
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

          {/* Right spacer to balance the mobile toggle on desktop */}
          <div className="hidden md:block w-6" />
        </div>
      </div>
    </nav>
  );
}
