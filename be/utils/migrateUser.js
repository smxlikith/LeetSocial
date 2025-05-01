import { User } from '../models/User.js';

export async function moveOffFriendsToOnFriends(newUser) {
    try {
        const username = newUser.username;
        const userId = newUser._id;

        const affectedUsers = await User.find({ offFriends: username });

        for (let user of affectedUsers) {
            await User.findByIdAndUpdate(
                user._id,
                {
                    $pull: { offFriends: username },
                    $addToSet: { onFriends: userId }
                }
            );
        }

        // console.log(`${affectedUsers.length} users updated`);
    } catch (err) {
        console.error('Error moving offFriends to onFriends:', err);
    }
}
