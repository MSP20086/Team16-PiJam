import mongoose, { Schema } from "mongoose";

const teacherSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    challenges_created: [{
        type: Schema.Types.ObjectId,
        ref: "Challenge"
    }]
}, { timestamps: true });

export const Teacher = mongoose.model("Teacher", teacherSchema);
