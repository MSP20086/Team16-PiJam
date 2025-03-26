import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

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
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["student", "teacher"],
    required: true
  },
  submissions: [{
    type: Schema.Types.ObjectId,
    ref: "Submission"
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

userSchema.statics.signup = async function (name, email, password, role) {
  if (!email || !password || !name || !role) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }
  if (!["student", "teacher"].includes(role)) {
    throw Error("Invalid role");
  }

  const emailexists = await this.findOne({ email }); 
  if (emailexists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ name, email, password: hash, role }); 
  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};
export const User = mongoose.model("User", userSchema);
