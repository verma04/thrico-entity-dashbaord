"use client";

import { ModerationDashboard } from "@/components/moderation/moderation-dashboard";
import { ModerationAccess } from "./access";

export default function ModerationPage() {
  return (
    <ModerationAccess>
      <ModerationDashboard />
    </ModerationAccess>
  );
}
