// app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/mongoDBConnection';
import ChatMessage from '@/lib/models/chatMesssage';
import io from 'socket.io-client'; 

// --- Configuration ---
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

// --- Utility function to emit a socket event ---
const emitSocketEvent = (event: string, data: any) => {
    try {
        const socket = io(SOCKET_SERVER_URL, {
            transports: ["websocket"],
            reconnection: false, 
            timeout: 5000,
        });

        socket.on('connect', () => {
            socket.emit(event, data);
            socket.disconnect(); 
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error from API:', err.message);
        });

    } catch (error) {
        console.error("Error emitting socket event from API:", error);
    }
};

// --- 1. GET (Fetch Messages for a Conversation) ---
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId'); 

    if (!chatId) {
        return NextResponse.json({ message: "Missing chatId parameter" }, { status: 400 });
    }

    await ConnectDB();

    const messages = await ChatMessage.find({ recipientId: chatId })
      .sort({ createdAt: 1 }) 
      .lean();

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ message: "Failed to fetch messages" }, { status: 500 });
  }
}

// --- 2. POST (Send New Message) ---
export async function POST(req: NextRequest) {
  const { senderId, recipientId, content } = await req.json();

  if (!senderId || !recipientId || !content) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    await ConnectDB();

    const newMessage = new ChatMessage({
      senderId,
      recipientId,
      content,
    });

    await newMessage.save();
    
    // Broadcast the new message for real-time update
    emitSocketEvent('new-chat-message', newMessage.toObject()); 

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Failed to post message:", error);
    return NextResponse.json({ message: "Failed to post message" }, { status: 500 });
  }
}