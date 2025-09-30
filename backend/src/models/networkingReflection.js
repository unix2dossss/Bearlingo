import mongoose from 'mongoose';

const NetworkingReflectionSchema = new mongoose.Schema(
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
            default: "Untitled Entry"
        },
        responses: [{
            question: { type: String, required: true },
            answer: { type: Number, required: true, min: 1, max: 5 }
        }],
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        }
    },
    {
        timestamps: true
    });


export default mongoose.model("NetworkingReflection", NetworkingReflectionSchema);
