import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { MeetingModel } from "@/lib/models/meeting";

export async function POST(req: NextRequest) {
  await ConnectDB();

  const { meetingId } = await req.json();

  const meeting = await MeetingModel.findById(meetingId);

  meeting.status = "live";
  await meeting.save();

  return NextResponse.json(meeting);
}