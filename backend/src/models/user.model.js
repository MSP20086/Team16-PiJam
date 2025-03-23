import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["student", "teacher"],
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export const User = mongoose.model("User", userSchema);
