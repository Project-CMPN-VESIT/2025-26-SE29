import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  action: string;
  detail: string;
  category: "donation" | "volunteer" | "event" | "food" | "child" | "system";
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    action: { type: String, required: true, trim: true },
    detail: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["donation", "volunteer", "event", "food", "child", "system"],
      default: "system",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<IActivity>("Activity", activitySchema);
