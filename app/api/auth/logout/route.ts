import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/getAuth";

export async function POST() {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
  return NextResponse.json({ message: "Logged out" });
}
