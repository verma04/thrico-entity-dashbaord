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
  async redirects() {
    return [
      {
        source: "/email",
        destination: "/marketing/email",
        permanent: false,
      },
      {
        source: "/email/:path*",
        destination: "/marketing/email/:path*",
        permanent: false,
      },
      {
        source: "/whatsapp",
        destination: "/marketing/whatsapp",
        permanent: false,
      },
      {
        source: "/whatsapp/:path*",
        destination: "/marketing/whatsapp/:path*",
        permanent: false,
      },
      {
        source: "/settings/integrations/whatsapp",
        destination: "/marketing/whatsapp",
        permanent: false,
      },
      {
        source: "/settings/integrations/whatsapp/:path*",
        destination: "/marketing/whatsapp/:path*",
        permanent: false,
      },
      {
        source: "/settings/marketing/whatsapp",
        destination: "/marketing/whatsapp",
        permanent: false,
      },
      {
        source: "/settings/marketing/whatsapp/:path*",
        destination: "/marketing/whatsapp/:path*",
        permanent: false,
      },
      {
        source: "/settings/marketing/whatssp",
        destination: "/marketing/whatsapp",
        permanent: false,
      },
      {
        source: "/settings/marketing/whatssp/:path*",
        destination: "/marketing/whatsapp/:path*",
        permanent: false,
      },
    ];
  },
};


export default withNextIntl(nextConfig);
