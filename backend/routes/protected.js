import express from "express";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});
export default router;
