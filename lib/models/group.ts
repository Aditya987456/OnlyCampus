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

    //yahi list hai users ke kisi group me , members array me user ke _id honge as reference to User collection, taki hume pata chale ki kaunse users kis group me hain, aur jab hume group ke members ki details chahiye toh hum User collection se populate kar sakte hain using these ObjectIds.
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