
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      required: true
    },

    department: String,
    year: String,

    isAllowed: {
      type: Boolean,
      default: true
    },

    password: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

export const UserModel =  mongoose.models.User || mongoose.model("User", UserSchema);
