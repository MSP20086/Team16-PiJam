import mongoose, { Schema } from "mongoose";

const rubricSchema = new Schema({
    criteria: [{
        parameter: {
            type: String,
            required: true
        },
        weight: {
            type: Number,
            required: true
        }
    }]
}, { timestamps: true });

export const Rubric = mongoose.model("Rubric", rubricSchema);
