import mongoose from 'mongoose';

const NetworkingReflectionSchema = new mongoose.Schema(
    {
        question1: {
            question: "I connected with someone new at this event",
            answer: { type: Number, required: true }
        },
        question2: {
            question: "I learned something valuable at this event",
            answer: { type: Number, required: true }
        },
        question3: {
            question: "I feel more confident about networking after this event",
            answer: { type: Number, required: true }
        },
        question4: {
            question: "I have a clear next step to follow up with people I met",
            answer: { type: Number, required: true }
        }
    },
    {
        timestamps: true
    });


export default mongoose.model("NetworkingReflection", NetworkingReflectionSchema);
