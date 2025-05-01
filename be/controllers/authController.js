import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';
import { moveOffFriendsToOnFriends } from "../utils/migrateUser.js"
import cookieValidator from "../utils/cookieValidator.js";
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

export async function loginUser(req, res) {
    try {
        const cookieString = req.query.cookie;
        if (!cookieString) {
            return res.status(400).json({ error: 'No cookie provided' });
        }

        const userData = await cookieValidator(cookieString);

        if (userData.error) {
            console.log(userData);
            return res.status(400).json({ error: userData.message });
        }

        let user = await User.findOne({ username: userData.username });

        if (!user) {
            user = await User.create({
                username: userData.username,
                email: userData.email,
                leetcodeId: userData.id,
                avatar: userData.avatar,
                fullCookie: cookieString,
            });
            await Notification.create({
                user: user._id
            })
            moveOffFriendsToOnFriends(user);
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.json({ success: true, message: "Logged in successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function refreshAccessToken(req, res) {
    try {
        const token = req.cookies['refreshToken'];
        if (!token) {
            return res.status(401).json({ error: 'No refresh token' });
        }

        const decoded = verifyRefreshToken(token);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const newAccessToken = generateAccessToken(user);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000,
        });

        res.json({ success: true, message: "Access token refreshed" });

    } catch (error) {
        console.error(error);
        res.status(403).json({ error: 'Invalid refresh token' });
    }
}