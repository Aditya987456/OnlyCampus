// components/AnnouncementPanel.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSocket } from "@/context/socketContext";
import { IAnnouncement } from "@/lib/models/announcement"; 
import { AlertTriangle, Clock } from "lucide-react"; // Import Clock for styling

const PRIMARY_COLOR = "green-600";

export default function AnnouncementPanel() {
  const socket = useSocket();
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);

  // Fetch initial announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const res = await fetch("/api/announcements");
      const data: { announcements: IAnnouncement[] } = await res.json();
      // Sort announcements newest first on initial fetch
      if (res.ok) setAnnouncements(data.announcements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    };
    fetchAnnouncements();
  }, []);

  // Listen for live updates
  useEffect(() => {
    if (!socket) return;

    const handler = (announcement: IAnnouncement) => {
      // Prepend the new announcement to the list
      setAnnouncements((prev) => [announcement, ...prev]);
    };

    socket.on("announcement-created", handler); 
    return () => {
      socket.off("announcement-created", handler);
    };
  }, [socket]);

  const formatDateTime = (dateString: Date) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    return date.toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

  // NOTE: The title/header moved to the parent page (announcements/page.tsx)

  return (
    <>
      {announcements.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
            <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-3"/>
            <p className="text-gray-500 italic font-medium">No recent announcements to display.</p>
            <p className="text-sm text-gray-400 mt-1">Check back later for updates.</p>
        </div>
      ) : (
        <div className="space-y-4">
            {announcements.map((a) => (
            <div 
                key={a._id.toString()} 
                className="p-5 border border-gray-100 rounded-xl bg-white hover:bg-green-50/30 transition duration-150 shadow-sm"
            >
                <h3 className={`text-lg font-bold text-gray-900 mb-1`}>{a.title}</h3>
                <p className="text-gray-600 mb-3 text-base">{a.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3 mt-2 border-gray-100">
                  <span className="font-medium text-green-700">By: {a.createdBy}</span> 
                  <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3"/>
                      {formatDateTime(a.createdAt)}
                  </span>
                </div>
            </div>
            ))}
        </div>
      )}
    </>
  );
}