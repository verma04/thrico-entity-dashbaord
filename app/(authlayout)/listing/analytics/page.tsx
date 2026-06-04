"use client";

import React, { useState, useEffect } from "react";
import { Store, Users, Eye, ThumbsUp, Activity, Zap, ShieldCheck, RotateCcw, TrendingUp, BarChart3, Globe, ArrowRight, Timer, Sparkles, LayoutGrid } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI, EcosystemCard, EcosystemStatusIndicator } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function ListingAnalytics() {
  const [timeRange, setTimeRange] = useState("month");
  
  // Prepare Mock Data
  const kpis = [
    { title: "Total Listings", value: "1,024", trend: 12, icon: Store, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Total Users", value: "256", trend: 8, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Total Views", value: "125.4k", trend: 24, icon: Eye, color: "text-violet-500", bg: "bg-violet-500/10" },
    { title: "Interactions", value: "8.4k", trend: 5, icon: ThumbsUp, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  const trendData = Array.from({ length: 15 }, (_, i) => ({
    name: `D${i+1}`,
    views: Math.floor(Math.random() * 1000) + 500,
    listings: Math.floor(Math.random() * 20) + 10,
  }));

  const categoryData = [
    { name: "Vehicles", value: 45, color: "#6366f1" },
    { name: "Electronics", value: 30, color: "#a78bfa" },
    { name: "Real Estate", value: 15, color: "#10b981" },
    { name: "Other", value: 10, color: "#f59e0b" }
  ];

  return (
    <EcosystemWrapper anonymized-1="listing-analytics">
      <EcosystemHeader
        title="Listing Analytics"
        badgeText="Overview"
        description="Monitor how your community is interacting with listings. Track traffic, engagement, and category distribution."
        icon={Store}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <EcosystemStatusIndicator status="active" label="Syncing live data..." />
              <div className="h-4 w-px bg-muted" />
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">
                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                 <span>Verified Secure</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="h-10 w-[200px] rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm">
                  <Timer className="h-4 w-4 mr-2 text-indigo-500" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border shadow-2xl">
                  <SelectItem value="week" className="font-bold uppercase text-[10px]">Today</SelectItem>
                  <SelectItem value="month" className="font-bold uppercase text-[10px]">Last 30 Days</SelectItem>
                  <SelectItem value="quarter" className="font-bold uppercase text-[10px]">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
              <div className="h-4 w-px bg-muted mx-1" />
              <Button variant="outline" size="icon" className="h-10 w-10 text-muted-foreground hover:text-indigo-600 rounded-xl transition-all shadow-sm bg-card">
                <RotateCcw className="h-4 w-4" />
              </Button>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {kpis.map((kpi, i) => (
             <EcosystemKPI key={i} {...kpi} trendLabel="Last Month" />
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Chart Section */}
           <div className="lg:col-span-8">
              <EcosystemCard 
                title="Traffic Trends" 
                description="Views and activity over time" 
                icon={TrendingUp}
                decorationIcon={Zap}
              >
                 <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} dy={15} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "16px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                          itemStyle={{ color: "#fff", fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                          labelStyle={{ display: 'none' }}
                        />
                        <Bar dataKey="views" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40}>
                           {trendData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#a78bfa'} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
              </EcosystemCard>
           </div>

           {/* Distribution Section */}
           <div className="lg:col-span-4">
              <EcosystemCard 
                title="Category Mix" 
                description="Breakdown by type" 
                icon={Sparkles}
                decorationIcon={LayoutGrid}
                className="min-h-fit"
              >
                 <div className="h-[250px] w-full mb-8 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie
                           data={categoryData}
                           cx="50%"
                           cy="50%"
                           innerRadius={70}
                           outerRadius={100}
                           paddingAngle={8}
                           dataKey="value"
                         >
                           {categoryData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                           ))}
                         </Pie>
                       </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <span className="text-3xl font-black text-foreground tracking-tighter">100%</span>
                       <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none">Total</span>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    {categoryData.map((item, i) => (
                      <div key={i} className="group/item flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border hover:bg-card hover:shadow-lg transition-all duration-300">
                         <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full shadow-lg" style={{ backgroundColor: item.color }} />
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.name}</span>
                         </div>
                         <span className="text-sm font-black text-foreground">{item.value}%</span>
                      </div>
                    ))}
                 </div>
              </EcosystemCard>
           </div>
        </div>

        {/* Master Registry Table */}
        <div className="space-y-8">
           <div className="flex items-center gap-3 px-1">
              <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-white">
                 <LayoutGrid className="h-5 w-5" />
              </div>
              <div>
                 <h2 className="text-xl font-black text-foreground tracking-tight italic uppercase">Top Creators</h2>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] leading-none mt-1">Activity by individual users</p>
              </div>
           </div>

           <div className="p-1 rounded-[3.5rem] bg-muted/50 border border-border shadow-inner overflow-hidden">
              <div className="bg-card rounded-[3.2rem] overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="py-6 px-10 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">User</TableHead>
                      <TableHead className="text-right py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Listings</TableHead>
                      <TableHead className="text-right py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Views</TableHead>
                      <TableHead className="text-right py-6 px-10 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Likes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { username: "john_doe", list: 45, views: "12.5k", likes: 780 },
                      { username: "jane_smith", list: 38, views: "9.8k", likes: 620 },
                      { username: "robert_v", list: 32, views: "8.2k", likes: 540 }
                    ].map((user, i) => (
                      <TableRow key={i} className="hover:bg-muted/50 transition-colors border-slate-50 group">
                         <TableCell className="py-6 px-10">
                            <div className="flex items-center gap-3">
                               <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground font-black text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                  {user.username.charAt(0).toUpperCase()}
                               </div>
                               <span className="font-black text-foreground tracking-tighter uppercase">{user.username}</span>
                            </div>
                         </TableCell>
                         <TableCell className="text-right font-black text-foreground">{user.list}</TableCell>
                         <TableCell className="text-right font-black text-muted-foreground">{user.views}</TableCell>
                         <TableCell className="text-right px-10">
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tighter">{user.likes}</span>
                         </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
           </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withModulePermission(ListingAnalytics, "LISTING", "canRead");
