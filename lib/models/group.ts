import mongoose, { Schema, models, model } from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    type: {
      type: String,
      // enum: ["faculty", "student"],
      enum: ["student", "faculty", "announcement"],
      required: true
    },

    department: String,
    year: String,

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],


  createdBy: {
  type: Schema.Types.ObjectId,
  ref: "User",
  default: null  // null for auto-created groups
}




  },
  { timestamps: true }
);

export const GroupModel = models.Group || model("Group", GroupSchema);