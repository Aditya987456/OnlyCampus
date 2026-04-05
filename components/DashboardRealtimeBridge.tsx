"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export const MEETINGS_REALTIME_EVENT = "onlycampus-meetings";
export const MEETINGS_RECONNECT_EVENT = "onlycampus-meetings-reconnect";
export const ANNOUNCEMENTS_REALTIME_EVENT = "onlycampus-announcements";
export const CHAT_REALTIME_EVENT = "onlycampus-chat";
export const CHAT_RECONNECT_EVENT = "onlycampus-chat-reconnect";

/**
 * Keeps socket listeners mounted for the whole dashboard so realtime events
 * are not dropped when navigating between routes (and avoids Strict Mode
 * stripping handlers from leaf pages).
 */
export default function DashboardRealtimeBridge() {
  useEffect(() => {
    const notifyMeeting = (payload: unknown) => {
      window.dispatchEvent(
        new CustomEvent(MEETINGS_REALTIME_EVENT, { detail: payload })
      );
    };

    const notifyAnnouncement = (payload: unknown) => {
      window.dispatchEvent(
        new CustomEvent(ANNOUNCEMENTS_REALTIME_EVENT, { detail: payload })
      );
    };

    const notifyChat = (payload: unknown) => {
      window.dispatchEvent(
        new CustomEvent(CHAT_REALTIME_EVENT, { detail: payload })
      );
    };

    const onConnect = () => {
      window.dispatchEvent(new Event(MEETINGS_RECONNECT_EVENT));
      window.dispatchEvent(new Event(CHAT_RECONNECT_EVENT));
    };

    socket.on("meeting-created", notifyMeeting);
    socket.on("meeting-updated", notifyMeeting);
    socket.on("announcement-received", notifyAnnouncement);
    socket.on("chat-message-received", notifyChat);
    socket.on("connect", onConnect);

    return () => {
      socket.off("meeting-created", notifyMeeting);
      socket.off("meeting-updated", notifyMeeting);
      socket.off("announcement-received", notifyAnnouncement);
      socket.off("chat-message-received", notifyChat);
      socket.off("connect", onConnect);
    };
  }, []);

  return null;
}
