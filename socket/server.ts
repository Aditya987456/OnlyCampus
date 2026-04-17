
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { GroupModel } from "../lib/models/group";

const JWT_SECRET =
  process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || "";
const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  process.env.NEXT_PUBLIC_MONGODB_URL ||
  "";

const FRONTEND_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";




  /* Client sends token → server verifies → gets userId */
function verifyToken(token: unknown): { id: string } | null {
  if (!token || typeof token !== "string" || !JWT_SECRET) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    if (!decoded?.id) return null;
    return { id: decoded.id };
  } catch {
    return null;
  }
}




/* Before any DB work → ensure connection exists */
async function ensureDb() {
  if (mongoose.connection.readyState === 1) return;
  if (!MONGODB_URI) {
    throw new Error("MongoDB URI missing (MONGODB_URI or NEXT_PUBLIC_MONGODB_URL)");
  }
  await mongoose.connect(MONGODB_URI);
}

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: [FRONTEND_ORIGIN, "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});








io.use(async (socket, next) => {
  try {

    /* Runs before connection is accepted */
    await ensureDb();
    const token =
      (socket.handshake.auth as { token?: string })?.token ||
      socket.handshake.headers.authorization?.replace(/^Bearer\s+/i, "");
    const user = verifyToken(token);
    if (!user) {
      next(new Error("Unauthorized"));
      return;
    }
    (socket.data as { userId?: string }).userId = user.id;
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});



//A client successfully connects → we have their userId from the token → they can join rooms and emit events
io.on("connection", (socket) => {
  const userId = (socket.data as { userId?: string }).userId;
  console.log("Socket connected:", socket.id, "user", userId);





  socket.on("join-group", async (groupId: string) => {
    if (!groupId || !userId) return;
    const gid = String(groupId).trim();
    if (!mongoose.Types.ObjectId.isValid(gid)) return;
    try {

      await ensureDb();

      let memberId: mongoose.Types.ObjectId;
      try {
        memberId = new mongoose.Types.ObjectId(userId);
      } catch {
        socket.emit("join-error", { groupId: gid, message: "Invalid user" });
        return;
      }
      const ok = await GroupModel.findOne({
        _id: new mongoose.Types.ObjectId(gid),
        members: memberId,
      }).lean();
      if (!ok) {
        socket.emit("join-error", { groupId: gid, message: "Not a member of this group" });
        return;
      }
      socket.join(gid);
    } catch (err) {
      console.error("join-group error:", err);
    }
  });



  /*
    Client sends → "new-chat-message"
              payload = messageData

    Server receives
              ↓
    Broadcast to group
              ↓
    All clients receive
 */


  socket.on("new-chat-message", (messageData: { groupId?: string }) => {
    if (!messageData?.groupId) return;
    io.to(messageData.groupId).emit("chat-message-received", messageData);
  });

  socket.on("delete-chat-message", (payload: { groupId?: string; deletedId?: string }) => {
    if (!payload?.groupId || !payload?.deletedId) return;
    io.to(payload.groupId).emit("chat-message-received", payload);
  });

  

  function meetingRoomId(payload: unknown): string | null {
    if (!payload || typeof payload !== "object") return null;
    const p = payload as Record<string, unknown>;
    if (typeof p.groupId === "string" && p.groupId) return p.groupId;
    const meeting = p.meeting;
    if (meeting && typeof meeting === "object") {
      const m = meeting as Record<string, unknown>;
      const g = m.groupId;
      if (typeof g === "string" && g) return g;
      if (g && typeof g === "object" && g !== null && "_id" in g) {
        return String((g as { _id: unknown })._id);
      }
      if (g != null) return String(g);
    }
    return null;
  }

  socket.on("meeting-created", (payload: unknown) => {
    const room = meetingRoomId(payload);
    if (!room) return;
    const roomKey = String(room);
    io.to(roomKey).emit("meeting-created", payload);
  });

  socket.on("meeting-updated", (payload: unknown) => {
    const room = meetingRoomId(payload);
    if (!room) return;
    const roomKey = String(room);
    io.to(roomKey).emit("meeting-updated", payload);
  });

  socket.on(
    "new-announcement",
    (data: { groupId?: string; announcement?: { targetAll?: boolean } }) => {
      if (!data?.groupId || !data?.announcement) return;
      const roomKey = String(data.groupId).trim();
      if (!mongoose.Types.ObjectId.isValid(roomKey)) return;
      if (data.announcement.targetAll === true) {
        io.emit("announcement-received", data);
        return;
      }
      io.to(roomKey).emit("announcement-received", data);
    }
  );

  socket.on(
    "delete-announcement",
    (data: { groupId?: string; deletedId?: string; targetAll?: boolean }) => {
      if (!data?.deletedId) return;
      if (data.targetAll === true) {
        io.emit("announcement-received", data);
        return;
      }
      if (!data?.groupId) return;
      const roomKey = String(data.groupId).trim();
      if (!mongoose.Types.ObjectId.isValid(roomKey)) return;
      io.to(roomKey).emit("announcement-received", data);
    }
  );

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

const PORT = Number(process.env.SOCKET_PORT || 4000);
httpServer.listen(PORT, () => {
  console.log(`Socket server running on http://localhost:${PORT}`);
});
