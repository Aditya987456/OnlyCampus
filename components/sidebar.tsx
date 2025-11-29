"use client";
import React from "react";

type SidebarProps = {
  active: "announcements" | "classes";
  setActive: (tab: "announcements" | "classes") => void;
};

export default function Sidebar({ active, setActive }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <button
        className={`mb-2 p-2 rounded-lg w-full text-left ${
          active === "announcements" ? "bg-green-600 text-white" : "hover:bg-green-100"
        }`}
        onClick={() => setActive("announcements")}
      >
        Announcements
      </button>
      <button
        className={`mb-2 p-2 rounded-lg w-full text-left ${
          active === "classes" ? "bg-green-600 text-white" : "hover:bg-green-100"
        }`}
        onClick={() => setActive("classes")}
      >
        Classes / Chat
      </button>
    </div>
  );
}
