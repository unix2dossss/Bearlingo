import mongoose from 'mongoose';
import User from './User.js';

const LinkedInProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        profressionalHeadline: { type: String },
        currentRole: { type: String },
        keySkills: {
            keySkill1: { type: String, required: true },
            keySkill2: { type: String },
            keySkill3: { type: String },
            keySkill4: { type: String },
            keySkill5: { type: String },
            keySkill6: { type: String },
            keySkill7: { type: String },
            keySkill8: { type: String },
        },
        objective: { type: String, required: true }

    },
    {
        timestamps: true
    });


export default mongoose.model("LinkedInProfile", LinkedInProfileSchema);
