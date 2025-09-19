import mongoose from 'mongoose';
import User from './User';

const LinkedInProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: { type: String },
        profressionalHeadline: { type: String },
        currentRole: { type: String },
        keySkills: {
            keySkill1: { type: String },
            keySkill2: { type: String },
            keySkill3: { type: String },
        },
        objective: { type: String }

    },
    {
        timestamps: true
    });


export default mongoose.model("LinkedInProfile", LinkedInProfileSchema);
