// app/dashboard/layout.tsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Users, MessageSquare, Briefcase, User, Calendar, Bell, FileText, Search, GraduationCap
} from "lucide-react";

// --- UI CONSTANTS ---
const PRIMARY_COLOR = "green-600";
const NEUTRAL_COLOR = "gray-600";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// --- Navigation Links Data ---
const STUDENT_LINKS = [
  { href: "/dashboard/student-dashboard", label: "Dashboard", Icon: Home },
  { href: "/dashboard/meetings", label: "Meetings", Icon: Calendar }, // Dedicated meeting page
  { href: "/dashboard/announcements", label: "Announcements", Icon: Bell }, // Dedicated announcements page
  { href: "/dashboard/chat", label: "Chat", Icon: MessageSquare }, // Dedicated chat page
];

const FACULTY_LINKS = [
  { href: "/dashboard/faculty-dashboard", label: "Dashboard", Icon: Home },
  { href: "/dashboard/meetings", label: "Meetings", Icon: Calendar },
  { href: "/dashboard/create-assignment", label: "Assignments", Icon: FileText },
  { href: "/dashboard/chat", label: "Chat", Icon: MessageSquare },
];

const GENERAL_LINKS = [
  { href: "/dashboard/profile", label: "Profile", Icon: User },
  { href: "/dashboard/settings", label: "Settings", Icon: Briefcase }, // Replaced generic settings icon
];

// Custom NavLink component with corrected active state logic
const NavLink = ({ href, label, Icon }: any) => {
  const pathname = usePathname();
  
  // Logic to determine if a link is the main dashboard link
  const isDashboardLink = href.endsWith('dashboard');

  // If it's a dashboard link, it's active if the current pathname starts with it.
  // This keeps the dashboard highlighted when navigating to its sub-pages.
  // If it's a specific page (like /meetings or /chat), it's active only on exact match.
  const isActive = isDashboardLink 
    ? pathname.startsWith(href)
    : pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-150 font-medium 
        ${isActive
          ? `bg-${PRIMARY_COLOR} text-white shadow-md`
          : `text-${NEUTRAL_COLOR} hover:bg-green-50 hover:text-${PRIMARY_COLOR}`
        }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
};

const Header = () => (
  <header className="flex items-center justify-between h-20 px-8 bg-white border-b border-gray-100 shadow-sm">
    <div className={`text-3xl font-extrabold text-${PRIMARY_COLOR} flex items-center gap-2`}>
      <GraduationCap className="w-8 h-8" />
      <span>OnlyCampus</span>
    </div>
    
    <div className="flex items-center w-full max-w-lg mx-8">
      <div className="relative w-full">
        <Search className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400`} />
        <input
          type="search"
          placeholder="Search..."
          className="w-full py-3 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-green-400 transition"
        />
      </div>
    </div>

    <div className="flex items-center gap-3">
        {/* Simple Avatar Placeholder */}
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold cursor-pointer shadow-md">
            A
        </div>
    </div>
  </header>
);

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    
    // Determine user role based on path segment
    const isStudent = pathname.includes("student-dashboard") || !pathname.includes("faculty-dashboard");
    const navLinks = isStudent ? STUDENT_LINKS : FACULTY_LINKS;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 p-5 flex flex-col shadow-lg">
        <nav className="flex flex-col gap-5 pt-8">
          
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
                <NavLink key={link.href} {...link} />
            ))}
          </div>

          <div className="border-t border-gray-100 pt-5 mt-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2 pl-3">Account</h3>
            {GENERAL_LINKS.map((link) => (
                <NavLink key={link.href} {...link} />
            ))}
          </div>
          
          <div className="border-t border-gray-100 pt-5 mt-5">
             <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2 pl-3">User View</h3>
             <NavLink 
                href={isStudent ? "/dashboard/faculty-dashboard" : "/dashboard/student-dashboard"} 
                Icon={Users}
                label={isStudent ? "Switch to Faculty" : "Switch to Student"}
             />
          </div>

        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
}