
import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
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

    
    // ###Create new user --> no need here kyuki hamare pass already email ye sab hai like user created hain in our college database.
    // await UserModel.create({
    //     name :normalizedName,
    //     email :normalizedEmail,
    //     role,
    //     password:passwordHash 
    //   });

    //just update the user...
    ClgKaAadmi.password = passwordHash;
    ClgKaAadmi.name = normalizedName;
    await ClgKaAadmi.save();



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
