import express from "express";
import { getPendingRequests, sendContestRequest, removeContestRequest, acceptContestRequest, sendFriendRequest, removeFriendRequest, acceptFriendRequest } from "../controllers/notificationController.js";

const router = express.Router();

//All the pending requests of a User
router.get('/', getPendingRequests);

//Friend Requests
router.post('/friend/:targetUserId', sendFriendRequest);
router.delete('/friend/:targetUserId', removeFriendRequest);
router.post('/friend/:targetUserId/accept', acceptFriendRequest);

//Contest Requests
router.post('/contest', sendContestRequest);
router.delete('/contest', removeContestRequest);
router.post('/contest/:roomId/accept', acceptContestRequest);

export default router;