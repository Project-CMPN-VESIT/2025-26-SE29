import mongoose, { Schema, Document } from "mongoose";

export interface ITalent extends Document {
  name: string;
  skill: string;
  rating: number;
  mediaUrl?: string;
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const talentSchema = new Schema<ITalent>(
  {
    name: { type: String, required: true, trim: true },
    skill: { type: String, required: true, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    mediaUrl: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<ITalent>("Talent", talentSchema);
