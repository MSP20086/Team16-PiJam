import { Router } from "express";
import {
  getChallenges,
  createChallenge,
  getSubmissions,
  getSpecificSubmission,
  evaluateSubmission,
  getChallengeAnalytics,
} from "../controllers/teacher.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.get("/challenges", getChallenges);
// router.post("/challenge/create", createChallenge);
router.route("/challenge/create").post(
  upload.fields([
    // the name property shall match the form object property from frontend
    { name: "refMaterials" },
  ]),
  createChallenge
);
router.get("/:challengeId/submissions", getSubmissions);
router.get("/submissions/:submissionId", getSpecificSubmission);
router.post("/submission/evaluate", evaluateSubmission);
router.get("/analytics/:challengeId", getChallengeAnalytics);

export default router;
