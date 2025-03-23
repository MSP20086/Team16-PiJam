import mongoose, { Schema } from "mongoose";

const challengeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    rubric_id: {
      type: Schema.Types.ObjectId,
      ref: "Rubric",
    },
    submissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Submission",
      },
    ],
    reference_materials: [
      {
        type: String,
      },
    ],
    criteria: {
      mid: Number,
      high: Number,
    },
  },
  { timestamps: true }
);

export const Challenge = mongoose.model("Challenge", challengeSchema);
