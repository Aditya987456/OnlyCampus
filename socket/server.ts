// // socket/server.ts

// import { createServer } from "http";
// import { Server } from "socket.io";

// const httpServer = createServer();
// const io = new Server(httpServer, {
//   cors: {
//     origin: "*", 
//     methods: ["GET", "POST"]
//   }
// });

// io.on("connection", (socket) => {
//   console.log(" New client connected:", socket.id);

//   // --- ANNOUNCEMENT LOGIC ---
//   socket.on("create-announcement", (announcementData) => {
//     // Broadcast the new announcement to all clients
//     io.emit("announcement-created", announcementData);
//   });

//   // --- MEETING LOGIC ---
//   socket.on("schedule-meeting", (meetingData) => {
//     // Broadcast the new meeting to all clients
//     io.emit("meeting-scheduled", meetingData); 
//   });
  
//   // NEW CHAT LOGIC: Listen for events emitted by the Next.js API route
//   socket.on("new-chat-message", (messageData) => {
//     console.log(` Broadcasting new message for chat ID: ${messageData.recipientId}`);
//     // Broadcast the new message to all clients. 
//     // In a real app, you would use io.to(messageData.recipientId).emit(...) for private delivery.
//     io.emit("chat-message-received", messageData); 
//   });


//   socket.on("disconnect", () => {
//     console.log(" Client disconnected:", socket.id);
//   });
// });

// const PORT = 4000;
// httpServer.listen(PORT, () =>
//   console.log(` Socket.io server running on :${PORT}`)
// );





// socket/server.ts

// import { createServer } from "http";
// import { Server } from "socket.io";

// const httpServer = createServer();

// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   // JOIN GROUP ROOM
//   socket.on("join-group", (groupId) => {
//     socket.join(groupId);
//     console.log(`User joined group: ${groupId}`);
//   });

//   // CHAT MESSAGE (Group Based)
//   socket.on("new-chat-message", (messageData) => {
//     const { groupId } = messageData;

//     console.log(`Broadcasting message to group: ${groupId}`);

//     io.to(groupId).emit("chat-message-received", messageData);
//   });

//   // ANNOUNCEMENT (Optional: Global or Specific Group)
//   socket.on("create-announcement", (announcementData) => {
//     io.to("announcement-group").emit("announcement-created", announcementData);
//   });

//   // MEETING (Group Based)
//   socket.on("schedule-meeting", (meetingData) => {
//     io.to(meetingData.groupId).emit("meeting-scheduled", meetingData);
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// const PORT = 4000;
// httpServer.listen(PORT, () =>
//   console.log(`Socket.io server running on :${PORT}`)
// );


import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("New client connected ----------> :", socket.id);

  // Join group
  socket.on("join-group", (groupId: string) => {
    socket.join(groupId);
  });

  // Send message to group
  socket.on("new-chat-message", (messageData) => {
    io.to(messageData.groupId).emit("chat-message-received", messageData);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

httpServer.listen(4000, () =>
  console.log("Socket server running on http://localhost:4000")
);