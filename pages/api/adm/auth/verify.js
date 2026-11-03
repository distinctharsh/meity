import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
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

    // Read JWT from HttpOnly cookie
    const token = req.cookies?.cms_token;

    if (!token) {
        clearAuthCookie(res);

        return res.status(401).json({
            authenticated: false,
            message: 'Session expired. Please login again.'
        });
    }

    try {

        // Verify JWT
        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ['HS256'],
            issuer: 'cabsec-cms',
            audience: 'cabsec-cms-api'
        });

        // Your JWT uses sub, not userId
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

        // Expired, invalid signature, wrong issuer/audience, etc.
        if (
            error.name === 'TokenExpiredError' ||
            error.name === 'JsonWebTokenError' ||
            error.name === 'NotBeforeError'
        ) {
            clearAuthCookie(res);

            return res.status(401).json({
                authenticated: false,
                message: error.name === 'TokenExpiredError'
                    ? 'Session expired. Please login again.'
                    : 'Invalid session. Please login again.'
            });
        }

        console.error('Token verification error:', error);

        return res.status(500).json({
            authenticated: false,
            message: 'Internal server error'
        });
    }
}