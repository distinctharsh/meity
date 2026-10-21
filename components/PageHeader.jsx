import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { t } from '@/lib/translations';

function toTitleCase(str = '') {
  return str
    .replace(/[-_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function PageHeader({
  pagePath,
  fallbackHeading,
  fallbackSubheading,
  fallbackBackgroundUrl,
  breadcrumbPath: externalBreadcrumb = []
}) {
  const router = useRouter();

  /*
   * IMPORTANT:
   *
   * Never use router.pathname for a catch-all dynamic route.
   *
   * router.pathname:
   *     /[...slug]
   *
   * router.asPath:
   *     /about-us/our-organization
   */

  const getActualPath = () => {
    /*
     * 1. Explicit pagePath from DB/SSR is preferred.
     */
    if (
      pagePath &&
      typeof pagePath === 'string' &&
      !pagePath.includes('[...') &&
      !pagePath.includes('[')
    ) {
      return pagePath.split('?')[0];
    }

    /*
     * 2. Use actual browser URL.
     */
    if (
      router &&
      router.isReady &&
      router.asPath &&
      !router.asPath.includes('[...') &&
      !router.asPath.includes('[')
    ) {
      return router.asPath.split('?')[0];
    }

    /*
     * 3. Do NOT return router.pathname because
     * catch-all routes give /[...slug].
     */
    return '';
  };

  const effectivePath = getActualPath();

  const [cfg, setCfg] = useState(null);
  const [autoBreadcrumbPath, setAutoBreadcrumbPath] =
    useState([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbPath =
    externalBreadcrumb.length > 0
      ? externalBreadcrumb
      : autoBreadcrumbPath;


  /*
   * =========================================================
   * LOAD HEADER
   * =========================================================
   */

  useEffect(() => {
    let mounted = true;

    async function load() {
      /*
       * Do not make API call until we have a real URL.
       */
      if (
        !effectivePath ||
        effectivePath.includes('[...') ||
        effectivePath.includes('[')
      ) {
        return;
      }

      try {
        setLoading(true);

        /*
         * Build URL explicitly.
         */
        const apiUrl =
          `/api/page-header?path=${encodeURIComponent(
            effectivePath
          )}`;

        console.log(
          '[PageHeader] Loading:',
          effectivePath
        );

        const res = await fetch(
          apiUrl,
          {
            method: 'GET',
            cache: 'no-store',
            headers: {
              Accept: 'application/json'
            }
          }
        );

        let data = null;

        if (res.ok) {
          try {
            data = await res.json();
          } catch (jsonError) {
            console.error(
              '[PageHeader] JSON error:',
              jsonError
            );
          }
        }

        if (mounted) {
          setCfg(data);
        }


        /*
         * =====================================================
         * NAVIGATION / BREADCRUMB
         * =====================================================
         */

        let resolvedPath = [];

        try {
          const navRes = await fetch(
            '/api/navigation',
            {
              method: 'GET',
              cache: 'no-store',
              headers: {
                Accept: 'application/json'
              }
            }
          );

          if (navRes.ok) {
            const nav =
              await navRes.json();

            const navMap = new Map();

            const buildNavMap = (nodes) => {
              for (const n of nodes || []) {
                const linkVal =
                  n.href ||
                  n.link ||
                  '';

                if (linkVal) {
                  navMap.set(
                    linkVal,
                    n
                  );

                  navMap.set(
                    linkVal.replace(
                      /^\//,
                      ''
                    ),
                    n
                  );
                }

                if (
                  n.children &&
                  n.children.length
                ) {
                  buildNavMap(
                    n.children
                  );
                }
              }
            };

            buildNavMap(nav);

            const cleanPath =
              effectivePath
                .replace(
                  /\/$/,
                  ''
                );

            const currentItem =
              navMap.get(
                cleanPath
              ) ||
              navMap.get(
                cleanPath.replace(
                  /^\//,
                  ''
                )
              );

            const buildBreadcrumb = (
              node,
              path = []
            ) => {
              if (!node) {
                return path;
              }

              const name =
                node.text ||
                node.name ||
                node.label ||
                node.title ||
                '';

              const href =
                node.href ||
                node.link ||
                '';

              path.unshift({
                name,
                href
              });

              const findParent = (
                nodes,
                targetId,
                parent = null
              ) => {
                for (
                  const n of nodes || []
                ) {
                  if (
                    n.id ===
                    targetId
                  ) {
                    return parent;
                  }

                  if (
                    n.children &&
                    n.children.length
                  ) {
                    const p =
                      findParent(
                        n.children,
                        targetId,
                        n
                      );

                    if (p) {
                      return p;
                    }
                  }
                }

                return null;
              };

              const parent =
                findParent(
                  nav,
                  node.id
                );

              if (parent) {
                return buildBreadcrumb(
                  parent,
                  path
                );
              }

              return path;
            };

            if (currentItem) {
              resolvedPath =
                buildBreadcrumb(
                  currentItem
                );
            }
          }
        } catch (navError) {
          console.error(
            '[PageHeader] Navigation error:',
            navError
          );
        }


        /*
         * =====================================================
         * FALLBACK BREADCRUMB
         * =====================================================
         */

        if (
          resolvedPath.length === 0
        ) {
          const segments =
            effectivePath
              .split('/')
              .filter(Boolean);

          let accumulatedPath = '';

          resolvedPath =
            segments.map(
              (seg) => {
                accumulatedPath +=
                  `/${seg}`;

                const translationKey =
                  seg.replace(
                    /-/g,
                    '_'
                  );

                const translatedName =
                  t(
                    translationKey
                  ) !== translationKey
                    ? t(
                        translationKey
                      )
                    : toTitleCase(
                        seg
                      );

                return {
                  name:
                    translatedName,
                  href:
                    accumulatedPath
                };
              }
            );
        }

        if (mounted) {
          setAutoBreadcrumbPath(
            resolvedPath
          );
        }

      } catch (error) {
        console.error(
          '[PageHeader] Load error:',
          error
        );
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
    effectivePath
  ]);


  /*
   * =========================================================
   * FINAL CONFIG
   * =========================================================
   */

  const final = useMemo(() => {
    const base = cfg || {};

    return {
      heading:
        base.heading ||
        (!loading
          ? fallbackHeading
          : '') ||
        (!loading
          ? (
              breadcrumbPath.length
                ? breadcrumbPath[
                    breadcrumbPath.length - 1
                  ].name
                : toTitleCase(
                    (
                      effectivePath ||
                      ''
                    )
                      .split('/')
                      .filter(Boolean)
                      .slice(-1)[0] ||
                      ''
                  )
            )
          : ''),

      subheading:
        base.subheading ||
        fallbackSubheading ||
        '',

      background_url:
        base.background_url ||
        fallbackBackgroundUrl ||
        '/images/headers/about-default.jpg',

      overlay:
        base.overlay !== undefined
          ? base.overlay
          : true,

      breadcrumb_enabled:
        base.breadcrumb_enabled !== undefined
          ? base.breadcrumb_enabled
          : true,

      text_color:
        base.text_color ||
        '#ffffff',

      parent_label:
        base.parent_label ||
        null,

      parent_href:
        base.parent_href ||
        null
    };
  }, [
    cfg,
    loading,
    fallbackHeading,
    fallbackSubheading,
    fallbackBackgroundUrl,
    effectivePath,
    breadcrumbPath
  ]);


  const textColor =
    final.text_color ||
    '#ffffff';


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section
      className="bg-[#123a6b] text-white px-4 hero-before"
      style={{
        background:
          final.background_url
            ? `url('${final.background_url}') no-repeat center center`
            : undefined,

        backgroundSize:
          'cover',

        paddingTop:
          '90px',

        paddingBottom:
          '90px',

        position:
          'relative'
      }}
    >

      <div className="gi-container">

        {final.overlay ? (
          <div
            className="overlay"
            style={{
              position:
                'absolute',

              top: 0,
              left: 0,

              width:
                '100%',

              height:
                '100%',

              background:
                'linear-gradient(90deg, rgb(22, 47, 106) 20%, transparent 70%)'
            }}
          />
        ) : null}


        {final.breadcrumb_enabled ? (
          <p
            className="opacity-99 mb-4"
            style={{
              position:
                'relative',

              zIndex: 1,

              color:
                textColor
            }}
          >

            <a
              href="/"
              className="hover:underline"
              style={{
                color:
                  textColor
              }}
            >
              {t('home')}
            </a>

            {breadcrumbPath.map(
              (item, index) => (
                <span
                  key={`${item.href || item.name}-${index}`}
                >

                  <span
                    style={{
                      color:
                        textColor
                    }}
                  >
                    {' / '}
                  </span>

                  {item.href &&
                  item.href !==
                    effectivePath ? (
                    <a
                      href={item.href}
                      className="hover:underline"
                      style={{
                        color:
                          textColor
                      }}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <span
                      style={{
                        color:
                          textColor
                      }}
                    >
                      {item.name}
                    </span>
                  )}

                </span>
              )
            )}

          </p>
        ) : null}


        {final.heading ? (
          <h1
            className="text-4xl font-bold"
            style={{
              position:
                'relative',

              zIndex: 1,

              color:
                textColor
            }}
          >
            {final.heading}
          </h1>
        ) : null}


        {final.subheading ? (
          <p
            className="text-xl md:text-2xl opacity-90"
            style={{
              position:
                'relative',

              zIndex: 1,

              color:
                textColor
            }}
          >
            {final.subheading}
          </p>
        ) : null}

      </div>
    </section>
  );
}