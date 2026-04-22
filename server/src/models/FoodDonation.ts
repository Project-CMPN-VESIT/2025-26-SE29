import mongoose, { Schema, Document } from "mongoose";

export interface IFoodDonation extends Document {
  title: string;
  mealType: "breakfast" | "lunch" | "dinner" | "festival";
  mealsCount: number;
  emoji: string;
  scheduledDate?: string;
  location?: string;
  donor?: mongoose.Types.ObjectId;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const foodDonationSchema = new Schema<IFoodDonation>(
  {
    title: { type: String, required: true, trim: true },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "festival"],
      required: true,
    },
    mealsCount: { type: Number, required: true, min: 1 },
    emoji: { type: String, default: "🍛" },
    scheduledDate: { type: String },
    location: { type: String, trim: true },
    donor: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IFoodDonation>("FoodDonation", foodDonationSchema);
