

import mongoose, { Schema, models, model } from "mongoose";


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