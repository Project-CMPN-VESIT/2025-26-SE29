import mongoose, { Schema, Document } from "mongoose";

export interface IDonationGoal extends Document {
  category: "education" | "food" | "healthcare";
  goal: number;
  createdAt: Date;
  updatedAt: Date;
}

const donationGoalSchema = new Schema<IDonationGoal>(
  {
    category: {
      type: String,
      enum: ["education", "food", "healthcare"],
      required: true,
      unique: true,
    },
    goal: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IDonationGoal>("DonationGoal", donationGoalSchema);
