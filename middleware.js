import { NextResponse } from 'next/server';

// Paths to ignore from middleware processing
const IGNORE_PREFIXES = ['/api', '/_next', '/static', '/favicon.ico', '/robots.txt', '/sitemap.xml'];

export async function middleware(req) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Skip non-GET and ignored paths
  if (req.method !== 'GET') return NextResponse.next();
  if (IGNORE_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // Allow admin/tools to bypass CMS rewrite for route existence checks
  const skipCms = req.headers.get('x-skip-cms');
  if (skipCms === '1') return NextResponse.next();

  // Root path handled by existing index page
  if (pathname === '/') return NextResponse.next();

  try {
    // Call internal API to check if a CMS page exists for this slug
    const slug = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    const url = `${nextUrl.origin}/api/pages/${slug}`; // our API returns 200 if page exists
    const res = await fetch(url, { headers: { 'x-cms-check': '1' }, cache: 'no-store' });

    if (res.ok) {
      // Rewrite to our internal renderer at /p/<slug>
      const rewriteUrl = new URL(`/p${pathname}`, nextUrl.origin);
      return NextResponse.rewrite(rewriteUrl);
    }
  } catch (e) {
    // Fail open (continue normal routing) on any error
  }

  return NextResponse.next();
}

export const config = {
  // Apply to all paths
  matcher: '/:path*',
};
