import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { UserModel } from "@/lib/models/user";
import bcrypt from "bcrypt";
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



//-----find is user exist or not?
    const ClgKaAadmi = await UserModel.findOne({ email:normalizedEmail});

    if(!ClgKaAadmi){
        return NextResponse.json(
          { message: "User not found." },
          { status: 403 }
        );
    }

    //----checking is access or not..
    if (!ClgKaAadmi.isAllowed) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    //checking is password is null means not registered.
    if (!ClgKaAadmi.isAllowed) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }



//----if user is there then compare the password with hashing.
    const passwordValid = await bcrypt.compare(normalizedPassword, ClgKaAadmi.password)
      if(!passwordValid){
          return NextResponse.json(
              { message:'Incorrect password. Try again'},
              { status: 403 }
          )
      }


//-----after all things ok then signin for jwt.
    // const token = jwt.sign({ id: ClgKaAadmi._id }, JWT_SECRET);

    //storing things in frontend for use in dashboard or auto grp assigning...
    const token = jwt.sign(
      {
        id: ClgKaAadmi._id,
        role: ClgKaAadmi.role,
        department: ClgKaAadmi.department,
        year: ClgKaAadmi.year
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "login Successfully...",
        token,
        //firstname: userExist.firstname,
      },
      { status: 200 }
    );


  } catch (error) {
    return NextResponse.json(
      { message: "Error in logging in right now." },
      { status: 411 }
    );
  }
}