import { Router } from "express";
import {
  getChallenges,
  createChallenge,
  getSubmissions,
  getSpecificSubmission,
  evaluateSubmission,
  getChallengeAnalytics,
  getInsightsOfSpecificChallenge,
} from "../controllers/teacher.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import requireAuth from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth); 
const requireTeacherRole = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "Access denied. Only teachers can perform this action." });
  }
  next();
};
router.use(requireTeacherRole); 

router.get("/challenges", getChallenges);
router.route("/challenge/create").post(
  upload.fields([{ name: "refMaterials" }]),
  createChallenge
);
router.get("/:challengeId/submissions", getSubmissions);
router.get("/submissions/:submissionId", getSpecificSubmission);
router.post("/submission/evaluate", evaluateSubmission);
router.get("/analytics/:challengeId", getChallengeAnalytics);
router.route("/:challengeId/insights").get(getInsightsOfSpecificChallenge);

export default router;
