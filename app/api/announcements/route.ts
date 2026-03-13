// import { NextRequest, NextResponse } from "next/server";
// import { ConnectDB } from "@/lib/mongoDBConnection";
// import { AnnouncementModel } from "@/lib/models/announcement";

// export async function GET() {
//   await ConnectDB();
//   const announcements = await AnnouncementModel.find().sort({ createdAt: -1 }).lean();
//   return NextResponse.json({ announcements });
// }

// export async function POST(req: NextRequest) {
//   await ConnectDB();
//   const { title, description, createdBy } = await req.json();

//   if (!title || !description || !createdBy) {
//     return NextResponse.json({ message: "Missing fields" }, { status: 400 });
//   }

//   const newAnnouncement = await AnnouncementModel.create({ title, description, createdBy });

//   // ⚠️ DO NOT call io.emit() here
//   // After POST, faculty frontend will emit to socket

//   return NextResponse.json({ announcement: newAnnouncement });
// }












































// app/api/announcements/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { AnnouncementModel } from "@/lib/models/announcement";
import { GroupModel } from "@/lib/models/group";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config/config";
import "@/lib/models"; //  registers ALL models at once
import { UserModel } from "@/lib/models/user";

// GET — fetch announcements for a specific group
export async function GET(req: NextRequest) {
  await ConnectDB();

  const groupId = req.nextUrl.searchParams.get("groupId");

  if (!groupId) {
    return NextResponse.json(
      { message: "groupId is required" }, 
      { status: 400 }
    );
  }

  // Fetch announcements for this group OR announcements targeting everyone
  const announcements = await AnnouncementModel.find({
    $or: [
      { groupId: groupId },
      { targetAll: true }
    ]
  })
  .populate("createdBy", "name")  // shows faculty name instead of just ID
  .sort({ createdAt: -1 })
  .lean();

  return NextResponse.json({ announcements });
}


// POST — faculty creates announcement
export async function POST(req: NextRequest) {
  await ConnectDB();

  // Verify JWT — only faculty can post
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  let decoded: any;

  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // Only faculty can post announcements
  if (decoded.role !== "faculty") {
    return NextResponse.json({ message: "Only faculty can post announcements" }, { status: 403 });
  }

  const { title, description, groupId, targetAll } = await req.json();

  if (!title || !description || !groupId) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  // Verify the group exists
  const group = await GroupModel.findById(groupId);
  if (!group) {
    return NextResponse.json({ message: "Group not found" }, { status: 404 });
  }

  const newAnnouncement = await AnnouncementModel.create({
    title,
    description,
    createdBy: decoded.id,  // from JWT token
    groupId,
    targetAll: targetAll || false,
  });

  // Populate faculty name before returning
  const populated = await newAnnouncement.populate("createdBy", "name");

  return NextResponse.json({ announcement: populated }, { status: 201 });
}

