

import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { UserModel } from "@/lib/models/user";
import bcrypt from "bcrypt";
import assignUserToGroup from "@/utils/autoAssignGrp";
import { isInstituteEmail } from "@/utils/validateEmail";

//here we using regex to validate the formate of the email simple .
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();  //first thing connect db.

    const { email, password, name } = await req.json();

    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPassword = password?.trim();

    if (!normalizedEmail || !normalizedPassword || !normalizedName) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

  //before calling db to check firstly we check here is firstly formate is right or not?
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    //now here check in db of the college ki ye collge ka email hai ya nahi?
    if (!isInstituteEmail(normalizedEmail)) {
      return NextResponse.json(
        { message: "Use a valid email address" },
        { status: 403 }
      );
    }


    // Check if email is allowed
    const ClgKaAadmi = await UserModel.findOne({ email:normalizedEmail});

    if (!ClgKaAadmi) {
      return NextResponse.json({ 
         message: "Email not found in college records" },
         { status: 404 });
    }

    //checking is access or not.
    if (!ClgKaAadmi.isAllowed) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    
    // Check if user already exists --> if exist means password will not be null.
    if (ClgKaAadmi.password) {
      return NextResponse.json(
        { message: "Already registered. Please login." },
        { status: 409 }
      );
    }


    // Hashing the password
    const passwordHash = await bcrypt.hash(normalizedPassword, 10);


    //just update the user...
    ClgKaAadmi.password = passwordHash;
    ClgKaAadmi.name = normalizedName;
    await ClgKaAadmi.save();

 

    // **************auto assign grp******************************** yahi kar do...
    if (ClgKaAadmi.role === "student" || ClgKaAadmi.role === "faculty") {
      await assignUserToGroup(ClgKaAadmi);
    }

    return NextResponse.json({ message: "Registered successfully" }, { status: 201 });

  } 
  catch (error: unknown) {

    console.error("Register error:", error);

    if (error && typeof error === "object" && "code" in error && (error as { code?: number }).code === 11000) {
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
