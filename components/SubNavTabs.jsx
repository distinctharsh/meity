import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';

import { useRouter } from 'next/router';
import { fetchWithCacheBusting } from '@/utils/api';

export default function SubNavTabs({ pagePath }) {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);

  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const [hasOverflow, setHasOverflow] =
    useState(false);

  const [showLeft, setShowLeft] =
    useState(false);

  const [showRight, setShowRight] =
    useState(false);

  /*
   * ============================================================
   * IMPORTANT:
   *
   * router.pathname is NOT suitable for dynamic pages.
   *
   * Example:
   *
   * router.pathname
   *     /documents/[slug]
   *
   * Actual URL
   *     /documents/cabinet-secretariat
   *
   * We therefore use router.asPath and extract only pathname.
   * ============================================================
   */

  const getActualPath = useCallback(() => {
    let value = pagePath;

    if (!value) {
      value = router?.asPath || '';
    }

    if (!value) {
      return '';
    }

    /*
     * Remove query string and hash.
     */
    value = String(value)
      .split('?')[0]
      .split('#')[0];

    /*
     * Ensure leading slash.
     */
    if (!value.startsWith('/')) {
      value = '/' + value;
    }

    /*
     * Remove duplicate trailing slash except root.
     */
    if (
      value.length > 1 &&
      value.endsWith('/')
    ) {
      value = value.replace(/\/+$/, '');
    }

    return value;
  }, [
    pagePath,
    router?.asPath,
  ]);

  const effectivePath =
    getActualPath();

  /*
   * ============================================================
   * CURRENT FULL URL
   * ============================================================
   */

  const getCurrentSearchParams = useCallback(() => {
    if (
      typeof window === 'undefined'
    ) {
      return new URLSearchParams();
    }

    return new URLSearchParams(
      window.location.search
    );
  }, []);

  /*
   * ============================================================
   * ARCHIVE DETECTION
   * ============================================================
   */

  const isArchivePath =
    effectivePath === '/archives' ||
    effectivePath === '/archives/all' ||
    effectivePath.startsWith(
      '/archives/'
    );

  /*
   * ============================================================
   * NORMALIZE URL
   * ============================================================
   */

  const normalizePath = useCallback(
    (value) => {
      if (!value) {
        return '';
      }

      let result = String(value)
        .trim();

      /*
       * Remove absolute origin if DB happens
       * to contain an absolute URL.
       */
      try {
        if (
          /^https?:\/\//i.test(result)
        ) {
          const url =
            new URL(result);

          result =
            url.pathname +
            url.search;
        }
      } catch {
        // Keep original value.
      }

      /*
       * Remove query/hash when comparing
       * navigation paths.
       */
      result =
        result
          .split('?')[0]
          .split('#')[0];

      if (!result.startsWith('/')) {
        result = '/' + result;
      }

      if (
        result.length > 1 &&
        result.endsWith('/')
      ) {
        result =
          result.replace(
            /\/+$/,
            ''
          );
      }

      return result;
    },
    []
  );

  /*
   * ============================================================
   * URL DECODE SAFELY
   * ============================================================
   */

  const safeDecode = useCallback(
    (value) => {
      if (
        value === null ||
        value === undefined
      ) {
        return '';
      }

      let result =
        String(value);

      /*
       * Decode repeatedly only when safe.
       * Maximum 2 levels prevents malformed
       * encoded values from causing problems.
       */
      for (
        let i = 0;
        i < 2;
        i++
      ) {
        try {
          const decoded =
            decodeURIComponent(
              result
            );

          if (
            decoded === result
          ) {
            break;
          }

          result = decoded;
        } catch {
          break;
        }
      }

      return result;
    },
    []
  );

  /*
   * ============================================================
   * NORMALIZE DOCUMENT URL
   *
   * Avoid double encoding.
   * ============================================================
   */

  const normalizeDocumentHref =
    useCallback(
      (href) => {
        if (!href) {
          return '#';
        }

        const raw =
          String(href).trim();

        if (
          raw === '/documents'
        ) {
          return '/documents';
        }

        if (
          !raw.startsWith(
            '/documents'
          )
        ) {
          return raw;
        }

        /*
         * Remove /documents/.
         */
        let rest =
          raw.replace(
            /^\/documents\/+/,
            ''
          );

        /*
         * Decode an already encoded
         * database value first.
         */
        rest =
          safeDecode(rest);

        /*
         * Encode exactly once.
         */
        return (
          '/documents/' +
          encodeURIComponent(
            rest
          )
        );
      },
      [safeDecode]
    );

  /*
   * ============================================================
   * LOAD SUB NAVIGATION
   * ============================================================
   */

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        if (!effectivePath) {
          if (mounted) {
            setItems([]);
          }

          return;
        }

        /*
         * --------------------------------------------------------
         * PAGE HEADER
         *
         * This is deliberately non-blocking.
         * If page-header fails because of WAF/API issue,
         * navigation must still be loaded.
         * --------------------------------------------------------
         */

        try {
          const res =
            await fetch(
              `/api/page-header?path=${encodeURIComponent(
                effectivePath
              )}`,
              {
                cache: 'no-store',
                headers: {
                  Accept:
                    'application/json',
                },
              }
            );

          if (res.ok) {
            await res
              .json()
              .catch(
                () => null
              );
          }
        } catch (error) {
          console.warn(
            'SubNav page-header request failed:',
            error
          );
        }

        /*
         * --------------------------------------------------------
         * NAVIGATION
         * --------------------------------------------------------
         */

        const navRes =
          await fetchWithCacheBusting(
            '/api/navigation'
          );

        if (!navRes.ok) {
          if (mounted) {
            setItems([]);
          }

          return;
        }

        const nav =
          await navRes.json();

        const derived =
          deriveFromNavigation(
            nav,
            effectivePath,
            {
              isArchivePath,
              normalizePath,
              normalizeDocumentHref,
              safeDecode,
            }
          );

        if (mounted) {
          setItems(
            Array.isArray(
              derived
            )
              ? derived
              : []
          );
        }
      } catch (error) {
        console.error(
          'SubNav load error:',
          error
        );

        if (mounted) {
          setItems([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [
    effectivePath,
    isArchivePath,
    normalizePath,
    normalizeDocumentHref,
    safeDecode,
  ]);

  /*
   * ============================================================
   * OVERFLOW
   * ============================================================
   */

  const updateOverflow =
    useCallback(() => {
      const el =
        containerRef.current;

      if (!el) {
        return;
      }

      const overflow =
        el.scrollWidth >
        el.clientWidth + 1;

      setHasOverflow(
        overflow
      );

      setShowLeft(
        el.scrollLeft > 0
      );

      setShowRight(
        el.scrollLeft +
          el.clientWidth <
        el.scrollWidth - 1
      );
    }, []);

  useEffect(() => {
    updateOverflow();

    const onResize =
      () => updateOverflow();

    window.addEventListener(
      'resize',
      onResize
    );

    return () => {
      window.removeEventListener(
        'resize',
        onResize
      );
    };
  }, [
    updateOverflow,
    items,
  ]);

  /*
   * ============================================================
   * DRAG SCROLL
   * ============================================================
   */

  function handlePointerDown(e) {
    const el =
      containerRef.current;

    if (!el) {
      return;
    }

    isDraggingRef.current =
      true;

    hasDraggedRef.current =
      false;

    startXRef.current =
      e.clientX;

    startScrollLeftRef.current =
      el.scrollLeft;

    try {
      e.target.setPointerCapture?.(
        e.pointerId
      );
    } catch {}

    try {
      el.classList.add(
        'dragging'
      );
    } catch {}
  }

  function handlePointerMove(e) {
    if (
      !isDraggingRef.current
    ) {
      return;
    }

    const el =
      containerRef.current;

    if (!el) {
      return;
    }

    const dx =
      e.clientX -
      startXRef.current;

    /*
     * Only treat as a real drag after
     * movement exceeds 5 pixels.
     */
    if (
      Math.abs(dx) > 5
    ) {
      hasDraggedRef.current =
        true;
    }

    if (
      !hasDraggedRef.current
    ) {
      return;
    }

    el.scrollLeft =
      startScrollLeftRef.current -
      dx;

    updateOverflow();
  }

  function handlePointerUp(e) {
    const wasDragged =
      hasDraggedRef.current;

    isDraggingRef.current =
      false;

    try {
      e.target.releasePointerCapture?.(
        e.pointerId
      );
    } catch {}

    try {
      containerRef.current?.classList.remove(
        'dragging'
      );
    } catch {}

    /*
     * Keep the flag alive briefly so
     * the click event generated after
     * pointerup can be cancelled.
     */
    if (wasDragged) {
      setTimeout(() => {
        hasDraggedRef.current =
          false;
      }, 80);
    } else {
      hasDraggedRef.current =
        false;
    }
  }



  function scrollBy(amount) {
    const el =
      containerRef.current;

    if (!el) {
      return;
    }

    el.scrollBy({
      left: amount,
      behavior: 'smooth',
    });

    setTimeout(
      updateOverflow,
      220
    );
  }

  /*
   * ============================================================
   * ACTIVE ITEM
   * ============================================================
   */

  const isActiveItem =
    useCallback(
      (
        item,
        displayHref
      ) => {
        if (!item) {
          return false;
        }

        const href =
          normalizePath(
            displayHref ||
              item.href ||
              ''
          );

        if (!href) {
          return false;
        }

        /*
         * ------------------------------------------------------
         * ARCHIVE
         * ------------------------------------------------------
         */

        if (
          isArchivePath &&
          href.startsWith(
            '/archives'
          )
        ) {
          const params =
            getCurrentSearchParams();

          const currentPage =
            params.get(
              'page'
            );

          /*
           * Agar URL mein koi ?page parameter nahi hai,
           * toh koi bhi archive tab active nahi hona chahiye.
           */
          if (!currentPage) {
            return false;
          }

          if (
            item.archiveHref
          ) {
            const archiveParams =
              new URLSearchParams(
                String(
                  item.archiveHref
                ).split('?')[1] ||
                  ''
              );

            const archivePage =
              archiveParams.get(
                'page'
              );

            if (
              currentPage &&
              archivePage &&
              safeDecode(
                currentPage
              ).trim().toLowerCase() ===
                safeDecode(
                  archivePage
                ).trim().toLowerCase()
            ) {
              return true;
            }
          }

          return false;
        }

        /*
         * ------------------------------------------------------
         * DOCUMENTS
         * ------------------------------------------------------
         */

        if (
          href.startsWith(
            '/documents'
          )
        ) {
          const currentPath =
            normalizePath(
              getActualPath()
            );

          /*
           * /documents itself.
           */
          if (
            currentPath ===
              '/documents' &&
            href ===
              '/documents'
          ) {
            const params =
              getCurrentSearchParams();

            const navItem =
              params.get(
                'nav_item'
              );

            const nav =
              params.get(
                'nav'
              );

            if (
              !navItem &&
              !nav
            ) {
              return true;
            }
          }

          /*
           * Query-based document navigation.
           */
          if (
            typeof window !==
            'undefined'
          ) {
            const params =
              new URLSearchParams(
                window.location
                  .search
              );

            const navItem =
              params.get(
                'nav_item'
              );

            const nav =
              params.get(
                'nav'
              );

            if (
              navItem &&
              item.id &&
              String(
                navItem
              ) ===
                String(
                  item.id
                )
            ) {
              return true;
            }

            if (
              nav
            ) {
              const decodedNav =
                normalizePath(
                  safeDecode(
                    nav
                  )
                );

              const decodedHref =
                normalizePath(
                  item.href ||
                    href
                );

              if (
                decodedNav ===
                decodedHref
              ) {
                return true;
              }
            }
          }

          /*
           * Dynamic document URL.
           */
          return (
            currentPath ===
            href
          );
        }

        /*
         * ------------------------------------------------------
         * NORMAL DYNAMIC CMS PAGE
         * ------------------------------------------------------
         */

        const current =
          normalizePath(
            getActualPath()
          );

        const target =
          normalizePath(
            href
          );

        return (
          current ===
            target ||
          current.startsWith(
            target + '/'
          )
        );
      },
      [
        getActualPath,
        getCurrentSearchParams,
        isArchivePath,
        normalizeDocumentHref,
        normalizePath,
        safeDecode,
      ]
    );

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return null;
  }

  if (!items.length) {
    return null;
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      <style>{`
        .dot-before::before {
          content: '';
          position: absolute;
          left: -8px;
          top: 0px;
          width: 12px;
          height: 28px;

          background-image: url("data:image/svg+xml,%3Csvg width='12' height='28' viewBox='0 0 12 28' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_1293_43610)'%3E%3Cpath d='M8.35593 3.06788C8.35593 4.07416 9.17168 4.88992 10.178 4.88992C11.1842 4.88992 12 4.07417 12 3.06788C12 2.0616 11.1842 1.24585 10.178 1.24585C9.17168 1.24585 8.35593 2.0616 8.35593 3.06788Z' fill='white'/%3E%3Cpath d='M8.35593 10.356C8.35593 11.3623 9.17168 12.178 10.178 12.178C11.1842 12.178 12 11.3623 12 10.356C12 9.34969 11.1842 8.53394 10.178 8.53394C9.17168 8.53394 8.35593 9.34969 8.35593 10.356Z' fill='white'/%3E%3Cpath d='M8.35593 17.6441C8.35593 18.6503 9.17168 19.4661 10.178 19.4661C11.1842 19.4661 12 18.6503 12 17.6441C12 16.6378 11.1842 15.822 10.178 15.822C9.17168 15.822 8.35593 16.6378 8.35593 17.6441Z' fill='white'/%3E%3Cpath d='M8.35593 24.9321C8.35593 25.9384 9.17168 26.7542 10.178 26.7542C11.1842 26.7542 12 25.9384 12 24.9321C12 23.9259 11.1842 23.1101 10.178 23.1101C9.17168 23.1101 8.35593 23.9259 8.35593 24.9321Z' fill='white'/%3E%3Cpath d='M1.06785 3.06788C1.06785 4.07416 1.8836 4.88992 2.88988 4.88992C3.89616 4.88992 4.71191 4.07417 4.71191 3.06788C4.71191 2.0616 3.89616 1.24585 2.88988 1.24585C1.8836 1.24585 1.06785 2.0616 1.06785 3.06788Z' fill='white'/%3E%3Cpath d='M1.06785 10.356C1.06785 11.3623 1.8836 12.178 2.88988 12.178C3.89616 12.178 4.71191 11.3623 4.71191 10.356C4.71191 9.34969 3.89616 8.53394 2.88988 8.53394C1.06785 10.356 1.06785 10.356 1.06785 10.356Z' fill='white'/%3E%3Cpath d='M1.06785 17.6441C1.06785 18.6503 1.8836 19.4661 2.88988 19.4661C3.89616 19.4661 4.71191 18.6503 4.71191 17.6441C4.71191 16.6378 3.89616 15.822 2.88988 15.822C1.06785 17.6441 1.06785 17.6441 1.06785 17.6441Z' fill='white'/%3E%3C/g%3E%3C/svg%3E");

          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }

        .subnav-scroll {
          overflow-x: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
          cursor: grab;
          user-select: none;
        }

        .subnav-scroll.dragging {
          cursor: grabbing;
        }

        .subnav-scroll::-webkit-scrollbar {
          display: none;
        }

        .scroll-button {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }

        .scroll-button:hover {
          background: rgba(255,255,255,0.14);
        }
      `}</style>

      <section
        className="bg-white"
        style={{
          marginTop: '-10px',
          position: 'absolute',
          width: '100%',
        }}
      >
        <div className="gi-container">
          <div
            style={{
              marginTop: '-40px',
              position: 'relative',
              zIndex: 10,
            }}
          >
            <div
              ref={containerRef}
              onPointerDown={
                handlePointerDown
              }
              onPointerMove={
                handlePointerMove
              }
              onPointerUp={
                handlePointerUp
              }
              onPointerCancel={
                handlePointerUp
              }
              onPointerLeave={
                handlePointerUp
              }
              className="
                bg-[#162f6a]
                rounded-xl
                px-6
                py-4
                flex
                items-center
                space-x-6
                subnav-scroll
                flex-nowrap
              "
              style={{
                alignItems:
                  'center',
              }}
            >
              {items.map((it) => {
                let displayHref =
                  it.href ||
                  it.archiveHref ||
                  '#';

                if (
                  isArchivePath &&
                  it.archiveHref
                ) {
                  displayHref =
                    it.archiveHref;
                } else if (
                  it.href &&
                  String(
                    it.href
                  ).startsWith(
                    '/documents'
                  )
                ) {
                  displayHref =
                    normalizeDocumentHref(
                      it.href
                    );
                } else if (
                  typeof displayHref ===
                    'string' &&
                  displayHref.startsWith(
                    '/'
                  )
                ) {
                  if (
                    !displayHref.startsWith(
                      '/archives?'
                    )
                  ) {
                    const hashIndex =
                      displayHref.indexOf(
                        '#'
                      );

                    if (
                      hashIndex >= 0
                    ) {
                      displayHref =
                        displayHref.slice(
                          0,
                          hashIndex
                        );
                    }
                  }
                }

                const keyValue =
                  it.id
                    ? `${it.id}-${displayHref}`
                    : displayHref;

                const active =
                  isActiveItem(
                    it,
                    displayHref
                  );

                if (active) {
                  return (
                    <span
                      key={
                        keyValue
                      }
                      className="
                        text-white
                        font-bold
                        relative
                        pl-3
                        dot-before
                        whitespace-nowrap
                        font-20-700
                      "
                      style={{
                        color: '#fff',
                      }}
                    >
                      {it.label}
                    </span>
                  );
                }

                return (
                  <a
                    key={
                      keyValue
                    }
                    href={
                      displayHref
                    }
                    className="
                      text-white/80
                      hover:text-white
                      whitespace-nowrap
                      font-20-400
                    "
                    style={{
                      color: '#fff',
                    }}
                    onClick={(e) => {
                      if (
                        hasDraggedRef.current
                      ) {
                        e.preventDefault();
                        e.stopPropagation();

                        setTimeout(
                          () => {
                            hasDraggedRef.current =
                              false;
                          },
                          80
                        );
                      }
                    }}
                  >
                    {it.label}
                  </a>
                );
              })}
            </div>

            {hasOverflow ? (
              <>
                {showLeft ? (
                  <button
                    type="button"
                    aria-label="Scroll left"
                    onClick={() =>
                      scrollBy(
                        -Math.max(
                          160,
                          (
                            containerRef
                              .current
                              ?.clientWidth ||
                            320
                          ) * 0.6
                        )
                      )
                    }
                    className="
                      scroll-button
                      left
                    "
                    style={{
                      position:
                        'absolute',
                      left: 8,
                      top: '50%',
                      transform:
                        'translateY(-50%)',
                      zIndex: 20,
                    }}
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>
                ) : null}

                {showRight ? (
                  <button
                    type="button"
                    aria-label="Scroll right"
                    onClick={() =>
                      scrollBy(
                        Math.max(
                          160,
                          (
                            containerRef
                              .current
                              ?.clientWidth ||
                            320
                          ) * 0.6
                        )
                      )
                    }
                    className="
                      scroll-button
                      right
                    "
                    style={{
                      position:
                        'absolute',
                      right: 8,
                      top: '50%',
                      transform:
                        'translateY(-50%)',
                      zIndex: 20,
                    }}
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}


function deriveFromNavigation(
  nav,
  path,
  helpers
) {
  if (
    !Array.isArray(nav)
  ) {
    return [];
  }

  const {
    normalizePath,
    normalizeDocumentHref,
    safeDecode,
  } = helpers;

  const actualPath =
    normalizePath(
      path
    );

  if (!actualPath) {
    return [];
  }

  const findByLink = (
    nodes,
    target
  ) => {
    const normalizedTarget =
      normalizePath(
        target
      );

    for (
      const node of
        nodes || []
    ) {
      const nodeHref =
        node.link ||
        node.href ||
        '';

      const normalizedNodeHref =
        normalizePath(
          nodeHref
        );

      if (
        normalizedNodeHref ===
        normalizedTarget
      ) {
        return node;
      }

      if (
        Array.isArray(
          node.children
        ) &&
        node.children.length
      ) {
        const found =
          findByLink(
            node.children,
            target
          );

        if (found) {
          return found;
        }
      }
    }

    let bestMatch =
      null;

    let bestLength = -1;

    const findParentMatch =
      (nodes) => {
        for (
          const node of
            nodes || []
        ) {
          const nodeHref =
            normalizePath(
              node.link ||
                node.href ||
                ''
            );

          if (
            nodeHref &&
            normalizedTarget.startsWith(
              nodeHref + '/'
            )
          ) {
            if (
              nodeHref.length >
              bestLength
            ) {
              bestMatch =
                node;

              bestLength =
                nodeHref.length;
            }
          }

          if (
            Array.isArray(
              node.children
            ) &&
            node.children.length
          ) {
            findParentMatch(
              node.children
            );
          }
        }
      };

    findParentMatch(
      nodes
    );

    return bestMatch;
  };

  const findByName = (
    nodes,
    targetPath
  ) => {
    const targetSection =
      String(
        targetPath
      )
        .replace(
          /^\//,
          ''
        )
        .toLowerCase();

    for (
      const node of
        nodes || []
    ) {
      const name =
        String(
          node.name ||
            node.label ||
            node.text ||
            ''
        ).toLowerCase();

      if (
        name.includes(
          targetSection
        )
      ) {
        return node;
      }

      if (
        Array.isArray(
          node.children
        ) &&
        node.children.length
      ) {
        const found =
          findByName(
            node.children,
            targetPath
          );

        if (found) {
          return found;
        }
      }
    }

    return null;
  };

  const isArchive =
    actualPath ===
      '/archives' ||
    actualPath ===
      '/archives/all' ||
    actualPath.startsWith(
      '/archives/'
    );

  if (isArchive) {
    const sectionNames = [
      'documents',
      'offerings',
      'document',
      'offering',
      'दस्तावेज',
      'प्रसाद',
    ];

    let allChildren =
      [];

    for (
      const sectionName of
        sectionNames
    ) {
      const section =
        nav.find(
          (node) => {
            const name =
              String(
                node.name ||
                  node.label ||
                  node.text ||
                  ''
              ).toLowerCase();

            const link =
              String(
                node.link ||
                  node.href ||
                  ''
              ).toLowerCase();

            return (
              name.includes(
                sectionName
              ) ||
              link.includes(
                sectionName
              )
            );
          }
        );

      if (
        section &&
        Array.isArray(
          section.children
        )
      ) {
        allChildren =
          allChildren.concat(
            section.children
              .map(
                (child) => ({
                  ...child,

                  link:
                    child.link ||
                    child.href,

                  href:
                    child.link ||
                    child.href,

                  originalLink:
                    child.link ||
                    child.href,
                })
              )
          );
      }
    }

    if (
      allChildren.length === 0
    ) {
      const collectChildren =
        (nodes) => {
          for (
            const node of
              nodes || []
          ) {
            if (
              Array.isArray(
                node.children
              ) &&
              node.children.length
            ) {
              allChildren =
                allChildren.concat(
                  node.children.map(
                    (child) => ({
                      ...child,

                      link:
                        child.link ||
                        child.href,

                      href:
                        child.link ||
                        child.href,

                      originalLink:
                        child.link ||
                        child.href,
                    })
                  )
                );

              collectChildren(
                node.children
              );
            }
          }
        };

      collectChildren(
        nav
      );
    }

    const unique =
      new Map();

    for (
      const child of
        allChildren
    ) {
      const href =
        normalizePath(
          child.originalLink ||
            child.link ||
            child.href ||
            '#'
        );

      if (
        !unique.has(
          href
        )
      ) {
        unique.set(
          href,
          child
        );
      }
    }

    return Array.from(
      unique.values()
    )
      .filter(
        (child) =>
          child.is_active !==
            false &&
          child.is_show !==
            false
      )
      .map(
        (child) => {
          const originalHref =
            child.originalLink ||
            child.link ||
            child.href ||
            '#';

          let slug =
            String(
              originalHref
            )
              .replace(
                /^\/+/,
                ''
              )
              .split('/')
              .slice(1)
              .join('-');

          slug =
            safeDecode(
              slug
            );

          const archiveHref =
            '/archives?page=' +
            encodeURIComponent(
              slug
            );

          const raw =
            child.text ||
            child.name ||
            child.label ||
            child.title ||
            '';

          const label =
            raw &&
            String(raw)
              .trim()
              .length
              ? raw
              : formatLabelFromHref(
                  originalHref
                );

          return {
            label,
            href:
              normalizePath(
                originalHref
              ),
            archiveHref,
            id: child.id,
          };
        }
      );
  }

  const parts =
    actualPath
      .split('/')
      .filter(Boolean);

  if (!parts.length) {
    return [];
  }

  const sectionPath =
    '/' + parts[0];

  let sectionNode =
    findByLink(
      nav,
      sectionPath
    );

  if (
    !sectionNode &&
    sectionPath ===
      '/documents'
  ) {
    sectionNode =
      findByName(
        nav,
        sectionPath
      );
  }

  let children =
    sectionNode?.children ||
    [];

  if (
    !children.length
  ) {
    const currentNode =
      findByLink(
        nav,
        actualPath
      );

    if (
      currentNode
    ) {
      const parentOf =
        (
          nodes,
          target,
          parent = null
        ) => {
          for (
            const node of
              nodes || []
          ) {
            if (
              node === target
            ) {
              return parent;
            }

            if (
              Array.isArray(
                node.children
              ) &&
              node.children.length
            ) {
              const parentResult =
                parentOf(
                  node.children,
                  target,
                  node
                );

              if (
                parentResult
              ) {
                return parentResult;
              }
            }
          }

          return null;
        };

      const parent =
        parentOf(
          nav,
          currentNode
        );

      if (
        parent &&
        Array.isArray(
          parent.children
        )
      ) {
        children =
          parent.children;
      }
    }
  }

  if (
    !children.length
  ) {
    const currentNode =
      findByLink(
        nav,
        actualPath
      );

    if (
      currentNode &&
      Array.isArray(
        currentNode.children
      )
    ) {
      children =
        currentNode.children;
    }
  }

  return (
    children || []
  )
    .filter(
      (child) =>
        child.is_active !==
          false &&
        child.is_show !==
          false
    )
    .map(
      (child) => {
        let href =
          child.link ||
          child.href ||
          '#';

        if (
          href.startsWith(
            '/documents'
          )
        ) {
          href =
            normalizeDocumentHref(
              href
            );
        } else if (
          href.startsWith('/')
        ) {
          href =
            normalizePath(
              href
            );
        }

        const raw =
          child.text ||
          child.name ||
          child.label ||
          child.title ||
          '';

        const label =
          raw &&
          String(raw)
            .trim()
            .length
            ? raw
            : formatLabelFromHref(
                href
              );

        return {
          label,
          href,
          id: child.id,
        };
      }
    );
}

function formatLabelFromHref(
  href
) {
  if (
    !href ||
    href === '#'
  ) {
    return 'Item';
  }

  try {
    const clean =
      String(href)
        .split('?')[0]
        .split('#')[0];

    const segments =
      clean
        .split('/')
        .filter(Boolean);

    const last =
      segments[
        segments.length - 1
      ] || '';

    if (!last) {
      return 'Item';
    }

    return last
      .replace(
        /[-_]+/g,
        ' '
      )
      .replace(
        /\s+/g,
        ' '
      )
      .trim()
      .replace(
        /\b\w/g,
        (m) =>
          m.toUpperCase()
      );
  } catch {
    return 'Item';
  }
}