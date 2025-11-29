// components/FacultyAnnouncementForm.tsx
"use client";
import React, { useState } from "react";
import { useSocket } from "@/context/socketContext";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { IAnnouncement } from "@/lib/models/announcement";

const PRIMARY_COLOR = "green-600";

// Ensure the props interface is defined for type safety
interface FacultyAnnouncementFormProps {
  facultyName: string; 
  facultyId: string;
}

export default function FacultyAnnouncementForm({ facultyName, facultyId }: FacultyAnnouncementFormProps) {
  const socket = useSocket();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return toast.error("All fields are required");

    setLoading(true);

    try {
      // 1. PERSIST to MongoDB
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, createdBy: facultyName }), 
      });

      // Explicitly type the response data
      const data: { announcement?: IAnnouncement, message?: string } = await res.json();

      if (!res.ok || !data.announcement) {
          return toast.error(data.message || "Failed to create announcement");
      }

      // 2. BROADCAST via Socket.IO
      // This sends the newly created announcement object to all connected clients
      socket?.emit("create-announcement", data.announcement);

      toast.success("Announcement created successfully!");
      setTitle("");
      setDescription("");
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-fit">
      <h2 className={`text-xl font-bold text-${PRIMARY_COLOR} mb-5 border-b pb-3 border-gray-200`}>
        <span className="flex items-center gap-2"><Send className="w-5 h-5"/> Publish New Message</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Announcement Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition duration-150"
          required
        />
        <textarea
          placeholder="Detailed Description of the announcement..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition duration-150"
          rows={6}
          required
        />
        <button
          type="submit"
          disabled={loading || !socket}
          className={`w-full py-3 text-white font-semibold rounded-lg bg-green-600 hover:bg-green-700 shadow-lg transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? "Publishing..." : "Publish Announcement"}
        </button>
      </form>
    </div>
  );
}