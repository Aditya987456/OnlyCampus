import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { JWT_SECRET } from "@/config/config";
import { GroupModel } from "@/lib/models/group";
import mongoose from "mongoose";


//jwtpayload me user ka id, role, deparment, yr yahi sab hoga jo humne use kiya tha during generating token in login...
export type JwtPayload = {
  id: string;
  role: string;
  department?: string;
  year?: string;
};

export const AUTH_COOKIE = "oc_token";

export function getTokenFromRequest(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const t = auth.slice(7).trim();
    if (t) return t;
  }
  return req.cookies.get(AUTH_COOKIE)?.value ?? null;
}

export function verifyJwtFromRequest(req: NextRequest): JwtPayload | null {
  const token = getTokenFromRequest(req);
  if (!token || !JWT_SECRET) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function userIsGroupMember(
  userId: string,
  groupId: string
): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(groupId)) return false;
  let uid: mongoose.Types.ObjectId;
  try {
    uid = new mongoose.Types.ObjectId(userId);
  } catch {
    return false;
  }
  const g = await GroupModel.findOne({
    _id: new mongoose.Types.ObjectId(groupId),
    members: uid,
  }).lean();
  return !!g;
}
