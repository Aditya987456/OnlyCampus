import mongoose from "mongoose";

export type Role = "student" | "faculty";

const AllowedUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ["student", "faculty"] },
    allowed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// need to use like this in nextjs because---
// Next.js API routes are not long-running servers.
// Every request or file edit can create a new instance of the file.


export const AllowedUserModel =
  mongoose.models.AllowedUser ||
  mongoose.model("AllowedUser", AllowedUserSchema);
