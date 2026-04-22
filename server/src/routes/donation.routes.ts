import { Router } from "express";
import { getDonations, createDonation, getDonationStats } from "../controllers/donation.controller";
import { validate } from "../middleware/validate";
import { createDonationSchema } from "../utils/validators";

const router = Router();

router.get("/", getDonations);
router.post("/", validate(createDonationSchema), createDonation);
router.get("/stats", getDonationStats);

export default router;
