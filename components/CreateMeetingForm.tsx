
// "use client";

// import { useEffect, useState } from "react";
// import { socket } from "@/lib/socket";

// interface CreateMeetingFormProps {
//   onCreated?: (meeting: any) => void;
// }

// export default function CreateMeetingForm({
//   onCreated,
// }: CreateMeetingFormProps) {
//   const [groups, setGroups] = useState<any[]>([]);
//   const [selectedGroupName, setSelectedGroupName] = useState("");
//   const [title, setTitle] = useState("");
//   const [scheduledAt, setScheduledAt] = useState("");


// // fetch the list of group for whom i want to create the meeeting..
//   useEffect(() => {
//     fetch("/api/groups/list")
//       .then((res) => res.json())
//       .then((data) => setGroups(data));
//   }, []);






// const handleCreate = async () => {
//   if (!title.trim()) return alert("Title required");
//   if (!selectedGroupName) return alert("Select group");
//   if (!scheduledAt) return alert("Scheduled time required");  // add this guard BEFORE conversion

//   const token = localStorage.getItem("token");
//   if (!token) return alert("Please login again");

//   const scheduledAtISO = new Date(scheduledAt).toISOString();  // now safe

//   const res = await fetch("/api/meetings", {
//     method: "POST",
//     cache: "no-store",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       title,
//       groupName: selectedGroupName,
//       scheduledAt: scheduledAtISO,
//     }),
//   });

//   const meeting = await res.json();

//   if (!res.ok) {
//     alert(meeting.message);
//     return;
//   }

//   socket.emit("meeting-created", meeting);

//   if (onCreated) onCreated(meeting);

//   setTitle("");
//   setSelectedGroupName("");
//   setScheduledAt("");  // also reset this field
// };

//   return (
//     <div className="mb-6 text-black">
//       <h3 className="font-semibold mb-2 ">Create Meeting</h3>

//       <input
//         type="text"
//         placeholder="Meeting Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="border p-2 mr-2"
//       />

//       <select
//         value={selectedGroupName}
//         onChange={(e) => setSelectedGroupName(e.target.value)}
//         className="border p-2 mr-2"
//       >
//         <option value="">Select Group</option>
//         {groups.map((group) => (
//           <option key={group._id} value={group.name}>
//             {group.name}
//           </option>
//         ))}
//       </select>

//       <input
//   type="datetime-local"
//   value={scheduledAt}
//   onChange={(e) => setScheduledAt(e.target.value)}
//   className="border p-2 mr-2"
// />

//       <button
//       type="button"
//         onClick={handleCreate}
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Create
//       </button>
//     </div>
//   );
// }
























"use client";

import { useEffect, useState } from "react";
import { ensureSocketConnected, socket } from "@/lib/socket";

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
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/groups/list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => (Array.isArray(data) ? setGroups(data) : setGroups([])));
  }, []);






const handleCreate = async () => {
  if (!title.trim()) return alert("Title required");
  if (!selectedGroupName) return alert("Select group");
  if (!scheduledAt) return alert("Scheduled time required");  // add this guard BEFORE conversion

  const token = localStorage.getItem("token");
  if (!token) return alert("Please login again");

  const scheduledAtISO = new Date(scheduledAt).toISOString();  // now safe

  const res = await fetch("/api/meetings", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      groupName: selectedGroupName,
      scheduledAt: scheduledAtISO,
    }),
  });

  const meeting = await res.json();

  if (!res.ok) {
    alert(meeting.message);
    return;
  }

  const gid =
    meeting.groupId != null && typeof meeting.groupId === "object"
      ? String((meeting.groupId as { _id?: string })._id ?? "")
      : String(meeting.groupId ?? "");
  ensureSocketConnected();
  socket.emit("meeting-created", { groupId: gid, meeting });

  if (onCreated) onCreated(meeting);

  setTitle("");
  setSelectedGroupName("");
  setScheduledAt("");  // also reset this field
};

  return (
    <div className="mb-2 text-black">
      <h3 className="mb-3 font-semibold">Create Meeting</h3>

      <div className="flex max-w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
        <input
          type="text"
          placeholder="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="min-w-0 flex-1 rounded border border-gray-200 p-2.5 text-sm sm:min-w-[12rem]"
        />

        <select
          value={selectedGroupName}
          onChange={(e) => setSelectedGroupName(e.target.value)}
          className="w-full min-w-0 rounded border border-gray-200 p-2.5 text-sm sm:w-auto sm:min-w-[10rem]"
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
          className="w-full min-w-0 rounded border border-gray-200 p-2.5 text-sm sm:w-auto sm:flex-1 sm:min-w-[12rem]"
        />

        <button
          type="button"
          onClick={handleCreate}
          className="w-full rounded bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 sm:w-auto"
        >
          Create
        </button>
      </div>
    </div>
  );
}