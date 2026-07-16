"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useGetEmailOverview } from "@/graphql/actions/email";
import { UsageHeader } from "./usage/usage-header";
import { UsageStats } from "./usage/usage-stats";
import { UsageChart } from "./usage/usage-chart";
import { ActivityLog, PurchaseHistory } from "./usage/usage-activity";
import { UsageTopupModal } from "./usage/usage-topup-modal";
import { motion } from "framer-motion";

export default function UsageDashboard() {
  const { data, loading } = useGetEmailOverview();
  const [topOpen, setTopOpen] = useState(false);
  const { setShowBuyPlanDialog } = useSubscriptionStore();

  if (loading || !data) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="h-5 w-5 text-muted-foreground animate-spin" />
      </div>
    );
  }

  const { usage } = data.getEmailOverview;
  const daysUntilReset = usage.periodEnd
    ? Math.ceil((new Date(usage.periodEnd).getTime() - Date.now()) / 86400000)
    : 0;

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-in fade-in duration-500">
      <UsageHeader 
        onAddCredits={() => setTopOpen(true)} 
        onManagePlan={() => setShowBuyPlanDialog(true)} 
      />

      <UsageStats 
        emailsSent={usage.emailsSent}
        monthlyQuota={usage.numberOfEmailsPerMonth}
        remaining={usage.remaining}
        daysToReset={daysUntilReset}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UsageChart />
          <ActivityLog />
        </div>
        <div className="space-y-6">
          <PurchaseHistory />
          
          <div className="p-6 rounded-3xl border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-1">
              Need more?
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upgrade your plan to increase your monthly base quota and get better rates on top-ups.
            </p>
            <button 
              onClick={() => setShowBuyPlanDialog(true)}
              className="mt-4 text-xs font-bold text-primary hover:underline"
            >
              Compare Plans
            </button>
          </div>
        </div>
      </div>

      {topOpen && (
        <UsageTopupModal 
          onClose={() => setTopOpen(false)} 
          usage={usage} 
        />
      )}
    </div>
  );
}
