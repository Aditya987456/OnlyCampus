// models/chatMessage.ts (Conceptual Mongoose Model)

import mongoose, { Document, Schema } from 'mongoose';

// Interface for type safety
export interface IChatMessage extends Document {
    senderId: string;
    recipientId: string; // Or chatId if using group chats
    content: string;
    createdAt: Date;
    read: boolean;
}

const ChatMessageSchema: Schema = new Schema({
    senderId: {
        type: String, // Assuming sender ID is a simple string (e.g., user ID)
        required: true,
    },
    recipientId: { // This identifies the recipient (individual or group chat ID)
        type: String,
        required: true,
        index: true,
    },
    content: {
        type: String,
        required: true,
        maxlength: 500,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    read: {
        type: Boolean,
        default: false,
    },
});

const ChatMessage = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);

export default ChatMessage;