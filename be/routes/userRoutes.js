import express from 'express';
import { addFriends, removeFriends, getUserInfo } from '../controllers/userController.js';
const router = express.Router();

router.get("/", getUserInfo);
router.patch('/addFriends', addFriends);
router.patch('/removeFriends', removeFriends);

export default router;