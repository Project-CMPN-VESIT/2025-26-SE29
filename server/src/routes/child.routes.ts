import { Router } from "express";
import { getChildren, addChild, updateChild, getChildrenStats, deleteChild } from "../controllers/child.controller";
import { protect, adminOnly } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { addChildSchema, updateChildSchema } from "../utils/validators";

const router = Router();

router.get("/", getChildren);
router.post("/", protect, adminOnly, validate(addChildSchema), addChild);
router.get("/stats", getChildrenStats);
router.put("/:id", protect, adminOnly, validate(updateChildSchema), updateChild);
router.delete("/:id", protect, adminOnly, deleteChild);

export default router;
