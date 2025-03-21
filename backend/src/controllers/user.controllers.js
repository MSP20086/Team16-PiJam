import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { COOKIE_OPTIONS } from "../constants.js";
import { Student } from "../models/student.model.js";
import mongoose from "mongoose";
import { Teacher } from "../models/teacher.model.js";

// here normal async function is user because we are not generating any web request
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // get user to use the token methods
    const user = await User.findById(userId);
    // generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // store refreshToken in database for further reference
    user.refreshToken = refreshToken;
    // saves without applying specified validation
    await user.save({ validateBeforeSave: false });
    // return both tokens to user
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if ([name, email, password, role].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please fill all input fields");
  }
  const exisistingUser = await User.findOne({ $or: [{ name }, { email }] });

  if (exisistingUser) {
    throw new ApiError(
      409, // indicates a conflict with resource's current state
      "User already exists with entered name or email"
    );
  }

  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  if (role === "student") {
    await Student.create({ userId: new mongoose.Types.ObjectId(user._id) });
  } else {
    await Teacher.create({ userId: new mongoose.Types.ObjectId(user._id) });
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // take user data from req.body - ask for username/email and password
  const { email, password } = req.body;

  // check for empty email or password
  if (!email || !password) {
    throw new ApiError(400, "Please input all the fields!");
  }

  // find user using email/username
  const user = await User.findOne({ email });

  // if user exists proceed else return error
  if (!user) {
    throw new ApiError(404, "User doesn't exists");
  }

  // check for password -> using compare function, if password correct, proceed else return error
  // the custom methods created in user model is not available using User model, that only provides access to mongoose methods, custom methods are available using user variable, the instance created using User model
  const passwordCheck = await user.isPasswordCorrect(password);
  if (!passwordCheck) {
    throw new ApiError(401, "Invalid password credentials");
  }

  // generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // send both tokens to user in form of secure cookies
  // generate data (user object) to be sent to user as response (without password and refreshToken)
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // send response of success login
  return (
    res
      .status(200)
      // able to access this property due to use of cookieparser middleware
      .cookie("accessToken", accessToken, COOKIE_OPTIONS)
      .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
      .json(
        // good practice of sending both tokens along with data to allow user to do whatever with it, since it has the authority
        new ApiResponse(
          // statusCode
          200,
          // data
          { user: loggedInUser, accessToken, refreshToken },
          // message
          "User logged in successfully"
        )
      )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  // reset refreshToken field from User
  await User.findByIdAndUpdate(
    req.user._id,
    // updates the fields
    { $set: { refreshToken: undefined } },
    // this basically removes the field from document
    // { $unset: { refreshToken: 1 } },
    // returns new copy
    { new: true }
  );

  // clear cookies from user browser
  return (
    res
      .status(200)
      // need to provide options while clearing cookies
      .clearCookie("accessToken", COOKIE_OPTIONS)
      .clearCookie("refreshToken", COOKIE_OPTIONS)
      .json(new ApiResponse(200, {}, "User logged out successfully"))
  );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export { registerUser, loginUser, logoutUser, getCurrentUser };
