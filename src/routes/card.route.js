import { Router } from "express";
import {
  createBusinessCards,
  getBusinessCard,
  getUserBusinessCards,
  getAllBusinessCards,
  updateBusinessCard,
  activateBusinessCard,
  deactivateBusinessCard,
  reAssignBusinessCard,
  setUrlCode,
  getNonAdminUsers,
  deleteBusinessCard,
} from "../controllers/card.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/:urlCode", getBusinessCard);

// User routes (require authentication)
router.post("/create", verifyJWT, createBusinessCards);
router.get("/user", verifyJWT, getUserBusinessCards);
router.put("/:urlCode", verifyJWT, updateBusinessCard);
router.put("/:urlCode/activate", verifyJWT, activateBusinessCard);
router.put("/:urlCode/deactivate", verifyJWT, deactivateBusinessCard);
router.put("/:id/url-code", verifyJWT, setUrlCode);
router.delete("/:id", verifyJWT, deleteBusinessCard);

// Admin routes (require authentication and admin role)
router.get("/all", verifyJWT, isAdmin, getAllBusinessCards);
router.get("/non-admin-users", verifyJWT, isAdmin, getNonAdminUsers);
router.put("/:urlCode/reassign", verifyJWT, isAdmin, reAssignBusinessCard);

export default router;
