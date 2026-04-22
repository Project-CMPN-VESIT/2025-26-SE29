import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/User";
import Donation from "../models/Donation";
import DonationGoal from "../models/DonationGoal";
import Volunteer from "../models/Volunteer";
import VolunteerTask from "../models/VolunteerTask";
import FoodDonation from "../models/FoodDonation";
import Talent from "../models/Talent";
import Event from "../models/Event";
import Child from "../models/Child";
import Activity from "../models/Activity";

dotenv.config();

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/impactsphere";
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB for seeding");

    // Clear all collections
    await Promise.all([
      User.deleteMany({}),
      Donation.deleteMany({}),
      DonationGoal.deleteMany({}),
      Volunteer.deleteMany({}),
      VolunteerTask.deleteMany({}),
      FoodDonation.deleteMany({}),
      Talent.deleteMany({}),
      Event.deleteMany({}),
      Child.deleteMany({}),
      Activity.deleteMany({}),
    ]);
    console.log("🗑️  Cleared all collections");

    // --- 1. Admin User ---
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Admin",
      email: "admin@impactsphere.org",
      password: hashedPassword,
      role: "admin",
      phone: "+91 98765 43210",
    });
    console.log("👤 Admin user created (admin@impactsphere.org / admin123)");

    // --- 2. Donation Goals ---
    await DonationGoal.insertMany([
      { category: "education", goal: 1500000 },
      { category: "food", goal: 2000000 },
      { category: "healthcare", goal: 1000000 },
    ]);
    console.log("🎯 Donation goals seeded");

    // --- 3. Donations (to match frontend hardcoded raised values) ---
    // Education: 850000, Food: 1200000, Healthcare: 600000
    const donationSeed = [
      { amount: 350000, category: "education", donorName: "Ravi Sharma", status: "completed" },
      { amount: 250000, category: "education", donorName: "Priya Mehta", status: "completed" },
      { amount: 250000, category: "education", donorName: "Anonymous", status: "completed" },
      { amount: 500000, category: "food", donorName: "Suresh K.", status: "completed" },
      { amount: 400000, category: "food", donorName: "Lakshmi Foundation", status: "completed" },
      { amount: 300000, category: "food", donorName: "Anita D.", status: "completed" },
      { amount: 300000, category: "healthcare", donorName: "Dr. Patel", status: "completed" },
      { amount: 300000, category: "healthcare", donorName: "MedCare Trust", status: "completed" },
    ];
    await Donation.insertMany(donationSeed);
    console.log("💰 Donations seeded");

    // --- 4. Volunteer Tasks ---
    await VolunteerTask.insertMany([
      { title: "Food Distribution Drive", status: "active", date: "Mar 28, 2026", location: "Mumbai" },
      { title: "Education Workshop", status: "completed", date: "Mar 15, 2026", location: "Delhi" },
      { title: "Health Camp Coordination", status: "active", date: "Apr 5, 2026", location: "Bangalore" },
      { title: "Event Photography", status: "completed", date: "Feb 20, 2026", location: "Chennai" },
    ]);
    console.log("📋 Volunteer tasks seeded");

    // --- 5. Food Donation Programs ---
    await FoodDonation.insertMany([
      { title: "Breakfast Drive", mealType: "breakfast", mealsCount: 200, emoji: "🥣", status: "completed" },
      { title: "Lunch Program", mealType: "lunch", mealsCount: 500, emoji: "🍛", status: "completed" },
      { title: "Dinner Seva", mealType: "dinner", mealsCount: 350, emoji: "🍲", status: "completed" },
      { title: "Festival Special", mealType: "festival", mealsCount: 1000, emoji: "🎊", status: "scheduled" },
    ]);
    console.log("🍽️  Food donation programs seeded");

    // --- 6. Talents ---
    await Talent.insertMany([
      { name: "Aarav Singh", skill: "Classical Dance", rating: 4.8 },
      { name: "Meera Patel", skill: "Painting", rating: 4.9 },
      { name: "Ravi Kumar", skill: "Singing", rating: 4.7 },
      { name: "Sita Devi", skill: "Pottery", rating: 4.6 },
      { name: "Vikram Rao", skill: "Photography", rating: 4.8 },
      { name: "Lakshmi N.", skill: "Embroidery", rating: 4.9 },
    ]);
    console.log("⭐ Talents seeded");

    // --- 7. Events ---
    await Event.insertMany([
      { title: "Annual Charity Gala", description: "An evening of giving, music, and celebration.", date: "2026-04-15", location: "Mumbai", attendeesCount: 250, emoji: "✨" },
      { title: "Community Health Camp", description: "Free health checkups and awareness sessions.", date: "2026-04-20", location: "Delhi", attendeesCount: 500, emoji: "🏥" },
      { title: "Children's Art Exhibition", description: "Showcasing artwork by talented children.", date: "2026-05-01", location: "Bangalore", attendeesCount: 150, emoji: "🎨" },
      { title: "Food Drive Marathon", description: "Run for a cause — every km feeds a family.", date: "2026-05-10", location: "Chennai", attendeesCount: 300, emoji: "🏃" },
    ]);
    console.log("📅 Events seeded");

    // --- 8. Children ---
    await Child.insertMany([
      { name: "Ananya", age: 8, educationProgress: 75, healthProgress: 90 },
      { name: "Rohan", age: 10, educationProgress: 60, healthProgress: 85 },
      { name: "Priya", age: 7, educationProgress: 85, healthProgress: 95 },
      { name: "Arjun", age: 9, educationProgress: 70, healthProgress: 80 },
    ]);
    console.log("👶 Children seeded");

    // --- 9. Activity Feed ---
    await Activity.insertMany([
      { action: "Donation received", detail: "₹5,000 from Priya S.", category: "donation" },
      { action: "Volunteer joined", detail: "Rahul V. registered", category: "volunteer" },
      { action: "Event created", detail: "Health Camp – Delhi", category: "event" },
      { action: "Food drive", detail: "200 meals distributed", category: "food" },
      { action: "Child update", detail: "Ananya's progress updated", category: "child" },
    ]);
    console.log("📊 Activity feed seeded");

    console.log("\n🎉 Database seeded successfully!");
    console.log("   Admin login: admin@impactsphere.org / admin123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedDB();
