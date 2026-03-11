import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { GroupModel } from "@/lib/models/group";

export async function GET() {
  await ConnectDB();

  const groups = await GroupModel.find()
    .select("name")
    .sort({ name: 1 });

  return NextResponse.json(groups);
}