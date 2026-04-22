import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: string;
  location: string;
  attendeesCount: number;
  emoji: string;
  registrations: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    attendeesCount: { type: Number, default: 0 },
    emoji: { type: String, default: "📅" },
    registrations: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>("Event", eventSchema);
