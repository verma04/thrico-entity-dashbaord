"use client";

// This component is now split into separate pages:
// - /email/automation        → campaigns list
// - /email/automation/add    → new campaign canvas
// - /email/automation/edit/[id] → edit campaign canvas
//
// This file is kept only for backwards-compatibility with the re-export in
// components/email/automation-campaign-builder.tsx
// The actual routing is handled by the app/(authlayout)/email/automation pages.

import { CampaignsList } from "./campaigns-list";
import { useRouter } from "next/navigation";

export default function AutomationCampaignBuilder() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-120px)] bg-muted/50 overflow-hidden">
      <CampaignsList onCreate={() => router.push("/email/automation/add")} />
    </div>
  );
}
