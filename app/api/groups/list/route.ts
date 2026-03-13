// import { NextResponse } from "next/server";
// import { ConnectDB } from "@/lib/mongoDBConnection";
// import { GroupModel } from "@/lib/models/group";

// export async function GET() {
//   await ConnectDB();

//   const groups = await GroupModel.find()
//     .select("name")
//     .sort({ name: 1 });

//   return NextResponse.json(groups);
// }


















import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { GroupModel } from "@/lib/models/group";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config/config";

export async function GET(req: NextRequest) {
  await ConnectDB();

  //  Only faculty can access this
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

  if (decoded.role !== "faculty") {
    return NextResponse.json({ message: "Only faculty can access this" }, { status: 403 });
  }

  // Only return student groups for the dropdown
  // Faculty doesn't announce to "Faculty Chat" group*******************
  const groups = await GroupModel.find({ type: "student" })
    .select("_id name department year")
    .sort({ name: 1 });

  return NextResponse.json(groups);
}
