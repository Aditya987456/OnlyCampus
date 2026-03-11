











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

  socket.on("join-group", (groupId: string) => {
    if (!groupId) return;
    socket.join(groupId);
  });

  socket.on("new-chat-message", (messageData) => {
    if (!messageData?.groupId) return;

    io.to(messageData.groupId).emit(
      "chat-message-received",
      messageData
    );
  });

  socket.on("meeting-created", (meetingData) => {
    if (!meetingData?.groupId) return;

    socket.on("meeting-updated", (meetingData) => {
  io.emit("meeting-updated", meetingData);
});

    io.to(meetingData.groupId).emit(
      "meeting-created",
      meetingData
    );
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log("Socket server running on http://localhost:4000");
});