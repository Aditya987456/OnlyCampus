import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { MessageModel } from "@/lib/models/chatMesssage";
import "@/lib/models/user";
import "@/lib/models/group";


import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");

    console.log('group is -------', groupId)

    if (!groupId) {
      return NextResponse.json({ message: "GroupId required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return NextResponse.json({ message: "Invalid GroupId" }, { status: 400 });
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
  await ConnectDB();

  const { groupId, senderId, content } = await req.json();

  if (!groupId || !senderId || !content) {
    return NextResponse.json({ message: "All fields required" }, { status: 400 });
  }

  const message = await MessageModel.create({
    groupId,
    senderId,
    content
  });

  return NextResponse.json(message);
}