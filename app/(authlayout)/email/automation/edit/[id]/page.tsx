"use client";

import { CanvasBuilder } from "@/components/email/automation/canvas-builder";
import { useRouter } from "next/navigation";

interface EditPageProps {
  params: { id: string };
}

export default function AutomationEditPage({ params }: EditPageProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-120px)] bg-slate-50 overflow-hidden">
      <CanvasBuilder
        campaignId={params.id}
        onBack={() => router.push("/email/automation")}
      />
    </div>
  );
}
