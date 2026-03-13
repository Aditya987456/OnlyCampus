

"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import io from "socket.io-client";

export default function FacultyAnnouncementForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("everyone");

  //  Fetch student groups for dropdown
  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/groups/list", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setGroups(data);
    };
    fetchGroups();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return toast.error("All fields required");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const isEveryone = selectedGroupId === "everyone";

      // #1 — save to MongoDB with token + groupId  ----> post request...
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          groupId: isEveryone ? groups[0]?._id : selectedGroupId, // fallback for targetAll
          targetAll: isEveryone
        })
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Failed");

      // #2 — ring the bell via socket means tell socket that there is a new announcement here for all/ specific group.
      const socket = io("http://localhost:4000");
      socket.emit("new-announcement", {
        groupId: isEveryone ? "everyone" : selectedGroupId,
        announcement: data.announcement
      });

      toast.success("Announcement published!");
      setTitle("");
      setDescription("");
    } catch {
      toast.error("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-xl font-bold text-green-600 mb-5 border-b pb-3 border-gray-200 flex items-center gap-2">
        <Send className="w-5 h-5" /> Publish Announcement
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/*  Group Dropdown */}
        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-100"
        >
          <option value="everyone">📢 Everyone</option>
          {groups.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Announcement Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-100"
          required
        />

        <textarea
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-100"
          rows={5}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-white font-semibold rounded-lg bg-green-600 hover:bg-green-700 shadow transition disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish Announcement"}
        </button>

      </form>
    </div>
  );
}