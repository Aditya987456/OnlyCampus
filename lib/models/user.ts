import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type:String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, enum: ["student", "faculty"] },

});

export const UserModel =  mongoose.models.User || mongoose.model("User", UserSchema);
