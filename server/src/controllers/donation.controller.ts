import { Request, Response } from "express";
import Donation from "../models/Donation";
import DonationGoal from "../models/DonationGoal";
import Activity from "../models/Activity";
import { getPagination, paginatedResponse } from "../utils/pagination";

// @desc    Get all donations (with pagination, search, filter)
// @route   GET /api/donations?page=1&limit=20&category=food&search=priya
export const getDonations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter: any = {};

    // Filter by category
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Search by donor name
    if (req.query.search) {
      filter.donorName = { $regex: req.query.search, $options: "i" };
    }

    const [donations, total] = await Promise.all([
      Donation.find(filter)
        .populate("donor", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Donation.countDocuments(filter),
    ]);

    res.json(paginatedResponse(donations, total, { page, limit, skip }));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create donation
// @route   POST /api/donations
export const createDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, category, donorName, donorEmail } = req.body;

    const donation = await Donation.create({
      amount,
      category,
      donorName,
      donorEmail,
      status: "completed",
      transactionId: `TXN_${Date.now()}`,
    });

    await Activity.create({
      action: "Donation received",
      detail: `₹${Number(amount).toLocaleString("en-IN")} from ${donorName || "Anonymous"}`,
      category: "donation",
    });

    res.status(201).json(donation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get donation stats (raised vs goal per category)
// @route   GET /api/donations/stats
export const getDonationStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = ["education", "food", "healthcare"] as const;
    const icons = { education: "BookOpen", food: "Utensils", healthcare: "Stethoscope" };
    const stats = [];

    for (const cat of categories) {
      const result = await Donation.aggregate([
        { $match: { category: cat, status: "completed" } },
        { $group: { _id: null, raised: { $sum: "$amount" } } },
      ]);

      const raised = result.length > 0 ? result[0].raised : 0;
      const goalDoc = await DonationGoal.findOne({ category: cat });
      const goal = goalDoc ? goalDoc.goal : (cat === "education" ? 1500000 : cat === "food" ? 2000000 : 1000000);

      stats.push({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        icon: icons[cat],
        raised,
        goal,
      });
    }

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single donation
// @route   GET /api/donations/:id
export const getDonationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const donation = await Donation.findById(req.params.id).populate("donor", "name email");
    if (!donation) {
      res.status(404).json({ message: "Donation not found" });
      return;
    }
    res.json(donation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
