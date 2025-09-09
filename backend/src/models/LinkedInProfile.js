import mongoose from 'mongoose';
import User from './User';

const LinkedInProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: String,
        profressionalHeadline: { type: String },
        keySkills: {
            keySkill1: String,
            keySkill2: String,
            keySkill3: String,
        },
        objective: { type: String }

    },
    {
        timestamps: true
    });


export default mongoose.model("LinkedInProfile", LinkedInProfileSchema);
