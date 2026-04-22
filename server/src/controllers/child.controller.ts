import { Request, Response } from "express";
import Child from "../models/Child";
import Activity from "../models/Activity";

// @desc    Get all children
// @route   GET /api/children
export const getChildren = async (_req: Request, res: Response): Promise<void> => {
  try {
    const children = await Child.find().sort({ name: 1 });
    res.json(children);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add child record
// @route   POST /api/children
export const addChild = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, age, educationProgress, healthProgress, notes } = req.body;

    if (!name || age === undefined) {
      res.status(400).json({ message: "Name and age are required" });
      return;
    }

    const child = await Child.create({
      name, age, educationProgress, healthProgress, notes,
    });

    await Activity.create({
      action: "Child added",
      detail: `${name} (age ${age}) added to system`,
      category: "child",
    });

    res.status(201).json(child);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update child progress
// @route   PUT /api/children/:id
export const updateChild = async (req: Request, res: Response): Promise<void> => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      res.status(404).json({ message: "Child not found" });
      return;
    }

    const { name, age, educationProgress, healthProgress, notes } = req.body;

    if (name !== undefined) child.name = name;
    if (age !== undefined) child.age = age;
    if (educationProgress !== undefined) child.educationProgress = educationProgress;
    if (healthProgress !== undefined) child.healthProgress = healthProgress;
    if (notes !== undefined) child.notes = notes;

    await child.save();

    await Activity.create({
      action: "Child update",
      detail: `${child.name}'s progress updated`,
      category: "child",
    });

    res.json(child);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get children stats (averages)
// @route   GET /api/children/stats
export const getChildrenStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await Child.aggregate([
      {
        $group: {
          _id: null,
          avgEducation: { $avg: "$educationProgress" },
          avgHealth: { $avg: "$healthProgress" },
          totalChildren: { $sum: 1 },
        },
      },
    ]);

    const stats = result.length > 0
      ? result[0]
      : { avgEducation: 0, avgHealth: 0, totalChildren: 0 };

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete child record
// @route   DELETE /api/children/:id
export const deleteChild = async (req: Request, res: Response): Promise<void> => {
  try {
    const child = await Child.findByIdAndDelete(req.params.id);
    if (!child) {
      res.status(404).json({ message: "Child not found" });
      return;
    }
    res.json({ message: "Child record deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
