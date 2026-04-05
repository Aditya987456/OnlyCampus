

// import { NextRequest, NextResponse } from "next/server";
// import { ConnectDB } from "@/lib/mongoDBConnection";
// import "@/lib/models";
// import { GroupModel } from "@/lib/models/group";
// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "@/config/config";

// export async function GET(req: NextRequest) {
//   try {
//     await ConnectDB();

//     // Get userId from token, not URL
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     let decoded: any;

//     try {
//       decoded = jwt.verify(token, JWT_SECRET);
//     } catch {
//       return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//     }

//     const groups = await GroupModel.find({
//       members: decoded.id,
//     }).select("_id name type department year"); //  added department & year

//     return NextResponse.json(groups);

//   } catch (error) {
//     console.error("GET GROUPS ERROR:", error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }














import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { ConnectDB } from "@/lib/mongoDBConnection";
import "@/lib/models";
import { GroupModel } from "@/lib/models/group";
import { verifyJwtFromRequest } from "@/lib/getAuth";

export async function GET(req: NextRequest) {
  try {
    await ConnectDB();

    const decoded = verifyJwtFromRequest(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let memberId: mongoose.Types.ObjectId;
    try {
      memberId = new mongoose.Types.ObjectId(decoded.id);
    } catch {
      return NextResponse.json({ message: "Invalid user" }, { status: 400 });
    }

    const groups = await GroupModel.find({
      members: memberId,
    }).select("_id name type department year");

    return NextResponse.json(groups);
  } catch (error) {
    console.error("GET GROUPS ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}