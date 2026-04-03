"use client";

import React from "react";
import {
  Plus,
  Ticket,
  Activity,
  ShieldCheck,
  Zap,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CouponsTable } from "@/components/rewards/coupons/coupons-table";
import Link from "next/link";
import { useGetRewards } from "@/graphql/actions/rewards";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemStatusIndicator } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";

export default function CouponsPage() {
  const { data, loading, refetch } = useGetRewards();
  const coupons = data?.getRewards || [];

  return (
    <EcosystemWrapper anonymized-1="coupons-management">
      <EcosystemHeader
        title="Reward Catalog"
        badgeText="Rewards"
        description="Manage and monitor your rewards program's active coupons and vouchers."
        icon={Ticket}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <EcosystemStatusIndicator
              status="active"
              label="Program Status: Online"
            />
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Verified Reward Node</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 px-4 flex items-center bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 uppercase tracking-widest whitespace-nowrap">
              <Zap className="h-3 w-3 text-indigo-500 fill-current animate-pulse mr-2" />
              {coupons.length} Rewards Active
            </div>
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm bg-white"
              onClick={() => refetch()}
            >
              <RotateCcw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Link href="/rewards/vouchers/coupons/create">
              <Button className="h-10 px-6 rounded-xl bg-slate-900 border-slate-800 font-bold text-[11px] uppercase tracking-widest gap-2 shadow-xl hover:bg-black transition-all active:scale-95 group">
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-500" />
                Add Reward
              </Button>
            </Link>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        {/* Statistics Row (Mini) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              label: "Active Rewards",
              value: coupons.length,
              icon: Ticket,
              color: "text-indigo-500",
              bg: "bg-indigo-500/10",
            },
            {
              label: "Redemption Rate",
              value: "84%",
              icon: Activity,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
            {
              label: "Program Health",
              value: "Optimal",
              icon: ShieldCheck,
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-4xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-between group hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500"
            >
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </span>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </span>
              </div>
              <div
                className={cn(
                  "p-3 rounded-xl transition-all duration-500 group-hover:scale-110 shadow-lg shadow-black/5",
                  stat.bg,
                )}
              >
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </div>
          ))}
        </div>

        {/* Content Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-[1.2rem] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">
                Reward Inventory
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                List of all active and inactive rewards
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-1 rounded-[3.5rem] bg-slate-50 border border-slate-100 shadow-inner min-h-[600px]">
          <CouponsTable coupons={coupons} isLoading={loading} />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
