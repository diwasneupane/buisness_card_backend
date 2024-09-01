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

// Admin routes (require authentication and admin role)
router.get("/all", verifyJWT, isAdmin, getAllBusinessCards);
router.get("/non-admin-users", verifyJWT, isAdmin, getNonAdminUsers);

// User routes (require authentication)
router.post("/create", verifyJWT, createBusinessCards);
router.get("/user", verifyJWT, getUserBusinessCards);
router.put("/update/:urlCode", verifyJWT, updateBusinessCard);
router.put("/activate/:urlCode", verifyJWT, activateBusinessCard);
router.put("/deactivate/:urlCode", verifyJWT, deactivateBusinessCard);
router.put("/url-code/:id", verifyJWT, setUrlCode);
router.delete("/delete/:id", verifyJWT, deleteBusinessCard);

// Admin route for reassigning
router.put("/reassign/:urlCode", verifyJWT, isAdmin, reAssignBusinessCard);

// Public route
router.get("/:urlCode", getBusinessCard);

export default router;
