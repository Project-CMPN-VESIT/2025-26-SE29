import { Router } from "express";
import { getFoodDonations, createFoodDonation, getFoodDonationStats } from "../controllers/foodDonation.controller";
import { validate } from "../middleware/validate";
import { createFoodDonationSchema } from "../utils/validators";

const router = Router();

router.get("/", getFoodDonations);
router.post("/", validate(createFoodDonationSchema), createFoodDonation);
router.get("/stats", getFoodDonationStats);

export default router;
