

"use client";
import React, { useEffect, useState } from "react";
import { Bell, Send } from "lucide-react";
import { toast } from "sonner";
import { useSocket } from "@/context/socketContext";

interface Announcement {
  _id: string;
  title: string;
  description: string;
  createdBy: { name: string } | string;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [user, setUser] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("everyone");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Get socket from context — no new socket created
  const socket = useSocket();

  // Load user-- localstorage.
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Fetch data when user loads
  useEffect(() => {
    if (!user) return;
    fetchAnnouncements();
    if (user.role === "faculty") fetchGroups();
  }, [user]);

  //  Listen for realtime announcements using context socket
  useEffect(() => {
    if (!socket) return;

    socket.on("announcement-received", (data) => {
      console.log("📢 Announcement received!", data);
      setAnnouncements((prev) => [data.announcement, ...prev]);
    });

    return () => {
      socket.off("announcement-received");
    };
  }, [socket]);

  const fetchAnnouncements = async () => {
    const token = localStorage.getItem("token");
    const groupId = user?.announcementGroupId || user?.groupId;
    if (!groupId) return;

    const res = await fetch(`/api/announcements?groupId=${groupId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setAnnouncements(data.announcements);
  };

  const fetchGroups = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/groups/list", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (Array.isArray(data)) setGroups(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return toast.error("All fields required");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const isEveryone = selectedGroupId === "everyone";
      const targetGroupId = isEveryone
        ? user?.announcementGroupId
        : selectedGroupId;

      // Step 1 — save to MongoDB
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          groupId: targetGroupId,
          targetAll: isEveryone
        })
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to post");
        setLoading(false);
        return;
      }

      // ✅ Step 2 — emit using context socket
      socket?.emit("new-announcement", {
        groupId: targetGroupId,
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

  const getCreatorName = (createdBy: any) => {
    if (typeof createdBy === "object") return createdBy?.name;
    return createdBy;
  };

  const isFaculty = user?.role === "faculty";

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Bell className="w-7 h-7 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          {isFaculty
            ? "Post announcements to your students."
            : "Stay updated with the latest notices."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {isFaculty && (
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
              <h2 className="text-lg font-bold text-green-600 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" /> New Announcement
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
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
                  placeholder="Title"
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
                  className="w-full py-3 text-white font-semibold rounded-lg bg-green-600 hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? "Publishing..." : "Publish"}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className={isFaculty ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <h2 className="text-lg font-semibold text-green-600 mb-4">Feed</h2>
            {announcements.length === 0 ? (
              <p className="text-gray-500">No announcements yet.</p>
            ) : (
              <div className="space-y-4">
                {announcements.map((a) => (
                  <div key={a._id} className="p-4 border rounded-xl bg-green-50 border-green-100">
                    <h3 className="font-bold text-green-700">{a.title}</h3>
                    <p className="text-gray-700 mt-1 text-sm">{a.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      By {getCreatorName(a.createdBy)} · {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
