



// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useParams } from "next/navigation";
// import { socket } from "@/lib/socket";
// import { Send, MessageSquare } from "lucide-react";

// export default function ChatPage() {
//   const { groupId } = useParams();

//   const [messages, setMessages] = useState<any[]>([]);
//   const [content, setContent] = useState("");
//   const [user, setUser] = useState<any>(null);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   // Load user from localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser && storedUser !== "undefined") {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // Fetch old messages
//   const fetchMessages = async () => {
//     const res = await fetch(`/api/messages?groupId=${groupId}`);
//     const data = await res.json();
//     if (Array.isArray(data)) {
//       setMessages(data);
//     } else {
//       setMessages([]);
//     }
//   };

//   useEffect(() => {
//     if (groupId) {
//       fetchMessages();
//     }
//   }, [groupId]);

//   // Auto-scroll to bottom on new messages
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Join socket room + listen
//   useEffect(() => {
//     if (!groupId) return;
//     socket.emit("join-group", groupId);
//     socket.on("chat-message-received", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });
//     return () => {
//       socket.off("chat-message-received");
//     };
//   }, [groupId]);

//   // Send message
//   const sendMessage = async () => {
//     if (!content.trim() || !user) return;
//     const res = await fetch("/api/messages", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ groupId, senderId: user.id, content }),
//     });
//     const savedMessage = await res.json();
//     socket.emit("new-chat-message", savedMessage);
//     setContent("");
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const isOwnMessage = (msg: any) => msg.senderId?._id === user?.id || msg.senderId?.id === user?.id;

//   const getInitial = (name: string) => name?.charAt(0).toUpperCase() ?? "?";

//   return (
//     <div className="flex flex-col h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 shadow-sm">
//         <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center">
//           <MessageSquare size={18} className="text-white" />
//         </div>
//         <div>
//           <h2 className="text-base font-bold text-gray-800">Group Chat</h2>
//           <p className="text-xs text-gray-400">{messages.length} messages</p>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
//         {messages.length === 0 && (
//           <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-2">
//             <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
//               <MessageSquare size={24} className="text-green-400" />
//             </div>
//             <p className="text-sm font-medium">No messages yet</p>
//             <p className="text-xs">Be the first to say something!</p>
//           </div>
//         )}

//         {messages.map((msg) => {
//           const own = isOwnMessage(msg);
//           const senderName = msg.senderId?.name ?? "Unknown";

//           return (
//             <div
//               key={msg._id}
//               className={`flex items-end gap-2.5 ${own ? "flex-row-reverse" : "flex-row"}`}
//             >
//               {/* Avatar */}
//               {!own && (
//                 <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0">
//                   {getInitial(senderName)}
//                 </div>
//               )}

//               <div className={`flex flex-col gap-1 max-w-[65%] ${own ? "items-end" : "items-start"}`}>
//                 {!own && (
//                   <span className="text-xs text-gray-500 font-medium px-1">{senderName}</span>
//                 )}
//                 <div
//                   className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
//                     own
//                       ? "bg-green-600 text-white rounded-br-sm"
//                       : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
//                   }`}
//                 >
//                   {msg.content}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//         <div ref={bottomRef} />
//       </div>

//       {/* Input Bar */}
//       <div className="bg-white border-t border-gray-200 px-6 py-4">
//         <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-400 transition-all">
//           <input
//             className="flex-1 bg-transparent text-gray-800 text-sm outline-none placeholder:text-gray-400"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Type a message… (Enter to send)"
//           />
//           <button
//             onClick={sendMessage}
//             disabled={!content.trim()}
//             className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
//           >
//             <Send size={14} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }











































"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  CHAT_REALTIME_EVENT,
  CHAT_RECONNECT_EVENT,
} from "@/components/DashboardRealtimeBridge";
import { ensureSocketConnected, socket } from "@/lib/socket";
import { Send, MessageSquare, Trash2 } from "lucide-react";

type ChatUser = {
  id?: string;
  _id?: string;
  name?: string;
};

type ChatMessage = {
  _id?: string;
  groupId?: string | { _id?: string };
  senderId?: ChatUser;
  content?: string;
  createdAt?: string;
};

