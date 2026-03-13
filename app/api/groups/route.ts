

import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import "@/lib/models";
import { GroupModel } from "@/lib/models/group";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config/config";

export async function GET(req: NextRequest) {
  try {
    await ConnectDB();

    // Get userId from token, not URL
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

    const groups = await GroupModel.find({
      members: decoded.id,
    }).select("_id name type department year"); //  added department & year

    return NextResponse.json(groups);

  } catch (error) {
    console.error("GET GROUPS ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}