import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.thrico.network",
      },
    ],
  },
  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
