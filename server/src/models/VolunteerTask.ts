import mongoose, { Schema, Document } from "mongoose";

export interface IVolunteerTask extends Document {
  title: string;
  status: "active" | "completed";
  date: string;
  location: string;
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const volunteerTaskSchema = new Schema<IVolunteerTask>(
  {
    title: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "completed"], default: "active" },
    date: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "Volunteer" },
  },
  { timestamps: true }
);

export default mongoose.model<IVolunteerTask>("VolunteerTask", volunteerTaskSchema);
