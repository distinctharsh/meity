import React, { useEffect } from 'react';
import pool from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import SubNavTabs from '@/components/SubNavTabs';
import Footer from '@/components/Footer';

export async function getServerSideProps(context) {
  try {
    const params = context.params || {};

    /*
     * Support both:
     * pages/[...slug].js
     * pages/[...Slug].js
     */
    const slugArr = params.slug || params.Slug || [];

    const parts = Array.isArray(slugArr)
      ? slugArr
      : [slugArr];

    /*
     * Convert:
     * ["abc", "def"]
     *
     * into:
     * /abc/def
     */
    const slug =
      '/' +
      parts
        .filter(Boolean)
        .map((part) =>
          String(part).replace(/^\/+|\/+$/g, '')
        )
        .filter(Boolean)
        .join('/');

    /*
     * Do not query DB for an invalid route.
     */
    if (
      !slug ||
      slug === '/' ||
      slug.includes('[...slug]') ||
      slug.includes('[...Slug]')
    ) {
      console.warn('[CMS] Invalid slug:', slug);

      return {
        notFound: true
      };
    }

    /*
     * Important for WAF/proxy environments.
     *
     * Do not allow an intermediate cache to return
     * an incorrect CMS response.
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

    console.log('[CMS] Loading:', slug);

    /*
     * Get page directly from MariaDB.
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

    if (!rows || rows.length === 0) {
      console.warn('[CMS] Page not found:', slug);

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
        page.content_json = JSON.parse(
          page.content_json
        );
      } catch (error) {
        console.error(
          '[CMS] Invalid content_json:',
          error
        );

        page.content_json = {};
      }
    }

    /*
     * Make DB values serializable.
     */
    const serializable = {
      ...page
    };

    [
      'created_at',
      'updated_at',
      'publish_date'
    ].forEach((key) => {
      if (serializable[key] instanceof Date) {
        serializable[key] =
          serializable[key].toISOString();
      }
    });

    /*
     * Pass actual DB URL separately.
     */
    return {
      props: {
        page: serializable,
        resolvedSlug: slug
      }
    };

  } catch (err) {
    console.error(
      '[CMS] SSR page fetch error:',
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
   * =========================================================
   * CMS CONTENT
   * =========================================================
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
   * Remove script tags from CMS HTML.
   *
   * CMS JS is handled separately.
   */
  const safeHtml = rawHtml.replace(
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    ''
  );


  /*
   * =========================================================
   * CSS SCOPING
   * =========================================================
   */

  const scopeSelectors = (
    cssText,
    scope
  ) => {
    if (!cssText) {
      return '';
    }

    /*
     * Handle @media blocks.
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
                s.length === 0
              ) {
                return s;
              }

              /*
               * Already scoped.
               */
              if (
                s.startsWith(scope)
              ) {
                return s;
              }

              /*
               * Map html/body/:root
               * to CMS container.
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
   * =========================================================
   * BASE CMS CSS
   * =========================================================
   */

  const baseScopedCss = `
    .cms-content h1 {
      font-size: 2rem;
      line-height: 2.4rem;
      font-weight: 700;
      margin: 1rem 0 0.75rem;
    }

    .cms-content h2 {
      font-size: 1.5rem;
      line-height: 2rem;
      font-weight: 700;
      margin: 0.875rem 0 0.5rem;
    }

    .cms-content h3 {
      font-size: 1.25rem;
      line-height: 1.75rem;
      font-weight: 600;
      margin: 0.75rem 0 0.5rem;
    }

    .cms-content p {
      margin: 0.75rem 0;
    }

    .cms-content ul {
      list-style: disc;
      padding-left: 1.25rem;
      margin: 0.75rem 0;
    }

    .cms-content ol {
      list-style: decimal;
      padding-left: 1.25rem;
      margin: 0.75rem 0;
    }

    .cms-content a {
      color: #2563eb;
      text-decoration: underline;
    }

    .cms-content img {
      max-width: 100%;
      height: auto;
    }

    .cms-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }

    .cms-content th,
    .cms-content td {
      border: 1px solid #e5e7eb;
      padding: 0.5rem;
      text-align: left;
    }

    .cms-content code {
      background: #f3f4f6;
      padding: 0.1rem 0.3rem;
      border-radius: 4px;
      font-family:
        ui-monospace,
        SFMono-Regular,
        Menlo,
        monospace;
    }

    .cms-content pre {
      background: #111827;
      color: #f9fafb;
      padding: 0.75rem;
      border-radius: 6px;
      overflow: auto;
    }
  `;


  /*
   * =========================================================
   * CMS JAVASCRIPT
   * =========================================================
   *
   * This runs only after the page is available.
   *
   * The CMS HTML itself does NOT depend on this.
   */
  useEffect(() => {
    const id = 'cms-inline-js';

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
        document.createElement('script');

      script.id = id;
      script.type = 'text/javascript';

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
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <main
      id="main"
      key={resolvedSlug || page?.slug || ''}
    >

      <PageHeader
        pagePath={
          resolvedSlug ||
          page?.slug ||
          ''
        }
      />

      <SubNavTabs
        pagePath={
          resolvedSlug ||
          page?.slug ||
          ''
        }
      />

      <style
        dangerouslySetInnerHTML={{
          __html: baseScopedCss
        }}
      />

      {scopedCss ? (
        <style
          dangerouslySetInnerHTML={{
            __html: scopedCss
          }}
        />
      ) : null}

      {/*
       * IMPORTANT:
       *
       * CMS HTML is rendered immediately from SSR props.
       *
       * There is NO:
       *
       * hydrated ? ... : null
       *
       * around this content.
       */}
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