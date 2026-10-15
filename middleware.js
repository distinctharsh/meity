import { NextResponse } from 'next/server';
import routesData from '@/lib/routes.json';

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
  '/_error'
];

export async function middleware(req) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  if (req.method !== 'GET') return NextResponse.next();
  
  const isIgnored = IGNORE_PREFIXES.some((p) => pathname.startsWith(p)) || 
                    pathname.match(/\.(ico|jpg|jpeg|png|svg|css|js|woff|woff2|ttf|mp4)$/);

  if (isIgnored) return NextResponse.next();

  // Safe check for header
  const skipCmsHeader = req.headers.get('x-skip-cms');
  if (skipCmsHeader === '1') return NextResponse.next();

  if (pathname === '/') return NextResponse.next();

  // Route check from JSON
  const isAllowedRoute = routesData.includes(pathname);

  if (!isAllowedRoute) {
    // Agar route JSON mein nahi hai, toh seedha 404 page par bhej dein
    return NextResponse.rewrite(new URL('/404', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};