
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

// this hook is what components use to access the socket
// instead of importing socket directly everywhere
export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    //  Only connect if user is logged in
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!user || !token) return; // not logged in, don't connect

    const parsedUser = JSON.parse(user);

    const newSocket = io(SOCKET_URL, {
  transports: ["websocket", "polling"] // polling as fallback
});

    // Join their group room automatically
    newSocket.on("connect", () => {
      // join their class/faculty group
      if (parsedUser.groupId) {
        newSocket.emit("join-group", parsedUser.groupId);
      }
      // join announcement group too
      if (parsedUser.announcementGroupId) {
        newSocket.emit("join-group", parsedUser.announcementGroupId);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};