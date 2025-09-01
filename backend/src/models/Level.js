import mongoose from 'mongoose';

const { Schema, SchemaTypes, model } = mongoose;

const levelSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    levelNumber: {
        type: Number,
        required: true
    },
    module: {
        type: SchemaTypes.ObjectId,
        ref: 'Module',
        required: true,
    },
    xpReward: {
        type: Number,
        required: true
    },
    badge: {
        type: String,
        required: true
    },
    subtasks: [
        {
            type: SchemaTypes.ObjectId,
            ref: 'Subtask',
            required: true,
        }]
}, {
    timestamps: true
}
);


const Level = model('Level', levelSchema);
export default Level;