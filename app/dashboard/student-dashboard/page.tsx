// app/dashboard/student-dashboard/page.tsx
"use client";
import React from "react";
import Link from "next/link";
// Removed imports: AnnouncementPanel, StudentMeetingPanel
import { User, Bell, Calendar, MessageSquare, FileText, Clock } from "lucide-react"; // Added Clock for clarity

const PRIMARY_COLOR = "green-600";
const NEUTRAL_COLOR = "gray-800";

const student = {
  name: "John Doe",
  email: "john.doe@student.iert.ac.in",
};

// --- Custom Dashboard Card Component (Clean Style) ---
const DashboardCard = ({ children, title, Icon, color = PRIMARY_COLOR, linkHref }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col">
        <div className={`flex items-center justify-between gap-3 mb-4 border-b pb-3 border-gray-100`}>
            <div className="flex items-center gap-3">
                <Icon className={`w-6 h-6 text-${color}`} />
                <h2 className={`text-xl font-bold text-${NEUTRAL_COLOR}`}>{title}</h2>
            </div>
            {linkHref && (
                <Link href={linkHref} className={`text-sm font-medium text-${PRIMARY_COLOR} hover:text-green-700 transition`}>
                    View All
                </Link>
            )}
        </div>
        <div className="flex-1">{children}</div>
    </div>
);


export default function StudentDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      
      {/* 1. Profile Quick View Card (lg:col-span-1) */}
      <DashboardCard title="Quick Profile" Icon={User} color="purple-500">
        <div className="space-y-2 mb-4">
            <p className="text-gray-700"><span className="font-semibold">Name:</span> {student.name}</p>
            <p className="text-gray-700"><span className="font-semibold">Email:</span> {student.email}</p>
        </div>
        <Link href="/dashboard/profile" className={`block w-full text-center py-2 text-white font-medium rounded-lg bg-purple-500 hover:bg-purple-600 transition`}>
            View Profile
        </Link>
      </DashboardCard>
      
      {/* 2. Messages/Chat Quick Access (lg:col-span-1) */}
      <DashboardCard title="Recent Chats" Icon={MessageSquare} color="orange-500" linkHref="/dashboard/chat">
        <div className="space-y-3">
            <p className="text-gray-700 border-b pb-2">Dr. Smith: "Please check Assignment 5 notes."</p>
            <p className="text-gray-500">No new messages.</p>
        </div>
      </DashboardCard>

      {/* 3. Assignments Due (lg:col-span-1) */}
      <DashboardCard title="Assignments Due" Icon={FileText} color="red-500" linkHref="/dashboard/assignments">
        <div className="space-y-3">
            <div className="p-2 bg-red-50/50 border-l-4 border-red-400 rounded">
                <p className="text-sm font-medium text-red-800">Calculus II: Problem Set 5</p>
                <span className="inline-block mt-1 text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">DUE: Oct 28</span>
            </div>
            <p className="text-sm text-gray-700">History of Art: Essay Draft (Due Nov 05)</p>
        </div>
      </DashboardCard>


      {/* 4. Upcoming Meetings/Classes (Spans 2 columns) - NOW JUST A LINK */}
      <div className="lg:col-span-2 xl:col-span-4"> 
        <DashboardCard title="Upcoming Meetings & Live Classes" Icon={Calendar} color="blue-600" linkHref="/dashboard/meetings">
            <div className="text-center py-5 bg-blue-50/50 rounded-lg border border-blue-100">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2"/>
                <p className="text-gray-700 font-medium">View the full schedule of upcoming classes and meetings.</p>
                <Link href="/dashboard/meetings" className={`inline-flex items-center gap-1 mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 transition`}>
                    <Clock className="w-4 h-4"/> Go to Meeting Schedule
                </Link>
            </div>
        </DashboardCard>
      </div>

      {/* 5. Announcements Panel (Full width) - NOW JUST A LINK */}
      <div className="lg:col-span-3 xl:col-span-4"> 
        <DashboardCard title="Latest Announcements" Icon={Bell} color="teal-600" linkHref="/dashboard/announcements">
            <div className="text-center py-5 bg-teal-50/50 rounded-lg border border-teal-100">
                <Bell className="w-8 h-8 text-teal-500 mx-auto mb-2 animate-pulse"/>
                <p className="text-gray-700 font-medium">All real-time campus announcements are now located on their dedicated page.</p>
                <Link href="/dashboard/announcements" className={`inline-block mt-3 text-sm font-semibold text-teal-600 hover:text-teal-700 transition`}>
                    View All Announcements
                </Link>
            </div>
        </DashboardCard>
      </div>
      
    </div>
  );
}