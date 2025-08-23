import mongoose from 'mongoose';

const { Schema, SchemaTypes, model } = mongoose;

const moduleSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    levels: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Level",
                required: true,
            }
        ],
        default: []   // default is empty array for testing purposes
    },
    timestamps: true
});


const Module = model('Module', moduleSchema);
export default Module;