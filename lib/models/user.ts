// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   name: { type:String },
//   email: { type: String, required: true, unique: true },
//   passwordHash: { type: String, required: true },
//   role: { type: String, required: true, enum: ["student", "faculty"] },

// });

// export const UserModel =  mongoose.models.User || mongoose.model("User", UserSchema);



import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    role: {
      type: String,
      enum: ["student", "faculty"],
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