import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDBConnection";
import { UserModel } from "@/lib/models/user";
import { verifyJwtFromRequest } from "@/lib/getAuth";
import { isInstituteEmail } from "@/utils/validateEmail";

type CreateRosterUserPayload = {
  name?: string;
  email?: string;
  role?: "student" | "faculty";
  department?: string;
  year?: string;
  isAllowed?: boolean;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();

    const decoded = verifyJwtFromRequest(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await UserModel.findById(decoded.id);
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = (await req.json()) as CreateRosterUserPayload;
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const role = body.role;
    const department = body.department?.trim();
    const year = body.year?.trim();
    const isAllowed = body.isAllowed ?? true;

    if (!name || !email || !role || !department) {
      return NextResponse.json(
        { message: "Name, email, role, and department are required" },
        { status: 400 }
      );
    }

    if (!["student", "faculty"].includes(role)) {
      return NextResponse.json(
        { message: "Admin can add only student or faculty accounts" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email) || !isInstituteEmail(email)) {
      return NextResponse.json(
        { message: "Use a valid email address" },
        { status: 400 }
      );
    }

    if (role === "student" && !year) {
      return NextResponse.json(
        { message: "Year is required for student accounts" },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists in college records" },
        { status: 409 }
      );
    }

    const createdUser = await UserModel.create({
      name,
      email,
      role,
      department,
      year: role === "student" ? year : undefined,
      isAllowed,
      password: null,
    });

    return NextResponse.json(
      {
        message: `${role[0].toUpperCase() + role.slice(1)} added successfully`,
        user: {
          id: createdUser._id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          department: createdUser.department,
          year: createdUser.year ?? null,
          isAllowed: createdUser.isAllowed,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADMIN CREATE USER ERROR:", error);
    return NextResponse.json(
      { message: "Failed to add user" },
      { status: 500 }
    );
  }
}
