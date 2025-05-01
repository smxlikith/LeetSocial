import { model, Schema } from "mongoose";
import { User } from "./User.js";

const contestSchema = Schema({
    contestName: { type: String, required: true }, //should be sent
    description: { type: String }, //if not set it'll be in the pre save hook
    roomId: { type: String, required: true, unique: true }, //will be set in the controller
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true }, //will be set in the controller
    dateCreated: { type: Schema.Types.Date, default: Date.now },
    startTime: { type: Schema.Types.Date, default: Date.now },
    duration: { type: Number, default: 90, min: 1, max: 1440 },
    topics: [{ type: String }],
    problems: [{
        titleSlug: { type: String, required: true },
        title: { type: String, required: true },
        difficulty: { type: String, required: true },
        questionFrontendId: { type: String, required: true },
    }],
    inviteOnly: { type: Boolean, default: false },
    instant: { type: Boolean, default: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    maxUsers: { type: Number, default: 5, min: 2, max: 15 },
    status: { type: String, enum: ['waiting', 'ongoing', 'ended'], default: 'waiting' },
})

contestSchema.pre('save', async function (next) {
    if (!this.description) {
        const user = await User.findById(this.creator);
        this.description = `Contest Challenge by ${user?.username || 'Unknown'}`;
    }
    next();
});

const Contest = new model("Contest", contestSchema);

export { Contest };