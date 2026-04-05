// "use client";
// import React, { useEffect, useState } from "react";
// import { useSocket } from "@/context/socketContext";

// const PRIMARY = "green-600";

// interface Announcement {
//   _id: string;
//   title: string;
//   description: string;
//   createdBy: string;
//   createdAt: string;
// }

// export default function AnnouncementPanel() {
//   const socket = useSocket(); 

//   const [announcements, setAnnouncements] = useState<Announcement[]>([]);




//   // Fetch initial announcements
// useEffect(() => {
//   const fetchAnnouncements = async () => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     const groupId = user?.groupId;

//     if (!groupId) return; // can't fetch without a group

//     const res = await fetch(`/api/announcements?groupId=${groupId}`);
//     const data = await res.json();
//     console.log("announcement from GET ----------> ", data);
//     if (res.ok) setAnnouncements(data.announcements);
//   };
//   fetchAnnouncements();
// }, []);

// // Listen for live announcements — fix event name ✅
// useEffect(() => {
//   if (!socket) return;

//   const handler = (payload: { groupId: string; announcement: Announcement }) => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     // Accept if it's for everyone OR matches this student's group
//     if (payload.groupId === "everyone" || payload.groupId === user?.groupId) {
//       setAnnouncements((prev) => [payload.announcement, ...prev]);
//     }
//   };

//   socket.on("new-announcement", handler); // was "announcement-updated" ❌

//   return () => {
//     socket.off("new-announcement", handler);
//   };
// }, [socket]);





//   // // Fetch initial announcements
//   // useEffect(() => {
//   //   const fetchAnnouncements = async () => {
//   //   const res = await fetch("/api/announcements");
      
//   //     const data = await res.json();
//   //     console.log("announcement from GET ----------> ", data)
//   //     if (res.ok) setAnnouncements(data.announcements);
//   //   };
//   //   fetchAnnouncements();
//   // }, []);

  



//   // // Listen for live announcements
//   // useEffect(() => {
//   //   if (!socket) return;

//   //   const handler = (announcement: Announcement) => {
//   //     setAnnouncements((prev) => [announcement, ...prev]);
//   //   };

//   //   socket.on("announcement-updated", handler);

//   //   return () => {
//   //     socket.off("announcement-updated", handler);
//   //   };
//   // }, [socket]);















//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100">
//       <h2 className={`text-xl font-semibold text-${PRIMARY} mb-4`}>Announcements</h2>

//       {announcements.length === 0 ? (
//         <p className="text-gray-500">No announcements yet.</p>
//       ) : (
//         announcements.map((a) => (
//           <div key={a._id} className="mb-4 p-4 border rounded-lg bg-green-50">
//             <h3 className={`text-lg font-bold text-${PRIMARY}`}>{a.title}</h3>
//             <p className="text-gray-700">{a.description}</p>
//             <p className="text-sm text-gray-500 mt-1">
//               By: {a.createdBy} | {new Date(a.createdAt).toLocaleString()}
//             </p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }














"use client";
import React, { useEffect, useState } from "react";
import { useSocket } from "@/context/socketContext";

const PRIMARY = "green-600";

interface Announcement {
  _id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

export default function AnnouncementPanel() {
  const socket = useSocket(); 

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);




  // Fetch initial announcements
useEffect(() => {
  const fetchAnnouncements = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const groupId = user?.groupId;

    if (!groupId) return; // can't fetch without a group

    const res = await fetch(`/api/announcements?groupId=${groupId}`);
    const data = await res.json();
    console.log("announcement from GET ----------> ", data);
    if (res.ok) setAnnouncements(data.announcements);
  };
  fetchAnnouncements();
}, []);

// Listen for live announcements — fix event name ✅
useEffect(() => {
  if (!socket) return;

  const handler = (payload: { groupId: string; announcement: Announcement }) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    // Accept if it's for everyone OR matches this student's group
    if (payload.groupId === "everyone" || payload.groupId === user?.groupId) {
      setAnnouncements((prev) => [payload.announcement, ...prev]);
    }
  };

  socket.on("new-announcement", handler); // was "announcement-updated" ❌

  return () => {
    socket.off("new-announcement", handler);
  };
}, [socket]);





  // // Fetch initial announcements
  // useEffect(() => {
  //   const fetchAnnouncements = async () => {
  //   const res = await fetch("/api/announcements");
      
  //     const data = await res.json();
  //     console.log("announcement from GET ----------> ", data)
  //     if (res.ok) setAnnouncements(data.announcements);
  //   };
  //   fetchAnnouncements();
  // }, []);

  



  // // Listen for live announcements
  // useEffect(() => {
  //   if (!socket) return;

  //   const handler = (announcement: Announcement) => {
  //     setAnnouncements((prev) => [announcement, ...prev]);
  //   };

  //   socket.on("announcement-updated", handler);

  //   return () => {
  //     socket.off("announcement-updated", handler);
  //   };
  // }, [socket]);















  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100">
      <h2 className={`text-xl font-semibold text-${PRIMARY} mb-4`}>Announcements</h2>

      {announcements.length === 0 ? (
        <p className="text-gray-500">No announcements yet.</p>
      ) : (
        announcements.map((a) => (
          <div key={a._id} className="mb-4 p-4 border rounded-lg bg-green-50">
            <h3 className={`text-lg font-bold text-${PRIMARY}`}>{a.title}</h3>
            <p className="text-gray-700">{a.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              By: {a.createdBy} | {new Date(a.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
