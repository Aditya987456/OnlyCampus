
// import { NextRequest, NextResponse } from "next/server";
// import { ConnectDB } from "@/lib/mongoDBConnection";
// import { AnnouncementModel } from "@/lib/models/announcement";
// import { GroupModel } from "@/lib/models/group";
// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "@/config/config";
// import "@/lib/models"; //  registers ALL models at once
// import { UserModel } from "@/lib/models/user";





// // GET — fetch announcements for a specific group
// export async function GET(req: NextRequest) {
//   await ConnectDB();

//   const groupId = req.nextUrl.searchParams.get("groupId");

//   if (!groupId) {
//     return NextResponse.json(
//       { message: "groupId is required" }, 
//       { status: 400 }
//     );
//   }

//   //**************** */ Fetch announcements for this group OR announcements targeting everyone
//   const announcements = await AnnouncementModel.find({
//     $or: [
//       { groupId: groupId },
//       { targetAll: true }
//     ]
//   })
//   .populate("createdBy", "name")  // shows faculty name instead of just ID
//   .sort({ createdAt: -1 })
//   .lean();

//   return NextResponse.json({ announcements });
// }










// // POST — faculty creates announcement
// export async function POST(req: NextRequest) {
//   await ConnectDB();

//   // Verify JWT — only faculty can post
//   const authHeader = req.headers.get("authorization");
//   if (!authHeader) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const token = authHeader.split(" ")[1];
//   let decoded: any;

//   try {
//     decoded = jwt.verify(token, JWT_SECRET);
//   } catch {
//     return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//   }

//   // Only faculty can post announcements
//   if (decoded.role !== "faculty") {
//     return NextResponse.json({ message: "Only faculty can post announcements" }, { status: 403 });
//   }

//   const { title, description, groupId, targetAll } = await req.json();

//   if (!title || !description || !groupId) {
//     return NextResponse.json({ message: "Missing fields" }, { status: 400 });
//   }

//   // Verify the group exists
//   const group = await GroupModel.findById(groupId);
//   if (!group) {
//     return NextResponse.json({ message: "Group not found" }, { status: 404 });
//   }

//   const newAnnouncement = await AnnouncementModel.create({
//     title,
//     description,
//     createdBy: decoded.id,  // from JWT token
//     groupId,
//     targetAll: targetAll || false,
//   });

//   // Populate faculty name before returning
//   const populated = await newAnnouncement.populate("createdBy", "name");

//   return NextResponse.json({ announcement: populated }, { status: 201 });
// }












































import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { AnnouncementModel } from "@/lib/models/announcement";
import { GroupModel } from "@/lib/models/group";
import "@/lib/models";
import mongoose from "mongoose";
import { verifyJwtFromRequest, userIsGroupMember } from "@/lib/getAuth";

/**
 * - targetAll: true → visible to every signed-in user (campus-wide).
 * - Otherwise: visible if announcement.groupId is a group the user belongs to,
 *   OR they authored it (faculty always sees their own class-targeted posts).
 */
export async function GET(req: NextRequest) {
  await ConnectDB();

  const decoded = verifyJwtFromRequest(req);
  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const memberGroups = await GroupModel.find({ members: decoded.id }).select("_id");
  const groupIds = memberGroups.map((g) => g._id);

  const orConditions: object[] = [
    { targetAll: true },
    { createdBy: decoded.id },
  ];
  if (groupIds.length > 0) {
    orConditions.push({ groupId: { $in: groupIds } });
  }

  const announcements = await AnnouncementModel.find({ $or: orConditions })
    .populate("createdBy", "name")
    .populate("groupId", "name type")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ announcements });
}

export async function POST(req: NextRequest) {
  await ConnectDB();

  const decoded = verifyJwtFromRequest(req);
  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (decoded.role !== "faculty") {
    return NextResponse.json(
      { message: "Only faculty can post announcements" },
      { status: 403 }
    );
  }

  const { title, description, groupId, targetAll } = await req.json();

  if (!title || !description || !groupId) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return NextResponse.json({ message: "Invalid group" }, { status: 400 });
  }

  const group = await GroupModel.findById(groupId);
  if (!group) {
    return NextResponse.json({ message: "Group not found" }, { status: 404 });
  }

  const facultyInGroup = await userIsGroupMember(decoded.id, groupId);
  const canTarget =
    facultyInGroup ||
    group.type === "student" ||
    group.type === "announcement";

  if (!canTarget) {
    return NextResponse.json(
      { message: "You cannot post to this group" },
      { status: 403 }
    );
  }

  const newAnnouncement = await AnnouncementModel.create({
    title,
    description,
    createdBy: decoded.id,
    groupId,
    targetAll: Boolean(targetAll),
  });

  const populated = await AnnouncementModel.findById(newAnnouncement._id)
    .populate("createdBy", "name")
    .populate("groupId", "name type");

  return NextResponse.json({ announcement: populated }, { status: 201 });
}


