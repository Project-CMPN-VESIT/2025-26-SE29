import { Request, Response } from "express";
import Volunteer from "../models/Volunteer";
import VolunteerTask from "../models/VolunteerTask";
import Activity from "../models/Activity";
import { getPagination, paginatedResponse } from "../utils/pagination";

// @desc    Get all volunteers (with pagination, search, filter)
// @route   GET /api/volunteers?page=1&limit=20&status=active&search=rahul
export const getVolunteers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter: any = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
        { skills: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const [volunteers, total] = await Promise.all([
      Volunteer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Volunteer.countDocuments(filter),
    ]);

    res.json(paginatedResponse(volunteers, total, { page, limit, skip }));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register as volunteer
// @route   POST /api/volunteers
export const registerVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, skills } = req.body;

    const existing = await Volunteer.findOne({ email });
    if (existing) {
      res.status(400).json({ message: "Already registered as volunteer with this email" });
      return;
    }

    const volunteer = await Volunteer.create({ name, email, phone, skills });

    await Activity.create({
      action: "Volunteer joined",
      detail: `${name} registered as volunteer`,
      category: "volunteer",
    });

    res.status(201).json(volunteer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get volunteer tasks (with filter)
// @route   GET /api/volunteers/tasks?status=active&location=Mumbai
export const getVolunteerTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: any = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: "i" };
    }

    const tasks = await VolunteerTask.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create volunteer task (admin)
// @route   POST /api/volunteers/tasks
export const createVolunteerTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, date, location, status } = req.body;
    const task = await VolunteerTask.create({ title, date, location, status });
    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update volunteer status
// @route   PUT /api/volunteers/:id
export const updateVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      res.status(404).json({ message: "Volunteer not found" });
      return;
    }

    const { status, skills } = req.body;
    if (status) volunteer.status = status;
    if (skills) volunteer.skills = skills;

    await volunteer.save();
    res.json(volunteer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete volunteer
// @route   DELETE /api/volunteers/:id
export const deleteVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      res.status(404).json({ message: "Volunteer not found" });
      return;
    }
    res.json({ message: "Volunteer removed successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
