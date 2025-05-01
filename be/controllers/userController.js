import { User } from '../models/User.js';

async function addFriends(req, res) {
    try {
        const { friends } = req.body;
        const user = await User.findOne({ username: req.user.username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const onFriends = [];
        const offFriends = [];

        for (let friend of friends) {
            const result = await User.findOne({ username: friend });
            if (result) {
                onFriends.push(result._id);
            } else {
                offFriends.push(friend);
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $addToSet: {
                    onFriends: { $each: onFriends },
                    offFriends: { $each: offFriends }
                }
            },
            { new: true }
        );

        res.status(200).json({ success: true, user: updatedUser });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: true, message: e.message });
    }
}

async function removeFriends(req, res) {
    try {
        const { friends } = req.body;
        const user = await User.findOne({ username: req.user.username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const onFriends = [];
        const offFriends = [];

        for (let friend of friends) {
            const result = await User.findOne({ username: friend });
            if (result) {
                onFriends.push(result._id);
            } else {
                offFriends.push(friend);
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $pull: {
                    onFriends: { $in: onFriends },
                    offFriends: { $in: offFriends }
                }
            },
            { new: true }
        );

        res.status(200).json({ success: true, user: updatedUser });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: true, message: e.message });
    }
}

async function getUserInfo(req, res) {
    try {
        const { userId } = req.user;
        const user = await User.findById(userId, "username onFriends offFriends avatar -_id");
        const populatedUser = await user.populate({ path: "onFriends", select: "username -_id" })
        res.status(200).json({ success: true, message: { user: populatedUser } });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: true, message: e.message });
    }
}

export { addFriends, removeFriends, getUserInfo };