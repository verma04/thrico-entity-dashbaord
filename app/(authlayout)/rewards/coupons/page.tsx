"use client";

import React from "react";
import { Plus, Ticket, Activity, ShieldCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CouponsTable } from "@/components/rewards/coupons/coupons-table";
import Link from "next/link";
import { useGetRewards } from "@/graphql/actions/rewards";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

export default function CouponsPage() {
  const { data, loading, refetch } = useGetRewards();
  const coupons = data?.getRewards || [];

  const stats = [
    {
      label: "Active Rewards",
      value: coupons.length,
      icon: Ticket,
      accent: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Redemption Rate",
      value: "84%",
      icon: Activity,
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Program Health",
      value: "Optimal",
      icon: ShieldCheck,
      accent: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Reward Catalog"
        badgeText="Coupons"
        description="Manage your active reward coupons and voucher programs."
        icon={Ticket}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              {coupons.length} rewards active
            </span>
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => refetch()}
          >
            <RotateCcw
              className={cn("h-3.5 w-3.5", loading && "animate-spin")}
            />
          </Button>
          <Link href="/rewards/vouchers/coupons/create">
            <Button size="sm" className="gap-2">
              <Plus className="h-3.5 w-3.5" />
              Add Reward
            </Button>
          </Link>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
            >
              <div
                className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${s.bg}`}
              >
                <s.icon className={`h-4 w-4 ${s.accent}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {s.label}
                </p>
                <p className="text-xl font-bold text-foreground tracking-tight">
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">All Rewards</h2>

          <CouponsTable coupons={coupons} isLoading={loading} />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
