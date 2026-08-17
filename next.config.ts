import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: "/:path*",
      },
    ];
  },
};


export default withNextIntl(nextConfig);
