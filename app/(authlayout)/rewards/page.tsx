"use client";

import React from "react";
import { BarChart3, Flame, Ticket, Package, Plus, ArrowRight, TrendingUp, History, ShieldCheck, Trophy, Activity, Zap, Timer, RotateCcw, Sparkles, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { useGetRewardStats, useGetRedemptions } from "@/graphql/actions/rewards";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI, EcosystemCard, EcosystemStatusIndicator } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";

export default function RewardsDashboard() {
  const { data: statsData, loading: statsLoading, refetch } = useGetRewardStats();
  const { data: redemptionsData, loading: redemptionsLoading } =
    useGetRedemptions({
      pagination: { page: 1, limit: 5 },
    });

  const stats = statsData?.getRewardStats;
  const redemptions = redemptionsData?.getRedemptions || [];

  const kpis = [
    {
      title: "Total Redemptions",
      value: statsLoading ? "..." : (stats?.totalRedemptions || "0"),
      icon: Ticket,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Total TC Distributed",
      value: statsLoading ? "..." : (stats?.totalTcBurned?.toLocaleString() || "0"),
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Low Inventory Items",
      value: statsLoading ? "..." : (stats?.lowInventoryItems || "0"),
      icon: Package,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      trendLabel: "Items"
    },
    {
      title: "Success Rate",
      value: "92.4%",
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  const chartData =
    stats?.redemptionTrend?.map((t: any) => ({
      name: moment(t.date).format("ddd"),
      val: t.value || 0,
    })) || [];

  return (
    <EcosystemWrapper anonymized-1="rewards-dashboard">
      <EcosystemHeader
        title="Rewards Overview"
        badgeText="Reward Program"
        description="Monitor reward redemptions, track inventory levels, and analyze program performance across the platform."
        icon={Trophy}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
               <EcosystemStatusIndicator status="active" label="System: Online" />
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                 <span>Verified Rewards Node</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
               <Link href="/rewards/analytics">
                  <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 font-bold text-[10px] uppercase tracking-wider text-slate-600 gap-3 hover:bg-slate-50 transition-all shadow-sm">
                     <BarChart3 className="h-4 w-4 text-indigo-500" />
                     Detailed Analytics
                  </Button>
               </Link>
              <div className="h-4 w-px bg-slate-200 mx-1" />
              <Button variant="outline" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm bg-white" onClick={() => refetch()}>
                <RotateCcw className={cn("h-4 w-4", statsLoading && "animate-spin")} />
              </Button>
               <Link href="/rewards/vouchers/coupons/create">
                  <Button className="h-10 px-6 rounded-xl bg-slate-900 border-slate-800 font-bold text-[10px] uppercase tracking-wider gap-2 shadow-xl hover:bg-black transition-all active:scale-95 group">
                     <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-500" />
                     Create Reward
                  </Button>
               </Link>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {kpis.map((kpi, i) => (
             <EcosystemKPI key={i} {...kpi} trendLabel={kpi.trendLabel || "Registry"} />
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Chart Section */}
            <div className="lg:col-span-8">
               <EcosystemCard 
                 title="Redemption Trends" 
                 description="Distributions over the last 7 days" 
                 icon={TrendingUp}
                 decorationIcon={Zap}
               >
                 <div className="h-[350px] w-full">
                    {statsLoading ? (
                       <div className="h-full w-full flex items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 transition-all">
                          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                       </div>
                    ) : (
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={chartData} barGap={8}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} dy={15} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} />
                           <Tooltip
                             contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "16px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                             itemStyle={{ color: "#fff", fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}
                             labelStyle={{ display: 'none' }}
                             cursor={{ fill: '#f8fafc' }}
                           />
                           <Bar dataKey="val" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} animationDuration={1500}>
                            {chartData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#f59e0b'} />
                            ))}
                           </Bar>
                         </BarChart>
                       </ResponsiveContainer>
                    )}
                 </div>
              </EcosystemCard>
           </div>

           {/* Live Feed Section */}
            <div className="lg:col-span-4">
               <EcosystemCard 
                 title="Recent Activity" 
                 description="Latest reward redemptions" 
                 icon={Activity}
                 decorationIcon={Sparkles}
                 className="min-h-fit"
               >
                 <div className="space-y-4 pt-4">
                    {redemptionsLoading ? (
                      [1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm animate-pulse">
                          <Skeleton className="h-10 w-10 rounded-xl" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-2 w-32" />
                          </div>
                        </div>
                      ))
                    ) : redemptions.length > 0 ? (
                      redemptions.map((act: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md hover:translate-x-1 group/item">
                          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">
                            {act.user?.firstName?.charAt(0)}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate uppercase tracking-tight">
                              {act.user?.firstName} {act.user?.lastName}
                            </p>
                            <p className="text-[10px] font-semibold text-slate-400 truncate uppercase tracking-tight">
                              {act.reward?.title}
                            </p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-bold text-indigo-500 whitespace-nowrap">
                              {moment(act.claimedAt).fromNow(true)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center space-y-4">
                        <div className="h-16 w-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto opacity-50">
                          <History className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No activity</p>
                      </div>
                    )}
                 </div>

                 <div className="mt-8 pt-8 border-t border-slate-50">
                     <Link href="/rewards/vouchers/redemptions">
                        <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 font-bold text-[10px] uppercase tracking-wider text-slate-600 gap-3 hover:bg-slate-50 transition-all shadow-sm">
                           View History
                           <ArrowRight className="h-4 w-4" />
                        </Button>
                     </Link>
                 </div>
              </EcosystemCard>
           </div>
        </div>

        {/* Governance Shortcuts */}
        <div className="space-y-8">
            <div className="flex items-center gap-3 px-1">
               <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                  <LayoutGrid className="h-5 w-5" />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Quick Actions</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Manage rewards, inventory, and audit logs</p>
               </div>
            </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                { title: "Manage Coupons", desc: "Configuration and reward logic", icon: Ticket, link: "/rewards/vouchers/coupons", color: "text-blue-600", bg: "bg-blue-50" },
                { title: "Inventory Audit", desc: "Verify and restock voucher pools", icon: Package, link: "/rewards/vouchers/inventory", color: "text-emerald-600", bg: "bg-emerald-50" },
                { title: "Audit Ledger", desc: "Full history of redemptions", icon: History, link: "/rewards/vouchers/redemptions", color: "text-indigo-600", bg: "bg-indigo-50" },
                { title: "Fraud Protocol", desc: "Monitor and prevent reward abuse", icon: ShieldCheck, link: "/rewards/fraud", color: "text-rose-600", bg: "bg-rose-50" }
              ].map((item, i) => (
                <Link key={i} href={item.link}>
                  <div className="p-8 rounded-4xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 relative overflow-hidden">
                    <div className={cn("inline-flex p-4 rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110", item.bg)}>
                       <item.icon className={cn("h-6 w-6", item.color)} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase mb-2">{item.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{item.desc}</p>
                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Node</span>
                       <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </Link>
              ))}
           </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
