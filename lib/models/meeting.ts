// // lib/models/meeting.ts
// import mongoose, { Document, Schema } from 'mongoose';

// /**
//  * Defines the structure for a Meeting document stored in MongoDB.
//  */
// export interface IMeeting extends Document {
//     _id: mongoose.Types.ObjectId; 
//     title: string;          
//     description: string;    
//     time: Date;             // ✅ Corrected property name
//     duration: number;       
//     hostId: string;         
//     host: string;           
//     meetingLink: string;    
//     targetAudience: string; 
//     isLive: boolean;        
//     createdAt: Date;
//     updatedAt: Date;
// }

// const MeetingSchema: Schema = new Schema({
//     title: {
//         type: String,
//         required: true,
//         trim: true,
//         maxlength: 100,
//     },
//     description: {
//         type: String,
//         required: false,
//         maxlength: 500,
//     },
//     time: { // ✅ Corrected schema field
//         type: Date,
//         required: true,
//         index: true,
//     },
//     duration: {
//         type: Number,
//         required: true,
//         min: 15,
//         max: 240, 
//     },
//     hostId: {
//         type: String,
//         required: true,
//     },
//     host: {
//         type: String,
//         required: true,
//     },
//     meetingLink: {
//         type: String,
//         required: true,
//         match: [/^https?:\/\/.+/, 'Please use a valid meeting URL'],
//     },
//     targetAudience: {
//         type: String,
//         required: true,
//         default: "All Students",
//     },
//     isLive: {
//         type: Boolean,
//         default: false,
//     },
// }, { 
//     timestamps: true 
// });

// const MeetingModel = mongoose.models.Meeting || mongoose.model<IMeeting>('Meeting', MeetingSchema);

// export default MeetingModel;








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
    meetingLink: { type: String, required: true },
  },
  { timestamps: true }
);

export const MeetingModel =
  models.Meeting || model("Meeting", MeetingSchema);