
// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// const SocketContext = createContext<Socket | null>(null);

// // this hook is what components use to access the socket
// // instead of importing socket directly everywhere
// export const useSocket = () => useContext(SocketContext);

// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

// export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     //  Only connect if user is logged in
//     const user = localStorage.getItem("user");
//     const token = localStorage.getItem("token");

//     if (!user || !token) return; // not logged in, don't connect

//     const parsedUser = JSON.parse(user);

//     const newSocket = io(SOCKET_URL, {
//     transports: ["websocket", "polling"] // polling as fallback
//   });

//     // Join their group room automatically
//     newSocket.on("connect", () => {
//       console.log("Socket connected:", newSocket.id);
//       // join their class/faculty group
//       if (parsedUser.groupId) {
//         newSocket.emit("join-group", parsedUser.groupId);
//         console.log("Joined group room:", parsedUser.groupId);
//       }
//       // join announcement group too
//       if (parsedUser.announcementGroupId) {
//         newSocket.emit("join-group", parsedUser.announcementGroupId);
//       }
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };













"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { socket } from "@/lib/socket";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

function emitJoinFromStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined") return;
    const u = JSON.parse(raw) as {
      groupId?: string;
      announcementGroupId?: string;
    };
    if (u.groupId) socket.emit("join-group", String(u.groupId));
    if (u.announcementGroupId) {
      socket.emit("join-group", String(u.announcementGroupId));
    }
  } catch {
    /* ignore */
  }
}

/** Join every Mongo group the user belongs to (API) plus stored primary groups. */
async function joinAllUserGroups() {
  const token = localStorage.getItem("token");
  if (!token) return;

  emitJoinFromStoredUser();

  try {
    const res = await fetch("/api/groups", {
      cache: "no-store",
      credentials: "same-origin",
      headers: { Authorization: `Bearer ${token}` },
    });
    const groups = await res.json();
    if (!Array.isArray(groups)) return;
    for (const g of groups) {
      if (g?._id) {
        socket.emit("join-group", String(g._id));
      }
    }
  } catch {
    /* ignore */
  }
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeSocket, setActiveSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (!token || !userRaw || userRaw === "undefined") return;

    socket.auth = { token };
    if (!socket.connected) socket.connect();

    const onConnect = () => {
      void joinAllUserGroups();
    };

    socket.on("connect", onConnect);
    if (socket.connected) void joinAllUserGroups();

    setActiveSocket(socket);

    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={activeSocket}>{children}</SocketContext.Provider>
  );
};
