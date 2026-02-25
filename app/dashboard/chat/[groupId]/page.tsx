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





"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { socket } from "@/lib/socket";

export default function ChatPage() {
  const { groupId } = useParams();

  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState<any>(null);

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

    // setMessages(data);

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




  // Join socket room + listen
  useEffect(() => {
    if (!groupId) return;

    socket.emit("join-group", groupId);

    socket.on("chat-message-received", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("chat-message-received");   //not clear yet---------------???????????????????????????????
    };
  }, [groupId]);


  // Send message
  const sendMessage = async () => {
    if (!content.trim() || !user) return;

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupId,
        senderId: user.id,
        content,
      }),
    });

    const savedMessage = await res.json();

    // Emit via socket
    socket.emit("new-chat-message", savedMessage);

    setContent("");
  };

  return (
    <div
    className="text-black"
     style={{ padding: "20px" }}>
      <h2>Group Chat</h2>

      <div style={{ minHeight: "300px", marginBottom: "10px" }}>
        {messages.map((msg) => (
          <div key={msg._id}>
            <strong>{msg.senderId?.name}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <input
      className="border-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type message..."
      />
      <button className="border-2 " onClick={sendMessage}>Send</button>
    </div>
  );
}