import { Router } from "express";
import {
  registerUser,
  loginUser,
  logout,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logout);
router.get("/current-user", verifyJWT, getCurrentUser);

export default router;
