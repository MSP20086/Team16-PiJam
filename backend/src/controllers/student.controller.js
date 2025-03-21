import mongoose from "mongoose";
import { Challenge } from "../models/challenge.model.js";
import { Submission } from "../models/submission.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Student } from "../models/student.model.js";

export const getAllChallenges = asyncHandler(async (req, res) => {
  // Optionally, can add filtering logic based on student criteria.
  const challenges = await Challenge.find();
  return res
    .status(200)
    .json(new ApiResponse(200, challenges, "Challenges fetched successfully"));
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
  return res
    .status(200)
    .json(new ApiResponse(200, challenge, "Challenge details fetched"));
});

export const submitChallenge = asyncHandler(async (req, res) => {
  const { challengeId } = req.params;
  const { student_id, file_path } = req.body;

  // Validate student ID and file path
  if (!student_id) {
    throw new ApiError(400, "Student ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(student_id)) {
    throw new ApiError(400, "Invalid student ID");
  }

  if (!mongoose.Types.ObjectId.isValid(challengeId)) {
    throw new ApiError(400, "Invalid challenge ID");
  }

  if (!file_path) {
    throw new ApiError(400, "File path is required");
  }

  const submission = await Submission.create({
    student_id,
    challenge_id: challengeId,
    file_path,
    extracted_text: "", // Will be updated after processing
    ai_scores: {}, // Default empty scores
    teacher_scores: {},
    final_score: 0,
    classification: "low",
    summary: "",
    status: "pending",
  });

  const updatedStudent = await Student.findOneAndUpdate(
    { userId: req.user._id },
    { $push: { submissions: submission } },
    { new: true }
  );

  if (!updatedStudent) {
    throw new ApiError(500, "Some error occurred while making new submission!");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, submission, "Submission uploaded successfully"));
});

export const getStudentSubmissions = asyncHandler(async (req, res) => {
  const submissions = await Student.findOne({ userId: req.user._id })
    .submissions;

  return res
    .status(200)
    .json(
      new ApiResponse(200, submissions, "Submissions fetched successfully")
    );
});

export const getMySubmissionForChallenge = asyncHandler(async (req, res) => {
  // const studentId = req.user._id;
  // const { studentId } = req.body;
  const { student_id } = req.query;
  const { challengeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(challengeId)) {
    throw new ApiError(400, "Invalid challenge ID");
  }
  if (!mongoose.Types.ObjectId.isValid(student_id)) {
    throw new ApiError(400, "Invalid Student ID");
  }
  const submission = await Submission.findOne({
    student_id: student_id,
    challenge_id: challengeId,
  }).populate({
    path: "challenge_id",
    select: "title description rubric",
  });

  if (!submission) {
    throw new ApiError(404, "No submission found for this challenge");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: submission._id,
        file_path: submission.file_path,
        extracted_text: submission.extracted_text,
        summary: submission.summary,
        ai_scores: submission.ai_scores,
        teacher_scores: submission.teacher_scores,
        final_score: submission.final_score,
        classification: submission.classification,
        status: submission.status,
        challenge: submission.challenge_id, // populated object
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      },
      "Submission for challenge retrieved"
    )
  );
});
