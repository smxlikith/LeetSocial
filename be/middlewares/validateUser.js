import { verifyAccessToken } from '../utils/tokenUtils.js';

export function ValidateRequestAuth(req, res, next) {
    const token = req.cookies['accessToken'];
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(403).json({ error: 'Access token expired or invalid' });
    }
}
