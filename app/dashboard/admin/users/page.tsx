import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { AUTH_COOKIE } from "@/lib/getAuth";
import { JWT_SECRET } from "@/config/config";
import AdminUserForm from "@/components/AdminUserForm";

type SessionPayload = {
  id: string;
  role: string;
};

export default async function AdminUsersPage() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;

  if (!token || !JWT_SECRET) {
    redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionPayload;
    if (decoded.role !== "admin") {
      redirect("/dashboard");
    }
  } catch {
    redirect("/login");
  }

  return <AdminUserForm />;
}
