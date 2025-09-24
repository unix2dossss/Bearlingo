import mongoose from "mongoose";


const ReflectionSchema = new mongoose.Schema(
    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            maxLength: 100,
            default: "Untitled Reflection"
        },
        // Q1: What is this reflection about?
        about: { type: String, required: true },

        // Q2: How did this event/experience make me feel?
        feeling: {
            emoji: { type: Number, required: true, min: 1, max: 10 }, // 😃 😔 😬 etc.
            text: { type: String }, // optional extra explanation
        },

        // Q3: What went well?
        whatWentWell: { type: String, required: true },

        // Q4: What could I do to improve?
        improvement: { type: String, required: true },

        // Q5: Rate the event/experience (1–10 stars)
        rating: { type: Number, required: true, min: 1, max: 10 },
    },

    // For date set
    { timestamps: true }
);

export default mongoose.model("ReflectionEntry", ReflectionSchema);