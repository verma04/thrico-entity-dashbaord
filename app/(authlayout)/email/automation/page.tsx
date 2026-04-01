"use client";

import { CampaignsList } from "@/components/email/automation/campaigns-list";
import { useRouter } from "next/navigation";

export default function AutomationPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-120px)] bg-slate-50 overflow-hidden">
      <CampaignsList onCreate={() => router.push("/email/automation/add")} />
    </div>
  );
}
