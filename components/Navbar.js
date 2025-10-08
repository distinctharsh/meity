"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchWithCacheBusting } from '@/utils/api';

export default function NewNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch navigation from DB-backed API and prepare structure
  useEffect(() => {
    let isMounted = true;
    async function loadNav() {
      try {
        const res = await fetchWithCacheBusting('/api/navigation');
        if (!res.ok) {
          console.error('Failed to load navigation:', res.status, res.statusText);
          return; // Return early instead of throwing error
        }
        const data = await res.json();

        // Transform API tree into component's expected shape
        const transform = (items) =>
          items.map((it) => ({
            text: it.text,
            href: it.href || '#',
            dropdown: (it.children && it.children.length > 0) || false,
            items: it.children ? transform(it.children) : [],
          }));

        const prepared = transform(data);
        if (isMounted) setNavItems(prepared);
      } catch (e) {
        console.error('Navbar: navigation fetch error', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadNav();
    return () => {
      isMounted = false;
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

  return (
    <nav className="bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] border-t border-[#d0d0d0] sticky top-[154px] z-[299]" style={{borderBottom: '2px solid #162f6a'}}>
      <div className="px-[7%]">
        {/* Bar container */}
        <div className="flex items-center justify-between h-13">
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
              {(loading ? [] : navItems).map((item, index) => (
                <li
                  key={index}
                  className={`group relative md:w-auto w-full`}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between md:justify-start no-underline  px-4 py-3 text-[16px] font-semibold transition-colors duration-200 ${(isActive(item.href) || (item.items && item.items.some((si) => isActive(si.href))))
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
                    <span className="flex items-center">
                      <span className="leading-none text-[20px] " style={{ fontWeight: '600' }}>{item.text}</span>
                      {item.dropdown && (
                        <svg
                          className="ml-2 w-5 h-5 md:transform md:transition-transform md:duration-200 md:group-hover:rotate-180"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      )}
                    </span>
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
            {(loading ? [] : navItems).map((item, index) => (
              <li key={index} className="">
                <Link
                  href={item.href}
                  className={`flex items-center justify-between no-underline px-4 py-3 text-[16px] font-semibold ${isActive(item.href) ? 'text-[#162f6a]' : 'text-[#1b1b1b]'}`}
                  onClick={(e) => {
                    if (item.dropdown) {
                      e.preventDefault();
                      setActiveDropdown(activeDropdown === index ? null : index);
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  <span className="flex items-center justify-between w-full">
                    <span>{item.text}</span>
                    {item.dropdown && (
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    )}
                  </span>
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
