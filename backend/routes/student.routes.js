import express from "express";
import {
  getAllChallenges,
  getChallengeById,
  submitChallenge,
  getStudentSubmissions,
  getMySubmissionForChallenge
} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/challenges", getAllChallenges);
router.get("/challenges/submissions", getStudentSubmissions);
router.get("/challenges/:challengeId", getChallengeById);
router.post("/challenges/:challengeId", submitChallenge);
router.get("/challenges/:challengeId/submission",getMySubmissionForChallenge);


export default router;