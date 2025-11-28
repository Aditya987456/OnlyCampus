
import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { AllowedUserModel } from "@/lib/models/allowedUser";
import { UserModel } from "@/lib/models/user";
import bcrypt from "bcrypt";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


export async function POST(req: NextRequest) {
  try {
    await ConnectDB();    //first thing connect db.

    const { email, role, password,name } = await req.json();


    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPassword = password?.trim();

    // Validate required fields
    if (!normalizedEmail || !role || !normalizedPassword || !normalizedName) {
      return NextResponse.json(
        { message: "Name, email, role, and password are required" },
        { status: 400 }
      );
    }


    //before calling db to check firstly we check here also 
    if (!isValidEmail(normalizedEmail)) {
        return NextResponse.json({ error: "Invalid email formate" }, { status: 400 });
    }

    // Check if email is allowed
    const allowed = await AllowedUserModel.findOne({ email:normalizedEmail, role, allowed: true });
    if (!allowed) {
      return NextResponse.json({ message: "Email not allowed" }, { status: 403 });
    }

    // Check if user already exists
    const existing = await UserModel.findOne({ email:normalizedEmail });
    if (existing) {
      return NextResponse.json({ message: "Already registered" }, { status: 409 });
    }

    // Hashing the password
    const passwordHash = await bcrypt.hash(normalizedPassword, 10);

    // Create new user
    await UserModel.create({
        name :normalizedName,
        email :normalizedEmail,
        role,
        passwordHash });

    return NextResponse.json({ message: "Registered successfully" }, { status: 201 });

  } 
  catch (error: any) {

    console.error("Register error:", error);

    if (error.code === 11000) {
        return NextResponse.json(
            { message: "Username already exists" },
            {status: 409}

        ) }

    return NextResponse.json(
      { message: "Error during registration" },
      { status: 500 }
    );
  }
}
