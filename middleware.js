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

  // No rewrite needed anymore. We now render CMS pages directly via pages/[...slug].js
  // Static pages keep highest priority; dynamic catch-all will handle CMS if exists.
  return NextResponse.next();
}

export const config = {
  // Apply to all paths
  matcher: '/:path*',
};
