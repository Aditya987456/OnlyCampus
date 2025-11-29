// app/api/meetings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/utils/database'; // Adjust path as needed
import Meeting from '@/models/meeting'; // Adjust path to your Mongoose model
import { getSocketInstance } from '@/socket/socketHandler'; // Utility to get the server instance

// --- 1. GET (Read Meetings) ---
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    // Fetch all meetings, sorted by time (upcoming first)
    const meetings = await Meeting.find({})
      .sort({ time: 1 }) // Assuming 'time' is a Date field
      .lean(); // Use .lean() for faster read performance

    return NextResponse.json(meetings, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch meetings:", error);
    return NextResponse.json({ message: "Failed to fetch meetings" }, { status: 500 });
  }
}

// --- 2. POST (Create Meeting) ---
export async function POST(req: NextRequest) {
  const { title, time, host, duration } = await req.json();

  if (!title || !time || !host || !duration) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    await connectToDB();

    const newMeeting = new Meeting({
      title,
      time: new Date(time), // Convert time string to Date object
      host,
      duration,
    });

    await newMeeting.save();
    
    // Get Socket.IO instance and broadcast the new meeting
    const io = getSocketInstance();
    // Emit 'meeting-scheduled' to all connected clients
    io.emit('meeting-scheduled', newMeeting); 

    return NextResponse.json(newMeeting, { status: 201 });
  } catch (error) {
    console.error("Failed to create meeting:", error);
    return NextResponse.json({ message: "Failed to create meeting" }, { status: 500 });
  }
}

// --- 3. DELETE (Delete/Cancel Meeting) ---
// Note: This uses the body to pass the meeting ID, a common pattern in RESTful APIs
// for operations that need a body payload but are deleting a resource.
export async function DELETE(req: NextRequest) {
  try {
    const { meetingId } = await req.json();

    if (!meetingId) {
      return NextResponse.json({ message: "Missing meeting ID" }, { status: 400 });
    }

    await connectToDB();

    const deletedMeeting = await Meeting.findByIdAndDelete(meetingId);

    if (!deletedMeeting) {
      return NextResponse.json({ message: "Meeting not found" }, { status: 404 });
    }

    // Get Socket.IO instance and broadcast the cancellation
    const io = getSocketInstance();
    // Emit 'meeting-canceled' with the ID of the deleted meeting
    io.emit('meeting-canceled', meetingId); 

    return NextResponse.json({ message: "Meeting deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete meeting:", error);
    return NextResponse.json({ message: "Failed to delete meeting" }, { status: 500 });
  }
}