import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import routesData from '@/lib/routes.json';

const validRoutesSet = new Set(routesData);
const JWT_SECRET = process.env.JWT_SECRET;
const PUBLIC_CRYPTO_KEY = process.env.JWT_SECRET;

if (!JWT_SECRET || !PUBLIC_CRYPTO_KEY) {
  throw new Error('Security configuration missing.');
}

// 🔓 Encrypted cookie string ko decrypt karne ka function (Proxy ke liye)
function decryptTokenString(encryptedTokenString) {
  try {
    if (!encryptedTokenString || typeof encryptedTokenString !== 'string') {
      return null;
    }
    if (encryptedTokenString.length % 2 !== 0) {
      return null;
    }

    const encryptedBuffer = Buffer.from(encryptedTokenString, 'hex');
    if (encryptedBuffer.length === 0 || encryptedBuffer.length % 16 !== 0) {
      return null;
    }

    const key = crypto.createHash('sha256').update(PUBLIC_CRYPTO_KEY, 'utf8').digest();
    const iv = crypto.createHash('sha256').update(PUBLIC_CRYPTO_KEY, 'utf8').digest().subarray(0, 16);

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    return null;
  }
}

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

  // Get encrypted JWT from HttpOnly cookie
  const encryptedCookieToken = req.cookies.get('cms_token')?.value;

  if (!encryptedCookieToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // 1. Pehle encrypted token ko decrypt karo
    const rawToken = decryptTokenString(encryptedCookieToken);

    if (!rawToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Ab original JWT ko verify karo
    const decoded = jwt.verify(rawToken, JWT_SECRET, {
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