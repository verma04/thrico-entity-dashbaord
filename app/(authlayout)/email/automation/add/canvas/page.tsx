"use client";

import { useRouter } from "next/navigation";
import { CanvasBuilder } from "@/components/email/automation/canvas-builder";

export default function NewCampaignCanvasPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <CanvasBuilder campaignId={null} onBack={() => router.push("/email/automation/add")} />
    </div>
  );
}
