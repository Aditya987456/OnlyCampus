import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  //ye bas abhi ke liye hai baad me erase karna hai isse....
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
