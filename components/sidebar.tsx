
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  MessageSquare,
  Megaphone,
  Video,
  GraduationCap,
  ChevronRight,
  LogOut,
  X,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/context/socketContext";

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
  /** Called after navigating (closes mobile drawer) */
  onNavigate?: () => void;
};

type SidebarUser = {
  name?: string;
  role?: string;
};

type SidebarGroup = {
  _id: string;
  name: string;
  type: string;
};

export default function Sidebar({
  mobileOpen = false,
  onClose,
  onNavigate,
}: SidebarProps) {
  const socket = useSocket();
  const [user, setUser] = useState<SidebarUser | null>(null);
  const [groups, setGroups] = useState<SidebarGroup[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchGroups(); // no userId needed
    }
  }, []);

  //  sends token in header instead of userId in URL
  const fetchGroups = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/groups", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (Array.isArray(data)) setGroups(data as SidebarGroup[]);
  };


  //------------handling logout--------------- need to add warning as well++++++++++++++++++++
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* still clear client */
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    socket?.disconnect();
    router.push("/login");
  };

  const studentGroup = groups.find((g) => g.type === "student");
  const facultyGroup = groups.find((g) => g.type === "faculty");
  const announcementGroup = groups.find((g) => g.type === "announcement");
  const mainChatGroup = studentGroup || facultyGroup;

  const navItem = (href: string, Icon: LucideIcon, label: string) => (
    <Link
      href={href}
      onClick={() => onNavigate?.()}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-150 font-medium text-sm"
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 group-hover:bg-green-100 transition-colors">
        <Icon size={16} className="text-gray-500 group-hover:text-green-600" />
      </span>
      <span className="flex-1">{label}</span>
      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-green-500 transition-opacity" />
    </Link>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "z-50 flex h-[100dvh] w-[min(100vw-2.5rem,18rem)] sm:w-64 flex-col border-r border-gray-200 bg-white shadow-lg transition-transform duration-200 ease-out lg:static lg:translate-x-0 lg:shadow-sm",
          "fixed inset-y-0 left-0 lg:relative",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between gap-2 border-b border-green-700/30 bg-green-600 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold leading-tight text-white">OnlyCampus</h2>
              <p className="text-xs text-green-200">IERT Portal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/90 hover:bg-white/15 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Channels
        </p>

        {/* Class Chat */}
        {mainChatGroup && navItem(
          `/dashboard/chat/${mainChatGroup._id}`,
          MessageSquare,
          mainChatGroup.name
        )}

        {/* Announcements */}
        {announcementGroup && navItem(
          `/dashboard/announcements`,
          Megaphone,
          "Announcements"
        )}

        {/* Meetings */}
        {mainChatGroup && navItem(
          `/dashboard/meetings/${mainChatGroup._id}`,
          Video,
          "Meetings"
        )}

        {user?.role === "admin" && navItem(
          "/dashboard/admin/users",
          UserPlus,
          "Manage Users"
        )}
      </div>

      {/* User Footer */}
      <div className="border-t border-gray-100 bg-gray-50 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
              <p className="text-xs text-green-600 capitalize font-medium">{user.role}</p>
            </div>
            {/* --Logout */}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-gray-200" />
            <div className="space-y-1">
              <div className="w-24 h-3 bg-gray-200 rounded" />
              <div className="w-16 h-2 bg-gray-200 rounded" />
            </div>
          </div>
        )}
      </div>

      </aside>
    </>
  );
}
