import { model, Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    name: String,
    leetcodeId: { type: Number },
    avatar: { type: String },
    fullCookie: { type: String },
    onFriends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    offFriends: [{ type: String }],
})

userSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const userExists = await this.constructor.findOne({ username: this.username });

            if (userExists) {
                const error = new Error('User with this username already exists.');
                error.status = 400;
                return next(error);
            }

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const User = model('User', userSchema)

export { User };
