import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.thrico.network"],
  },
  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
