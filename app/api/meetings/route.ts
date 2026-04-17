

// import { NextRequest, NextResponse } from "next/server";
// import { ConnectDB } from "@/lib/mongoDBConnection";
// import { MeetingModel } from "@/lib/models/meeting";
// import { GroupModel } from "@/lib/models/group";
// import { UserModel } from "@/lib/models/user";
// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "@/config/config";

// function getTokenFromHeader(req: NextRequest) {
//   const authHeader = req.headers.get("authorization");
//   if (!authHeader) return null;

//   const parts = authHeader.split(" ");
//   if (parts.length !== 2) return null;

//   return parts[1];
// }


// export async function POST(req: NextRequest) {
//   try {
//     await ConnectDB();








//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) {
//       return NextResponse.json({ message: "No token provided" }, { status: 403 });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as any;

//     const user = await UserModel.findById(decoded.id);

//     if (!user || user.role.toLowerCase() !== "faculty") {
//       return NextResponse.json(
//         { message: "Only faculty can create meetings" },
//         { status: 403 }
//       );
//     }














//   //here from frontend things like group name , meeting title and scheduled time.
//     const { title, groupName, scheduledAt } = await req.json();

//     if (!title || !groupName) {
//       return NextResponse.json(
//         { message: "Title and group required" },
//         { status: 400 }
//       );
//     }

//     const group = await GroupModel.findOne({ name: groupName });

//     if (!group) {
//       return NextResponse.json(
//         { message: "Group not found" },
//         { status: 404 }
//       );
//     }


// //checking the scheduled time.************************************
//     const parsedDate = new Date(scheduledAt);
//     if (isNaN(parsedDate.getTime())) {
//       return NextResponse.json(
//         { message: "Invalid scheduled time" },
//         { status: 400 }
//       );
//     }



//     //const { title, groupName, scheduledAt } = await req.json();

// const meeting = await MeetingModel.create({
//   title,
//   groupId: group._id,
//   createdBy: user._id,
//   scheduledAt: parsedDate,
//   status: "scheduled",
//   meetingLink: `https://meet.jit.si/onlycampuss-${Date.now()}`,
// });

//     return NextResponse.json(meeting);

//   } catch (error) {
//     console.error("MEETING ERROR:", error); //  IMPORTANT
//     return NextResponse.json(
//       { message: "Server error--" },
//       { status: 500 }
//     );
//   }
// }



// // import mongoose from "mongoose";

// // export async function GET(req: NextRequest) {
// //   await ConnectDB();

// //   const { searchParams } = new URL(req.url);
// //   const groupId = searchParams.get("groupId");

// //   if (!groupId) {
// //     return NextResponse.json([]);
// //   }

// //   const meetings = await MeetingModel.find({
// //     groupId: new mongoose.Types.ObjectId(groupId),
// //   }).sort({ createdAt: -1 });

// //   return NextResponse.json(meetings);
// // }




// // import { NextRequest, NextResponse } from "next/server";
// // import { ConnectDB } from "@/lib/mongoDBConnection";
// // import { MeetingModel } from "@/lib/models/meeting";
// // import { GroupModel } from "@/lib/models/group";
// // import { UserModel } from "@/lib/models/user";
// // import jwt from "jsonwebtoken";
// // import { JWT_SECRET } from "@/config/config";













// export async function GET(req: NextRequest) {
//   try {
//     await ConnectDB();

