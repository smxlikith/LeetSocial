import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';

export function generateAccessToken(user) {
    const payload = { userId: user._id, username: user.username };
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(user) {
    const payload = { userId: user._id, username: user.username };
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });
}

export function verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET);
}
