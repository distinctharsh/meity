import React from 'react';
import pool from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

export async function getServerSideProps(context) {
  try {
    /*
     * IMPORTANT:
     * For a catch-all route such as:
     *
     * pages/[...Slug].js
     *
     * Next.js normally gives:
     *
     * context.params.Slug
     *
     * But support both Slug and slug to avoid casing issues.
     */
    const params = context.params || {};

    const slugArr =
      params.Slug ||
      params.slug ||
      [];

    const normalizedSlugArr = Array.isArray(slugArr)
      ? slugArr
      : [slugArr];

    /*
     * Build the REAL URL stored in DB.
     *
     * Example:
     * ["abc", "def"]
     *
     * becomes:
     *
     * /abc/def
     */
    const slug =
      '/' +
      normalizedSlugArr
        .filter(Boolean)
        .map((part) => String(part).replace(/^\/+|\/+$/g, ''))
        .filter(Boolean)
        .join('/');

    /*
     * Never allow the Next.js route pattern itself
     * to reach the database.
     */
    if (
      !slug ||
      slug === '/' ||
      slug.includes('[...Slug]') ||
      slug.includes('[...slug]')
    ) {
      console.warn(
        'Invalid dynamic route slug:',
        slug
      );

      return {
        notFound: true
      };
    }

    /*
     * Prevent intermediate/proxy caching of SSR response.
     *
     * This is useful when Apache/WAF/proxy infrastructure
     * is sitting in front of Next.js.
     */
    if (context.res) {
      context.res.setHeader(
        'Cache-Control',
        'private, no-store, no-cache, must-revalidate, max-age=0'
      );

      context.res.setHeader(
        'Pragma',
        'no-cache'
      );

      context.res.setHeader(
        'Expires',
        '0'
      );
    }

    console.log(
      '[DynamicPage] Loading DB page:',
      slug
    );

    /*
     * Get page content from DB.
     */
    const [rows] = await pool.query(
      `
        SELECT
          p.*,
          n.name AS nav_name,
          n.link AS nav_link
        FROM pages p
        LEFT JOIN navigation_items n
          ON n.id = p.navigation_item_id
        WHERE p.slug = ?
          AND p.is_active = TRUE
        LIMIT 1
      `,
      [slug]
    );

    /*
     * Page does not exist.
     */
    if (!rows || rows.length === 0) {
      console.warn(
        '[DynamicPage] Page not found:',
        slug
      );

      return {
        notFound: true
      };
    }

    const page = rows[0];

    /*
     * Parse JSON content.
     */
    if (
      page.content_json &&
      typeof page.content_json === 'string'
    ) {
      try {
        page.content_json =
          JSON.parse(page.content_json);
      } catch (jsonError) {
        console.error(
          '[DynamicPage] Invalid content_json:',
          jsonError
        );

        page.content_json = {};
      }
    }

    /*
     * Make MySQL/MariaDB values serializable.
     */
    const serializable = {
      ...page
    };

    [
      'created_at',
      'updated_at',
      'publish_date'
    ].forEach((key) => {
      if (
        serializable[key] instanceof Date
      ) {
        serializable[key] =
          serializable[key].toISOString();
      }
    });

    /*
     * Pass the actual DB slug separately.
     *
     * This prevents PageHeader from having to determine
     * the route from router.pathname.
     */
    return {
      props: {
        page: serializable,
        resolvedSlug: slug
      }
    };

  } catch (err) {
    console.error(
      '[DynamicPage] SSR page fetch error:',
      err
    );

    return {
      notFound: true
    };
  }
}


export default function DynamicPage({
  page,
  resolvedSlug
}) {
  /*
   * ---------------------------------------------------------
   * PAGE CONTENT
   * ---------------------------------------------------------
   */

  const contentJson =
    page?.content_json || {};

  const rawHtml =
    typeof contentJson.html === 'string'
      ? contentJson.html
      : '';

  const rawCss =
    typeof contentJson.css === 'string'
      ? contentJson.css
      : '';

  const rawJs =
    typeof contentJson.js === 'string'
      ? contentJson.js
      : '';

  const noScope =
    contentJson.no_scope === true;


  /*
   * ---------------------------------------------------------
   * REMOVE SCRIPT TAGS FROM CMS HTML
   * ---------------------------------------------------------
   *
   * CMS HTML should not execute scripts through
   * dangerouslySetInnerHTML.
   *
   * JavaScript is handled separately below.
   */
  const safeHtml = rawHtml.replace(
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    ''
  );


  /*
   * ---------------------------------------------------------
   * CSS SCOPING
   * ---------------------------------------------------------
   */
  const scopeSelectors = (
    cssText,
    scope
  ) => {
    if (!cssText) {
      return '';
    }

    /*
     * Process @media blocks.
     */
    const scopedMedia =
      cssText.replace(
        /@media[^{]+\{([\s\S]*?)\}/g,
        (full, inner) => {
          const innerScoped =
            scopeSelectors(
              inner,
              scope
            );

          return full.replace(
            inner,
            innerScoped
          );
        }
      );

    /*
     * Scope normal selectors.
     */
    return scopedMedia.replace(
      /(^|})([^@}][^{]+)\{/g,
      (
        match,
        brace,
        selectorPart
      ) => {
        const scopedSel =
          selectorPart
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .map((s) => {
              if (
                s.startsWith('@') ||
                !s.length
              ) {
                return s;
              }

              if (
                s.startsWith(scope)
              ) {
                return s;
              }

              /*
               * Convert:
               *
               * body
               * html
               * :root
               *
               * to the CMS container.
               */
              const rootMapped =
                s.replace(
                  /^(html|body|:root)(\b|\s)/,
                  `${scope}$2`
                );

              if (
                rootMapped !== s
              ) {
                return rootMapped;
              }

              return `${scope} ${s}`;
            })
            .join(', ');

        return `${brace}${scopedSel}{`;
      }
    );
  };


  const scopedCss =
    noScope
      ? rawCss
      : scopeSelectors(
          rawCss,
          '.cms-content'
        );


  /*
   * ---------------------------------------------------------
   * CMS JAVASCRIPT
   * ---------------------------------------------------------
   */
  React.useEffect(() => {
    const id =
      'cms-inline-js';

    const previous =
      document.getElementById(id);

    if (previous) {
      previous.remove();
    }

    if (
      rawJs &&
      typeof window !== 'undefined'
    ) {
      const script =
        document.createElement(
          'script'
        );

      script.id = id;
      script.type =
        'text/javascript';

      script.textContent = `
        try {
          ${rawJs}
        } catch (e) {
          console.error(
            'CMS inline JS error:',
            e
          );
        }
      `;

      document.body.appendChild(
        script
      );
    }

    return () => {
      const element =
        document.getElementById(id);

      if (element) {
        element.remove();
      }
    };
  }, [rawJs]);


  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */
  return (
    <main
      id="main"
      key={resolvedSlug}
    >
      {/*
       * Pass the actual DB URL.
       *
       * Example:
       * /abc/def
       *
       * PageHeader will NOT need router.pathname.
       */}
      <PageHeader
        pagePath={resolvedSlug}
      />

      {scopedCss ? (
        <style
          dangerouslySetInnerHTML={{
            __html: scopedCss
          }}
        />
      ) : null}

      <div className="gi-container">
        <div
          className="cms-content"
          dangerouslySetInnerHTML={{
            __html: safeHtml
          }}
        />
      </div>

      <Footer />
    </main>
  );
}