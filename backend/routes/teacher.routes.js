import { Router } from 'express';
import {
    getChallenges,
    createChallenge,
    getSubmissions,
    getSpecificSubmission,
    evaluateSubmission
} from "../controllers/teacher.controller.js"


const router = Router();

router.get("/challenges", getChallenges);
router.post("/challenge/create", createChallenge);
router.get(":challengeId/submissions", getSubmissions);
router.get("/submissions/:submissionId", getSpecificSubmission);
router.post("/submission/evaluate", evaluateSubmission);

export default router