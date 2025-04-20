import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost", "127.0.0.1", "img.clerk.com", "utfs.io"],
  },
};

export default nextConfig;
