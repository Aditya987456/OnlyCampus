// components/StudentMeetingPanel.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSocket } from "@/context/socketContext";
import { Calendar, Users } from "lucide-react";
import { IMeeting } from "@/lib/models/meeting";

const PRIMARY_COLOR = "green-600";
const HOVER_COLOR = "green-700";

export default function StudentMeetingPanel() {
  const socket = useSocket();
  const [meetings, setMeetings] = useState<IMeeting[]>([]);

  // 1. Fetch initial meetings
  useEffect(() => {
    const fetchMeetings = async () => {
      const res = await fetch("/api/meetings");
      const data = await res.json();
      if (res.ok) setMeetings(data.meetings);
    };
    fetchMeetings();
  }, []);

  // 2. Listen for live updates (listening for "meeting-scheduled")
  useEffect(() => {
    if (!socket) return;

    const handler = (newMeeting: IMeeting) => {
      setMeetings((prev) => [newMeeting, ...prev]); 
    };

    socket.on("meeting-scheduled", handler);
    return () => {
      socket.off("meeting-scheduled", handler);
    };
  }, [socket]);

  const formatTime = (dateString: Date) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

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
                //@ts-ignore
                <div key={m._id} className="p-4 border border-green-200 rounded-xl bg-green-50/50 flex justify-between items-center transition duration-150">
                    <div>
                        <h3 className={`font-semibold text-lg text-gray-800`}>{m.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-green-700"/>
                            Scheduled: {formatTime(m.scheduledTime)} | By: {m.createdBy}
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