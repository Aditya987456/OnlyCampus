

// "use client";

// import { useEffect, useState } from "react";
// import CreateMeetingForm from "@/components/CreateMeetingForm";

// interface Meeting {
//   _id: string;
//   title: string;
//   scheduledAt: string;
//   status: "scheduled" | "live" | "ended";
//   meetingLink: string;
//   groupId?: { name: string };
//   createdBy?: { name: string };
// }

// function formatDate(dateStr: string) {
//   if (!dateStr || isNaN(Date.parse(dateStr))) return "—";
//   return new Date(dateStr).toLocaleString("en-IN", {
//     weekday: "short",
//     day: "numeric",
//     month: "short",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// // ── Status Badge ──────────────────────────────────────────────────────────────
// function StatusBadge({ status }: { status: Meeting["status"] }) {
//   const map = {
//     live: "bg-green-100 text-green-700 border border-green-300",
//     scheduled: "bg-amber-50 text-amber-700 border border-amber-200",
//     ended: "bg-gray-100 text-gray-400 border border-gray-200",
//   };
//   const labels = { live: "Live Now", scheduled: "Scheduled", ended: "Ended" };

//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${map[status]}`}
//     >
//       {status === "live" && (
//         <span className="relative flex h-1.5 w-1.5">
//           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
//           <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
//         </span>
//       )}
//       {labels[status]}
//     </span>
//   );
// }

// // ── Meeting Card ──────────────────────────────────────────────────────────────
// function MeetingCard({
//   meeting,
//   isFaculty,
//   onStart,
// }: {
//   meeting: Meeting;
//   isFaculty: boolean;
//   onStart: (id: string) => void;
// }) {
//   const isLive = meeting.status === "live";
//   const isScheduled = meeting.status === "scheduled";
//   const isEnded = meeting.status === "ended";

//   return (
//     <div
//       className={`
//         relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden
//         ${isLive
//           ? "border-green-300 shadow-lg shadow-green-100"
//           : isEnded
//           ? "border-gray-100 opacity-60"
//           : "border-green-100 shadow-sm hover:shadow-md hover:border-green-200 hover:-translate-y-0.5"
//         }
//       `}
//     >
//       {/* Live accent bar */}
//       {isLive && (
//         <div className="h-1 w-full bg-gradient-to-r from-green-400 to-green-600" />
//       )}

//       <div className="p-5">
//         {/* Title + Badge */}
//         <div className="flex items-start justify-between gap-3 mb-2">
//           <h3 className={`font-semibold text-base leading-tight ${isEnded ? "text-gray-400" : "text-gray-800"}`}>
//             {meeting.title}
//           </h3>
//           <StatusBadge status={meeting.status} />
//         </div>

//         {/* Meta */}
//         <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
//           {meeting.groupId?.name && (
//             <span className="flex items-center gap-1 text-xs text-gray-400">
//               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//               {meeting.groupId.name}
//             </span>
//           )}
//           {meeting.createdBy?.name && (
//             <span className="flex items-center gap-1 text-xs text-gray-400">
//               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//               {meeting.createdBy.name}
//             </span>
//           )}
//           {meeting.scheduledAt && (
//             <span className="flex items-center gap-1 text-xs text-gray-400">
//               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//               {formatDate(meeting.scheduledAt)}
//             </span>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-2 flex-wrap">
//           {isFaculty && isScheduled && (
//             <button
//               onClick={() => onStart(meeting._id)}
//               className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-sm shadow-green-200"
//             >
//               <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M8 5v14l11-7z" />
//               </svg>
//               Start Session
//             </button>
//           )}

//           {isLive && (
//             <a
//               href={meeting.meetingLink}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-green-200 no-underline"
//             >
//               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
//               </svg>
//               Join Now
//             </a>
//           )}

//           {isEnded && (
//             <span className="text-xs text-gray-300 italic">Session has ended</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Tab Button ────────────────────────────────────────────────────────────────
// function TabBtn({
//   label,
//   count,
//   active,
//   onClick,
// }: {
//   label: string;
//   count: number;
//   active: boolean;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`
//         flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
//         ${active
//           ? "bg-green-600 text-white shadow-sm shadow-green-200"
//           : "text-gray-500 hover:text-gray-700 hover:bg-green-50"
//         }
//       `}
//     >
//       {label}
//       {count > 0 && (
//         <span
//           className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
//             active ? "bg-white/25 text-white" : "bg-green-100 text-green-700"
//           }`}
//         >
//           {count}
//         </span>
//       )}
//     </button>
//   );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────
// export default function MeetingsPage() {
//   const [meetings, setMeetings] = useState<Meeting[]>([]);
//   const [user, setUser] = useState<any>(null);
//   const [activeTab, setActiveTab] = useState<"all" | "live" | "scheduled" | "ended">("all");
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const stored = localStorage.getItem("user");
//     if (stored) setUser(JSON.parse(stored));
//   }, []);

