// app/api/meetings/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection"; // Assume ConnectDB exists
import MeetingModel, { IMeeting } from "@/lib/models/meeting"; // ✅ 1. Import the model
import io from 'socket.io-client'; // For real-time broadcasting

// --- Configuration ---
// Match the URL used in your SocketProvider
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

// --- GET (Fetch Meetings) ---
export async function GET() {
  try {
    await ConnectDB();
    
    // ✅ 2. Use 'time' property for sorting (as defined in IMeeting)
    const meetings = await MeetingModel.find().sort({ time: 1 }).lean(); 
    
    // Note: In a real app, you'd filter by user/audience
    return NextResponse.json({ meetings }, { status: 200 });
  } catch (error) {
    console.error("Meeting fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch meetings" }, { status: 500 });
  }
}

// --- POST (Create Meeting) ---
export async function POST(req: NextRequest) {
  await ConnectDB();
  
  // ✅ 3. Destructure the time field as 'time' (matching the model)
  // We'll rename the createdBy field to hostId to match the standard model structure
  const { title, duration, meetingLink, time, hostId, host, targetAudience, description } = await req.json();

  // Basic validation (adjust fields as necessary)
  if (!title || !time || !hostId || !meetingLink) {
    return NextResponse.json({ message: "Missing required fields (title, time, hostId, meetingLink)" }, { status: 400 });
  }

  try {
    const newMeeting = await MeetingModel.create({ 
        title, 
        duration, 
        meetingLink, 
        time, // ✅ Use 'time'
        hostId, 
        host, // Assuming host name is passed
        targetAudience, 
        description 
    });
    
    // Broadcast the new meeting for real-time update
    emitSocketEvent('schedule-meeting', newMeeting.toObject()); 

    return NextResponse.json({ meeting: newMeeting }, { status: 201 });
  } catch (error: any) {
    console.error("Meeting creation error:", error.message);
    return NextResponse.json({ message: "Failed to create meeting", error: error.message }, { status: 500 });
  }
}