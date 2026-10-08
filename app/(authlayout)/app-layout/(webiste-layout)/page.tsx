import type { Metadata } from "next";
import { WebsitePagesManager } from "@/components/website-layout/website-pages-manager";

export const metadata: Metadata = {
  title: "Website Pages | Website Builder",
  description: "Manage your website pages, routing paths, and publishing statuses.",
};

export default function Page() {
  return <WebsitePagesManager />;
}
