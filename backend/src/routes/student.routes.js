import express from "express";
import {
  getAllChallenges,
  getChallengeById,
  submitChallenge,
  getStudentSubmissions,
  getMySubmissionForChallenge,
} from "../controllers/student.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import requireAuth from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(requireAuth); 
const requireStudentRole = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ error: "Access denied. Only students can perform this action." });
  }
  next();
};
router.use(requireStudentRole);

router.get("/challenges", getAllChallenges);
router.get("/challenges/submissions", getStudentSubmissions);
router.get("/challenges/:challengeId", getChallengeById);
router
  .route("/challenges/:challengeId")
  .post(upload.single("submissionFile"), submitChallenge);
router.get("/challenges/:challengeId/submission", getMySubmissionForChallenge);

export default router;
