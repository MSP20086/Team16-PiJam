import mongoose from "mongoose"
import {Teacher} from "../models/teacher.model.js"
import {Challenge} from "../models/challenge.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Rubric} from "../models/rubric.model.js"
import {Submission} from "../models/submission.model.js"

export const getChallenges = asyncHandler(async (req, res) => {
    const challenges = await Challenge.find();
    return res.status(200).json(new ApiResponse(200, challenges));
});

export const createChallenge = asyncHandler(async (req, res) => {
    const teacherId = new mongoose.Types.ObjectId();
    if (!teacherId)
    {
        throw new ApiError(400, "User ID is required");
    }
    const { title, description, deadline,reference_materials, criteria, rubric } = req.body;
    if (!title || !description || !deadline || !reference_materials || !criteria || !rubric)
    {
        throw new ApiError(400, "All fields are required");
    }
    const rubricObj = new Rubric(rubric);
    await rubricObj.save();
    const rubric_id = rubricObj._id;
    if(!rubric_id)
    {
        throw new ApiError(500, "Rubric ID not found");
    }
    const challenge = new Challenge({
        title,
        description,
        deadline,
        rubric_id,
        reference_materials,
        criteria,
        created_by: teacherId
    });
    await challenge.save();
    return res.status(201).json(new ApiResponse(201, challenge));
});

export const getSubmissions = asyncHandler(async (req, res) => {
    const challengeId = req.params.challengeId;
    if (!challengeId)
    {
        throw new ApiError(400, "Challenge ID is required");
    }
    const challenge = await Challenge.findById(challengeId);
    if (!challenge)
    {
        throw new ApiError(404, "Challenge not found");
    }
    const submissions = await Submission.find({ challenge_id: challengeId });
    return res.status(200).json(new ApiResponse(200, submissions));
});

export const getSpecificSubmission = asyncHandler(async (req, res) => {
    const submissionId = req.params.submissionId;
    if (!submissionId)
    {
        throw new ApiError(400, "Submission ID is required");
    }
    const submission = await Submission.findById(submissionId);
    if (!submission)
    {
        throw new ApiError(404, "Submission not found");
    }
    return res.status(200).json(new ApiResponse(200, submission));
});

export const evaluateSubmission = asyncHandler(async (req, res) => {
    const {submissionId, challengeId, score} = req.body;
    if (!submissionId || !challengeId || !score)
    {
        throw new ApiError(400, "All fields are required");
    }
    const submission = await Submission.findById(submissionId);
    if (!submission)
    {
        throw new ApiError(404, "Submission not found");
    }
    const challenge = await Challenge.findById(challengeId);
    if (!challenge)
    {
        throw new ApiError(404, "Challenge not found");
    }
    const rubric = await Rubric.findById(challenge.rubric_id);
    if (!rubric)
    {
        throw new ApiError(404, "Rubric not found");
    }
    const rubricCriteria = rubric.criteria.map(c => c.parameter);
    const scoreKeys = Object.keys(score);
    if (!rubricCriteria.every(param => scoreKeys.includes(param)))
    {
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
    if (!updatedSubmission)
    {
        throw new ApiError(404, "Submission not found");
    }
    res.status(200).json({
        success: true,
        message: "Submission graded successfully",
        data: updatedSubmission
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

    const totalSubmissions = await Submission.countDocuments({ challenge_id: challengeId });

    const classificationCounts = await Submission.aggregate([
        { $match: { challenge_id: new mongoose.Types.ObjectId(challengeId) } },
        { $group: { _id: "$classification", count: { $sum: 1 } } }
    ]);

    let scoreDistribution = { low: 0, medium: 0, high: 0 };
    classificationCounts.forEach(({ _id, count }) => {
        if (_id) scoreDistribution[_id] = count;
    });

    return res.status(200).json(new ApiResponse(200, {
        challengeId,
        totalSubmissions,
        scoreDistribution
    }));
});
