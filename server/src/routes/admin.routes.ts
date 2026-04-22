import { Router } from "express";
import { getDashboardStats, getRecentActivity } from "../controllers/admin.controller";
import { protect, adminOnly } from "../middleware/auth";

const router = Router();

router.get("/dashboard", protect, adminOnly, getDashboardStats);
router.get("/activity", protect, adminOnly, getRecentActivity);

export default router;
