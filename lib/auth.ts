// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "@/config/config";
// import { UserModel } from "@/lib/models/user";

// export async function getUserFromToken(req: any) {
//   const authHeader = req.headers.get("authorization");

//   if (!authHeader) {
//     console.log("No Authorization header");
//     return null;
//   }

//   const token = authHeader.split(" ")[1];

//   if (!token) {
//     console.log("Token missing in header");
//     return null;
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as any;

//     const user = await UserModel.findById(decoded.id);

//     return user;
//   } catch (error) {
//     console.log("JWT Error:", error);
//     return null;
//   }
// }

















// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "@/config/config";
// import { UserModel } from "@/lib/models/user";

// export async function getUserFromToken(req: any) {
//   // Use req.headers directly (important)
//   const authHeader =
//     req.headers.get("Authorization") ||
//     req.headers.get("authorization");

//   console.log("AUTH HEADER RAW:", authHeader);

//   if (!authHeader) return null;

//   const parts = authHeader.split(" ");
//   if (parts.length !== 2) return null;

//   const token = parts[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as any;
//     console.log("DECODED:", decoded);

//     const user = await UserModel.findById(decoded.id);
//     return user;
//   } catch (error) {
//     console.log("JWT ERROR:", error);
//     return null;
//   }
// }












import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config/config";
import { UserModel } from "@/lib/models/user";

export async function getUserFromToken(req: { headers: Headers }) {
  const authHeader =
    req.headers.get("Authorization") || req.headers.get("authorization");
  const token =
    authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

  if (!token || !JWT_SECRET) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return await UserModel.findById(decoded.id);
  } catch {
    return null;
  }
}
