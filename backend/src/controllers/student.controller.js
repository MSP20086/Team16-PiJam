// backend/controllers/student.controller.js
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
import {User} from "../models/user.model.js";

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
  const student_id = "65fdc2a1e4b0c2e3d1a7b123";
  
  const challenge = await Challenge.findById(challengeId).populate("rubric_id");
  if (!challenge) {
    throw new ApiError(404, "Challenge not found");
  }
  
  const problem_statement = challenge.description;
  const rubric = challenge.rubric_id;
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
  console.log(submissionLocalPath);

  if (!submissionLocalPath) {
    throw new ApiError(400, "Submission file is necessary");
  }

  const submissionCloudPath = await uploadOnCloudinary(submissionLocalPath);
  console.log("here ", submissionCloudPath);
  if (!submissionCloudPath?.url) {
    throw new ApiError(
      500,
      "Submission file not uploaded successfully on cloudinary"
    );
  }

  const file_path = submissionCloudPath.url;

  const submission = await Submission.create({
    student_id,
    challenge_id: challengeId,
    file_path: file_path,
    extracted_text: "",
    ai_scores: {}, 
    teacher_scores: {},
    final_score: 0,
    classification: "low",
    summary: "",
    status: "pending",
  });

  // Add new submission to the challenge's submissions array
  challenge.submissions.push(submission._id);
  await challenge.save();

  console.log(rubric);
  const formData = new FormData();
  formData.append("file", fs.createReadStream(submissionLocalPath));
  formData.append("problem_statement", problem_statement);
  formData.append("rubric", JSON.stringify(rubric.criteria));

  // url will change
  try {
    const evaluationResponse = await axios.post("https://7c80-34-125-196-67.ngrok-free.app/evaluate", formData, {
      headers: formData.getHeaders ? formData.getHeaders() : { 'Content-Type': 'multipart/form-data' },
    });
    console.log("Evaluation response:", evaluationResponse.data);
    const evalData = evaluationResponse.data;
    const aiScoresMap = {};
    if (Array.isArray(evalData.evaluation.evaluation)) {
      evalData.evaluation.evaluation.forEach(item => {
        if (item.criterion && typeof item.criterion === "string") {
          aiScoresMap[item.criterion] = item.score;
        } else {
          console.warn("Evaluation item has an invalid or missing criterion:", item);
        }
      });
    } else {
      console.error("Evaluation data is not in expected array format:", evalData.evaluation.evaluation);
    }

    const updatedSubmission = await Submission.findByIdAndUpdate(
      submission._id,
      {
        extracted_text: evalData.transcription || "",
        ai_scores: aiScoresMap || {},
        summary: evalData.summary || "",
        final_score: evalData.evaluation.final_score || 0,
        status: "pending"
      },
      { new: true }
    );
    
    fs.unlinkSync(submissionLocalPath);
    console.log("Submission updated with evaluation data:", updatedSubmission);
    return res.status(201).json(new ApiResponse(201, updatedSubmission, "Submission uploaded and evaluated successfully"));
  } catch (error) {
    console.error("Evaluation error:", error.message);
    fs.unlinkSync(submissionLocalPath);
  
    return res.status(201).json(new ApiResponse(201, submission, "Submission uploaded, but evaluation failed"));  
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
