import { Contest } from '../models/Contest.js';
import { User } from '../models/User.js';
import { nanoid } from 'nanoid';
import { getProps } from '../utils/getProps.js';
import agenda from '../jobs/agenda.js';

async function startJob(contest) {
    const { _id, startTime, duration } = contest;
    const start = new Date(startTime);
    const end = new Date(start.getTime() + (duration * 60 * 1000));
    console.log(start, end);
    await agenda.schedule(start, 'start contest', { contestId: _id });
    await agenda.schedule(end, 'end contest', { contestId: _id });
}
async function deleteJob(contest) {
    const { contestId } = contest;
    await agenda.cancel({ 'data.contestId': contestId });
}

function filteredContests(c) {
    const startTime = new Date(c.startTime);
    const createdAt = new Date(c.dateCreated);
    if (c.status === "waiting") {
        const { problems, ...rest } = c;
        return rest;
    }

    return c;
}

async function createContest(req, res) {
    try {
        const user = await User.findById(req.user.userId);
        if (!req.body.contestName) {
            return res.status(400).json({ error: "No Contest Name Provied" });
        }

        if (!req.body.problemsList) {
            return res.status(400).json({ error: "No Problems list provided" });
        }

        const props = await getProps(req.body);

        const newContest = new Contest({
            creator: user._id,
            roomId: nanoid(6),
            participants: [user._id],
            ...props
        });

        await newContest.save();
        const populatedContest = await newContest.populate([{ path: "creator", select: "username -_id" }, { path: "participants", select: "username -_id" }]);
        const contestObj = populatedContest.toObject();
        startJob(contestObj);
        res.status(201).json({ success: true, message: 'Contest created successfully', contest: filteredContests(contestObj) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
}

async function getContestById(req, res) {
    try {
        const { roomId } = req.params;

        const contest = await Contest.findOne({ roomId: roomId }).populate([{ path: "creator", select: "username -_id" }, { path: "participants", select: "username -_id" }]).lean();
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }
        res.status(200).json(filteredContests(contest));

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
}

async function getPublicContests(req, res) {
    try {
        const publicContests = await Contest.find({
            inviteOnly: false
        }).populate([{ path: "creator", select: "username -_id" }, { path: "participants", select: "username -_id" }]).lean();

        if (!publicContests || publicContests.length === 0) {
            return res.status(404).json({ message: 'No public contests found' });
        }

        res.status(200).json(publicContests.map(contest => filteredContests(contest)));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
}

async function updateContest(req, res) {
    try {
        const { roomId } = req.params;
        const contest = await Contest.findOne({ roomId: roomId });
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        if (contest.status === 'ended') {
            return res.status(400).json({ message: 'Contest has already ended' });
        }

        if (contest.status === 'Ongoing') {
            return res.status(400).json({ message: 'Contest has already started.' });
        }

        if (contest.creator.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this contest' });
        }

        Object.assign(contest, req.body);
        const newContest = await contest.save();
        deleteJob(newContest);
        startJob(newContest);
        res.json(newContest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deleteContest(req, res) {
    try {
        const { roomId } = req.params;
        console.log(roomId);
        const contest = await Contest.findOne({ roomId: roomId });
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }
        if (contest.creator.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this contest' });
        }
        await deleteJob(contest);
        await contest.deleteOne();
        res.json({ message: 'Contest deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function joinContest(req, res) {
    try {
        const { roomId } = req.params;
        const contest = await Contest.findOne({ roomId: roomId });

        const user = await User.findById(req.user.userId);
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        if (contest.status === 'ended') {
            return res.status(400).json({ message: 'Contest has already ended' });
        }

        if (contest.participants.includes(user._id)) {
            return res.status(400).json({ message: 'User already joined this contest' });
        }
        contest.participants.push(user._id);
        contest.save()
        const populatedContest = await contest.populate([{ path: "creator", select: "username -_id" }, { path: "participants", select: "username -_id" }]);
        const contestObj = populatedContest.toObject();
        res.status(200).json({ message: 'Successfully joined contest', contest: filteredContests(contestObj) });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

async function leaveContest(req, res) {
    try {
        const { roomId } = req.params;
        const contest = await Contest.findOne({ roomId: roomId });

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        if (contest.status === 'ended') {
            return res.status(400).json({ message: 'Contest has already ended' });
        }

        if (contest.status === 'Ongoing') {
            return res.status(400).json({ message: 'Contest has already started.' });
        }

        const userId = req.user.userId;

        if (!contest.participants.includes(userId)) {
            return res.status(400).json({ message: 'User is not part of this contest' });
        }

        contest.participants = contest.participants.filter(
            participantId => participantId.toString() !== userId
        );

        await contest.save();

        const populatedContest = await contest.populate([
            { path: "creator", select: "username -_id" },
            { path: "participants", select: "username -_id" }
        ]);

        const contestObj = populatedContest.toObject();

        res.status(200).json({ message: 'Successfully left contest', contest: filteredContests(contestObj) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export { createContest, getContestById, getPublicContests, updateContest, deleteContest, joinContest, leaveContest };
