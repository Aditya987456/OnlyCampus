// app/dashboard/faculty-dashboard/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import AnnouncementPanel from "@/components/announcement"; // Kept for viewing recent announcements
// Removed imports: FacultyAnnouncementForm, FacultyMeetingForm
import { User, CalendarPlus, Bell, FileText, MessageSquare, ListPlus } from "lucide-react"; // Added ListPlus

const PRIMARY_COLOR = "green-600";
const NEUTRAL_COLOR = "gray-800";

const faculty = {
  name: "Dr. Smith",
  email: "smith@faculty.iert.ac.in",
  id: "faculty123",
};

// --- Custom Dashboard Card Component (reused) ---
const DashboardCard = ({ children, title, Icon, color = PRIMARY_COLOR, linkHref }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col">
        <div className={`flex items-center justify-between gap-3 mb-4 border-b pb-3 border-gray-100`}>
            <div className="flex items-center gap-3">
                <Icon className={`w-6 h-6 text-${color}`} />
                <h2 className={`text-xl font-bold text-${NEUTRAL_COLOR}`}>{title}</h2>
            </div>
            {linkHref && (
                <Link href={linkHref} className={`text-sm font-medium text-${PRIMARY_COLOR} hover:text-green-700 transition`}>
                    Go
                </Link>
            )}
        </div>
        <div className="flex-1">{children}</div>
    </div>
);


export default function FacultyDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      
      {/* --- Column 1: Profile & Quick Actions --- */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* 1. Faculty Profile Card */}
        <DashboardCard title="Faculty Profile" Icon={User} color="teal-600">
            <div className="space-y-2 mb-4">
                <p className="text-gray-700"><span className="font-semibold">Name:</span> {faculty.name}</p>
                <p className="text-gray-700"><span className="font-semibold">Email:</span> {faculty.email}</p>
            </div>
            <Link href="/dashboard/profile" className={`block w-full text-center py-2 text-white font-medium rounded-lg bg-teal-600 hover:bg-teal-700 transition`}>
                View Profile
            </Link>
        </DashboardCard>

        {/* 2. Quick Links Card */}
        <DashboardCard title="Quick Actions" Icon={FileText} color="orange-500">
          <div className="space-y-3">
              <Link href="/dashboard/create-assignment" className="flex items-center justify-between p-3 bg-orange-50/50 rounded hover:bg-orange-100 transition">
                  <span className="font-medium text-orange-800">Create Assignment</span>
                  <FileText className="w-5 h-5 text-orange-500" />
              </Link>
              <Link href="/dashboard/chat" className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
                  <span className="font-medium text-gray-700">Open Chat Portal</span>
                  <MessageSquare className="w-5 h-5 text-gray-500" />
              </Link>
          </div>
        </DashboardCard>
      </div>

      {/* --- Columns 2 & 3: Forms and Announcements --- */}
      <div className="lg:col-span-2 xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 3. Schedule Meeting Form (NOW QUICK LINK) */}
        <div className="md:col-span-1">
            <DashboardCard title="Schedule Live Class" Icon={CalendarPlus} color="green-600" linkHref="/dashboard/meetings">
                <div className="text-center py-5 bg-green-50/50 rounded-lg border border-green-100">
                    <CalendarPlus className="w-8 h-8 text-green-500 mx-auto mb-2"/>
                    <p className="text-gray-700 font-medium">Click here to access the full meeting management portal.</p>
                </div>
            </DashboardCard>
        </div>

        {/* 4. Post Announcement Form (NOW QUICK LINK) */}
        <div className="md:col-span-1">
            <DashboardCard title="Post Announcement" Icon={Bell} color="blue-500" linkHref="/dashboard/announcements">
                <div className="text-center py-5 bg-blue-50/50 rounded-lg border border-blue-100">
                    <ListPlus className="w-8 h-8 text-blue-500 mx-auto mb-2"/>
                    <p className="text-gray-700 font-medium">Publish new messages and manage announcements.</p>
                </div>
            </DashboardCard>
        </div>

        {/* 5. Announcements Panel (Full width, kept for quick view) */}
        <div className="md:col-span-2">
            <DashboardCard title="Recent Announcements" Icon={Bell} color="gray-500" linkHref="/dashboard/announcements">
                <AnnouncementPanel />
            </DashboardCard>
        </div>
        
      </div>
    </div>
  );
}