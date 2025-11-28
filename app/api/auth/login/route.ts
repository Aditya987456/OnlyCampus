import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { AllowedUserModel } from "@/lib/models/allowedUser";
import { UserModel } from "@/lib/models/user";
import bcrypt from "bcrypt";
// import { Jwt } from "jsonwebtoken";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@/config/config";






function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {

    await ConnectDB();  //first thing connect db


//----validate the input
    const { email, role, password } = await req.json();

    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPassword = password?.trim();
    if (!normalizedEmail || !role || !password) {
      return NextResponse.json(
        { message: "Email, role, and password are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }


    //----# i think no need of this because wahi login kar payega jo register hai already 
    // and registered user means valid.

    // const allowed = await AllowedUserModel.findOne({
    //   email: normalizedEmail,
    //   role: normalizedRole,
    //   allowed: true,
    // });

    // if (!allowed) {
    //   return NextResponse.json({ message: "Email not allowed" }, { status: 403 });
    // }


//-----find is user exist or not?
    const userExist=await UserModel.findOne({email})
    if(!userExist){
        return NextResponse.json(
          { message: "Invalid emailId." },
          { status: 403 }
        );
    }



//----if user is there then compare the password with hashing.
    const passwordValid = await bcrypt.compare(password, userExist.passwordHash)
      if(!passwordValid){
          return NextResponse.json(
              { message:'Incorrect password. Try again'},
              { status: 403 }
          )
      }


//-----after all things ok then signin for jwt.
    const token = jwt.sign({ id: userExist._id }, JWT_SECRET);

    return NextResponse.json(
      {
        message: "Signin Successfully...",
        token,
        firstname: userExist.firstname,
      },
      { status: 200 }
    );


  } catch (error) {
    return NextResponse.json(
      { message: "Error in signing in right now." },
      { status: 411 }
    );
  }
}