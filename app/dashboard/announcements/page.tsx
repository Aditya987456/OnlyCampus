

// "use client";
// import React, { useEffect, useState } from "react";
// import { Bell, Send } from "lucide-react";
// import { toast } from "sonner";
// import { useSocket } from "@/context/socketContext";

// interface Announcement {
//   _id: string;
//   title: string;
//   description: string;
//   createdBy: { name: string } | string;
//   createdAt: string;
// }

// export default function AnnouncementsPage() {
//   const [user, setUser] = useState<any>(null);
//   const [announcements, setAnnouncements] = useState<Announcement[]>([]);
//   const [groups, setGroups] = useState<any[]>([]);
//   const [selectedGroupId, setSelectedGroupId] = useState("everyone");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Get socket from context — no new socket created
//   const socket = useSocket();

//   // Load user-- localstorage.
//   useEffect(() => {
//     const stored = localStorage.getItem("user");
//     if (stored && stored !== "undefined") {
//       setUser(JSON.parse(stored));
//     }
//   }, []);

//   // Fetch data when user loads
//   useEffect(() => {
//     if (!user) return;
//     fetchAnnouncements();
//     if (user.role === "faculty") fetchGroups();
//   }, [user]);

//   //  Listen for realtime announcements using context socket
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("announcement-received", (data) => {
//       console.log("📢 Announcement received!", data);
//       setAnnouncements((prev) => [data.announcement, ...prev]);
//     });

//     return () => {
//       socket.off("announcement-received");
//     };
//   }, [socket]);

//   const fetchAnnouncements = async () => {
//     const token = localStorage.getItem("token");
//     const groupId = user?.announcementGroupId || user?.groupId;
//     if (!groupId) return;

//     const res = await fetch(`/api/announcements?groupId=${groupId}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     const data = await res.json();
//     if (res.ok) setAnnouncements(data.announcements);
//   };

//   const fetchGroups = async () => {
//     const token = localStorage.getItem("token");
//     const res = await fetch("/api/groups/list", {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     const data = await res.json();
//     if (Array.isArray(data)) setGroups(data);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title || !description) return toast.error("All fields required");
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       const isEveryone = selectedGroupId === "everyone";
//       const targetGroupId = isEveryone
//         ? user?.announcementGroupId
//         : selectedGroupId;

//       // Step 1 — save to MongoDB
//       const res = await fetch("/api/announcements", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           title,
//           description,
//           groupId: targetGroupId,
//           targetAll: isEveryone
//         })
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         toast.error(data.message || "Failed to post");
//         setLoading(false);
//         return;
//       }

//       // ✅ Step 2 — emit using context socket
//       socket?.emit("new-announcement", {
//         groupId: targetGroupId,
//         announcement: data.announcement
//       });

//       toast.success("Announcement published!");
//       setTitle("");
//       setDescription("");
//     } catch {
//       toast.error("Something went wrong.");
//     }

//     setLoading(false);
//   };

//   const getCreatorName = (createdBy: any) => {
//     if (typeof createdBy === "object") return createdBy?.name;
//     return createdBy;
//   };

//   const isFaculty = user?.role === "faculty";

//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       <div className="mb-6 pb-4 border-b border-gray-200">
//         <div className="flex items-center gap-3">
//           <Bell className="w-7 h-7 text-green-600" />
//           <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
//         </div>
//         <p className="text-gray-500 text-sm mt-1">
//           {isFaculty
//             ? "Post announcements to your students."
//             : "Stay updated with the latest notices."}
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {isFaculty && (
//           <div className="lg:col-span-1">
//             <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
//               <h2 className="text-lg font-bold text-green-600 mb-4 flex items-center gap-2">
//                 <Send className="w-5 h-5" /> New Announcement
//               </h2>
//               <form onSubmit={handleSubmit} className="space-y-3">
//                 <select
//                   value={selectedGroupId}
//                   onChange={(e) => setSelectedGroupId(e.target.value)}
//                   className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-100"
//                 >
//                   <option value="everyone">📢 Everyone</option>
//                   {groups.map((g) => (
//                     <option key={g._id} value={g._id}>
//                       {g.name}
//                     </option>
//                   ))}
//                 </select>
//                 <input
//                   type="text"
//                   placeholder="Title"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-100"
//                   required
//                 />
//                 <textarea
//                   placeholder="Description..."
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-100"
//                   rows={5}
//                   required
//                 />
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full py-3 text-white font-semibold rounded-lg bg-green-600 hover:bg-green-700 transition disabled:opacity-50"
//                 >
//                   {loading ? "Publishing..." : "Publish"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         <div className={isFaculty ? "lg:col-span-2" : "lg:col-span-3"}>
//           <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
//             <h2 className="text-lg font-semibold text-green-600 mb-4">Feed</h2>
//             {announcements.length === 0 ? (
//               <p className="text-gray-500">No announcements yet.</p>
//             ) : (
//               <div className="space-y-4">
//                 {announcements.map((a) => (
//                   <div key={a._id} className="p-4 border rounded-xl bg-green-50 border-green-100">
//                     <h3 className="font-bold text-green-700">{a.title}</h3>
//                     <p className="text-gray-700 mt-1 text-sm">{a.description}</p>
//                     <p className="text-xs text-gray-400 mt-2">
//                       By {getCreatorName(a.createdBy)} · {new Date(a.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }





























"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Bell, Send, Trash2, FileText, ImageIcon, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { ANNOUNCEMENTS_REALTIME_EVENT } from "@/components/DashboardRealtimeBridge";
import { ensureSocketConnected, socket } from "@/lib/socket";

type AnnouncementAttachment = {
  name: string;
  url: string;
  mimeType: string;
};

interface Announcement {
  _id: string;
  title: string;
  description: string;
  createdBy: { _id?: string; name: string } | string;
  createdAt: string;
  targetAll?: boolean;
  groupId?: { _id?: string; name?: string; type?: string } | string;
  attachments?: AnnouncementAttachment[];
}

export default function AnnouncementsPage() {
  const [user, setUser] = useState<{ id?: string; role?: string; announcementGroupId?: string } | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [groups, setGroups] = useState<{ _id: string; name: string }[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("everyone");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<AnnouncementAttachment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
      setUser(JSON.parse(stored));
    }
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/announcements", {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && Array.isArray(data.announcements)) {
      setAnnouncements(data.announcements);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    void fetchAnnouncements();
    if (user.role === "faculty") {
      const token = localStorage.getItem("token");
      if (!token) return;
      fetch("/api/groups/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => (Array.isArray(data) ? setGroups(data) : setGroups([])));
    }
  }, [user, fetchAnnouncements]);

  useEffect(() => {
    const onAnnouncementRealtime = (event: Event) => {
      const detail = (event as CustomEvent<{ deletedId?: string } | undefined>).detail;
      if (detail?.deletedId) {
        setAnnouncements((prev) => prev.filter((item) => item._id !== detail.deletedId));
        return;
      }
      void fetchAnnouncements();
    };
    window.addEventListener(ANNOUNCEMENTS_REALTIME_EVENT, onAnnouncementRealtime);
    return () => {
      window.removeEventListener(ANNOUNCEMENTS_REALTIME_EVENT, onAnnouncementRealtime);
    };
  }, [fetchAnnouncements]);

  useEffect(() => {
    if (user?.role === "faculty") return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void fetchAnnouncements();
    }, 10000);
    return () => window.clearInterval(id);
  }, [user?.role, fetchAnnouncements]);

  const handleAttachmentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const nextFiles = files.slice(0, Math.max(0, 4 - attachments.length));
    const converted = await Promise.all(
      nextFiles.map(
        (file) =>
          new Promise<AnnouncementAttachment>((resolve, reject) => {
            if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
              reject(new Error("Only images and PDF files are allowed"));
              return;
            }
            if (file.size > 2 * 1024 * 1024) {
              reject(new Error("Each attachment must be 2MB or smaller"));
              return;
            }
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                name: file.name,
                mimeType: file.type,
                url: String(reader.result ?? ""),
              });
            reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
            reader.readAsDataURL(file);
          })
      )
    ).catch((error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to prepare attachment"
      );
      return [] as AnnouncementAttachment[];
    });

    if (converted.length > 0) {
      setAttachments((prev) => [...prev, ...converted].slice(0, 4));
    }

    e.target.value = "";
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

      if (!targetGroupId) {
        toast.error("Missing announcement group. Re-login or contact admin.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          groupId: targetGroupId,
          targetAll: isEveryone,
          attachments,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to post");
        setLoading(false);
        return;
      }

      if (data.announcement) {
        setAnnouncements((prev) => {
          const ann = data.announcement as Announcement;
          if (prev.some((a) => a._id === ann._id)) return prev;
          return [ann, ...prev];
        });
      }

      ensureSocketConnected();
      const ann = data.announcement as Announcement & { targetAll?: boolean };
      socket.emit("new-announcement", {
        groupId: String(targetGroupId),
        announcement: {
          ...ann,
          targetAll: Boolean(ann?.targetAll ?? isEveryone),
        },
      });

      void fetchAnnouncements();

      toast.success("Announcement published!");
      setTitle("");
      setDescription("");
      setAttachments([]);
    } catch {
      toast.error("Something went wrong.");
    }

    setLoading(false);
  };

  const getCreatorName = (createdBy: Announcement["createdBy"]) => {
    if (typeof createdBy === "object") return createdBy?.name;
    return createdBy;
  };

  const isOwnAnnouncement = (announcement: Announcement) => {
    if (!user) return false;
    if (typeof announcement.createdBy === "object") {
      return announcement.createdBy?._id === (user as { id?: string }).id;
    }
    return false;
  };

  const deleteAnnouncement = async (announcement: Announcement) => {
    const confirmed = window.confirm("Delete this announcement?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    const res = await fetch(
      `/api/announcements?announcementId=${encodeURIComponent(announcement._id)}`,
      {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Failed to delete announcement");
      return;
    }

    setAnnouncements((prev) => prev.filter((item) => item._id !== announcement._id));

    const announcementGroupId =
      typeof announcement.groupId === "object"
        ? String(announcement.groupId?._id ?? "")
        : String(announcement.groupId ?? "");

    ensureSocketConnected();
    socket.emit("delete-announcement", {
      deletedId: announcement._id,
      groupId: announcementGroupId,
      targetAll: Boolean(announcement.targetAll),
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const isFaculty = user?.role === "faculty";

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mb-4 border-b border-gray-200 pb-3 sm:mb-6 sm:pb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Bell className="h-6 w-6 shrink-0 text-green-600 sm:h-7 sm:w-7" />
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">Announcements</h1>
        </div>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          {isFaculty
            ? "Class = only that class + you. Everyone = all students and faculty campus-wide (realtime for everyone connected)."
            : "Class notices and campus-wide posts appear here in realtime."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {isFaculty && (
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow sm:p-6">
              <h2 className="text-lg font-bold text-green-600 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" /> New Announcement
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="everyone">📢 Everyone (all users)</option>
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
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 transition hover:bg-green-100">
                  <Paperclip className="h-4 w-4" />
                  Add image or PDF
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    className="hidden"
                    onChange={handleAttachmentChange}
                  />
                </label>
                {attachments.length > 0 && (
                  <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    {attachments.map((attachment, index) => {
                      const isImage = attachment.mimeType.startsWith("image/");
                      return (
                        <div key={`${attachment.name}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2">
                          <div className="flex min-w-0 items-center gap-2">
                            {isImage ? (
                              <ImageIcon className="h-4 w-4 shrink-0 text-green-600" />
                            ) : (
                              <FileText className="h-4 w-4 shrink-0 text-red-600" />
                            )}
                            <span className="truncate text-sm text-gray-700">{attachment.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-xs font-medium text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
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
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow sm:p-6">
            <h2 className="text-lg font-semibold text-green-600 mb-4">Feed</h2>
            {announcements.length === 0 ? (
              <p className="text-gray-500">No announcements yet.</p>
            ) : (
              <div className="space-y-4">
                {announcements.map((a) => (
                  <div key={a._id} className="p-4 border rounded-xl bg-green-50 border-green-100">
                    <div className="mb-1 flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-green-700">{a.title}</h3>
                        {a.targetAll && (
                          <span className="text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            Everyone
                          </span>
                        )}
                        {!a.targetAll && typeof a.groupId === "object" && a.groupId?.name && (
                          <span className="text-[10px] font-semibold uppercase tracking-wide bg-white text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                            {a.groupId.name}
                          </span>
                        )}
                      </div>
                      {isOwnAnnouncement(a) && (
                        <button
                          type="button"
                          onClick={() => deleteAnnouncement(a)}
                          className="shrink-0 text-gray-400 transition hover:text-red-600"
                          aria-label="Delete announcement"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 mt-1 text-sm">{a.description}</p>
                    {Array.isArray(a.attachments) && a.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {a.attachments.map((attachment, index) => {
                          const isImage = attachment.mimeType.startsWith("image/");
                          return (
                            <div key={`${a._id}-attachment-${index}`} className="rounded-lg border border-green-100 bg-white p-3">
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-green-700 no-underline hover:text-green-800"
                              >
                                {isImage ? (
                                  <ImageIcon className="h-4 w-4" />
                                ) : (
                                  <FileText className="h-4 w-4" />
                                )}
                                {attachment.name}
                              </a>
                              {isImage && (
                                <Image
                                  src={attachment.url}
                                  alt={attachment.name}
                                  width={800}
                                  height={480}
                                  className="mt-3 max-h-64 rounded-lg border border-gray-200 object-contain"
                                  unoptimized
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
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
