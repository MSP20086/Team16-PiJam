import mongoose from "mongoose";
import { Challenge } from "../models/challenge.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Rubric } from "../models/rubric.model.js";
import { Submission } from "../models/submission.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import axios from "axios";
import { User } from "../models/user.model.js";

export const getInsightsOfSpecificChallenge = asyncHandler(async (req, res) => {
  const { challengeId } = req.params;

  // Validate challengeId
  if (!mongoose.Types.ObjectId.isValid(challengeId)) {
    throw new ApiError(400, "Invalid Challenge ID");
  }

  // Fetch submissions for the given challenge
  const submissions = await Submission.find({ challenge_id: challengeId })
    .populate("challenge_id")
    .populate("student_id"); // Populate student info

  if (!submissions.length) {
    throw new ApiError(404, "No submissions found for this challenge");
  }

  // Flask API Endpoint
  const flaskEndPoint = "https://0571-34-125-182-213.ngrok-free.app/api/analyze_text";

  // Initialize score distribution bins
  let scoreDistribution = {
    "0-10": 0,
    "10-20": 0,
    "20-30": 0,
    "30-40": 0,
    "40-50": 0,
    "50-60": 0,
    "60-70": 0,
    "70-80": 0,
    "80-90": 0,
    "90-100": 0,
  };

  // Calculate score distribution
  submissions.forEach((sub) => {
    const score = sub.final_score ?? 0; // Use final_score, default to 0 if missing
    const rangeKey = Object.keys(scoreDistribution).find((range) => {
      const [min, max] = range.split("-").map(Number);
      return score >= min && score <= max;
    });

    if (rangeKey) {
      scoreDistribution[rangeKey] += 1;
    }
  });

  try {
    // Prepare data for Flask API
    const payload = {
      challenge_id: challengeId,
      submissions: submissions.map((sub) => ({
        submission_id: sub._id,
        extracted_text: sub.summary || "", // Ensure text exists
        classification: sub.classification || "unknown",
        status: sub.status || "unknown",
        student_name: sub.student_id?.name || "Unknown", // Extract student name
      })),
    };

    // Send request to Flask API
    const insightsResponse = await axios.post(flaskEndPoint, payload, {
      headers: { "Content-Type": "application/json" },
    });

    // Get insights from response
    const insights = insightsResponse.data;

    // Add score distribution to insights
    insights.score_distribution = scoreDistribution;

    return res.status(201).json(new ApiResponse(201, insights, "Insights generated successfully"));
  } catch (error) {
    console.error("Error fetching insights:", error.response?.data || error.message);
    throw new ApiError(500, "Error occurred while generating insights");
  }
});


export const getChallenges = asyncHandler(async (req, res) => {
  const challenges = await Challenge.find();
  return res.status(200).json(new ApiResponse(200, challenges));
});

export const createChallenge = asyncHandler(async (req, res) => {
  const teacherId = new mongoose.Types.ObjectId();
  if (!teacherId) {
    throw new ApiError(400, "User ID is required");
  }
  let { title, description, deadline, criteria, rubric } = req.body;
  if (!title || !description || !deadline || !criteria || !rubric) {
    throw new ApiError(400, "All fields are required");
  }

  deadline = new Date(deadline);
  criteria = JSON.parse(criteria);
  rubric = JSON.parse(rubric);

  const rubricObj = new Rubric(rubric);
  await rubricObj.save();
  const rubric_id = rubricObj._id;
  if (!rubric_id) {
    throw new ApiError(500, "Rubric ID not found");
  }

  const refMaterialFilesPath = req.files?.refMaterials.map((file) => file.path);
  let refMaterialCloudPath = [];

  if (refMaterialFilesPath?.length) {
    refMaterialCloudPath = await Promise.all(
      refMaterialFilesPath.map((localPath) => uploadOnCloudinary(localPath))
    );
  }

  if (!refMaterialCloudPath?.length) {
    throw new ApiError(
      500,
      "Some error occurred while uploading materials on cloudinary"
    );
  }

  const reference_materials = refMaterialCloudPath.map((path) => path.url);

  const challenge = new Challenge({
    title,
    description,
    deadline,
    rubric_id,
    reference_materials,
    criteria,
  });
  await challenge.save();
  return res.status(201).json(new ApiResponse(201, challenge));
});

