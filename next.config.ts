import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.thrico.network",
      },
      {
        protocol: "https",
        hostname: "thrico.blr1.digitaloceanspaces.com",
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
