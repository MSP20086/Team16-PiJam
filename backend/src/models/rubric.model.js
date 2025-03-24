// import mongoose, { Schema } from "mongoose";

// const rubricSchema = new Schema({
//     criteria: [{
//         parameter: {
//             type: String,
//             required: true
//         },
//         weight: {
//             type: Number,
//             required: true
//         }
//     }]
// }, { timestamps: true });

// export const Rubric = mongoose.model("Rubric", rubricSchema);
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
        },
        description: {
            type: String,
            required: true
        },
        sampleAnswer: {
            type: String,
            required: false
        },
        embeddings: {
            type: [Number], // Assuming embeddings are stored as an array of numbers
            required: false
        }
    }]
}, { timestamps: true });

export const Rubric = mongoose.model("Rubric", rubricSchema);
