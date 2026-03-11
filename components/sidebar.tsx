// "use client";
// import React from "react";

// type SidebarProps = {
//   active: "announcements" | "classes";
//   setActive: (tab: "announcements" | "classes") => void;
// };

// export default function Sidebar({ active, setActive }: SidebarProps) {
//   return (
//     <div className="w-64 bg-white border-r border-gray-200 h-full p-4 flex flex-col">
//       <h2 className="text-xl font-bold mb-6">Dashboard</h2>
//       <button
//         className={`mb-2 p-2 rounded-lg w-full text-left ${
//           active === "announcements" ? "bg-green-600 text-white" : "hover:bg-green-100"
//         }`}
//         onClick={() => setActive("announcements")}
//       >
//         Announcements
//       </button>
//       <button
//         className={`mb-2 p-2 rounded-lg w-full text-left ${
//           active === "classes" ? "bg-green-600 text-white" : "hover:bg-green-100"
//         }`}
//         onClick={() => setActive("classes")}
//       >
//         Classes / Chat
//       </button>
//     </div>
//   );
// }














// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function Sidebar() {
//   const [user, setUser] = useState<any>(null);
//   const [groups, setGroups] = useState<any[]>([]);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");

//     if (storedUser && storedUser !== "undefined") {
//       const parsedUser = JSON.parse(storedUser);
//       setUser(parsedUser);

//       fetchGroups(parsedUser.id);
//     }
//   }, []);

//   const fetchGroups = async (userId: string) => {
//     const res = await fetch(`/api/groups?userId=${userId}`);
//     const data = await res.json();

//     if (Array.isArray(data)) {
//       setGroups(data);
//     }
//   };

//   // 🔍 Separate groups by type
//   const studentGroup = groups.find(g => g.type === "student");
//   const facultyGroup = groups.find(g => g.type === "faculty");
//   const announcementGroup = groups.find(g => g.type === "announcement");

//   const mainChatGroup = studentGroup || facultyGroup;

//   return (
//     <aside className="w-64 h-screen bg-white border-r flex flex-col justify-between">

//       <div>
//         <div className="p-4 border-b">
//           <h2 className="text-xl font-bold text-blue-600">
//             OnlyCampus
//           </h2>
//         </div>

//         <nav className="mt-4 space-y-2 px-4">

//           {/* Main Chat */}
//           {mainChatGroup && (
//             <Link
//               href={`/dashboard/chat/${mainChatGroup._id}`}
//               className="block px-4 py-2 rounded-md hover:bg-gray-200"
//             >
//               💬 {mainChatGroup.name}
//             </Link>
//           )}

//           {/* Announcement */}
//           {announcementGroup && (
//             <Link
//               href={`/dashboard/chat/${announcementGroup._id}`}
//               className="block px-4 py-2 rounded-md hover:bg-gray-200"
//             >
//               📢 Announcement
//             </Link>
//           )}

//           {/* Meeting */}
//           <Link
//             href="/dashboard/videomeeting"
//             className="block px-4 py-2 rounded-md hover:bg-gray-200"
//           >
//             🎥 Meeting
//           </Link>

//         </nav>
//       </div>

//       <div className="p-4 border-t">
//         {user && (
//           <>
//             <p className="font-semibold">{user.name}</p>
//             <p className="text-sm text-gray-500 capitalize">
//               {user.role}
//             </p>
//           </>
//         )}
//       </div>

//     </aside>
//   );
// }











"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageSquare, Megaphone, Video, GraduationCap, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const [user, setUser] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchGroups(parsedUser.id);
    }
  }, []);

  const fetchGroups = async (userId: string) => {
    const res = await fetch(`/api/groups?userId=${userId}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      setGroups(data);
    }
  };

  const studentGroup = groups.find((g) => g.type === "student");
  const facultyGroup = groups.find((g) => g.type === "faculty");
  const announcementGroup = groups.find((g) => g.type === "announcement");
  const mainChatGroup = studentGroup || facultyGroup;

  const navItem = (href: string, Icon: any, label: string) => (
    <Link
      href={href}
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
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-green-600">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">OnlyCampus</h2>
            <p className="text-green-200 text-xs">IERT Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Channels
        </p>

        {mainChatGroup && navItem(`/dashboard/chat/${mainChatGroup._id}`, MessageSquare, mainChatGroup.name)}
        {announcementGroup && navItem(`/dashboard/chat/${announcementGroup._id}`, Megaphone, "Announcements")}


        {mainChatGroup &&
  navItem(
    `/dashboard/meetings/${mainChatGroup._id}`,
    Video,
    "Meetings"
  )}


      </div>

      {/* User Footer */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
              <p className="text-xs text-green-600 capitalize font-medium">{user.role}</p>
            </div>
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
  );
}