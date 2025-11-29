// lib/models/announcement.ts
import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for the document, including Mongoose properties
export interface IAnnouncement extends Document {
  // Mongoose fields added by default
  _id: mongoose.Types.ObjectId; // MongoDB unique ID
  createdAt: Date; // Added by timestamps: true
  updatedAt: Date; // Added by timestamps: true
  __v: number;      // Version key

  // Your specific fields
  title: string;
  description: string;
  createdBy: string; 
}

const AnnouncementSchema: Schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true } // This is what adds createdAt and updatedAt
);

export const AnnouncementModel =
  (mongoose.models.Announcement as mongoose.Model<IAnnouncement>) ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);

// Note: Ensure you apply the same logic to IMeeting in lib/models/meeting.ts