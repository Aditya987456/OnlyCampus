"use strict";
// socket/server.ts
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var httpServer = (0, http_1.createServer)();
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on("connection", function (socket) {
    console.log("🔌 New client connected:", socket.id);
    // --- ANNOUNCEMENT LOGIC ---
    socket.on("create-announcement", function (announcementData) {
        // Broadcast the new announcement to all clients
        io.emit("announcement-created", announcementData);
    });
    // --- MEETING LOGIC ---
    socket.on("schedule-meeting", function (meetingData) {
        // Broadcast the new meeting to all clients
        io.emit("meeting-scheduled", meetingData);
    });
    // 📢 NEW CHAT LOGIC: Listen for events emitted by the Next.js API route
    socket.on("new-chat-message", function (messageData) {
        console.log("\uD83D\uDCAC Broadcasting new message for chat ID: ".concat(messageData.recipientId));
        // Broadcast the new message to all clients. 
        // In a real app, you would use io.to(messageData.recipientId).emit(...) for private delivery.
        io.emit("chat-message-received", messageData);
    });
    socket.on("disconnect", function () {
        console.log("❌ Client disconnected:", socket.id);
    });
});
var PORT = 4000;
httpServer.listen(PORT, function () {
    return console.log("\uD83D\uDE80 Socket.io server running on :".concat(PORT));
});
