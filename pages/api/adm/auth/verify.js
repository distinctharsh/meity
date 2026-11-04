import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET;
const PUBLIC_CRYPTO_KEY = process.env.JWT_SECRET;

if (!JWT_SECRET || !PUBLIC_CRYPTO_KEY) {
    throw new Error('JWT_SECRET is not configured');
}

// 🔓 Encrypted cookie string ko securely decrypt karne ka function
function decryptTokenString(encryptedTokenString) {
    try {
        if (!encryptedTokenString || typeof encryptedTokenString !== 'string') {
            return null;
        }

        // Agar string hex format ki nahi hai, toh turant null return karo
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
        console.error('Decryption error details:', error.message);
        return null;
    }
}

// Clear authentication cookie
function clearAuthCookie(res) {
    res.setHeader(
        'Set-Cookie',
        'cms_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Method not allowed'
        });
    }

    // Read encrypted JWT from HttpOnly cookie
    const encryptedCookieToken = req.cookies?.cms_token;

    if (!encryptedCookieToken) {
        clearAuthCookie(res);
        return res.status(401).json({
            authenticated: false,
            message: 'Session expired. Please login again.'
        });
    }

    try {
        // 1. Pehle encrypted string ko decrypt karke original JWT token nikalo
        const rawToken = decryptTokenString(encryptedCookieToken);

        if (!rawToken) {
            clearAuthCookie(res);
            return res.status(401).json({
                authenticated: false,
                message: 'Invalid session structure.'
            });
        }

        // 2. Ab original JWT ko standard tareeqe se verify karo
        const decoded = jwt.verify(rawToken, JWT_SECRET, {
            algorithms: ['HS256'],
            issuer: 'cabsec-cms',
            audience: 'cabsec-cms-api'
        });

        const userId = decoded.sub;

        if (!userId) {
            clearAuthCookie(res);
            return res.status(401).json({
                authenticated: false,
                message: 'Invalid session. Please login again.'
            });
        }

        // Verify user is still active in database
        const [users] = await pool.query(
            `SELECT id, username, email, role, is_active
             FROM cms_users
             WHERE id = ? AND is_active = 1`,
            [userId]
        );

        if (users.length === 0) {
            clearAuthCookie(res);
            return res.status(401).json({
                authenticated: false,
                message: 'User inactive or session revoked. Please login again.'
            });
        }

        const user = users[0];

        return res.status(200).json({
            authenticated: true,
            message: 'Token valid',
            user
        });

    } catch (error) {
        console.error('Token verification error:', error.message);
        clearAuthCookie(res);

        return res.status(401).json({
            authenticated: false,
            message: 'Session expired or invalid. Please login again.'
        });
    }
}