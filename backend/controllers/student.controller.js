// backend/controllers/student.controller.js
import mongoose from "mongoose";
import { Challenge } from "../models/challenge.model.js";
import { Submission } from "../models/submission.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

// Mock challenge data
const mockChallenges = [
    {
        id: "1",
        title: "AI Ethics Challenge",
        description: "Discuss ethical concerns in AI.",
        deadline: "2025-03-25",
        reference_materials: ["https://example.com/ai-ethics.pdf"]
    },
    {
        id: "2",
        title: "Climate Change Hack",
        description: "Innovate to fight climate change.",
        deadline: "2025-04-01",
        reference_materials: ["https://example.com/climate.pdf"]
    }
];

// Mock submissions
let mockSubmissions = [];

export const getAllChallenges = asyncHandler(async (req, res) => {
    // Optionally, can add filtering logic based on student criteria.
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
    const { student_id, file_path } = req.body;
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
  
    if (!file_path) {
      throw new ApiError(400, "File path is required");
    }
  
    // Create a new submission with default values for extra fields
    const submission = await Submission.create({
      student_id,
      challenge_id: challengeId,
      file_path,
      extracted_text: "",  // Will be updated after processing
      ai_scores: {},       // Default empty scores
      teacher_scores: {},
      final_score: 0,
      classification: "low",
      summary: "",
      status: "pending"
    });
  
    return res.status(201).json(
      new ApiResponse(201, submission, "Submission uploaded successfully")
    );
});

export const getStudentSubmissions = asyncHandler(async (req, res) => {
    // const student_id = req.user._id;
    const { student_id } = req.query;
    if (!student_id) {
      throw new ApiError(400, "Student ID is required");
    }
    const submissions = await Submission.find({ student_id });
    return res.status(200).json(new ApiResponse(200, submissions, "Submissions fetched successfully"));
});
