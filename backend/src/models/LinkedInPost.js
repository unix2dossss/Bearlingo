import mongoose from 'mongoose';

const LinkedInPostSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },
        whyAttend: { type: String, required: true },
        whatLearned: { type: String, required: true },
        howApply: { type: String, required: true },
        hashtags: [{ type: String }]

    },
    {
        timestamps: true
    });


export default mongoose.model("LinkedInPost", LinkedInPostSchema);
