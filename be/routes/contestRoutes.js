import express from 'express';
import { createContest, getContestById, getPublicContests, updateContest, deleteContest, joinContest, leaveContest } from '../controllers/contestController.js';

const router = express.Router();

router.get('/id/:roomId', getContestById);
router.get('/contests', getPublicContests);
router.post('/create', createContest);
router.post('/join/:roomId', joinContest);
router.post('/leave/:roomId', leaveContest)
router.put('/:roomId', updateContest);
router.delete('/:roomId', deleteContest);

export default router;