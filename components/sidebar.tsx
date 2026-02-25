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




"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  // 🔍 Separate groups by type
  const studentGroup = groups.find(g => g.type === "student");
  const facultyGroup = groups.find(g => g.type === "faculty");
  const announcementGroup = groups.find(g => g.type === "announcement");

  const mainChatGroup = studentGroup || facultyGroup;

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col justify-between">

      <div>
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">
            OnlyCampus
          </h2>
        </div>

        <nav className="mt-4 space-y-2 px-4">

          {/* Main Chat */}
          {mainChatGroup && (
            <Link
              href={`/dashboard/chat/${mainChatGroup._id}`}
              className="block px-4 py-2 rounded-md hover:bg-gray-200"
            >
              💬 {mainChatGroup.name}
            </Link>
          )}

          {/* Announcement */}
          {announcementGroup && (
            <Link
              href={`/dashboard/chat/${announcementGroup._id}`}
              className="block px-4 py-2 rounded-md hover:bg-gray-200"
            >
              📢 Announcement
            </Link>
          )}

          {/* Meeting */}
          <Link
            href="/dashboard/videomeeting"
            className="block px-4 py-2 rounded-md hover:bg-gray-200"
          >
            🎥 Meeting
          </Link>

        </nav>
      </div>

      <div className="p-4 border-t">
        {user && (
          <>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500 capitalize">
              {user.role}
            </p>
          </>
        )}
      </div>

    </aside>
  );
}