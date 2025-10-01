import express from "express";
import { signup, login, getProfile } from "../controllers/authController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/profile", protect, getProfile);

router.get("/admin-only", protect, admin, (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

export default router;
