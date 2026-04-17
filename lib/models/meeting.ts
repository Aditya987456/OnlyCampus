
import mongoose, { models, model, Schema } from "mongoose";

const MeetingSchema = new Schema(
  {
    title: { type: String, required: true },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["scheduled", "live", "ended"],
      default: "scheduled",
    },
   // meetingLink: { type: String, required: true },
    roomName: String,
    hostLink: String,
    participantLink: String,
  },
  { timestamps: true }
);

export const MeetingModel =
  models.Meeting || model("Meeting", MeetingSchema);