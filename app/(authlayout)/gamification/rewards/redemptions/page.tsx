"use client";

import React from "react";
import {
  Download,
  History,
  Ticket,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";


import { useGetRedemptions } from "@/graphql/actions/rewards";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";
import { RotateCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { RedemptionsTable } from "@/components/rewards/redemptions/redemptions-table";
import { useModuleStore } from "@/store/useModuleStore";

export default function RedemptionsPage() {
  const rewardsModuleName = useModuleStore((state) => state.rewardsModuleName);
  const { data, loading } = useGetRedemptions();
  const redemptions = data?.getRedemptions || [];

  const totalRedemptions = redemptions.length;
  const fulfilledCount = redemptions.filter(
    (r: any) => r.status === "fulfilled" || r.status === "completed",
  ).length;
  const pendingCount = redemptions.filter(
    (r: any) => r.status === "pending",
  ).length;
  const successRate =
    totalRedemptions > 0
      ? Math.round((fulfilledCount / totalRedemptions) * 100)
      : 0;

  const stats = [
    {
      label: "Total Redemptions",
      value: loading ? "—" : totalRedemptions,
      desc: "All time records",
      icon: Ticket,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Fulfilled",
      value: loading ? "—" : fulfilledCount,
      desc: "Successfully delivered",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending",
      value: loading ? "—" : pendingCount,
      desc: "Awaiting fulfillment",
      icon: Clock,
      color: pendingCount > 0 ? "text-amber-600" : "text-slate-500",
      bg: pendingCount > 0 ? "bg-amber-50" : "bg-slate-100",
    },
    {
      label: "Success Rate",
      value: loading ? "—" : `${successRate}%`,
      desc: "Fulfillment efficiency",
      icon: Users,
      color: successRate >= 90 ? "text-emerald-600" : "text-amber-600",
      bg: successRate >= 90 ? "bg-emerald-50" : "bg-amber-50",
    },
  ];

  const handleExport = () => {
    const csv = [
      ["User", "Reward", "Status", "Date"],
      ...redemptions.map((r: any) => [
        `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.trim(),
        r.reward?.title || "",
        r.status || "completed",
        r.claimedAt || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `redemptions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Redemption History"
        badgeText="Reports"
        description={`A complete log of every ${rewardsModuleName.toLowerCase()} claimed by your community members.`}
        icon={Ticket}
        breadcrumbs={[{ label: "Gamification", href: "/gamification" }, { label: "Rewards", href: "/gamification/rewards" }, { label: "Redemptions" }]}
        actions={
          <EcosystemActionBar shadow="none" className="p-0 border-none bg-transparent gap-2">
            <EcosystemActionBar.Group>
              <div className="flex items-center gap-2 px-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                  {totalRedemptions} Live Records
                </span>
              </div>
            </EcosystemActionBar.Group>

            <EcosystemActionBar.Group align="right">
              <EcosystemActionBar.CtaButton onClick={handleExport} disabled={redemptions.length === 0}>
                <Download className="h-3 w-3" />
                Export Dataset
              </EcosystemActionBar.CtaButton>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>
        }
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <EcosystemKPI
                key={i}
                title={s.label}
                value={s.value}
                icon={s.icon}
                color={s.color}
                bg={s.bg}
                trendLabel={s.desc}
              />
            ))}
          </div>

          {/* Table container */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <History className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-foreground uppercase tracking-tight">
                    Active Fulfillment Log
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-medium italic opacity-70">
                    Real-time ledger of reward lifecycle events
                  </p>
                </div>
              </div>

              {!loading && totalRedemptions > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Showing
                  </span>
                  <span className="text-[10px] font-black text-indigo-600 tabular-nums">
                    {totalRedemptions} Node entries
                  </span>
                </div>
              )}
            </div>

            <RedemptionsTable redemptions={redemptions} isLoading={loading} />
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
