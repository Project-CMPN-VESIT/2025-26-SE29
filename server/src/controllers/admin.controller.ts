import { Request, Response } from "express";
import Donation from "../models/Donation";
import User from "../models/User";
import Volunteer from "../models/Volunteer";
import Event from "../models/Event";
import FoodDonation from "../models/FoodDonation";
import Activity from "../models/Activity";

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Total donations sum
    const donationResult = await Donation.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalDonations = donationResult.length > 0 ? donationResult[0].total : 0;

    // Total users
    const totalUsers = await User.countDocuments();

    // Active volunteers
    const activeVolunteers = await Volunteer.countDocuments({ status: "active" });

    // Events this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const eventsThisMonth = await Event.countDocuments({
      date: {
        $gte: startOfMonth.toISOString().split("T")[0],
        $lte: endOfMonth.toISOString().split("T")[0],
      },
    });

    // Monthly donation data (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const monthDonations = await Donation.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: start, $lte: end },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const monthVolunteers = await Volunteer.countDocuments({
        createdAt: { $gte: start, $lte: end },
      });

      monthlyData.push({
        month: start.toLocaleString("en-US", { month: "short" }),
        donations: monthDonations.length > 0 ? monthDonations[0].total : 0,
        volunteers: monthVolunteers,
      });
    }

    // Total meals
    const mealsResult = await FoodDonation.aggregate([
      { $group: { _id: null, total: { $sum: "$mealsCount" } } },
    ]);
    const totalMeals = mealsResult.length > 0 ? mealsResult[0].total : 0;

    res.json({
      totalDonations,
      totalUsers,
      activeVolunteers,
      eventsThisMonth,
      totalMeals,
      monthlyData,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent activity feed
// @route   GET /api/admin/activity
export const getRecentActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    // Format relative time
    const formatted = activities.map((a) => {
      const diffMs = Date.now() - new Date(a.createdAt).getTime();
      const diffMin = Math.floor(diffMs / 60000);
      let time: string;

      if (diffMin < 1) time = "Just now";
      else if (diffMin < 60) time = `${diffMin} min ago`;
      else if (diffMin < 1440) time = `${Math.floor(diffMin / 60)} hr${Math.floor(diffMin / 60) > 1 ? "s" : ""} ago`;
      else time = `${Math.floor(diffMin / 1440)} day${Math.floor(diffMin / 1440) > 1 ? "s" : ""} ago`;

      return {
        action: a.action,
        detail: a.detail,
        category: a.category,
        time,
        createdAt: a.createdAt,
      };
    });

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
