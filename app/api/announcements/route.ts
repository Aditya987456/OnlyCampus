
import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { AnnouncementModel } from "@/lib/models/announcement";
import { GroupModel } from "@/lib/models/group";
import { UserModel } from "@/lib/models/user";
import "@/lib/models";
import mongoose from "mongoose";
import { verifyJwtFromRequest, userIsGroupMember } from "@/lib/getAuth";
import { sendAnnouncementEmails } from "@/lib/mailer";

type AnnouncementAttachment = {
  name?: string;
  url?: string;
  mimeType?: string;
};

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

  const author = await UserModel.findById(decoded.id).select("name").lean();

  const { title, description, groupId, targetAll, attachments } = await req.json();

  if (!title || !description || !groupId) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return NextResponse.json({ message: "Invalid group" }, { status: 400 });
  }

  const group = await GroupModel.findById(groupId).populate(
    "members",
    "name email role isAllowed"
  );
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

  const normalizedAttachments = Array.isArray(attachments)
    ? (attachments as AnnouncementAttachment[])
        .filter(
          (
            attachment
          ): attachment is Required<AnnouncementAttachment> =>
            typeof attachment?.name === "string" &&
            attachment.name.trim().length > 0 &&
            typeof attachment?.url === "string" &&
            attachment.url.trim().length > 0 &&
            typeof attachment?.mimeType === "string" &&
            attachment.mimeType.trim().length > 0
        )
        .slice(0, 4)
        .map((attachment) => ({
          name: attachment.name.trim(),
          url: attachment.url.trim(),
          mimeType: attachment.mimeType.trim(),
        }))
    : [];

  const newAnnouncement = await AnnouncementModel.create({
    title,
    description,
    createdBy: decoded.id,
    groupId,
    targetAll: Boolean(targetAll),
    attachments: normalizedAttachments,
  });

  const populated = await AnnouncementModel.findById(newAnnouncement._id)
    .populate("createdBy", "name")
    .populate("groupId", "name type");

  const recipients = Boolean(targetAll)
    ? await UserModel.find({
        isAllowed: true,
        email: { $exists: true, $ne: "" },
      })
        .select("name email")
        .lean()
    : Array.isArray(group.members)
    ? group.members.filter(
        (
          member:any
        ): member is {
          name?: string;
          email?: string;
          role?: string;
          isAllowed?: boolean;
        } =>
          typeof member === "object" &&
          member !== null &&
          member.role === "student" &&
          member.isAllowed !== false &&
          typeof member.email === "string"
      )
    : [];

  try {
    await sendAnnouncementEmails(
      recipients.map((recipient:any) => ({
        email: String(recipient.email),
        name: recipient.name ?? "User",
      })),
      {
        facultyName: author?.name || "Faculty",
        groupName: group.name,
        title,
        description,
        targetAll: Boolean(targetAll),
        attachmentCount: normalizedAttachments.length,
      }
    );
  } catch (mailError) {
    console.error("ANNOUNCEMENT EMAIL ERROR:", mailError);
  }

  return NextResponse.json({ announcement: populated }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  await ConnectDB();

  const decoded = verifyJwtFromRequest(req);
  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const announcementId = searchParams.get("announcementId");

  if (!announcementId || !mongoose.Types.ObjectId.isValid(announcementId)) {
    return NextResponse.json({ message: "Invalid announcement" }, { status: 400 });
  }

  const announcement = await AnnouncementModel.findById(announcementId);
  if (!announcement) {
    return NextResponse.json({ message: "Announcement not found" }, { status: 404 });
  }

  if (String(announcement.createdBy) !== decoded.id) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  await AnnouncementModel.findByIdAndDelete(announcementId);

  return NextResponse.json({ message: "Announcement deleted", announcementId });
}
