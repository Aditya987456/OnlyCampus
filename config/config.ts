import dotenv from 'dotenv'
dotenv.config()


export const JWT_SECRET=process.env.NEXT_PUBLIC_JWT_SECRET!;
  //! means bhai baat mano JWT_SECRET empty nahi hai :)

  
export const MONGODB_URL=process.env.NEXT_PUBLIC_MONGODB_URL;