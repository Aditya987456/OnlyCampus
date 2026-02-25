// // lib/models/chatMessage.ts
// import mongoose, { Document, Schema } from 'mongoose';

// // Interface for type safety
// export interface IChatMessage extends Document {
//     senderId: string;
//     recipientId: string; // The ID of the conversation (e.g., concatenated user IDs or a group ID)
//     content: string;
//     createdAt: Date;
//     read: boolean;
// }

// const ChatMessageSchema: Schema = new Schema({
//     senderId: {
//         type: String, 
//         required: true,
//     },
//     recipientId: { // This identifies the conversation or "room"
//         type: String,
//         required: true,
//         index: true,
//     },
//     content: {
//         type: String,
//         required: true,
//         maxlength: 500,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
//     read: {
//         type: Boolean,
//         default: false,
//     },
// });

// const ChatMessage = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);

// export default ChatMessage;



import mongoose, { Schema, models, model } from "mongoose";
import { UserModel } from "./user";

const MessageSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const MessageModel = models.Message || model("Message", MessageSchema);