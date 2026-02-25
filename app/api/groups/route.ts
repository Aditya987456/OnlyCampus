import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import "@/lib/models"; // ensures all models are registered
import { GroupModel } from "@/lib/models/group";

export async function GET(req: NextRequest) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "UserId required" },
        { status: 400 }
      );
    }

    // Find all groups where this user is a member
    const groups = await GroupModel.find({
      members: userId,
    }).select("_id name type");

    return NextResponse.json(groups);

  } catch (error) {
    console.error("GET GROUPS ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}