//   const isFaculty = user?.role === "faculty";

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     fetch("/api/meetings", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((r) => r.json())
//       .then((data) => {
//         setMeetings(Array.isArray(data) ? data : []);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   const startMeeting = async (id: string) => {
//     const token = localStorage.getItem("token");
//     const res = await fetch("/api/meetings/start", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ meetingId: id }),
//     });
//     const updated = await res.json();
//     setMeetings((prev) => prev.map((m) => (m._id === id ? updated : m)));
//   };

//   const liveMeetings = meetings.filter((m) => m.status === "live");
//   const tabs = [
//     { key: "all" as const, label: "All", count: meetings.length },
//     { key: "live" as const, label: "Live", count: liveMeetings.length },
//     { key: "scheduled" as const, label: "Scheduled", count: meetings.filter((m) => m.status === "scheduled").length },
//     { key: "ended" as const, label: "Ended", count: meetings.filter((m) => m.status === "ended").length },
//   ];
//   const filtered = activeTab === "all" ? meetings : meetings.filter((m) => m.status === activeTab);

//   return (
//     <div className="min-h-screen bg-green-50 relative overflow-x-hidden">
     
//       <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,#d1fae5_0%,transparent_50%)] opacity-60" />
//       <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_80%,#bbf7d0_0%,transparent_50%)] opacity-50" />

//       <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">

//         {/* ── Header ── */}
//         <div className="flex items-start justify-between mb-6 gap-4">
//           <div>
//             <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">
//               OnlyCampus
//             </p>
//             <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Meetings</h1>
//             <p className="text-sm text-gray-500 mt-0.5">
//               {isFaculty
//                 ? "Create and manage your class sessions"
//                 : "View and join your upcoming sessions"}
//             </p>
//           </div>

//           {isFaculty && (
//             <button
//               onClick={() => setShowForm((v) => !v)}
//               className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-green-200 transition-all active:scale-95"
//             >
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//               </svg>
//               {showForm ? "Close" : "New Meeting"}
//             </button>
//           )}
//         </div>

//         {/* ── Live Alert Banner (students) ── */}
//         {!isFaculty && liveMeetings.length > 0 && (
//           <div className="mb-5 flex items-center gap-3 bg-white border border-green-300 rounded-2xl px-5 py-4 shadow-sm shadow-green-100">
//             <span className="relative flex h-3 w-3 shrink-0">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
//               <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
//             </span>
//             <div className="flex-1">
//               <p className="text-sm font-semibold text-green-700">
//                 {liveMeetings.length} session{liveMeetings.length > 1 ? "s" : ""} happening right now
//               </p>
//               <p className="text-xs text-gray-400">Tap "Join Now" below to enter</p>
//             </div>
//           </div>
//         )}

//         {/* ── Create Meeting Form ── */}
//         {isFaculty && showForm && (
//           <div className="mb-6 bg-white border border-green-200 rounded-2xl shadow-sm overflow-hidden">
//             <div className="flex items-center justify-between px-5 py-4 border-b border-green-100 bg-green-50/50">
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-700">New Meeting</h3>
//                 <p className="text-xs text-gray-400">Fill in the details to schedule or start</p>
//               </div>
//               <button
//                 onClick={() => setShowForm(false)}
//                 className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all text-sm"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="p-5">
//               <CreateMeetingForm
//                 onCreated={(meeting: Meeting) => {
//                   setMeetings((prev) => [meeting, ...prev]);
//                   setShowForm(false);
//                 }}
//               />
//             </div>
//           </div>
//         )}

//         {/* ── Tabs ── */}
//         <div className="flex gap-1 mb-5 bg-white/80 border border-green-100 p-1 rounded-2xl shadow-sm w-fit backdrop-blur-sm">
//           {tabs.map((tab) => (
//             <TabBtn
//               key={tab.key}
//               label={tab.label}
//               count={tab.count}
//               active={activeTab === tab.key}
//               onClick={() => setActiveTab(tab.key)}
//             />
//           ))}
//         </div>

//         {/* ── Loading Skeleton ── */}
//         {loading && (
//           <div className="space-y-3">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-28 bg-white/80 rounded-2xl border border-green-100 animate-pulse" />
//             ))}
//           </div>
//         )}

//         {/* ── Empty State ── */}
//         {!loading && filtered.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-16 text-center bg-white/60 border border-green-100 rounded-2xl backdrop-blur-sm">
//             <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-3">
//               <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
//               </svg>
//             </div>
//             <p className="text-sm font-medium text-gray-500">No meetings here</p>
//             <p className="text-xs text-gray-400 mt-1">
//               {isFaculty ? "Create a new meeting to get started" : "Check back later for sessions"}
//             </p>
//           </div>
//         )}

//         {/* ── Meetings List ── */}
//         {!loading && filtered.length > 0 && (
//           <div className="space-y-3">
//             {/* "All" tab: live on top with section label */}
//             {activeTab === "all" && liveMeetings.length > 0 && (
//               <>
//                 <p className="text-[11px] font-bold text-green-600 uppercase tracking-widest px-1 flex items-center gap-2">
//                   <span className="relative flex h-1.5 w-1.5">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
//                     <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
//                   </span>
//                   Happening Now
//                 </p>
//                 {liveMeetings.map((m) => (
//                   <MeetingCard key={m._id} meeting={m} isFaculty={isFaculty} onStart={startMeeting} />
//                 ))}

//                 {meetings.filter((m) => m.status !== "live").length > 0 && (
//                   <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1 pt-3">
//                     Other Sessions
//                   </p>
//                 )}
//                 {meetings
//                   .filter((m) => m.status !== "live")
//                   .map((m) => (
//                     <MeetingCard key={m._id} meeting={m} isFaculty={isFaculty} onStart={startMeeting} />
//                   ))}
//               </>
//             )}

//             {/* "All" tab with no live meetings, or other tabs */}
//             {(activeTab !== "all" || liveMeetings.length === 0) &&
//               filtered.map((m) => (
//                 <MeetingCard key={m._id} meeting={m} isFaculty={isFaculty} onStart={startMeeting} />
//               ))}
//           </div>
//         )}

//         {/* Auto-refresh hint */}
//         {!isFaculty && !loading && (
//           <p className="text-center text-[10px] text-gray-300 mt-8">
//             Page auto-refreshes every 10s to show live sessions
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import CreateMeetingForm from "@/components/CreateMeetingForm";

interface Meeting {
  _id: string;
  title: string;
  scheduledAt: string;
  status: "scheduled" | "live" | "ended";
  meetingLink: string;
  groupId?: { name: string };
  createdBy?: { name: string };
}

function formatDate(dateStr: string) {
  if (!dateStr || isNaN(Date.parse(dateStr))) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Meeting["status"] }) {
  const map = {
    live: "bg-green-100 text-green-700 border border-green-300",
    scheduled: "bg-amber-50 text-amber-700 border border-amber-200",
    ended: "bg-gray-100 text-gray-400 border border-gray-200",
  };
  const labels = { live: "Live Now", scheduled: "Scheduled", ended: "Ended" };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${map[status]}`}
    >
      {status === "live" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
        </span>
      )}
      {labels[status]}
    </span>
  );
}

// ── Meeting Card ──────────────────────────────────────────────────────────────
function MeetingCard({
  meeting,
  isFaculty,
  onStart,
}: {
  meeting: Meeting;
  isFaculty: boolean;
  onStart: (id: string) => void;
}) {
  const isLive = meeting.status === "live";
  const isScheduled = meeting.status === "scheduled";
  const isEnded = meeting.status === "ended";

  return (
    <div
      className={`
        relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden
        ${isLive
          ? "border-green-300 shadow-lg shadow-green-100"
          : isEnded
          ? "border-gray-100 opacity-60"
          : "border-green-100 shadow-sm hover:shadow-md hover:border-green-200 hover:-translate-y-0.5"
        }
      `}
    >
      {/* Live accent bar */}
      {isLive && (
        <div className="h-1 w-full bg-gradient-to-r from-green-400 to-green-600" />
      )}

      <div className="p-5">
        {/* Title + Badge */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className={`font-semibold text-base leading-tight ${isEnded ? "text-gray-400" : "text-gray-800"}`}>
            {meeting.title}
          </h3>
          <StatusBadge status={meeting.status} />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
          {meeting.groupId?.name && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {meeting.groupId.name}
            </span>
          )}
          {meeting.createdBy?.name && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {meeting.createdBy.name}
            </span>
          )}
          {meeting.scheduledAt && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(meeting.scheduledAt)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {isFaculty && isScheduled && (
            <button
              onClick={() => onStart(meeting._id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-sm shadow-green-200"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start Session
            </button>
          )}

          {isLive && (
            <a
              href={meeting.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-green-200 no-underline"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              Join Now
            </a>
          )}

          {isEnded && (
            <span className="text-xs text-gray-300 italic">Session has ended</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tab Button ────────────────────────────────────────────────────────────────
function TabBtn({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
        ${active
          ? "bg-green-600 text-white shadow-sm shadow-green-200"
          : "text-gray-500 hover:text-gray-700 hover:bg-green-50"
        }
      `}
    >
      {label}
      {count > 0 && (
        <span
          className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
            active ? "bg-white/25 text-white" : "bg-green-100 text-green-700"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"all" | "live" | "scheduled" | "ended">("all");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const isFaculty = user?.role === "faculty";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/meetings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setMeetings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const startMeeting = async (id: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/meetings/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ meetingId: id }),
    });
    const updated = await res.json();
    setMeetings((prev) => prev.map((m) => (m._id === id ? updated : m)));
  };

  const liveMeetings = meetings.filter((m) => m.status === "live");
  const tabs = [
    { key: "all" as const, label: "All", count: meetings.length },
    { key: "live" as const, label: "Live", count: liveMeetings.length },
    { key: "scheduled" as const, label: "Scheduled", count: meetings.filter((m) => m.status === "scheduled").length },
    { key: "ended" as const, label: "Ended", count: meetings.filter((m) => m.status === "ended").length },
  ];
  const filtered = activeTab === "all" ? meetings : meetings.filter((m) => m.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
     
      {/* <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,#d1fae5_0%,transparent_50%)] opacity-60" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_80%,#bbf7d0_0%,transparent_50%)] opacity-50" /> */}

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">
              OnlyCampus
            </p>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Meetings</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isFaculty
                ? "Create and manage your class sessions"
                : "View and join your upcoming sessions"}
            </p>
          </div>

          {isFaculty && (
            <button
              onClick={() => setShowForm((v) => !v)}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-green-200 transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {showForm ? "Close" : "New Meeting"}
            </button>
          )}
        </div>

        {/* ── Live Alert Banner (students) ── */}
        {!isFaculty && liveMeetings.length > 0 && (
          <div className="mb-5 flex items-center gap-3 bg-white border border-green-300 rounded-2xl px-5 py-4 shadow-sm shadow-green-100">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-700">
                {liveMeetings.length} session{liveMeetings.length > 1 ? "s" : ""} happening right now
              </p>
              <p className="text-xs text-gray-400">Tap "Join Now" below to enter</p>
            </div>
          </div>
        )}

        {/* ── Create Meeting Form ── */}
        {isFaculty && showForm && (
          <div className="mb-6 bg-white border border-green-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-green-100 bg-green-50/50">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">New Meeting</h3>
                <p className="text-xs text-gray-400">Fill in the details to schedule or start</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <CreateMeetingForm
                onCreated={(meeting: Meeting) => {
                  setMeetings((prev) => [meeting, ...prev]);
                  setShowForm(false);
                }}
              />
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-5 bg-white/80 border border-green-100 p-1 rounded-2xl shadow-sm w-fit backdrop-blur-sm">
          {tabs.map((tab) => (
            <TabBtn
              key={tab.key}
              label={tab.label}
              count={tab.count}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            />
          ))}
        </div>

        {/* ── Loading Skeleton ── */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-white/80 rounded-2xl border border-green-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white/60 border border-green-100 rounded-2xl backdrop-blur-sm">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">No meetings here</p>
            <p className="text-xs text-gray-400 mt-1">
              {isFaculty ? "Create a new meeting to get started" : "Check back later for sessions"}
            </p>
          </div>
        )}

        {/* ── Meetings List ── */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {/* "All" tab: live on top with section label */}
            {activeTab === "all" && liveMeetings.length > 0 && (
              <>
                <p className="text-[11px] font-bold text-green-600 uppercase tracking-widest px-1 flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                  </span>
                  Happening Now
                </p>
                {liveMeetings.map((m) => (
                  <MeetingCard key={m._id} meeting={m} isFaculty={isFaculty} onStart={startMeeting} />
                ))}

                {meetings.filter((m) => m.status !== "live").length > 0 && (
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1 pt-3">
                    Other Sessions
                  </p>
                )}
                {meetings
                  .filter((m) => m.status !== "live")
                  .map((m) => (
                    <MeetingCard key={m._id} meeting={m} isFaculty={isFaculty} onStart={startMeeting} />
                  ))}
              </>
            )}

            {/* "All" tab with no live meetings, or other tabs */}
            {(activeTab !== "all" || liveMeetings.length === 0) &&
              filtered.map((m) => (
                <MeetingCard key={m._id} meeting={m} isFaculty={isFaculty} onStart={startMeeting} />
              ))}
          </div>
        )}

        {/* Auto-refresh hint */}
        {!isFaculty && !loading && (
          <p className="text-center text-[10px] text-gray-300 mt-8">
            Page auto-refreshes every 10s to show live sessions
          </p>
        )}
      </div>
    </div>
  );
}



