"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NewNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const router = useRouter();

  // Listen for header-dispatched toggle for mobile navbar
  useEffect(() => {
    const handler = () => setMobileMenuOpen((prev) => !prev);
    if (typeof window !== 'undefined') {
      window.addEventListener('toggle-navbar', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('toggle-navbar', handler);
      }
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Determine if a nav item should be marked active for current route
  const isActive = (href) => {
    if (!href || href === '#') return false;
    if (href === '/') return router.pathname === '/';
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  const navItems = [
    { text: 'Home', href: '/', active: isActive('/'), dropdown: false },
    {
      text: 'Ministry', href: '/ministry', active: isActive('/ministry'), dropdown: true, items: [
        { text: 'About Us', href: '/ministry/about' },
        { text: 'Our Team', href: '/ministry/ourteam' },
      ]
    },
    {
      text: 'Offerings', href: '/offerings', active: isActive('/offerings'), dropdown: true, items: [
        { text: 'Schemes and Services', href: '/offerings/schemes-and-services' },
      ]
    },
    {
      text: 'Documents', href: '/documents', active: isActive('/documents'), dropdown: true, items: [
        { text: 'Reports', href: '/documents/reports' },
      ]
    },
    {
      text: 'Media', href: '/media', active: isActive('/media'), dropdown: true, items: [
        { text: 'Photos', href: '/media/photos' },
        { text: 'Videos', href: '/media/videos' },
      ]
    },
    {
      text: 'Connect', href: '#', dropdown: true, items: [
        { text: 'Contact Us', href: '/connect/contact-us' },
      ]
    },
  ];

  return (
    <nav className="bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] border-t border-[#d0d0d0] sticky top-[120px] z-[999]">
      <div className="px-[7%]">
        {/* Bar container */}
        <div className="flex items-center justify-between h-14">
          {/* Listen for header-triggered toggle on mobile */}
          {typeof window !== 'undefined' && (
            // eslint-disable-next-line react-hooks/rules-of-hooks
            (function () { })()
          )}

          {/* Desktop links */}
          <div
            className={`flex-1 hidden md:flex`}
          >
            <ul className="flex flex-row md:items-center justify-between m-0 p-0 w-full">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className={`group relative md:w-auto w-full`}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between md:justify-start no-underline  px-4 py-3 text-[16px] font-semibold transition-colors duration-200 ${item.active
                      ? `text-[#162f6a] border-b-8 border-[#162f6a] ${item.text !== 'Home' ? 'bg-[#fff]' : ''}`
                      : `text-[#1b1b1b] hover:text-[#162f6a] ${item.text !== 'Home' ? 'hover:bg-[#d2dfff]' : ''}`
                      }`}


                    onClick={(e) => {
                      if (item.dropdown && typeof window !== 'undefined' && window.innerWidth < 769) {
                        e.preventDefault();
                        toggleDropdown(index);
                      }
                    }}
                  >
                    <span className="leading-none text-[22px] " style={{ fontWeight: '600' }}>{item.text}</span>
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

          {/* Right: Mobile toggle is controlled from Header; keep hidden here */}
          <button
            className="hidden md:hidden"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Right spacer on desktop */}
          <div className="hidden md:block w-6" />
        </div>
      </div>

      {/* Mobile drawer and backdrop */}
      <>
        {/* Backdrop */}
        <div
          className={`md:hidden fixed inset-0 bg-black/30 transition-opacity duration-200 z-[1200] ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={toggleMobileMenu}
        />

        {/* Drawer */}
        <aside
          className={`md:hidden fixed top-0 right-0 h-full w-[80%] max-w-[360px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] transform transition-transform duration-300 z-[1201] ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-4 h-14 border-b border-[#eee]">
            <span className="text-[18px] font-semibold text-[#162f6a]">Menu</span>
            <button className="bg-transparent border-0 p-2 text-[#333]" aria-label="Close" onClick={toggleMobileMenu}>
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
          <ul className="m-0 p-2">
            {navItems.map((item, index) => (
              <li key={index} className="">
                <Link
                  href={item.href}
                  className={`flex items-center justify-between no-underline px-4 py-3 text-[16px] font-semibold ${item.active ? 'text-[#162f6a]' : 'text-[#1b1b1b]'}`}
                  onClick={(e) => {
                    if (item.dropdown) {
                      e.preventDefault();
                      setActiveDropdown(activeDropdown === index ? null : index);
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  <span>{item.text}</span>
                  {item.dropdown && (
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  )}
                </Link>

                {/* Mobile dropdown items */}
                {item.dropdown && item.items && (
                  <div className={`${activeDropdown === index ? 'block' : 'hidden'}`}>
                    <ul className="pl-6">
                      {item.items.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.href}
                            className="block no-underline text-[15px] text-[#162f6a] py-2"
                            onClick={() => setMobileMenuOpen(false)}
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
        </aside>
      </>
    </nav>
  );
}
