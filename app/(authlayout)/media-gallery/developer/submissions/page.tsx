import React from "react";
import { SubmissionsQueueTabView } from "@/components/media-gallery/developer/views";

export const metadata = {
  title: "Submissions Review Queue | Media Gallery Developer Hub",
  description: "Inspect, approve, or reject visitor uploads sent from SDK widgets and third-party websites.",
};

export default function MediaGalleryDeveloperSubmissionsPage() {
  return <SubmissionsQueueTabView />;
}
