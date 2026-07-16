"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CanvasBuilder } from "@/components/email/automation/canvas-builder";

function CanvasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");

  return (
    <CanvasBuilder
      campaignId={campaignId}
      onBack={() => router.push("/email/automation/add")}
    />
  );
}

export default function NewCampaignCanvasPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-muted/50">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
        <CanvasContent />
      </Suspense>
    </div>
  );
}
