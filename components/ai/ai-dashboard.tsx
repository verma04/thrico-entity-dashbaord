"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetAiWalletOverview,
  useGetMyActiveAdapter,
} from "@/graphql/actions/ai";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import {
  AINorthStar,
  AIPipelineNav,
  AIHealthTelemetry,
  AIQuotaCapacity,
  AIPerformanceActivity,
  AIAgentsDirectory,
  AIConnectorsHealth,
  AILaunchpad,
} from "./kpi-dashboard";
import { AICopilotModal } from "./ai-copilot-modal";
import { AITopupModal } from "./ai-topup-modal";

interface AIDashboardProps {
  dateRange?: any;
  timeRange?: string;
}

export default function AIDashboard({ dateRange, timeRange }: AIDashboardProps) {
  const [activeSection, setActiveSection] = useState("health");
  const [showCopilotModal, setShowCopilotModal] = useState(false);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState("");
  const [showTopupModal, setShowTopupModal] = useState(false);
  const { setShowBuyPlanDialog } = useSubscriptionStore();

  const {
    data: walletData,
    loading: walletLoading,
    refetch: refetchWallet,
  } = useGetAiWalletOverview();

  const {
    data: adapterData,
    loading: adapterLoading,
    refetch: refetchAdapter,
  } = useGetMyActiveAdapter();

  // Listen to refresh events from page header
  useEffect(() => {
    const handleRefreshEvent = () => {
      refetchWallet();
      refetchAdapter();
    };
    window.addEventListener("refresh-ai-dashboard", handleRefreshEvent);
    return () => {
      window.removeEventListener("refresh-ai-dashboard", handleRefreshEvent);
    };
  }, [refetchWallet, refetchAdapter]);

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = document.getElementById(`kpi-section-${key}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleOpenCopilot = (prompt?: string) => {
    if (prompt) setCopilotInitialPrompt(prompt);
    setShowCopilotModal(true);
  };

  const quota = walletData?.getAiWalletOverview?.quota || {
    entityId: "",
    balance: 0,
    usedThisMonth: 0,
    totalUsed: 0,
    usagePercent: 0,
  };

  const usagePercent = quota.usagePercent ?? 0;
  const loading = walletLoading || adapterLoading;
  const totalInvocations = quota.totalUsed || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Quota / Limit Warning Banner */}
      {usagePercent >= 85 && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="text-xs font-semibold">
              Token Quota Warning: You have consumed {Math.round(usagePercent)}% of your monthly AI compute allowance.
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => setShowTopupModal(true)}
            className="h-7 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-[4px]"
          >
            Add Credits
          </Button>
        </div>
      )}

      {/* North Star Hero Metric */}
      <AINorthStar
        loading={loading}
        totalInvocations={totalInvocations}
        monthlyQuota={1000000}
        usagePercent={usagePercent}
      />

      {/* KPI Pipeline Navigation */}
      <AIPipelineNav
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      {/* 1. Health & Telemetry */}
      <AIHealthTelemetry
        loading={loading}
        totalInvocations={totalInvocations}
      />

      {/* 2. Token Quota Capacity */}
      <AIQuotaCapacity
        loading={loading}
        quota={quota}
        onAddCredits={() => setShowTopupModal(true)}
        onManagePlan={() => setShowBuyPlanDialog(true)}
      />

      {/* 3. Performance & Workload Distribution */}
      <AIPerformanceActivity loading={loading} />

      {/* 4. Super Agents Directory */}
      <AIAgentsDirectory
        loading={loading}
        onOpenCopilot={handleOpenCopilot}
      />

      {/* 5. Infrastructure & Connectors */}
      <AIConnectorsHealth
        loading={loading}
        adapter={adapterData?.getMyActiveAdapter}
      />

      {/* 6. Quick Launchpad */}
      <AILaunchpad
        onOpenCopilot={handleOpenCopilot}
        onOpenTopup={() => setShowTopupModal(true)}
      />

      {/* Interactive Copilot Modal */}
      <AICopilotModal
        open={showCopilotModal}
        onOpenChange={setShowCopilotModal}
        initialPrompt={copilotInitialPrompt}
      />

      {/* Top-up Credits Modal */}
      {showTopupModal && (
        <AITopupModal
          onClose={() => setShowTopupModal(false)}
          quota={quota}
        />
      )}
    </div>
  );
}
