import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { AnnouncementModel } from "@/lib/models/announcement";

export async function GET() {
  await ConnectDB();
  const announcements = await AnnouncementModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ announcements });
}

export async function POST(req: NextRequest) {
  await ConnectDB();
  const { title, description, createdBy } = await req.json();

  if (!title || !description || !createdBy) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const newAnnouncement = await AnnouncementModel.create({ title, description, createdBy });

  // ⚠️ DO NOT call io.emit() here
  // After POST, faculty frontend will emit to socket

  return NextResponse.json({ announcement: newAnnouncement });
}