export default function ChatPage() {
  const { groupId } = useParams();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState<ChatUser | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch old messages
  const fetchMessages = useCallback(async () => {
    const gid = Array.isArray(groupId) ? groupId[0] : groupId;
    if (!gid) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/messages?groupId=${gid}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      setMessages(data);
    } else {
      setMessages([]);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      fetchMessages();
    }
  }, [groupId, fetchMessages]);

  useEffect(() => {
    if (!groupId) return;

    const onFocus = () => {
      void fetchMessages();
    };

    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void fetchMessages();
    }, 2000);

    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [groupId, fetchMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!groupId) return;
    const gid = Array.isArray(groupId) ? groupId[0] : groupId;
    if (!gid) return;

    const appendMessage = (message: ChatMessage) => {
      if (typeof (message as { deletedId?: string }).deletedId === "string") {
        const deletedId = (message as { deletedId: string }).deletedId;
        setMessages((prev) => prev.filter((item) => item._id !== deletedId));
        return;
      }
      const msgGid =
        typeof message.groupId === "object" && message.groupId?._id != null
          ? String(message.groupId._id)
          : String(message.groupId ?? "");
      if (msgGid && msgGid !== String(gid)) return;
      setMessages((prev) => {
        if (message._id && prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    const joinRoom = () => {
      socket.emit("join-group", String(gid));
    };

    const onChatEvent = (e: Event) => {
      appendMessage(
        (e as CustomEvent<ChatMessage>).detail
      );
    };

    const onReconnect = () => {
      joinRoom();
      void fetchMessages();
    };

    ensureSocketConnected();
    if (socket.connected) {
      joinRoom();
    }
    socket.on("connect", joinRoom);
    window.addEventListener(CHAT_REALTIME_EVENT, onChatEvent);
    window.addEventListener(CHAT_RECONNECT_EVENT, onReconnect);

    return () => {
      socket.off("connect", joinRoom);
      window.removeEventListener(CHAT_REALTIME_EVENT, onChatEvent);
      window.removeEventListener(CHAT_RECONNECT_EVENT, onReconnect);
    };
  }, [groupId, fetchMessages]);

  // Send message
  const sendMessage = async () => {
    if (!content.trim() || !user) return;
    const token = localStorage.getItem("token");
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ groupId, content }),
    });
    const savedMessage = await res.json();
    if (!res.ok) return;
    setMessages((prev) => {
      if (savedMessage._id && prev.some((m) => m._id === savedMessage._id)) return prev;
      return [...prev, savedMessage];
    });
    setContent("");
  };

  const deleteMessage = async (messageId?: string) => {
    if (!messageId) return;
    const confirmed = window.confirm("Delete this message?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    const gid = Array.isArray(groupId) ? groupId[0] : groupId;
    const res = await fetch(`/api/messages?messageId=${encodeURIComponent(messageId)}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    if (!res.ok) return;

    setMessages((prev) => prev.filter((message) => message._id !== messageId));

    if (gid) {
      ensureSocketConnected();
      socket.emit("delete-chat-message", {
        groupId: String(gid),
        deletedId: data.messageId || messageId,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isOwnMessage = (msg: ChatMessage) =>
    msg.senderId?._id === user?.id || msg.senderId?.id === user?.id;

  const getInitial = (name: string) => name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div
      className="flex w-[calc(100%+1.5rem)] -mx-3 flex-col bg-gray-50 sm:w-[calc(100%+2rem)] sm:-mx-4 md:w-[calc(100%+3rem)] md:-mx-6 lg:w-[calc(100%+4rem)] lg:-mx-8 min-h-[28rem] h-[min(85dvh,calc(100dvh-6rem))] max-h-[min(90dvh,calc(100dvh-5rem))] sm:h-[min(80dvh,calc(100dvh-7rem))] lg:h-[min(88dvh,calc(100dvh-8rem))]"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-4">
        <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center">
          <MessageSquare size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-800">Group Chat</h2>
          <p className="text-xs text-gray-400">{messages.length} messages</p>
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-2">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <MessageSquare size={24} className="text-green-400" />
            </div>
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs">Be the first to say something!</p>
          </div>
        )}

        {messages.map((msg) => {
          const own = isOwnMessage(msg);
          const senderName = msg.senderId?.name ?? "Unknown";

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2.5 ${own ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              {!own && (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0">
                  {getInitial(senderName)}
                </div>
              )}

              <div className={`flex max-w-[min(100%,20rem)] flex-col gap-1 sm:max-w-[65%] ${own ? "items-end" : "items-start"}`}>
                {!own && (
                  <span className="text-xs text-gray-500 font-medium px-1">{senderName}</span>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    own
                      ? "bg-green-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                <div className={`flex items-center gap-2 px-1 ${own ? "justify-end" : "justify-start"}`}>
                  {msg.createdAt && (
                    <span className="text-[11px] text-gray-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                  {own && (
                    <button
                      type="button"
                      onClick={() => deleteMessage(msg._id)}
                      className="text-gray-400 transition hover:text-red-600"
                      aria-label="Delete message"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition-all focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-500 sm:gap-3 sm:px-4">
          <input
            className="flex-1 bg-transparent text-gray-800 text-sm outline-none placeholder:text-gray-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
          />
          <button
            onClick={sendMessage}
            disabled={!content.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
