import mongoose from 'mongoose';

const { Schema, SchemaTypes, model } = mongoose;

const subTaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sequenceNumber: {
        type: Number,
        required: true
    },
    level: {
        type: SchemaTypes.ObjectId,
        ref: 'Level',
        required: true,
    },
    xpReward: {
        type: Number,
        required: true,
        default: 20
    },
}, {
    timestamps: true
});


const Subtask = model('Subtask', subTaskSchema);
export default Subtask;