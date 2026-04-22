import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB, { getConnectionStatus } from "./config/db";

// Route imports
import authRoutes from "./routes/auth.routes";
import donationRoutes from "./routes/donation.routes";
import volunteerRoutes from "./routes/volunteer.routes";
import foodDonationRoutes from "./routes/foodDonation.routes";
import talentRoutes from "./routes/talent.routes";
import eventRoutes from "./routes/event.routes";
import childRoutes from "./routes/child.routes";
import adminRoutes from "./routes/admin.routes";

// Middleware imports
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// --- Health Check ---
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "ImpactSphere API is running 🚀",
    database: getConnectionStatus() ? "connected" : "disconnected",
  });
});

// --- DB Check Middleware ---
const requireDB = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!getConnectionStatus()) {
    res.status(503).json({
      message: "Database not connected. Please configure MONGO_URI in server/.env",
      hint: "Use MongoDB Atlas (free): https://www.mongodb.com/atlas",
    });
    return;
  }
  next();
};

// --- Routes ---
app.use("/api/auth", requireDB, authRoutes);
app.use("/api/donations", requireDB, donationRoutes);
app.use("/api/volunteers", requireDB, volunteerRoutes);
app.use("/api/food-donations", requireDB, foodDonationRoutes);
app.use("/api/talents", requireDB, talentRoutes);
app.use("/api/events", requireDB, eventRoutes);
app.use("/api/children", requireDB, childRoutes);
app.use("/api/admin", requireDB, adminRoutes);

// --- Error Handler ---
app.use(errorHandler);

// --- Start Server ---
const startServer = async () => {
  const dbConnected = await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🚀 ImpactSphere server running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    
    if (!dbConnected) {
      console.log(`\n⚠️  Server started WITHOUT database connection.`);
      console.log(`   API routes will return 503 until MongoDB is configured.`);
      console.log(`   Edit server/.env and set MONGO_URI to your MongoDB connection string.\n`);
    }
  });
};

startServer();

export default app;
