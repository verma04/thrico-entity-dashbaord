import SeoManager from "@/components/settings/website-admin/seo-manager";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Settings",
  description: "Configure SEO settings, meta tags, and search engine optimization for your website.",
};

const page = () => {
  return <SeoManager />;
};

export default page;
