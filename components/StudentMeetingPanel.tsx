// components/StudentMeetingPanel.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
// Assuming you have a SocketContext setup at this path
import { useSocket } from "@/context/socketContext"; 
import { Calendar, Users } from "lucide-react";
import { IMeeting } from "@/lib/models/meeting"; // IMeeting defines the server-side Mongoose type

const PRIMARY_COLOR = "green-600";
const HOVER_COLOR = "green-700";

// --- CLIENT MEETING INTERFACE FIX ---
// Define the properties that change type from the Mongoose model (Date/ObjectId) to the client JSON (string)
type ClientMeetingOverrides = {
    _id: string;
    time: string;
    createdAt: string; 
    updatedAt: string;
};

/**
 * Defines the client-side structure for a meeting fetched via API.
 * It uses Omit to remove the Mongoose-specific types (like ObjectId and Date)
 * and then applies the string types defined in Overrides.
 */
export interface ClientMeeting extends Omit<IMeeting, keyof ClientMeetingOverrides> , ClientMeetingOverrides {}

// --- COMPONENT START ---

export default function StudentMeetingPanel() {
  const socket = useSocket();
  const [meetings, setMeetings] = useState<ClientMeeting[]>([]);

  // Helper function for date formatting
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

  // 1. Fetch initial meetings
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch("/api/meetings");
        // Type the expected response structure: { meetings: array_of_client_meetings }
        const data: { meetings: ClientMeeting[] } = await res.json();
        
        if (res.ok) {
            setMeetings(data.meetings);
        }
      } catch (error) {
        console.error("Failed to fetch meetings:", error);
      }
    };
    fetchMeetings();
  }, []);

  // 2. Listen for live updates via Socket.IO
  useEffect(() => {
    if (!socket) return;

    // The event emitted by the API route on POST is 'schedule-meeting' (or similar)
    // Assuming your socket server re-broadcasts this as 'meeting-scheduled'
    const handler = (newMeeting: ClientMeeting) => {
      // Add the newest meeting to the start of the list
      setMeetings((prev) => [newMeeting, ...prev]); 
    };

    socket.on("meeting-scheduled", handler);
    return () => {
      socket.off("meeting-scheduled", handler);
    };
  }, [socket]);


  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-green-100">
      <div className={`flex items-center gap-3 mb-4 border-b pb-3 border-green-100`}>
          <Users className={`w-6 h-6 text-${PRIMARY_COLOR}`} />
          <h2 className={`text-xl font-bold text-${PRIMARY_COLOR}`}>Upcoming Classes / Meetings</h2>
      </div>

      {meetings.length === 0 ? (
        <p className="text-gray-500">No classes scheduled yet.</p>
      ) : (
        <div className="space-y-4">
            {meetings.map((m) => (
                <div 
                    key={m._id} 
                    className="p-4 border border-green-200 rounded-xl bg-green-50/50 flex justify-between items-center transition duration-150 hover:bg-green-100"
                >
                    <div>
                        <h3 className={`font-semibold text-lg text-gray-800`}>{m.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-green-700"/>
                            {/* Uses the corrected 'm.time' property */}
                            Scheduled: {formatTime(m.time)} | By: 
                            {/* Uses the corrected 'm.host' property */}
                            <span className="font-medium ml-1">{m.host}</span> 
                        </p>
                    </div>
                    
                    <Link href={m.meetingLink} target="_blank">
                        <button className={`py-2 px-4 bg-${PRIMARY_COLOR} hover:bg-${HOVER_COLOR} text-white font-medium rounded-lg shadow-md transition`}>
                            Join Live Call
                        </button>
                    </Link>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}