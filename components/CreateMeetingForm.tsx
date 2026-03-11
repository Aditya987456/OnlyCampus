







"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

interface CreateMeetingFormProps {
  onCreated?: (meeting: any) => void;
}

export default function CreateMeetingForm({
  onCreated,
}: CreateMeetingFormProps) {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");



  useEffect(() => {
    fetch("/api/groups/list")
      .then((res) => res.json())
      .then((data) => setGroups(data));
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) return alert("Title required");
    if (!selectedGroupName) return alert("Select group");

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      return;
    }

const res = await fetch("/api/meetings", {
  method: "POST",
  cache: "no-store", //  important
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title,
    groupName: selectedGroupName,
    scheduledAt
  }),
});

    const meeting = await res.json();

    if (!res.ok) {
      alert(meeting.message);
      return;
    }

    socket.emit("meeting-created", meeting);

    if (onCreated) {
      onCreated(meeting);
    }

    setTitle("");
    setSelectedGroupName("");
  };

  return (
    <div className="mb-6 text-black">
      <h3 className="font-semibold mb-2 ">Create Meeting</h3>

      <input
        type="text"
        placeholder="Meeting Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mr-2"
      />

      <select
        value={selectedGroupName}
        onChange={(e) => setSelectedGroupName(e.target.value)}
        className="border p-2 mr-2"
      >
        <option value="">Select Group</option>
        {groups.map((group) => (
          <option key={group._id} value={group.name}>
            {group.name}
          </option>
        ))}
      </select>

      <input
  type="datetime-local"
  value={scheduledAt}
  onChange={(e) => setScheduledAt(e.target.value)}
  className="border p-2 mr-2"
/>

      <button
      type="button"
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </div>
  );
}