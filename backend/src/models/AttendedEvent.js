import mongoose from "mongoose";
import User from "../models/User.js";

const attendEventSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    attendingEventIds: [{
        evenId: { type: Number },
        status: { type: String, enum: ["attended", "going"], default: "going" },
        createdAt: { type: Date, default: Date.now }
    }],
}, {
    timestamps: true
});

const Events = mongoose.model("Events", attendEventSchema);
export default Events;