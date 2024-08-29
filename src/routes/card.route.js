import { Router } from "express";
import {
  createBusinessCards,
  getBusinessCard,
  getUserBusinessCards,
  updateBusinessCard,
  deactivateBusinessCard,
  reAssignBusinessCard,
  setCustomUrlCode,
} from "../controllers/card.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", verifyJWT, createBusinessCards);
router.get("/user", verifyJWT, getUserBusinessCards);
router.get("/:urlCode", getBusinessCard);
router.put("/:urlCode", verifyJWT, updateBusinessCard);
router.put("/:urlCode/deactivate", verifyJWT, deactivateBusinessCard);
router.put("/:urlCode/reassign", verifyJWT, isAdmin, reAssignBusinessCard);
router.put("/:urlCode/custom-url", verifyJWT, setCustomUrlCode);

export default router;
