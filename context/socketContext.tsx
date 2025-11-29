// context/socketcontext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

interface ProviderProps {
  children: React.ReactNode;
}

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"; // Changed 5000 to 4000

export const SocketProvider: React.FC<ProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};