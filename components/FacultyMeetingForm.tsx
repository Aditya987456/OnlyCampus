// components/FacultyMeetingForm.tsx
"use client";
import React, { useState } from "react";
import { useSocket } from "@/context/socketContext";
import { toast } from "sonner";
import { CalendarPlus, Link as LinkIcon, Clock } from "lucide-react";
import { IMeeting } from "@/lib/models/meeting"; 

const PRIMARY_COLOR = "green-600";
const HOVER_COLOR = "green-700";

interface FacultyMeetingFormProps {
  facultyName: string; // Used to store as 'createdBy'
}

const generateRoomID = () => `meeting-${Math.random().toString(36).substring(2, 9)}`;

export default function FacultyMeetingForm({ facultyName }: FacultyMeetingFormProps) {
  const socket = useSocket();
  const [title, setTitle] = useState("Class Meeting - Topic TBD");
  const [scheduledTime, setScheduledTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !scheduledTime) return toast.error("Title and time are required.");

    setLoading(true);

    const roomID = generateRoomID();
    const meetingLink = `/dashboard/meeting/${roomID}`;

    try {
      // 1. PERSIST to MongoDB
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            title, 
            roomID, 
            meetingLink, 
            scheduledTime, 
            createdBy: facultyName // Storing name
        }),
      });

      const data: { meeting?: IMeeting, message?: string } = await res.json();

      if (!res.ok || !data.meeting) {
        return toast.error(data.message || "Failed to schedule meeting.");
      }

      // 2. BROADCAST via Socket.IO
      socket?.emit("schedule-meeting", data.meeting);

      toast.success("Meeting scheduled and announced!");
      setTitle("Class Meeting - Topic TBD");
      setScheduledTime("");
      
    } catch (err) {
      toast.error("Something went wrong during scheduling.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
      <h2 className={`text-xl font-bold text-${PRIMARY_COLOR} mb-5 border-b pb-3 border-green-100`}>
        <span className="flex items-center gap-2"><CalendarPlus className="w-5 h-5"/> Schedule Class/Call</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-4 focus-within:ring-green-100 transition duration-150">
            <input
                type="text"
                placeholder="Meeting Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                required
            />
        </div>

        <div className="flex items-center gap-3 border border-gray-300 rounded-lg focus-within:ring-4 focus-within:ring-green-100 transition duration-150 p-1">
            <Clock className={`w-5 h-5 ml-2 text-${PRIMARY_COLOR}`} />
            <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full p-2 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                required
            />
        </div>
        
        <button
          type="submit"
          disabled={loading || !socket}
          className={`w-full py-3 text-white font-semibold rounded-lg bg-green-600 hover:bg-green-700 shadow-md transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        >
          {loading ? "Scheduling..." : <><LinkIcon className="w-5 h-5" />Schedule Meeting</>}
        </button>
      </form>
    </div>
  );
}