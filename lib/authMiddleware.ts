import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface JwtUser {
  _id: string;
  email: string;
  role: "student" | "faculty";
}

// Verify token & return user payload
export function verifyJWT(req: NextRequest): JwtUser | null {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtUser;
    return decoded;
  } catch {
    return null;
  }
}

// Protect API routes easily
export async function requireAuth(
  req: NextRequest,
  callback: (user: JwtUser) => Promise<NextResponse> | NextResponse
) {
  const user = verifyJWT(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return callback(user);
}
