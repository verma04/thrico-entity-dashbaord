import React from "react";
import { UploadPolicyTabView } from "@/components/media-gallery/developer/views";

export const metadata = {
  title: "Upload Policy & Daily Quotas | Media Gallery Developer Hub",
  description: "Configure third-party upload rules, file size limits, and destination album routing.",
};

export default function MediaGalleryDeveloperPolicyPage() {
  return <UploadPolicyTabView />;
}
