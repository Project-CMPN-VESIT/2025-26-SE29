import { Request, Response } from "express";
import FoodDonation from "../models/FoodDonation";
import Activity from "../models/Activity";

// @desc    Get all food donation programs
// @route   GET /api/food-donations
export const getFoodDonations = async (_req: Request, res: Response): Promise<void> => {
  try {
    const programs = await FoodDonation.find().sort({ createdAt: -1 });
    res.json(programs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Schedule a food donation
// @route   POST /api/food-donations
export const createFoodDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, mealType, mealsCount, emoji, scheduledDate, location } = req.body;

    if (!title || !mealType || !mealsCount) {
      res.status(400).json({ message: "Title, meal type and meals count are required" });
      return;
    }

    const food = await FoodDonation.create({
      title, mealType, mealsCount, emoji, scheduledDate, location,
    });

    await Activity.create({
      action: "Food drive",
      detail: `${mealsCount} meals scheduled at ${location || "TBD"}`,
      category: "food",
    });

    res.status(201).json(food);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get food donation stats
// @route   GET /api/food-donations/stats
export const getFoodDonationStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await FoodDonation.aggregate([
      { $match: { status: { $in: ["completed", "scheduled"] } } },
      { $group: { _id: null, totalMeals: { $sum: "$mealsCount" } } },
    ]);

    const totalMeals = result.length > 0 ? result[0].totalMeals : 0;

    const byType = await FoodDonation.aggregate([
      { $group: { _id: "$mealType", count: { $sum: "$mealsCount" } } },
    ]);

    res.json({ totalMeals, byType });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
