"use client";

import React from "react";
import { Download, History, Ticket, CheckCircle2, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RedemptionsTable } from "@/components/rewards/redemptions/redemptions-table";
import { useGetRedemptions } from "@/graphql/actions/rewards";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

export default function RedemptionsPage() {
  const { data, loading } = useGetRedemptions();
  const redemptions = data?.getRedemptions || [];

  const totalRedemptions = redemptions.length;
  const fulfilledCount = redemptions.filter(
    (r: any) => r.status === "fulfilled" || r.status === "completed"
  ).length;
  const pendingCount = redemptions.filter((r: any) => r.status === "pending").length;
  const successRate = totalRedemptions > 0
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
        description="A complete log of every reward claimed by your community members."
        icon={History}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">
            {totalRedemptions} total records
          </span>
        </div>

        <div className="sm:ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExport}
            disabled={redemptions.length === 0}
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
            >
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border border-border/50", s.bg)}>
                <s.icon className={cn("h-4 w-4", s.color)} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">{s.label}</p>
                <p className="text-xl font-bold text-foreground tabular-nums leading-tight">{s.value}</p>
                <p className="text-[10px] text-muted-foreground/60 truncate">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">All Redemptions</h2>
            {!loading && totalRedemptions > 0 && (
              <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted border border-border">
                Showing {totalRedemptions}
              </span>
            )}
          </div>
          <RedemptionsTable redemptions={redemptions} isLoading={loading} />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
