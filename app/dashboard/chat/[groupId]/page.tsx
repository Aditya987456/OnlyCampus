// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function ChatPage() {
//   const { groupId } = useParams();

//   const [messages, setMessages] = useState<any[]>([]);
//   const [content, setContent] = useState("");
//   const [user, setUser] = useState<any>(null);

//   // local storage...
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser && storedUser !== "undefined") {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);
  
//   const fetchMessages = async () => {
//     const res = await fetch(`/api/messages?groupId=${groupId}`);
//     const data = await res.json();
//     setMessages(data);
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, [groupId]);

//   const sendMessage = async () => {
//     if (!content.trim() || !user) return;

//     await fetch("/api/messages", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         groupId,
//         senderId: user.id,
//         content,
//       }),
//     });

//     setContent("");
//     fetchMessages();
//   };

//   return (
//     <div>
//       <h2>Chat</h2>

//       <div>
//         {messages.map((msg, index) => (
//           <div key={index}>
//             <strong>{msg.senderId?.name}:</strong> {msg.content}
//           </div>
//         ))}
//       </div>

//       <input
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// }















// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { socket } from "@/lib/socket";

// export default function ChatPage() {
//   const { groupId } = useParams();

//   const [messages, setMessages] = useState<any[]>([]);
//   const [content, setContent] = useState("");
//   const [user, setUser] = useState<any>(null);

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

//     // setMessages(data);

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




//   // Join socket room + listen
//   useEffect(() => {
//     if (!groupId) return;

//     socket.emit("join-group", groupId);

//     socket.on("chat-message-received", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     return () => {
//       socket.off("chat-message-received");   //not clear yet---------------???????????????????????????????
//     };
//   }, [groupId]);


//   // Send message
//   const sendMessage = async () => {
//     if (!content.trim() || !user) return;

//     const res = await fetch("/api/messages", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         groupId,
//         senderId: user.id,
//         content,
//       }),
//     });

//     const savedMessage = await res.json();

//     // Emit via socket
//     socket.emit("new-chat-message", savedMessage);

//     setContent("");
//   };

//   return (
//     <div
//     className="text-white"
//      style={{ padding: "20px" }}>
//       <h2>Group Chat</h2>

//       <div style={{ minHeight: "300px", marginBottom: "10px" }}>
//         {messages.map((msg) => (
//           <div key={msg._id}>
//             <strong>{msg.senderId?.name}:</strong> {msg.content}
//           </div>
//         ))}
//       </div>

//       <input
//       className="border-2"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Type message..."
//       />
//       <button className="border-2 " onClick={sendMessage}>Send</button>
//     </div>
//   );
// }



















"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { socket } from "@/lib/socket";
import { Send, MessageSquare } from "lucide-react";

export default function ChatPage() {
  const { groupId } = useParams();

  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch old messages
  const fetchMessages = async () => {
    const res = await fetch(`/api/messages?groupId=${groupId}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      setMessages(data);
    } else {
      setMessages([]);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchMessages();
    }
  }, [groupId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join socket room + listen
  useEffect(() => {
    if (!groupId) return;
    socket.emit("join-group", groupId);
    socket.on("chat-message-received", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off("chat-message-received");
    };
  }, [groupId]);

  // Send message
  const sendMessage = async () => {
    if (!content.trim() || !user) return;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, senderId: user.id, content }),
    });
    const savedMessage = await res.json();
    socket.emit("new-chat-message", savedMessage);
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isOwnMessage = (msg: any) => msg.senderId?._id === user?.id || msg.senderId?.id === user?.id;

  const getInitial = (name: string) => name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center">
          <MessageSquare size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-800">Group Chat</h2>
          <p className="text-xs text-gray-400">{messages.length} messages</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
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

              <div className={`flex flex-col gap-1 max-w-[65%] ${own ? "items-end" : "items-start"}`}>
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
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-400 transition-all">
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