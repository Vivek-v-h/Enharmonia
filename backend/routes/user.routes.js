import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  deleteUser,
  updateProfile,
  getProfile
} from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.get("/profile", auth, getProfile);
router.put("/update-profile", auth, upload.single("avatar"), updateProfile);
router.delete("/delete", auth, deleteUser);

export default router;
