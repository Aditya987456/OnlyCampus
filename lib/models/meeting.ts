// lib/models/meeting.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IMeeting extends Document {
  title: string;
  roomID: string;
  meetingLink: string;
  scheduledTime: Date;
  createdBy: string; // Storing the faculty name/ID as a string
}

const MeetingSchema: Schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    roomID: { type: String, required: true, unique: true, trim: true },
    meetingLink: { type: String, required: true, trim: true },
    scheduledTime: { type: Date, required: true },
    createdBy: { type: String, required: true }, // Storing the creator's identity
  },
  { timestamps: true }
);

export const MeetingModel =
  (mongoose.models.Meeting as mongoose.Model<IMeeting>) ||
  mongoose.model<IMeeting>("Meeting", MeetingSchema);