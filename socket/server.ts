// socket/server.ts

import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  // --- ANNOUNCEMENT LOGIC ---
  socket.on("create-announcement", (announcementData) => {
    // Broadcast the new announcement to all clients
    io.emit("announcement-created", announcementData);
  });

  // --- MEETING LOGIC ---
  socket.on("schedule-meeting", (meetingData) => {
    // Broadcast the new meeting to all clients
    io.emit("meeting-scheduled", meetingData); 
  });
  
  // 📢 NEW CHAT LOGIC: Listen for events emitted by the Next.js API route
  socket.on("new-chat-message", (messageData) => {
    console.log(`💬 Broadcasting new message for chat ID: ${messageData.recipientId}`);
    // Broadcast the new message to all clients. 
    // In a real app, you would use io.to(messageData.recipientId).emit(...) for private delivery.
    io.emit("chat-message-received", messageData); 
  });


  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = 4000;
httpServer.listen(PORT, () =>
  console.log(`🚀 Socket.io server running on :${PORT}`)
);