import express from 'express';
import { loginUser, refreshAccessToken } from '../controllers/authController.js';

const router = express.Router();
router.get("/callback", loginUser);
router.get("/refresh-token", refreshAccessToken);

export default router;