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
import { verifyJwtFromRequest, userIsGroupMember } from "@/lib/getAuth";

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
    return NextResponse.json(populated);
  } catch (error) {
    console.error("POST MESSAGE ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
