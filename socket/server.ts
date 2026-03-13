
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // User joins a group room — all events are scoped to this room
  socket.on("join-group", (groupId) => {
    if (!groupId) return;
    socket.join(groupId);
  });

  // Chat message — only goes to that group's room
  socket.on("new-chat-message", (messageData) => {
    if (!messageData?.groupId) return;
    io.to(messageData.groupId).emit("chat-message-received", messageData);
  });

  // Meeting created — notify only that group
  socket.on("meeting-created", (meetingData) => {
    if (!meetingData?.groupId) return;
    io.to(meetingData.groupId).emit("meeting-created", meetingData);
  });

  // Meeting updated (status change: live/ended) — only that group
  socket.on("meeting-updated", (meetingData) => {
    if (!meetingData?.groupId) return;
    io.to(meetingData.groupId).emit("meeting-updated", meetingData);
  });

  // NEW — Announcement from faculty to specific group
  socket.on("new-announcement", (data) => {
    if (!data?.groupId) return;
    io.to(data.groupId).emit("announcement-received", data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log("Socket server running on http://localhost:4000");
});



// ```

// ---

// **Quick mental model for your socket architecture:**
// ```
// Faculty posts announcement
//         ↓
// socket.emit("new-announcement", { groupId, content })
//         ↓
// Server receives → io.to(groupId).emit("announcement-received")
//         ↓
// Only students in that group's room receive it