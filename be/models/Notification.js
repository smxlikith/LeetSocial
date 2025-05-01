import { Schema, model } from "mongoose";

const notificationSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contests: {
        type: [{
            roomId: { type: String, required: true },
            from: { type: Schema.Types.ObjectId, ref: "User", required: true },
            sentTime: { type: Schema.Types.Date, default: Date.now }
        }], default: []
    },
    friends: {
        type: [{
            from: { type: Schema.Types.ObjectId, ref: "User", required: true },
            sentTime: { type: Schema.Types.Date, default: Date.now }
        }], default: []
    }
});

const Notification = model("notification", notificationSchema);

export { Notification };