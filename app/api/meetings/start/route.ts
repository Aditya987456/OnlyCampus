import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { MeetingModel } from "@/lib/models/meeting";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config/config";

export async function POST(req: NextRequest) {
  await ConnectDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET) as any;

  const { meetingId } = await req.json();

  const meeting = await MeetingModel.findById(meetingId);

  if (!meeting) {
    return NextResponse.json({ message: "Meeting not found" }, { status: 404 });
  }

  if (meeting.createdBy.toString() !== decoded.id) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  meeting.status = "live";
  await meeting.save();

  return NextResponse.json(meeting);
}