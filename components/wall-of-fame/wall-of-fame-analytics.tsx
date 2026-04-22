"use client";

import React from "react";
import {
  useGetWallOfFame,
  useGetWallOfFameCategories,
} from "@/graphql/wall-of-fame";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trophy,
  Users,
  Award,
  FolderTree,
  Activity,
  Zap,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Plus,
  ArrowRight,
  Timer,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemCard,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function WallOfFameAnalytics() {
  const [timeRange, setTimeRange] = React.useState("LAST_7_DAYS");

  const { data, loading, refetch } = useGetWallOfFame({
    input: { limit: 100 }
  });
  
  const { 
    data: categoriesData, 
    loading: categoriesLoading,
    refetch: refetchCategories 
  } = useGetWallOfFameCategories();

  const entries = data?.getWallOfFame || [];
  const categories = categoriesData?.getWallOfFameCategories || [];

  const stats = {
    totalEntries: entries.length,
    activeEntries: entries.length, // Currently no isActive field in GQL, assuming all are active
    totalCategories: categories.length,
    featuredEntries: entries.filter((e: any) => e.isFeatured).length,
  };

  const kpis = [
    {
      title: "Total Inductees",
      value: loading ? "..." : stats.totalEntries.toLocaleString(),
      icon: Users,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
    {
      title: "Registry Legacy",
      value: loading ? "..." : stats.activeEntries.toLocaleString(),
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Featured Nodes",
      value: loading ? "..." : stats.featuredEntries.toLocaleString(),
      icon: Award,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Taxonomy Nodes",
      value: loading ? "..." : stats.totalCategories.toLocaleString(),
      icon: FolderTree,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const distributionData = categories.slice(0, 5).map((cat: any) => ({
    name: cat.title,
    count: entries.filter((e: any) => e.category?.id === cat.id).length,
    color: "#" + Math.floor(Math.random()*16777215).toString(16) // Randomish colors for chart
  }));

  const handleRefetch = async () => {
    await Promise.all([refetch(), refetchCategories()]);
  };

  return (
    <EcosystemWrapper anonymized-1="wall-of-fame-analytics">
      <EcosystemHeader
        title="Wall of Fame Analytics"
        description="Monitor high-performance achievement protocols and architectural legacy expansion across the global registry node."
        badgeText="Distinction Registry"
        icon={Trophy}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">
              Verified Achievement Stream
            </span>
          </div>

          <div className="flex items-center gap-3">
             <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="h-9 w-[180px] rounded-lg border-zinc-200 bg-white text-xs font-semibold shadow-sm text-zinc-600">
                <Timer className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LAST_24_HOURS" className="text-xs">Today</SelectItem>
                <SelectItem value="LAST_7_DAYS" className="text-xs">Last 7 Days</SelectItem>
                <SelectItem value="LAST_30_DAYS" className="text-xs">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
              onClick={handleRefetch}
              disabled={loading || categoriesLoading}
            >
              <RotateCcw
                size={14}
                className={cn((loading || categoriesLoading) && "animate-spin")}
              />
            </Button>
            <Link href="/wall-of-fame/add">
              <Button className="h-9 px-4 rounded-lg bg-slate-900 text-[10px] font-black uppercase tracking-widest gap-2">
                <Plus size={14} />
                Add Entity
              </Button>
            </Link>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Registry Hub" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Recognition Distribution"
              description="Achievement density across various taxonomy nodes"
              icon={Activity}
            >
              <div className="h-[350px] w-full mt-6">
                {loading ? (
                   <div className="h-full w-full flex items-center justify-center bg-zinc-50/50 rounded-2xl border border-zinc-100">
                     <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                   </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData} barGap={8}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: "#a1a1aa" }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: "#a1a1aa" }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#18181b", border: "none", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        itemStyle={{ color: "#fff", fontWeight: 700, fontSize: "11px", textTransform: "uppercase" }}
                        labelStyle={{ display: "none" }}
                        cursor={{ fill: "#f4f4f5", opacity: 0.4 }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={60}>
                         {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#a1a1aa"][index % 5]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </EcosystemCard>
          </div>

          <div className="lg:col-span-4">
            <EcosystemCard
              title="Taxonomy Registry"
              description="System categorization distribution"
              icon={Sparkles}
            >
              <div className="space-y-6 mt-6">
                {categoriesLoading ? (
                  Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-2 w-full rounded-full" />
                      </div>
                    ))
                ) : categories.length > 0 ? (
                  categories.slice(0, 5).map((category: any, i: number) => {
                    const count = entries.filter((e: any) => e.category?.id === category.id).length;
                    const percent = stats.totalEntries > 0 ? Math.round((count / stats.totalEntries) * 100) : 0;
                    const colors = [
                      "bg-zinc-900",
                      "bg-indigo-600",
                      "bg-emerald-500",
                      "bg-amber-500",
                      "bg-zinc-400",
                    ];
                    return (
                      <div key={category.id} className="group/item">
                        <div className="flex items-center justify-between mb-2 px-1">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                            {category.title}
                          </span>
                          <span className="text-[10px] font-black text-zinc-900 leading-none">
                            {percent}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden p-[1px] border border-zinc-200/50">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-1000 ease-out",
                              colors[i % colors.length],
                            )}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10">
                    <p className="text-xs text-zinc-400 italic">
                      No categories found
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100">
                <Link href="/wall-of-fame/categories">
                  <Button
                    variant="ghost"
                    className="w-full text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-indigo-600 gap-2"
                  >
                    Manage Taxonomy <ChevronRight size={12} />
                  </Button>
                </Link>
              </div>
            </EcosystemCard>
          </div>
        </div>

        {/* Recent Inductions */}
        <EcosystemCard
          title="Recent Recognition"
          description="Latest nodes added to the legacy manifest"
          icon={Trophy}
        >
          <div className="mt-4 space-y-1">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))
            ) : entries.length > 0 ? (
              entries.slice(0, 5).map((entry: any) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {entry.user?.user?.avatar ? (
                        <img
                          src={entry.user.user.avatar}
                          className="h-full w-full object-cover"
                          alt=""
                        />
                      ) : (
                        <Trophy size={20} className="text-zinc-200" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-[13px] font-bold text-zinc-900 truncate tracking-tight">
                        {entry.user?.user?.firstName} {entry.user?.user?.lastName}
                      </h5>
                      <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider truncate">
                        {entry.title} • {entry.category?.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end mr-2">
                       <span className="text-[9px] font-bold text-zinc-400 uppercase">Registry Year</span>
                       <span className="text-[10px] font-bold text-indigo-600">{entry.year}</span>
                    </div>
                    <Link href={`/wall-of-fame/all?id=${entry.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-zinc-400 hover:text-indigo-600"
                      >
                        <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-zinc-100 rounded-2xl">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  No records in manifest
                </p>
              </div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-100">
            <Link href="/wall-of-fame/all">
              <Button
                variant="outline"
                className="w-full text-[10px] font-bold uppercase tracking-widest text-zinc-600 h-10 rounded-lg"
              >
                View Full Manifest
              </Button>
            </Link>
          </div>
        </EcosystemCard>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
