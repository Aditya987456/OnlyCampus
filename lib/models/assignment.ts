import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  classGroup: { type: String, required: true },
}, { timestamps: true });

export const AssignmentModel = mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);
