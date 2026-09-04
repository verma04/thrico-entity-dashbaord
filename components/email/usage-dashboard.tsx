"use client";

import React, { useState } from "react";
import { RefreshCw, Plus, Upload, SlidersHorizontal, BarChart3 } from "lucide-react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useGetEmailOverview } from "@/graphql/actions/email";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { UsageStats } from "./usage/usage-stats";
import { UsageChart } from "./usage/usage-chart";
import { ActivityLog, PurchaseHistory } from "./usage/usage-activity";
import { UsageTopupModal } from "./usage/usage-topup-modal";
import { toast } from "sonner";

export default function UsageDashboard() {
  const { data, loading, refetch } = useGetEmailOverview();
  const [topOpen, setTopOpen] = useState(false);
  const { setShowBuyPlanDialog } = useSubscriptionStore();
  const [search, setSearch] = useState("");

  if (loading || !data) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="h-5 w-5 text-muted-foreground animate-spin" />
      </div>
    );
  }

  const { usage } = data.getEmailOverview;
  const daysUntilReset = usage.periodEnd
    ? Math.max(0, Math.ceil((new Date(usage.periodEnd).getTime() - Date.now()) / 86400000))
    : 18;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* ── Action / Control Bar ─────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search usage & activity logs…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          <Button
            variant="outline"
            onClick={() => setShowBuyPlanDialog(true)}
            className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
          >
            Upgrade Plan
          </Button>

          <Button
            onClick={() => setTopOpen(true)}
            className="h-[30px] gap-1.5 shrink-0 bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-[12px] font-semibold px-2.5 rounded-[4px] cursor-pointer hover:bg-[#202020]"
          >
            <Plus className="h-3 w-3" />
            Top Up Credits
          </Button>

          <EcosystemActionBar.Separator />
          <EcosystemActionBar.Status active={true}>
            {usage.remaining.toLocaleString()} Credits Available
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ───────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-0 border-none bg-transparent shadow-none ring-0 space-y-4">
        <UsageStats
          emailsSent={usage.emailsSent}
          monthlyQuota={usage.numberOfEmailsPerMonth}
          remaining={usage.remaining}
          daysToReset={daysUntilReset}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <UsageChart />
            <ActivityLog />
          </div>
          <div className="space-y-4">
            <PurchaseHistory />

            <div className="p-6 rounded-2xl border border-dashed border-border bg-card/60 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                Need Higher Limits?
              </p>
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                Upgrade your organization plan to increase your monthly base quota and get dedicated sending IP pools.
              </p>
              <Button
                size="sm"
                onClick={() => setShowBuyPlanDialog(true)}
                className="mt-4 h-8 text-[11.5px] font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 rounded-[4px]"
              >
                Compare Enterprise Plans
              </Button>
            </div>
          </div>
        </div>

        {topOpen && (
          <UsageTopupModal
            onClose={() => {
              setTopOpen(false);
              refetch();
            }}
            usage={usage}
          />
        )}
      </EcosystemContainer>
    </div>
  );
}