//     //  Get token
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) {
//       return NextResponse.json([], { status: 403 });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as any;

//     const user = await UserModel.findById(decoded.id);
//     if (!user) {
//       return NextResponse.json([], { status: 403 });
//     }

//     //  FACULTY → show all meetings they created
//     if (user.role === "faculty") {
//       const meetings = await MeetingModel.find({
//         createdBy: user._id,
//       }).sort({ createdAt: -1 });

//       return NextResponse.json(meetings);
//     }

//     //  STUDENT → show meetings of groups they belong to
//     if (user.role === "student") {
//       const groups = await GroupModel.find({
//         members: user._id,
//       });

//       const groupIds = groups.map((group) => group._id);

//       const meetings = await MeetingModel.find({
//         groupId: { $in: groupIds },
//       }).sort({ createdAt: -1 });

//       return NextResponse.json(meetings);
//     }

//     return NextResponse.json([]);

//   } catch (error) {
//     console.error("GET MEETINGS ERROR:", error);
//     return NextResponse.json([], { status: 500 });
//   }
// }



































import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { MeetingModel } from "@/lib/models/meeting";
import { GroupModel } from "@/lib/models/group";
import { UserModel } from "@/lib/models/user";
import { verifyJwtFromRequest } from "@/lib/getAuth";
import {
  resolveWherebyMeetingDetails,
  serializeMeetingForRole,
} from "@/lib/meetingUrl";
import { sendMeetingScheduledEmails } from "@/lib/mailer";

type GroupMemberContact = {
  name?: string;
  email?: string;
  role?: string;
};

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();








    const decoded = verifyJwtFromRequest(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findById(decoded.id);

    if (!user || user.role.toLowerCase() !== "faculty") {
      return NextResponse.json(
        { message: "Only faculty can create meetings" },
        { status: 403 }
      );
    }














  //here from frontend things like group name , meeting title and scheduled time.
    const { title, groupName, scheduledAt } = await req.json();

    if (!title || !groupName) {
      return NextResponse.json(
        { message: "Title and group required" },
        { status: 400 }
      );
    }

    const group = await GroupModel.findOne({ name: groupName }).populate(
      "members",
      "name email role"
    );

    if (!group) {
      return NextResponse.json(
        { message: "Group not found" },
        { status: 404 }
      );
    }


//checking the scheduled time.************************************
    const parsedDate = new Date(scheduledAt);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid scheduled time" },
        { status: 400 }
      );
    }



    //const { title, groupName, scheduledAt } = await req.json();

    const uniqueSeed = `${Date.now()}-${String(user._id)}`;
    const { roomName, hostLink, participantLink } =
      resolveWherebyMeetingDetails(uniqueSeed);

    const meeting = await MeetingModel.create({
      title,
      groupId: group._id,
      createdBy: user._id,
      scheduledAt: parsedDate,
      status: "scheduled",
      roomName,
      hostLink,
      participantLink,
    });

    const populated = await MeetingModel.findById(meeting._id)
      .populate("groupId", "name")
      .populate("createdBy", "name");

    const groupMembers = Array.isArray(group?.members)
      ? (group.members as GroupMemberContact[])
      : [];

    const studentRecipients = groupMembers
      .filter(
        (member): member is Required<Pick<GroupMemberContact, "email">> &
          GroupMemberContact =>
          member?.role === "student" && typeof member.email === "string"
      )
      .map((member) => ({
        email: member.email,
        name: typeof member.name === "string" ? member.name : "Student",
      }));

    try {
      await sendMeetingScheduledEmails(studentRecipients, {
        facultyName: user.name || "Faculty",
        groupName: group.name,
        meetingTitle: title,
        scheduledAt: parsedDate,
      });
    } catch (mailError) {
      console.error("MEETING EMAIL ERROR:", mailError);
    }

    return NextResponse.json(serializeMeetingForRole(populated, user.role));

  } catch (error) {
    console.error("MEETING ERROR:", error); //  IMPORTANT
    return NextResponse.json(
      { message: "Server error--" },
      { status: 500 }
    );
  }
}



// import mongoose from "mongoose";

// export async function GET(req: NextRequest) {
//   await ConnectDB();

//   const { searchParams } = new URL(req.url);
//   const groupId = searchParams.get("groupId");

//   if (!groupId) {
//     return NextResponse.json([]);
//   }

//   const meetings = await MeetingModel.find({
//     groupId: new mongoose.Types.ObjectId(groupId),
//   }).sort({ createdAt: -1 });

//   return NextResponse.json(meetings);
// }




// import { NextRequest, NextResponse } from "next/server";
// import { ConnectDB } from "@/lib/mongoDBConnection";
// import { MeetingModel } from "@/lib/models/meeting";
// import { GroupModel } from "@/lib/models/group";
// import { UserModel } from "@/lib/models/user";
// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "@/config/config";













export async function GET(req: NextRequest) {
  try {
    await ConnectDB();

    const decoded = verifyJwtFromRequest(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return NextResponse.json([], { status: 403 });
    }

    //  FACULTY → show all meetings they created
    if (user.role === "faculty") {
      const meetings = await MeetingModel.find({
        createdBy: user._id,
      })
        .populate("groupId", "name")
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });

      return NextResponse.json(
        meetings.map((meeting) => serializeMeetingForRole(meeting, user.role))
      );
    }

    if (user.role === "student") {
      const groups = await GroupModel.find({
        members: user._id,
      });

      const groupIds = groups.map((group) => group._id);

      const meetings = await MeetingModel.find({
        groupId: { $in: groupIds },
      })
        .populate("groupId", "name")
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });

      return NextResponse.json(
        meetings.map((meeting) => serializeMeetingForRole(meeting, user.role))
      );
    }

    return NextResponse.json([]);

  } catch (error) {
    console.error("GET MEETINGS ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ConnectDB();

    const decoded = verifyJwtFromRequest(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findById(decoded.id);
    if (!user || user.role !== "faculty") {
      return NextResponse.json(
        { message: "Only faculty can delete meetings" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const meetingId = searchParams.get("meetingId");

    if (!meetingId) {
      return NextResponse.json(
        { message: "Meeting id is required" },
        { status: 400 }
      );
    }

    const meeting = await MeetingModel.findById(meetingId);

    if (!meeting) {
      return NextResponse.json({ message: "Meeting not found" }, { status: 404 });
    }

    if (meeting.createdBy.toString() !== decoded.id) {
      return NextResponse.json({ message: "Not allowed" }, { status: 403 });
    }

    await MeetingModel.findByIdAndDelete(meetingId);

    return NextResponse.json({ message: "Meeting deleted", meetingId });
  } catch (error) {
    console.error("DELETE MEETING ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
