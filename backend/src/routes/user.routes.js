import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// post
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
// get
router.route("/current-user").get(verifyJWT, getCurrentUser);
// post
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
