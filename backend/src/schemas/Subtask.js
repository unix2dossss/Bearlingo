import mongoose from 'mongoose';

const { Schema, SchemaTypes, model } = mongoose;

const subTaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    sequenceNumber: { type: Decimal128, required: true },
    timestamps: true,
    level: {
        type: SchemaTypes.ObjectId,
        ref: 'Level',
        required: true,
    },
    xpReward: { type: Int32, required: true, default: 20 },
    timestamps: true
});


const Subtask = model('Subtask', subTaskSchema);
export default Subtask;