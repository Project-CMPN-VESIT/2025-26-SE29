import { Request, Response } from "express";
import Talent from "../models/Talent";

// @desc    Get all talents
// @route   GET /api/talents
export const getTalents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const talents = await Talent.find().sort({ rating: -1, createdAt: -1 });
    res.json(talents);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create talent entry (with optional file upload)
// @route   POST /api/talents
export const createTalent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, skill, rating } = req.body;

    if (!name || !skill) {
      res.status(400).json({ message: "Name and skill are required" });
      return;
    }

    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const talent = await Talent.create({
      name,
      skill,
      rating: rating || 0,
      mediaUrl,
    });

    res.status(201).json(talent);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single talent
// @route   GET /api/talents/:id
export const getTalentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const talent = await Talent.findById(req.params.id);
    if (!talent) {
      res.status(404).json({ message: "Talent not found" });
      return;
    }
    res.json(talent);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
