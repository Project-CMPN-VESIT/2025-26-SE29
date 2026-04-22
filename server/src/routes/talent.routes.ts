import { Router } from "express";
import { getTalents, createTalent, getTalentById } from "../controllers/talent.controller";
import { upload } from "../utils/upload";

const router = Router();

router.get("/", getTalents);
router.post("/", upload.single("media"), createTalent);
router.get("/:id", getTalentById);

export default router;
