import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challenge_id: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    file_path: {
      type: String,
      required: true,
    },
    extracted_text: {
      type: String,
    },
    ai_scores: {
      type: Map,
      of: Number,
    },
    teacher_scores: {
      type: Map,
      of: Number,
    },
    final_score: {
      type: Number,
    },
    classification: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    summary: {
      type: String,
    },
    status: {
      type: String,
      enum: ["selected", "not selected", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Submission = mongoose.model("Submission", submissionSchema);
