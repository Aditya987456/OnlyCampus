// import dotenv from 'dotenv'
// dotenv.config()


// export const JWT_SECRET=process.env.NEXT_PUBLIC_JWT_SECRET!;
//   //! means bhai baat mano JWT_SECRET empty nahi hai :)

  
// export const MONGODB_URL=process.env.NEXT_PUBLIC_MONGODB_URL;





import dotenv from "dotenv";
dotenv.config();

/** Prefer server-only JWT_SECRET; NEXT_PUBLIC_* kept for existing .env compatibility. */
export const JWT_SECRET =
  process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || "";

export const MONGODB_URL =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  process.env.NEXT_PUBLIC_MONGODB_URL;