export const getSubmissions = asyncHandler(async (req, res) => {
  const challengeId = req.params.challengeId;
  if (!challengeId) {
    throw new ApiError(400, "Challenge ID is required");
  }
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    throw new ApiError(404, "Challenge not found");
  }
  const submissions = await Submission.find({
    challenge_id: challengeId,
  }).populate({
    path: "student_id",
    select: "name",
  });
  // console.log(submissions[0]);
  const rubric = await Rubric.findById(challenge.rubric_id);
  if (!rubric) {
    throw new ApiError(404, "Rubric not found");
  }
  const challengeObj = challenge.toObject();
  challengeObj.rubric = rubric;
  return res.status(200).json(
    new ApiResponse(200, {
      challenge: challengeObj,
      submissions: submissions,
    })
  );
});

export const getSpecificSubmission = asyncHandler(async (req, res) => {
  const submissionId = req.params.submissionId;
  if (!submissionId) {
    throw new ApiError(400, "Submission ID is required");
  }
  // Fetch the submission and populate its references
  const submission = await Submission.findById(submissionId);

  const challenge = await Challenge.findById(submission.challenge_id);

  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }
  let user = null;

  // Fetch student only if submission.student_id exists
  if (submission.student_id && submission.student_id._id) {
    user = await User.findById(submission.student_id);
  }

  return res.status(200).json(new ApiResponse(200, { submission, challenge , user }));
});

export const evaluateSubmission = asyncHandler(async (req, res) => {
  const { submissionId, challengeId, score, status} = req.body;
  if (!submissionId || !challengeId || !score || !status) {
    throw new ApiError(400, "All fields are required");
  }
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    throw new ApiError(404, "Challenge not found");
  }
  const rubric = await Rubric.findById(challenge.rubric_id);
  if (!rubric) {
    throw new ApiError(404, "Rubric not found");
  }
  const rubricCriteria = rubric.criteria.map((c) => c.parameter);
  const scoreKeys = Object.keys(score);
  if (!rubricCriteria.every((param) => scoreKeys.includes(param))) {
    throw new ApiError(400, "All rubric criteria must be scored");
  }
  let final_score = 0;
  rubric.criteria.forEach(({ parameter, weight }) => {
    final_score += (score[parameter] || 0) * weight/100;
  });
  let classification = "low";
  if (final_score >= challenge.criteria.high) {
    classification = "high";
  } else if (final_score >= challenge.criteria.mid) {
    classification = "medium";
  }
  const updatedSubmission = await Submission.findByIdAndUpdate(
    submissionId,
    {
      teacher_scores: score,
      final_score,
      classification,
      status
    },
    { new: true }
  );
  if (!updatedSubmission) {
    throw new ApiError(404, "Submission not found");
  }
  res.status(200).json({
    success: true,
    message: "Submission graded successfully",
    data: updatedSubmission,
  });
});

export const getChallengeAnalytics = asyncHandler(async (req, res) => {
  const { challengeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(challengeId)) {
    throw new ApiError(400, "Invalid Challenge ID");
  }

  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    throw new ApiError(404, "Challenge not found");
  }

  const totalSubmissions = await Submission.countDocuments({
    challenge_id: challengeId,
  });

  const classificationCounts = await Submission.aggregate([
    { $match: { challenge_id: new mongoose.Types.ObjectId(challengeId) } },
    { $group: { _id: "$classification", count: { $sum: 1 } } },
  ]);

  let scoreDistribution = { low: 0, medium: 0, high: 0 };
  classificationCounts.forEach(({ _id, count }) => {
    if (_id) scoreDistribution[_id] = count;
  });

  return res.status(200).json(
    new ApiResponse(200, {
      challengeId,
      totalSubmissions,
      scoreDistribution,
    })
  );
});
