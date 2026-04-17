
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { UserModel } from "@/lib/models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config/config";
import { GroupModel } from "@/lib/models/group";
import { AUTH_COOKIE } from "@/lib/getAuth";
import { isInstituteEmail } from "@/utils/validateEmail";

const DEFAULT_ADMIN_EMAIL = "admin@iert.ac.in";
const DEFAULT_ADMIN_PASSWORD = "123456";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    
    if (!JWT_SECRET) {
      return NextResponse.json(
        { message: "Server misconfiguration: JWT_SECRET missing" },
        { status: 500 }
      );
    }

    await ConnectDB(); //first cheez db se connect karna hai.

    const { email, role, password } = await req.json();

    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPassword = password?.trim();

    if (!normalizedEmail || !role || !normalizedPassword) {
      return NextResponse.json(
        { message: "Email, role, and password are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!isInstituteEmail(normalizedEmail)) {
      return NextResponse.json(
        { message: "Use a valid email address" },
        { status: 403 }
      );
    }


    //means admin login kar raha hai...
    const isDefaultAdminLogin =
      normalizedEmail === DEFAULT_ADMIN_EMAIL &&
      normalizedPassword === DEFAULT_ADMIN_PASSWORD &&
      role?.toLowerCase() === "admin";

    let user = await UserModel.findOne({ email: normalizedEmail });

    if (isDefaultAdminLogin && !user) {
      const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
      user = await UserModel.create({
        name: "Admin",
        email: DEFAULT_ADMIN_EMAIL,
        role: "admin",
        department: "Administration",
        year: "",
        isAllowed: true,
        password: passwordHash,
      });
    }

    //agar user mila hi nahi usermodel me matlab email galat hai not provided by the college
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 403 });
    }

    //role selection using slider from frontend.
    if (user.role.toLowerCase() !== role.toLowerCase()) {
      return NextResponse.json(
        { message: "Incorrect role selected." },
        { status: 403 }
      );
    }

    //check is 
    if (!user.isAllowed) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    if (!user.password && user.role === "admin" && isDefaultAdminLogin) {
      user.password = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
      user.isAllowed = true;
      await user.save();
    }

    if (!user.password) {
      return NextResponse.json(
        { message: "Please register first." },
        { status: 400 }
      );
    }

    const passwordValid = await bcrypt.compare(
      normalizedPassword,
      user.password
    );

    if (!passwordValid) {
      return NextResponse.json(
        { message: "Incorrect password. Try again" },
        { status: 403 }
      );
    }



    const token = jwt.sign(
      {
        id: String(user._id),
        role: user.role,
        department: user.department,
        year: user.year,
      },
      JWT_SECRET
    );


    //find is user is already in the group or not...
    const userGroup = await GroupModel.findOne({
      members: user._id,
      type:
        user.role === "faculty"
          ? "faculty"
          : user.role === "student"
          ? "student"
          : null,
    });

    //also in announcement group...
    const announcementGroup = await GroupModel.findOne({
      members: user._id,
      type: "announcement",
    });

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(
      {
        message: "Login Successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          department: user.department,
          year: user.year,
          groupId: userGroup?._id,
          announcementGroupId: announcementGroup?._id || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Error logging in." }, { status: 500 });
  }
}









