// app/dashboard/announcements/page.tsx
"use client";
import React from "react";
import { Bell } from "lucide-react";

// Assuming you have a way to determine the user type (e.g., from an auth context)
// For this example, we'll hardcode a faculty user for demonstration.
const user = {
    role: 'faculty', // Can be 'student' or 'faculty'
    name: 'Dr. Smith',
    id: 'faculty123',
};

// --- Dynamic Imports for Components ---
// We import the AnnouncementPanel (list) and the AnnouncementForm 
import AnnouncementPanel from "@/components/announcement";
import FacultyAnnouncementForm from "@/components/announcementForm";

const PRIMARY_COLOR = "green-600";
const NEUTRAL_COLOR = "gray-800";

export default function AnnouncementsPage() {
    const isFaculty = user.role === 'faculty';

    return (
        <div className="min-h-[80vh]">
            <header className="mb-8 pb-4 border-b border-gray-200">
                <div className={`flex items-center gap-3`}>
                    <Bell className={`w-8 h-8 text-${PRIMARY_COLOR}`} />
                    <h1 className={`text-3xl font-bold text-${NEUTRAL_COLOR}`}>Campus Announcements</h1>
                </div>
                <p className="text-gray-500 mt-1">
                    {isFaculty 
                        ? "Post new messages and view the real-time feed."
                        : "View the latest campus notifications in real-time."
                    }
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Announcement Creation Form (Faculty Only) */}
                {isFaculty && (
                    <div className="lg:col-span-1">
                        <FacultyAnnouncementForm
                            facultyName={user.name}
                            facultyId={user.id}
                        />
                    </div>
                )}
                
                {/* 2. Announcement Feed (Full Width for Students, Spans 2 cols for Faculty) */}
                <div className={`${isFaculty ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                        <AnnouncementPanel />
                    </div>
                </div>

            </div>
        </div>
    );
}