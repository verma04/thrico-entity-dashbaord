import FooterManager from "@/components/settings/website-admin/footer-manager";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Footer Settings",
  description: "Customize your website footer, including links, social media, and contact information.",
};

const page = () => {
  return <FooterManager />;
};

export default page;
