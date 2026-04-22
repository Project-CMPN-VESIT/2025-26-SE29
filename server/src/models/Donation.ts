import mongoose, { Schema, Document } from "mongoose";

export interface IDonation extends Document {
  donor?: mongoose.Types.ObjectId;
  donorName?: string;
  donorEmail?: string;
  amount: number;
  category: "education" | "food" | "healthcare";
  status: "pending" | "completed" | "failed";
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
  {
    donor: { type: Schema.Types.ObjectId, ref: "User" },
    donorName: { type: String, trim: true },
    donorEmail: { type: String, trim: true },
    amount: { type: Number, required: true, min: 1 },
    category: {
      type: String,
      enum: ["education", "food", "healthcare"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    transactionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IDonation>("Donation", donationSchema);
