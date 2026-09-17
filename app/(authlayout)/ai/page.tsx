"use client";

import React, { useState } from "react";
import { Sparkles, RotateCcw, Plus, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import AIDashboard from "@/components/ai/ai-dashboard";
import { AICopilotModal } from "@/components/ai/ai-copilot-modal";
import { cn } from "@/lib/utils";

export default function AIPage() {
  const router = useRouter();
  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    window.dispatchEvent(new CustomEvent("refresh-ai-dashboard"));
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title="AI Agent & Intelligence Hub"
        description="Full-spectrum multi-agent orchestration, token telemetry, Copilot workflows, and compute health"
        icon={Sparkles}
        badgeText="AI Hub"
        breadcrumbs={[{ label: "AI", href: "/ai" }, { label: "Overview" }]}
        actions={
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RotateCcw
                size={14}
                className={cn(isRefreshing && "animate-spin")}
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCopilot(true)}
              className="h-9 rounded-lg text-xs gap-1.5 font-medium border-border"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              New Conversation
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/ai/agents")}
              className="h-9 rounded-lg gap-2 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Agent
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        <AIDashboard dateRange={dateRange} timeRange={timeRange} />

        <AICopilotModal
          open={showCopilot}
          onOpenChange={setShowCopilot}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
