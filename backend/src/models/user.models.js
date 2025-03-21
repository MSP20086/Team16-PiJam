import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, "Password is required"] },
    role: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// pre hook allows for doing some functionality before any database operation, here encrypting password before creating new user

// runs on save command
// takes time, so async
// not using arrow function because we want to use this keyword
userSchema.pre("save", async function (next) {
  // runs only on modifying password
  if (!this.isModified("password")) return next();
  // 10 is saltrounds/hashrounds
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// custom method for checking for correct password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generating two jwt tokens
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    // always getting refreshed, so less payload is stored
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
