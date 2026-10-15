import { NextResponse } from 'next/server';
import routesData from '@/lib/routes.json';

const validRoutesSet = new Set(routesData);

const IGNORE_PREFIXES = [
  '/api',
  '/_next',
  '/static',
  '/images',
  '/vendor',
  '/uploads',
  '/media',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/404',
  '/_error',
  '/report_document',
];

const IGNORE_EXTENSIONS =
  /\.(?:ico|jpg|jpeg|png|svg|css|js|woff2?|ttf|mp4)$/i;

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (req.method !== 'GET') {
    return NextResponse.next();
  }

  if (
    IGNORE_PREFIXES.some(
      (prefix) =>
        pathname === prefix || pathname.startsWith(prefix + '/')
    ) ||
    IGNORE_EXTENSIONS.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (req.headers.get('x-skip-cms') === '1') {
    return NextResponse.next();
  }

  if (pathname === '/') {
    return NextResponse.next();
  }

  if (!validRoutesSet.has(pathname)) {
    return NextResponse.rewrite(new URL('/404', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};