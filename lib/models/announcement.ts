
import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId; // ref to User
  groupId: mongoose.Types.ObjectId;   // which group this is for
  targetAll: boolean;                  // true = sent to everyone
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema: Schema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true, 
      trim: true 
    },
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: "User",          // links to faculty user
      required: true 
    },
    groupId: { 
      type: Schema.Types.ObjectId, 
      ref: "Group",         // which group sees this
      required: true 
    },
    targetAll: { 
      type: Boolean, 
      default: false        // true = broadcast to everyone
    },
  },
  { timestamps: true }
);

export const AnnouncementModel =
  (mongoose.models.Announcement as mongoose.Model<IAnnouncement>) ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);