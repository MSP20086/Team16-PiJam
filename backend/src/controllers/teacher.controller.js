import mongoose from "mongoose";
import { Challenge } from "../models/challenge.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Rubric } from "../models/rubric.model.js";
import { Submission } from "../models/submission.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import axios from "axios";

// display charts, analytics remaining
// get insights remaining
export const getInsightsOfSpecificChallenge = asyncHandler(async (req, res) => {
  // use this code while integrating with actual flask server

  // const { challengeId } = req.params;

  // if (!mongoose.Types.ObjectId.isValid(challengeId)) {
  //   throw new ApiError(400, "Invalid Challenge ID");
  // }

  // const submissions = await Submission.find({
  //   challenge_id: challengeId,
  // }).populate("challenge_id");

  // const submissionsExtractedText = submissions.map(
  //   (submission) => submission.extracted_text
  // );

  // hard coded data for now for testing
  const submissionsExtractedText = [
    {
      id: 1,
      title: "Climate Change Effects",
      summary:
        "Climate change significantly impacts agriculture worldwide. Increased temperatures alter growing seasons, while unpredictable rainfall patterns damage crop yields. Extreme weather events including floods, droughts, and hurricanes destroy farmland. Agricultural adaptation requires developing drought-resistant crops, implementing efficient irrigation systems, and diversifying farming practices to enhance resilience against environmental stressors.",
      classification: "low",
      status: "selected",
      date_created: "2025-01-15T09:23:45Z",
    },
    {
      id: 2,
      title: "Exercise Benefits",
      summary:
        "Regular exercise provides numerous physiological benefits. Cardiovascular workouts strengthen heart muscles, improve circulation, and regulate blood pressure. Resistance training builds muscle mass, increases bone density, and boosts metabolism. Flexibility exercises enhance joint mobility, prevent injuries, and improve posture. Additionally, physical activity releases endorphins, reduces cortisol levels, and improves sleep quality, contributing to better mental health.",
      classification: "mid",
      status: "selected",
      date_created: "2025-01-16T14:12:33Z",
    },
    {
      id: 3,
      title: "Machine Learning Overview",
      summary:
        "Machine learning algorithms identify patterns within datasets without explicit programming. Supervised learning utilizes labeled examples for classification tasks, while unsupervised learning discovers hidden structures in unlabeled data. Neural networks mimic brain functionality through interconnected node layers that adjust connection weights during training. Practical applications include image recognition, natural language processing, recommendation systems, fraud detection, and autonomous vehicles.",
      classification: "high",
      status: "pending",
      date_created: "2025-01-18T08:45:21Z",
    },
    {
      id: 4,
      title: "Ancient Rome",
      summary:
        "Ancient Rome established sophisticated governmental structures alongside impressive architectural achievements. The Senate provided legislative authority, while elected consuls exercised executive power during the Republic period. Roman engineering feats included aqueducts transporting water across vast distances, concrete dome construction techniques, and extensive road networks spanning territories. Latin, their language, formed the foundation for Romance languages including Spanish, French, Italian, Portuguese, and Romanian.",
      classification: "mid",
      status: "selected",
      date_created: "2025-01-19T11:34:56Z",
    },
  ];

  const flaskEndPoint = "http://localhost:5000/api/analyse_text";
  try {
    const insightsResponse = await axios.post(
      flaskEndPoint,
      { submissions: submissionsExtractedText }, // Wrapped in an object
      { headers: { "Content-Type": "application/json" } }
    );
    const insights = insightsResponse.data;

    return res.status(201).json(new ApiResponse(201, insights));
  } catch (error) {
    console.error(
      "Error fetching insights:",
      error.response?.data || error.message
    );
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
    select: "name email",
  });
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
  const submission = await Submission.findById(submissionId).populate({
    path: "student_id",
    select: "name email",
  });
  const challenge = await Challenge.findById(submission.challenge_id);
  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }
  return res.status(200).json(new ApiResponse(200, { challenge, submission }));
});

export const evaluateSubmission = asyncHandler(async (req, res) => {
  const { submissionId, challengeId, score } = req.body;
  if (!submissionId || !challengeId || !score) {
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
    final_score += (score[parameter] || 0) * weight;
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
