import React from "react";
import { AllowedDomainsTabView } from "@/components/media-gallery/developer/views";

export const metadata = {
  title: "Allowed CORS Domains | Media Gallery Developer Hub",
  description: "Configure origin whitelists for cross-origin browser upload requests and embed security.",
};

export default function MediaGalleryDeveloperDomainsPage() {
  return <AllowedDomainsTabView />;
}
