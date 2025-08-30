import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        maxLength: 100,
        default: "Untitled Entry"
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
 },
    {
        timestamps: true
    }
);

export default mongoose.model("JournalEntry", journalEntrySchema);