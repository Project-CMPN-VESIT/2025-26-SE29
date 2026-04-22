import { Request, Response } from "express";
import Event from "../models/Event";
import Activity from "../models/Activity";
import { getPagination, paginatedResponse } from "../utils/pagination";

// @desc    Get all events (with pagination, filter by location)
// @route   GET /api/events?page=1&limit=20&location=Mumbai&upcoming=true
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter: any = {};

    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: "i" };
    }

    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    // Only upcoming events
    if (req.query.upcoming === "true") {
      filter.date = { $gte: new Date().toISOString().split("T")[0] };
    }

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ date: 1 }).skip(skip).limit(limit),
      Event.countDocuments(filter),
    ]);

    res.json(paginatedResponse(events, total, { page, limit, skip }));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create event (admin)
// @route   POST /api/events
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, date, location, attendeesCount, emoji } = req.body;

    const event = await Event.create({
      title, description, date, location, attendeesCount, emoji,
    });

    await Activity.create({
      action: "Event created",
      detail: `${title} – ${location}`,
      category: "event",
    });

    res.status(201).json(event);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    event.attendeesCount += 1;
    await event.save();

    res.json({ message: "Registered successfully", attendeesCount: event.attendeesCount });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
