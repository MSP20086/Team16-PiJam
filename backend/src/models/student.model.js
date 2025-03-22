import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  submissions: [{
    type: Schema.Types.ObjectId,
    ref: "Submission"
  }]
}, { timestamps: true });

export const Student = mongoose.model("Student", studentSchema);
