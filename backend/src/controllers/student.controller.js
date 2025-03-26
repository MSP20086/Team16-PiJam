import mongoose from "mongoose";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { Challenge } from "../models/challenge.model.js";
import { Submission } from "../models/submission.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

export const getAllChallenges = asyncHandler(async (req, res) => {
  const challenges = await Challenge.find();
  return res.status(200).json(new ApiResponse(200, challenges, "Challenges fetched successfully"));
});

export const getChallengeById = asyncHandler(async (req, res) => {
  const { challengeId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(challengeId)) {
    throw new ApiError(400, "Invalid challenge ID format");
  }
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    throw new ApiError(404, "Challenge not found");
  }
  return res.status(200).json(new ApiResponse(200, challenge, "Challenge details fetched"));
});

export const submitChallenge = asyncHandler(async (req, res) => {
  const { challengeId } = req.params;
  const { _id: userId, role } = req.user;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not logged in");
  }
  if (role !== "student") {
    throw new ApiError(403, "Forbidden: Only students can submit challenges");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const challenge = await Challenge.findById(challengeId).populate("rubric_id");
  if (!challenge) {
    throw new ApiError(404, "Challenge not found");
  }

  const submissionLocalPath = req.file?.path;
  if (!submissionLocalPath) {
    throw new ApiError(400, "Submission file is necessary");
  }

  const submissionCloudPath = await uploadOnCloudinary(submissionLocalPath);
  if (!submissionCloudPath?.url) {
    throw new ApiError(500, "Submission file upload to Cloudinary failed");
  }

  const submission = await Submission.create({
    student_id: userId,
    challenge_id: challengeId,
    file_path: submissionCloudPath.url,
    extracted_text: "",
    ai_scores: {},
    teacher_scores: {},
    final_score: 0,
    classification: "low",
    summary: "",
    status: "pending",
  });

  // Add submissionId to user's submissions
  user.submissions.push(submission._id);
  await user.save();

  // Add submissionId to challenge's submissions
  challenge.submissions.push(submission._id);
  await challenge.save();

  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(submissionLocalPath));
    formData.append("problem_statement", challenge.description);
    formData.append("rubric", JSON.stringify(challenge.rubric_id.criteria));

    const evaluationResponse = await axios.post(
      "https://7615-34-125-182-213.ngrok-free.app/evaluate",
      formData,
      { headers: formData.getHeaders() }
    );

    const evalData = evaluationResponse.data;
    const aiScoresMap = {};
    if (Array.isArray(evalData.evaluation.evaluation)) {
      evalData.evaluation.evaluation.forEach(item => {
        if (item.criterion) {
          aiScoresMap[item.criterion] = item.score;
        }
      });
    }

    const updatedSubmission = await Submission.findByIdAndUpdate(
      submission._id,
      {
        extracted_text: evalData.transcription || "",
        ai_scores: aiScoresMap || {},
        summary: evalData.summary || "",
        final_score: evalData.evaluation.final_score || 0,
        status: "pending",
      },
      { new: true }
    );

    fs.unlinkSync(submissionLocalPath);
    return res.status(201).json(new ApiResponse(201, updatedSubmission, "Submission uploaded and evaluated successfully"));
  } catch (error) {
    fs.unlinkSync(submissionLocalPath);
    return res.status(201).json(new ApiResponse(201, submission, "Submission uploaded, but evaluation failed"));
  }
});



export const getStudentSubmissions = asyncHandler(async (req, res) => {
  const { _id: userId, role } = req.user;
  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not logged in");
  }
  if (role !== "student") {
    throw new ApiError(403, "Forbidden: Only students can fetch submissions");
  }

  const user = await User.findById(userId).populate({
    path: "submissions",
    populate: {
      path: "challenge_id",
      select: "title description",
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user.submissions, "Submissions fetched successfully"));
});


export const getMySubmissionForChallenge = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { challengeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(challengeId)) {
    throw new ApiError(400, "Invalid challenge ID");
  }

  const submission = await Submission.findOne({
    student_id: userId,
    challenge_id: challengeId,
  }).populate("challenge_id", "title description rubric");

  if (!submission) {
    throw new ApiError(404, "No submission found for this challenge");
  }

  return res.status(200).json(new ApiResponse(200, submission, "Submission for challenge retrieved"));
});