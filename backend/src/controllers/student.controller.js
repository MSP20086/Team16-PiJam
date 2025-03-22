// backend/controllers/student.controller.js
import mongoose from "mongoose";
import axios from "axios";

import { Challenge } from "../models/challenge.model.js";
import { Submission } from "../models/submission.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
  const student_id = new mongoose.Types.ObjectId();
  let file_path = "";
  const challenge = await Challenge.findById(challengeId).populate("rubric_id");
  if (!challenge) {
    throw new ApiError(404, "Challenge not found");
  }
  const problem_statement = challenge.description;
  const rubric = challenge.rubric_id;
  // student_id = req.user._id;
  // const student_id = new mongoose.Types.ObjectId();
  // const  {file_path}=req.body;

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

  if (!problem_statement) {
    throw new ApiError(400, "Problem statement is required");
  }
  if (!rubric) {
    throw new ApiError(400, "Rubric is required");
  }

  const submissionLocalPath = req.file?.path;

  if (!submissionLocalPath) {
    throw new ApiError(400, "Submission file is necessary");
  }

  const submissionCloudPath = await uploadOnCloudinary(submissionLocalPath);
  if (!submissionCloudPath.url) {
    throw new ApiError(
      500,
      "Submission file not uploaded successfully on cloudinary"
    );
  }

  file_path = submissionCloudPath.url;

  const submission = await Submission.create({
    student_id,
    challenge_id: challengeId,
    file_path: file_path,
    extracted_text: "", // Will be updated after processing
    ai_scores: {}, // Default empty scores
    teacher_scores: {},
    final_score: 0,
    classification: "low",
    summary: "",
    status: "pending",
  });
  let evaluationEndpoint = "http://localhost:5000/evaluate";
  // if (file_type === "image") {
  //   evaluationEndpoint = "http://localhost:5000/evaluate/image";
  // } else if (file_type === "audio") {
  //   evaluationEndpoint = "http://localhost:5000/evaluate/speech";
  // } else if (file_type === "video") {
  //   evaluationEndpoint = "http://localhost:5000/evaluate/video";
  // } else {
  //   // Optional: if unknown file type, you may choose a default or throw an error.
  //   throw new ApiError(400, "Unsupported file type for evaluation");
  // }
  const payload = {
    file_url: file_path,
    problem_statement,
    rubric,
  };
  try {
    // Call the Flask evaluation endpoint
    const evaluationResponse = await axios.post(evaluationEndpoint, payload, {
      headers: { "Content-Type": "application/json" },
    });
    const evalData = evaluationResponse.data;

    // Update submission with evaluation results
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submission._id,
      {
        extracted_text: evalData.transcription || "",
        summary: evalData.summary || "",
        ai_scores: evalData.evaluation || {},
        final_score: evalData.final_score || 0,
        classification: evalData.classification || "low",
        status: "evaluated",
      },
      { new: true }
    );

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          updatedSubmission,
          "Submission uploaded and evaluated successfully"
        )
      );
  } catch (error) {
    console.error("Evaluation error:", error.message);
    // Return the submission without evaluation updates if the call fails
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          submission,
          "Submission uploaded, but evaluation failed"
        )
      );
  }
});

export const getStudentSubmissions = asyncHandler(async (req, res) => {
  // const student_id = req.user._id;
  const { student_id } = req.query;
  if (!student_id) {
    throw new ApiError(400, "Student ID is required");
  }
  const submissions = await Submission.find({ student_id });
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
