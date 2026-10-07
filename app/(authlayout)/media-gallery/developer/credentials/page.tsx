import React from "react";
import { ApiCredentialsTabView } from "@/components/media-gallery/developer/views";

export const metadata = {
  title: "API Credentials & Security | Media Gallery Developer Hub",
  description: "Manage client API keys, rate limits, token expiration, and secret regeneration.",
};

export default function MediaGalleryDeveloperCredentialsPage() {
  return <ApiCredentialsTabView />;
}
