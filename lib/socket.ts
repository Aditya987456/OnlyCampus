"use client";

import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

/** Shared client; connect only after login via `socket.auth` + `socket.connect()`. */
export const socket = io(SOCKET_URL, {
  autoConnect: false,   // Don't connect until we have a token
  transports: ["websocket", "polling"],
});

/** Call before emit so events are not dropped (e.g. right after navigation). */
export function ensureSocketConnected() {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem("token");
  if (!token) return;
  socket.auth = { token };
  if (!socket.connected) socket.connect();
}
