"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchWithCacheBusting } from '@/utils/api';
import { createPortal } from 'react-dom';

export default function NewNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stickyTop, setStickyTop] = useState(0);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  /*
   * ============================================================
   * STATIC NEXT.JS ROUTES
   * ============================================================
   *
   * These routes will continue using next/link.
   *
   * Add your other STATIC Next.js pages here.
   *
   * Everything else coming from the DB navigation will be
   * treated as a CMS page and will use normal <a href="">
   * navigation.
   *
   * This prevents Next.js from requesting:
   *
   * /_next/data/<build-id>/page.json?slug=...
   *
   * for CMS pages, which is useful behind your WAF.
   */
  const STATIC_ROUTES = [
    '/',
    '/documents',

    // Add other STATIC Next.js pages here, for example:
    // '/search',
    // '/contact',
    // '/sitemap',
  ];

  /*
   * Static route prefixes.
   *
   * /documents
   * /documents/reports
   * /documents/something
   *
   * will all use next/link.
   *
   * If you have other static route families, add them here.
   */
  const STATIC_ROUTE_PREFIXES = [
    '/documents',
  ];

  /*
   * Determine whether URL is an internal application URL.
   */
  const isInternalPath = (href) => {
    if (!href || href === '#') {
      return false;
    }

    if (typeof href !== 'string') {
      return false;
    }

    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('//') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:')
    ) {
      return false;
    }

    return href.startsWith('/');
  };

  /*
   * Normalize pathname for comparison.
   */
  const normalizePath = (href) => {
    if (!href || typeof href !== 'string') {
      return '';
    }

    try {
      const url = new URL(href, 'http://example.local');

      let pathname = url.pathname || '/';

      if (pathname.length > 1) {
        pathname = pathname.replace(/\/+$/, '');
      }

      return pathname || '/';
    } catch {
      return href.length > 1
        ? href.replace(/\/+$/, '')
        : href;
    }
  };

  /*
   * Determine whether a DB navigation URL is a static
   * Next.js page.
   *
   * Static page:
   *     /documents
   *     /documents/reports
   *
   * CMS page:
   *     /about-us
   *     /about-us/our-organization
   *     /connect/contact-us
   *     etc.
   */
  const isStaticRoute = (href) => {
    if (!isInternalPath(href)) {
      return false;
    }

    const pathname = normalizePath(href);

    /*
     * Exact static routes.
     */
    if (STATIC_ROUTES.includes(pathname)) {
      return true;
    }

    /*
     * Static route prefixes.
     */
    return STATIC_ROUTE_PREFIXES.some((prefix) => {
      const normalizedPrefix = normalizePath(prefix);

      return (
        pathname === normalizedPrefix ||
        pathname.startsWith(normalizedPrefix + '/')
      );
    });
  };

  /*
   * ============================================================
   * NAVIGATION COMPONENT
   * ============================================================
   *
   * Static Next.js page:
   *     <Link>
   *
   * CMS/DB page:
   *     <a>
   *
   * External URL:
   *     <a>
   */
  const SmartNavLink = ({
    href,
    children,
    className,
    onClick,
    onKeyDown,
    ...props
  }) => {
    /*
     * External URL
     */
    if (!isInternalPath(href)) {
      return (
        <a
          href={href}
          className={className}
          onClick={onClick}
          onKeyDown={onKeyDown}
          {...props}
        >
          {children}
        </a>
      );
    }

    /*
     * Known static Next.js route.
     *
     * This keeps client-side navigation for static pages.
     */
    if (isStaticRoute(href)) {
      return (
        <Link
          href={href}
          className={className}
          onClick={onClick}
          onKeyDown={onKeyDown}
          {...props}
        >
          {children}
        </Link>
      );
    }

    /*
     * CMS / DB page.
     *
     * IMPORTANT:
     *
     * Use normal browser navigation.
     *
     * Do NOT use next/link here.
     *
     * This prevents Next.js from requesting:
     *
     * /_next/data/<build-id>/...
     *
     * for CMS pages.
     */
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        onKeyDown={onKeyDown}
        {...props}
      >
        {children}
      </a>
    );
  };

  /*
   * ============================================================
   * AUTO CLOSE ON NEXT.JS ROUTE CHANGE
   * ============================================================
   */
  useEffect(() => {
    const handleRouteChange = () => {
      setActiveDropdown(null);
      setMobileMenuOpen(false);

      if (
        typeof document !== 'undefined' &&
        document.activeElement instanceof HTMLElement
      ) {
        document.activeElement.blur();
      }
    };

    router.events?.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events?.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  /*
   * ============================================================
   * MOBILE NAVBAR TOGGLE
   * ============================================================
   */
  useEffect(() => {
    const handler = () => {
      setMobileMenuOpen((prev) => !prev);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('toggle-navbar', handler);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('toggle-navbar', handler);
      }
    };
  }, []);

  /*
   * ============================================================
   * STICKY NAV TOP
   * ============================================================
   */
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const calc = () => {
      const el = document.getElementById('site-header');

      const h = el
        ? el.getBoundingClientRect().height
        : 0;

      setStickyTop(
        Math.max(0, Math.round(h))
      );
    };

    calc();

    window.addEventListener('resize', calc);
    window.addEventListener('scroll', calc);

    return () => {
      window.removeEventListener('resize', calc);
      window.removeEventListener('scroll', calc);
    };
  }, []);

  /*
   * ============================================================
   * PORTAL MOUNT
   * ============================================================
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * ============================================================
   * FETCH NAVIGATION
   * ============================================================
   */
  useEffect(() => {
    let isMounted = true;

    async function loadNav() {
      try {
        const res = await fetchWithCacheBusting(
          '/api/navigation'
        );

        if (!res.ok) {
          console.error(
            'Failed to load navigation:',
            res.status,
            res.statusText
          );

          return;
        }

        const data = await res.json();

        /*
         * Transform API tree.
         */
        const transform = (items) => {
          if (!items || !Array.isArray(items)) {
            return [];
          }

          return items.map((it) => {
            const rawHref = it.href || '#';

            let href = rawHref;

            /*
             * Existing documents URL handling.
             */
            if (
              typeof rawHref === 'string' &&
              rawHref.startsWith('/documents')
            ) {
              if (rawHref === '/documents') {
                href = '/documents';
              } else {
                const rest = String(rawHref)
                  .replace(/^\/documents\/?/, '');

                href =
                  `/documents/${encodeURIComponent(rest)}`;
              }
            }

            return {
              id: it.id,

              text: it.text,

              href,

              rawHref,

              dropdown:
                !!(
                  it.children &&
                  it.children.length > 0
                ),

              items: it.children
                ? transform(it.children)
                : [],
            };
          });
        };

        const prepared = transform(data);

        if (isMounted) {
          setNavItems(prepared);
        }

      } catch (e) {
        console.error(
          'Navbar: navigation fetch error',
          e
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadNav();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
   * ============================================================
   * MOBILE MENU
   * ============================================================
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  /*
   * ============================================================
   * DROPDOWN
   * ============================================================
   */
  const toggleDropdown = (index) => {
    setActiveDropdown(
      activeDropdown === index
        ? null
        : index
    );
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);

    if (
      typeof document !== 'undefined' &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }
  };

  /*
   * ============================================================
   * ACTIVE ROUTE
   * ============================================================
   */
  const isActive = (href) => {
    if (!href || href === '#') {
      return false;
    }

    try {
      const u = new URL(
        href,
        'http://example.local'
      );

      /*
       * Documents.
       */
      if (
        u.pathname.startsWith('/documents')
      ) {
        /*
         * Main documents page.
         */
        if (u.pathname === '/documents') {
          if (
            router.pathname !== '/documents'
          ) {
            return false;
          }

          const qNavItem =
            router.query?.nav_item;

          if (
            u.searchParams.has('nav_item')
          ) {
            return (
              String(
                u.searchParams.get(
                  'nav_item'
                )
              ) ===
              String(
                qNavItem || ''
              )
            );
          }

          if (
            u.searchParams.has('nav')
          ) {
            const linkParam =
              decodeURIComponent(
                String(
                  u.searchParams.get(
                    'nav'
                  ) || ''
                )
              );

            const currentNav =
              decodeURIComponent(
                String(
                  router.query?.nav ||
                  ''
                )
              );

            return (
              linkParam === currentNav
            );
          }

          return (
            router.pathname ===
            '/documents'
          );
        }

        /*
         * Documents child path.
         */
        const targetPath =
          u.pathname;

        const currentPath =
          router.asPath
            ? String(
                router.asPath
              ).split('?')[0]
            : router.pathname;

        return (
          currentPath ===
          targetPath
        );
      }

    } catch (e) {
      // Fall through to string comparison.
    }

    /*
     * Home.
     */
    if (href === '/') {
      return (
        router.pathname === '/'
      );
    }

    /*
     * Normal routes.
     */
    return (
      router.pathname === href ||
      router.pathname.startsWith(
        href + '/'
      )
    );
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */
  return (
    <nav
      className="hidden md:block bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] sticky z-[299]"
      style={{
        borderBottom:
          '2px solid #162f6a',
        top: stickyTop,
      }}
    >
      <div className="px-[2%]">

        {/* =====================================================
            DESKTOP NAVBAR
        ====================================================== */}

        <div className="flex justify-between h-13">

          <div className="flex-1 hidden md:flex">

            <ul className="flex flex-row md:items-center h-full m-0 p-0">

              {(loading ? [] : navItems).map(
                (item, index) => {

                  const itemActive =
                    isActive(item.href) ||
                    (
                      item.items &&
                      item.items.some(
                        (si) =>
                          isActive(
                            si.href
                          )
                      )
                    );

                  const showUnderline =
                    router.pathname !== '/' &&
                    itemActive;

                  return (
                    <li
                      key={
                        item.id ??
                        index
                      }
                      className="group relative md:w-auto w-full hover:bg-[#d2dfff] md:min-w-[140px] lg:min-w-[180px] xl:min-w-[220px] 2xl:min-w-[240px] h-full"
                    >

                      <SmartNavLink
                        href={item.href}
                        className={`
                          flex h-full
                          items-center
                          justify-between
                          md:justify-center
                          no-underline
                          px-4 py-3
                          transition-colors
                          duration-200
                          relative

                          ${
                            itemActive
                              ? 'text-[24px] font-[700] text-[#162f6a] bg-[#d2dfff]'
                              : 'text-[20px] font-[600] text-[#1b1b1b]'
                          }

                          group-hover:bg-[#d2dfff]
                          group-hover:text-[#162f6a]

                          ${
                            item.text !== 'Home'
                              ? itemActive
                                ? 'bg-[#fff]'
                                : 'hover:bg-[#d2dfff]'
                              : ''
                          }

                          ${
                            item.text === 'Home'
                              ? itemActive
                                ? 'bg-[#fff]'
                                : 'hover:bg-[#d2dfff]'
                              : ''
                          }
                        `}
                        onClick={(e) => {

                          /*
                           * On mobile, parent with dropdown
                           * acts as toggle.
                           *
                           * Desktop allows normal navigation.
                           */
                          if (
                            item.dropdown &&
                            typeof window !==
                              'undefined' &&
                            window.innerWidth <
                              769
                          ) {
                            e.preventDefault();

                            toggleDropdown(
                              index
                            );
                          } else {
                            closeDropdown();
                          }
                        }}
                        onKeyDown={(e) => {

                          if (
                            e.key === 'Enter' &&
                            item.dropdown &&
                            typeof window !==
                              'undefined' &&
                            window.innerWidth <
                              769
                          ) {
                            e.preventDefault();

                            toggleDropdown(
                              index
                            );
                          }
                        }}
                      >

                        <span className="flex items-center">

                          <span className="leading-none relative inline-block whitespace-nowrap text-2xl">

                            {item.text}

                            {showUnderline && (
                              <span
                                className="absolute left-0 -bottom-[14px] w-full h-[7px] bg-[#162f6a]"
                              />
                            )}

                          </span>

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
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          )}

                        </span>

                      </SmartNavLink>


                      {/* =================================================
                          DESKTOP DROPDOWN
                      ================================================== */}

                      {item.dropdown &&
                        item.items && (

                          <div
                            className={`
                              md:absolute
                              md:left-0
                              md:min-w-[240px]
                              md:rounded-b-[8px]
                              md:bg-[rgba(0,0,0,0.72)]
                              md:backdrop-blur-md
                              md:shadow-[0_6px_20px_rgba(0,0,0,0.3)]
                              md:opacity-0
                              md:invisible
                              md:translate-y-2
                              md:transition-all
                              md:duration-200

                              md:group-hover:opacity-100
                              md:group-hover:visible
                              md:group-hover:translate-y-0

                              ${
                                activeDropdown ===
                                index
                                  ? 'block'
                                  : 'hidden'
                              }

                              md:block
                            `}
                          >

                            <ul className="list-none m-0 p-0 md:bg-transparent bg-[#f9f9f9] md:shadow-none md:pl-0 pl-6">

                              {item.items.map(
                                (
                                  subItem,
                                  subIndex
                                ) => (

                                  <li
                                    key={
                                      subItem.id ??
                                      subIndex
                                    }
                                    className="p-0"
                                  >

                                    <SmartNavLink
                                      href={
                                        subItem.href
                                      }
                                      className="block no-underline text-[14.5px] font-medium text-center text-white md:text-white py-3 px-5 hover:bg-[#d2dfff] hover:text-[#000]"
                                      onClick={
                                        closeDropdown
                                      }
                                    >
                                      {
                                        subItem.text
                                      }
                                    </SmartNavLink>

                                  </li>

                                )
                              )}

                            </ul>

                          </div>

                        )}

                    </li>
                  );
                }
              )}

            </ul>

          </div>

          {/* Right spacer */}

          <div className="hidden md:block w-6" />

        </div>

      </div>


      {/* =========================================================
          MOBILE DRAWER
      ========================================================== */}

      {mounted &&
        createPortal(
          <>

            {/* Backdrop */}

            <div
              className={`
                md:hidden
                fixed
                inset-0
                bg-black/30
                transition-opacity
                duration-200
                z-[5000]

                ${
                  mobileMenuOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                }
              `}
              onClick={
                toggleMobileMenu
              }
            />


            {/* Drawer */}

            <aside
              className={`
                md:hidden
                fixed
                top-0
                right-0
                h-full
                w-[80%]
                max-w-[360px]
                bg-white
                shadow-[0_10px_30px_rgba(0,0,0,0.2)]
                transform
                transition-transform
                duration-300
                z-[5001]

                ${
                  mobileMenuOpen
                    ? 'translate-x-0'
                    : 'translate-x-full'
                }
              `}
              role="dialog"
              aria-modal="true"
            >

              <div className="flex items-center justify-between px-4 h-14 border-b border-[#eee]">

                <span className="text-[18px] font-semibold text-[#162f6a]">
                  Menu
                </span>

                <button
                  className="bg-transparent border-0 p-2 text-[#333]"
                  aria-label="Close"
                  onClick={
                    toggleMobileMenu
                  }
                >
                  <span className="material-symbols-outlined text-[22px]">
                    close
                  </span>
                </button>

              </div>


              <ul className="m-0 p-2">

                {(loading
                  ? []
                  : navItems
                ).map(
                  (item, index) => {

                    const itemActive =
                      isActive(
                        item.href
                      ) ||
                      (
                        item.items &&
                        item.items.some(
                          (si) =>
                            isActive(
                              si.href
                            )
                        )
                      );

                    const showUnderline =
                      router.pathname !== '/' &&
                      itemActive;

                    return (
                      <li
                        key={
                          item.id ??
                          index
                        }
                      >

                        {/* =================================================
                            MOBILE PARENT
                        ================================================== */}

                        <SmartNavLink
                          href={
                            item.href
                          }
                          className={`
                            flex
                            items-center
                            justify-between
                            md:justify-start
                            no-underline
                            px-4
                            py-3
                            relative

                            ${
                              itemActive
                                ? '!text-[24px] !font-[700] !text-[rgb(22,47,106)]'
                                : '!text-[20px] !font-[600] !text-[rgb(21,2,2)]'
                            }

                            transition-colors
                            duration-200

                            ${
                              itemActive
                                ? item.text !==
                                  'Home'
                                  ? 'bg-[#fff]'
                                  : ''
                                : item.text !==
                                  'Home'
                                  ? 'hover:bg-[#d2dfff]'
                                  : ''
                            }
                          `}
                          onClick={(e) => {

                            /*
                             * On mobile, if the parent has
                             * children, open dropdown rather
                             * than navigate immediately.
                             */
                            if (
                              item.dropdown
                            ) {
                              e.preventDefault();

                              setActiveDropdown(
                                activeDropdown ===
                                  index
                                  ? null
                                  : index
                              );
                            } else {
                              closeDropdown();
                            }
                          }}
                        >

                          <span className="flex items-center justify-between w-full">

                            <span className="relative">

                              {item.text}

                              {showUnderline && (
                                <span
                                  className="absolute bottom-0 left-0 right-0 h-2 bg-[rgb(22,47,106)]"
                                  style={{
                                    transform:
                                      'translateY(4px)',
                                  }}
                                />
                              )}

                            </span>


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
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            )}

                          </span>

                        </SmartNavLink>


                        {/* =================================================
                            MOBILE DROPDOWN
                        ================================================== */}

                        {item.dropdown &&
                          item.items && (

                            <div
                              className={`
                                ${
                                  activeDropdown ===
                                  index
                                    ? 'block'
                                    : 'hidden'
                                }
                              `}
                            >

                              <ul className="pl-6">

                                {item.items.map(
                                  (
                                    subItem,
                                    subIndex
                                  ) => (

                                    <li
                                      key={
                                        subItem.id ??
                                        subIndex
                                      }
                                    >

                                      <SmartNavLink
                                        href={
                                          subItem.href
                                        }
                                        className="block no-underline text-[15px] text-[#162f6a] py-2"
                                        onClick={
                                          closeDropdown
                                        }
                                      >
                                        {
                                          subItem.text
                                        }
                                      </SmartNavLink>

                                    </li>

                                  )
                                )}

                              </ul>

                            </div>

                          )}

                      </li>
                    );
                  }
                )}

              </ul>

            </aside>

          </>,
          document.body
        )}

    </nav>
  );
}