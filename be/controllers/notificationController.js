import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";
import { Contest } from "../models/Contest.js";

async function getPendingRequests(req, res) {
    try {
        const { userId } = req.user;
        const pending = await Notification.findOne({ user: userId }, 'friends contests -_id');
        res.status(200).json({ success: true, notifiactions: await pending.populate([{ path: "contests.from", select: "username -_id" }, { path: "friends.from", select: "username -_id" }]) });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: true, message: e.message });
    }

}

async function sendFriendRequest(req, res) {
    try {
        const { targetUserId: toUser } = req.params;
        const { userId: fromUser } = req.user;

        const to = await User.findOne({ username: toUser });
        const from = await User.findById(fromUser);

        if (!to || !from) {
            return res.status(404).json({ error: true, message: "User not found." });
        }

        if (to._id.toString() === from._id.toString()) {
            return res.status(400).json({ error: true, messager: "can't request yourself" })
        }
        const alreadyFriends = (to.onFriends.includes(from._id) || from.onFriends.includes(to._id)) || (to.offFriends.includes(from.username) || from.offFriends.includes(to.username));

        if (alreadyFriends) {
            return res.status(400).json({ error: true, message: "You are already friends with this user." });
        }

        let notification = await Notification.findOne({ user: to._id });

        const alreadyRequested = notification.friends.some(pending =>
            pending.from.toString() === from._id.toString()
        );

        if (alreadyRequested) {
            return res.status(400).json({ error: true, message: "Friend request already sent." });
        }

        notification.friends.push({ from: from._id });
        await notification.save();
        res.status(200).json({ success: true, message: "Friend Request Sent." })
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: true, message: e.message });
    }
}

async function removeFriendRequest(req, res) {
    try {
        const { targetUserId: fromUser } = req.params;
        const { userId: toUser } = req.user;

        const from = await User.findOne({ username: fromUser });
        const to = await User.findById(toUser);

        if (!from || !to) {
            return res.status(404).json({ error: true, message: "User not found." });
        }

        const notification = await Notification.findOne({ user: to._id });

        if (!notification || notification.friends.length === 0) {
            return res.status(404).json({ error: true, message: "No pending requests found." });
        }

        const initialLength = notification.friends.length;

        notification.friends = notification.friends.filter(
            pending => pending.from.toString() !== from._id.toString()
        );

        if (notification.friends.length === initialLength) {
            return res.status(400).json({ error: true, message: "No friend request to remove." });
        }

        await notification.save();

        res.status(200).json({ success: true, message: "Friend request removed." });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: true, message: e.message });
    }
}

async function acceptFriendRequest(req, res) {
    try {
        const { targetUserId: fromUser } = req.params;
        const { userId: toUser } = req.user;

        const from = await User.findOne({ username: fromUser });
        const to = await User.findById(toUser);

        if (!from || !to) {
            return res.status(404).json({ error: true, message: "User not found." });
        }

        const notification = await Notification.findOne({ user: to._id });

        if (!notification || notification.friends.length === 0) {
            return res.status(404).json({ error: true, message: "No pending friend requests." });
        }

        const requestIndex = notification.friends.findIndex(
            pending => pending.from.toString() === from._id.toString()
        );

        if (requestIndex === -1) {
            return res.status(400).json({ error: true, message: "No such friend request found." });
        }

        notification.friends.splice(requestIndex, 1);

        to.onFriends.push(from._id);

        await notification.save();
        await to.save();

        res.status(200).json({ success: true, message: "Friend request accepted." });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: true, message: e.message });
    }
}

async function sendContestRequest(req, res) {
    try {
        const { users, roomId } = req.body;
        const { userId } = req.user;

        const contest = await Contest.findOne({ roomId });
        if (!contest) {
            return res.status(404).json({ error: true, message: "Contest not found." });
        }

        const from = await User.findById(userId);
        if (!from) {
            return res.status(404).json({ error: true, message: "Requesting user not found." });
        }

        const results = await Promise.all(users.map(async (username) => {
            try {
                const to = await User.findOne({ username });
                if (!to) {
                    return { username, status: "skipped", reason: "User does not exist" };
                }

                if (contest.participants.includes(to._id)) {
                    return { username, status: "skipped", reason: "Already participating" };
                }

                const notification = await Notification.findOne({ user: to._id });
                if (!notification) {
                    return { username, status: "skipped", reason: "No notification record" };
                }

                const alreadyRequested = notification.contests.some(
                    pending => pending.roomId === contest.roomId && pending.from.toString() === from._id.toString()
                );

                if (alreadyRequested) {
                    return { username, status: "skipped", reason: "Already requested" };
                }

                notification.contests.push({ roomId: contest.roomId, from: from._id });
                await notification.save();

                return { username, status: "sent" };
            } catch (innerError) {
                console.error(`Error processing ${username}:`, innerError);
                return { username, status: "failed", reason: innerError.message };
            }
        }));

        const sentTo = results.filter(r => r.status === "sent").map(r => r.username);
        const skipped = results.filter(r => r.status === "skipped");
        const failed = results.filter(r => r.status === "failed");

        res.status(200).json({
            success: true,
            message: `Processed contest requests.`,
            sentTo,
            skipped,
            failed
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: true, message: e.message });
    }
}

async function removeContestRequest(req, res) {
    try {
        const { fromUsername, roomId } = req.body;
        const { userId } = req.user;
        const user = await User.findById(userId);
        const from = await User.findOne({ username: fromUsername });
        const notification = await Notification.findOne({ user: user._id });
        if (!notification) {
            return res.status(404).json({ error: true, message: "Notification record not found." });
        }
        if (!user || !from) {
            return res.status(400).json({ error: true, message: "Invalid Usernames provided, try again with proper usernames." })
        }
        const initialLength = notification.contests.length;

        notification.contests = notification.contests.filter(
            contest => !(contest.roomId === roomId && contest.from.toString() === from._id.toString())
        );

        if (notification.contests.length === initialLength) {
            return res.status(400).json({ error: true, message: "No matching contest request to remove." });
        }

        await notification.save();

        res.status(200).json({ success: true, message: "Contest request removed." });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: true, message: e.message });
    }
}

async function acceptContestRequest(req, res) {
    try {
        const { roomId } = req.params;
        const { userId } = req.user;

        const contest = await Contest.findOne({ roomId });
        if (!contest) {
            return res.status(404).json({ error: true, message: "Contest not found." });
        }

        if (contest.status === 'ended') {
            return res.status(400).json({ error: true, message: "Contest has already ended." });
        }

        if (contest.participants.includes(userId)) {
            return res.status(400).json({ error: true, message: "You are already a participant." });
        }

        const notification = await Notification.findOne({ user: userId });
        if (!notification) {
            return res.status(404).json({ error: true, message: "Notification record not found." });
        }

        const initialLength = notification.contests.length;

        notification.contests = notification.contests.filter(req => req.roomId !== roomId);

        if (notification.contests.length === initialLength) {
            return res.status(400).json({ error: true, message: "No pending contest request found." });
        }

        contest.participants.push(userId);

        await Promise.all([notification.save(), contest.save()]);

        res.status(200).json({ success: true, message: "You have joined the contest." });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: true, message: e.message });
    }
}

export { getPendingRequests, sendContestRequest, removeContestRequest, acceptContestRequest, sendFriendRequest, removeFriendRequest, acceptFriendRequest };