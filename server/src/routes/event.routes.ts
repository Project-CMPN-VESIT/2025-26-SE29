import { Router } from "express";
import { getEvents, createEvent, registerForEvent, getEventById, updateEvent, deleteEvent } from "../controllers/event.controller";
import { protect, adminOnly } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createEventSchema } from "../utils/validators";

const router = Router();

router.get("/", getEvents);
router.post("/", protect, adminOnly, validate(createEventSchema), createEvent);
router.get("/:id", getEventById);
router.post("/:id/register", registerForEvent);
router.put("/:id", protect, adminOnly, updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

export default router;
