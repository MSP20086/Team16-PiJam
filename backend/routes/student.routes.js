import express from "express";
import {
  getAllChallenges,
  getChallengeById,
  submitChallenge,
  getStudentSubmissions
} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/challenges", getAllChallenges);
router.get("/challenges/submissions", getStudentSubmissions);
router.get("/challenges/:challengeId", getChallengeById);
router.post("/challenges/:challengeId", submitChallenge);


export default router;