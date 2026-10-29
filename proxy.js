import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import routesData from '@/lib/routes.json';

const validRoutesSet = new Set(routesData);
const JWT_SECRET = process.env.JWT_SECRET;
const IGNORE_PREFIXES = [
  '/api',
  '/_next',
  '/static',
  '/images',
  '/vendor',
  '/uploads',
  '/media',
  '/favicon.ico',
  '/404',
  '/_error',
  '/search',
  '/documents',
  '/report_document',
  '/admin',
  '/sitemap',
  '/archives',
  '/gallery'
];

const IGNORE_EXTENSIONS =
  /\.(?:ico|jpg|jpeg|png|svg|css|js|woff2?|ttf|mp4)$/i;

export function proxy(req) {
    const { pathname } = req.nextUrl;
   if (
  pathname === '/api/adm' ||
  pathname.startsWith('/api/adm/')
) {

  // Login remains public
  if (pathname === '/api/adm/auth/login') {
    return NextResponse.next();
  }

  // Get JWT from HttpOnly cookie
  const token = req.cookies.get('cms_token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'cabsec-cms',
      audience: 'cabsec-cms-api'
    });

    const requestHeaders = new Headers(req.headers);

    requestHeaders.set(
      'x-auth-user-id',
      String(decoded.sub)
    );

    requestHeaders.set(
      'x-auth-role',
      String(decoded.role || '')
    );

    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

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

  if (pathname === '/') {
    return NextResponse.next();
  }

if (!validRoutesSet.has(pathname)) {
    const url = req.nextUrl.clone();
url.pathname = '/404';
url.search = '';

return NextResponse.rewrite(url);
}

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};