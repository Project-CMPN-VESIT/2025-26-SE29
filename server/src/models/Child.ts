import mongoose, { Schema, Document } from "mongoose";

export interface IChild extends Document {
  name: string;
  age: number;
  educationProgress: number;
  healthProgress: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const childSchema = new Schema<IChild>(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    educationProgress: { type: Number, default: 0, min: 0, max: 100 },
    healthProgress: { type: Number, default: 0, min: 0, max: 100 },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<IChild>("Child", childSchema);
