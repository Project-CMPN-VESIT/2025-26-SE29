import { Router } from "express";
import { getVolunteers, registerVolunteer, getVolunteerTasks, createVolunteerTask } from "../controllers/volunteer.controller";
import { validate } from "../middleware/validate";
import { registerVolunteerSchema, createTaskSchema } from "../utils/validators";

const router = Router();

router.get("/", getVolunteers);
router.post("/", validate(registerVolunteerSchema), registerVolunteer);
router.get("/tasks", getVolunteerTasks);
router.post("/tasks", validate(createTaskSchema), createVolunteerTask);

export default router;
