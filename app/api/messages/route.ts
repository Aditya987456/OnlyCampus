// import { NextRequest, NextResponse } from "next/server";
// import { ConnectDB } from "@/lib/mongoDBConnection";
// import { MessageModel } from "@/lib/models/chatMesssage";
// import "@/lib/models/user";
// import "@/lib/models/group";


// import mongoose from "mongoose";

// export async function GET(req: NextRequest) {
//   try {
//     await ConnectDB();

//     const { searchParams } = new URL(req.url);
//     const groupId = searchParams.get("groupId");

//     console.log('group is -------', groupId)

//     if (!groupId) {
//       return NextResponse.json({ message: "GroupId required" }, { status: 400 });
//     }

//     if (!mongoose.Types.ObjectId.isValid(groupId)) {
//       return NextResponse.json({ message: "Invalid GroupId" }, { status: 400 });
//     }

//     const messages = await MessageModel.find({
//       groupId: new mongoose.Types.ObjectId(groupId),
//     })
//       .sort({ createdAt: 1 })
//       .populate("senderId", "name");

//     return NextResponse.json(messages);

//   } catch (error) {
//     console.error("GET MESSAGE ERROR:", error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }



// export async function POST(req: NextRequest) {
//   await ConnectDB();

//   const { groupId, senderId, content } = await req.json();

//   if (!groupId || !senderId || !content) {
//     return NextResponse.json({ message: "All fields required" }, { status: 400 });
//   }

//   const message = await MessageModel.create({
//     groupId,
//     senderId,
//     content
//   });

//   return NextResponse.json(message);
// }























import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { MessageModel } from "@/lib/models/chatMesssage";
import "@/lib/models/user";
import "@/lib/models/group";
import mongoose from "mongoose";
import { io } from "socket.io-client";
import { verifyJwtFromRequest, userIsGroupMember } from "@/lib/getAuth";

const SOCKET_SERVER_URL =
  process.env.SOCKET_SERVER_URL ||
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  "http://localhost:4000";

function emitChatMessageRealtime(token: string, payload: unknown) {
  try {
    const client = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      auth: { token },
      forceNew: true,
      reconnection: false,
    });

    client.on("connect", () => {
      client.emit("new-chat-message", payload);
      client.disconnect();
    });

    client.on("connect_error", (error) => {
      console.error("CHAT SOCKET EMIT ERROR:", error.message);
      client.disconnect();
    });
  } catch (error) {
    console.error("CHAT SOCKET CLIENT ERROR:", error);
  }
}

export async function GET(req: NextRequest) {
  try {
    await ConnectDB();

    const decoded = verifyJwtFromRequest(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return NextResponse.json({ message: "GroupId required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return NextResponse.json({ message: "Invalid GroupId" }, { status: 400 });
    }

    const allowed = await userIsGroupMember(decoded.id, groupId);
    if (!allowed) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const messages = await MessageModel.find({
      groupId: new mongoose.Types.ObjectId(groupId),
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name");

    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET MESSAGE ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();

    const decoded = verifyJwtFromRequest(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { groupId, content } = await req.json();
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "").trim();

    if (!groupId || !content?.trim()) {
      return NextResponse.json({ message: "Group and message required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return NextResponse.json({ message: "Invalid group" }, { status: 400 });
    }

    const allowed = await userIsGroupMember(decoded.id, groupId);
    if (!allowed) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const message = await MessageModel.create({
      groupId,
      senderId: decoded.id,
      content: content.trim(),
    });

    const populated = await message.populate("senderId", "name");
    if (token) {
      const messageObject =
        typeof populated.toObject === "function" ? populated.toObject() : populated;
      emitChatMessageRealtime(token, {
        ...messageObject,
        groupId: String(groupId),
      });
    }
    return NextResponse.json(populated);
  } catch (error) {
    console.error("POST MESSAGE ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
