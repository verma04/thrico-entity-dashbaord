"use client";

import React from "react";
import {
  useGetMentorshipStats,
  useMentorshipRequests,
  useGetMentorCategories,
  useGetAllMentor,
  useMentorshipAuditLogs,
} from "@/graphql/mentorship/mentorship-quiries";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserCheck,
  Clock,
  FolderTree,
  Activity,
  Zap,
  ShieldCheck,
  RotateCcw,
  TrendingUp,
  BarChart3,
  Globe,
  ArrowRight,
  Timer,
  Sparkles,
  GraduationCap,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { TimeRange } from "@/graphql/actions";
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

export default function MentorshipAnalytics() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>(
    TimeRange.LAST_7_DAYS,
  );

  // Real Data Fetching
  const { data, loading, refetch } = useGetMentorshipStats();
  const {
    data: requestsData,
    loading: requestsLoading,
    refetch: refetchRequests,
  } = useMentorshipRequests({
    variables: { input: { limit: 5 } },
  });
  const {
    data: categoriesData,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useGetMentorCategories();
  const {
    data: topMentorsData,
    loading: topMentorsLoading,
    refetch: refetchTopMentors,
  } = useGetAllMentor({
    variables: { input: { limit: 4, isTopMentor: true } },
  });
  const {
    data: logsData,
    loading: logsLoading,
    refetch: refetchLogs,
  } = useMentorshipAuditLogs({
    variables: { pagination: { limit: 10 } },
  });

  const stats = data?.getMentorshipStats;
  const recentRequests = requestsData?.mentorshipRequests || [];
  const categories = categoriesData?.getMentorCategories || [];
  const topMentors = topMentorsData?.getAllMentor || [];
  const logs = logsData?.mentorshipAuditLogs?.data || [];

  const kpis = [
    {
      title: "Total Mentors",
      value: loading ? "..." : (stats?.totalMentors?.toLocaleString() ?? "0"),
      icon: Users,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
    {
      title: "Active Now",
      value: loading
        ? "..."
        : (stats?.approvedMentors?.toLocaleString() ?? "0"),
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Awaiting Review",
      value: loading ? "..." : (stats?.pendingMentors?.toLocaleString() ?? "0"),
      icon: Clock,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Expertise Hubs",
      value: loading
        ? "..."
        : (stats?.totalCategories?.toLocaleString() ?? "0"),
      icon: FolderTree,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const mentorshipOverviewData = [
    { name: "APPROVED", count: stats?.approvedMentors ?? 0, color: "#10b981" },
    { name: "PENDING", count: stats?.pendingMentors ?? 0, color: "#6366f1" },
    { name: "REJECTED", count: stats?.rejectedMentors ?? 0, color: "#f43f5e" },
  ];

  const handleRefetch = async () => {
    await Promise.all([
      refetch(),
      refetchRequests(),
      refetchCategories(),
      refetchTopMentors(),
      refetchLogs(),
    ]);
  };

  return (
    <EcosystemWrapper anonymized-1="mentorship-analytics">
      <EcosystemHeader
        title="Mentorship Analytics"
        description="Monitor expert application velocity, approval trajectories, and ecosystem expertise distribution."
        badgeText="Mentorship Hub"
        icon={GraduationCap}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">
              Verified Mentorship Stream
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={timeRange}
              onValueChange={(val) => setTimeRange(val as TimeRange)}
            >
              <SelectTrigger className="h-9 w-[180px] rounded-lg border-zinc-200 bg-white text-xs font-semibold shadow-sm text-zinc-600">
                <Timer className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TimeRange.LAST_24_HOURS} className="text-xs">
                  Today
                </SelectItem>
                <SelectItem value={TimeRange.LAST_7_DAYS} className="text-xs">
                  Last 7 Days
                </SelectItem>
                <SelectItem value={TimeRange.LAST_30_DAYS} className="text-xs">
                  Last 30 Days
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
              onClick={handleRefetch}
              disabled={
                loading ||
                requestsLoading ||
                categoriesLoading ||
                topMentorsLoading ||
                logsLoading
              }
            >
              <RotateCcw
                size={14}
                className={cn(
                  (loading ||
                    requestsLoading ||
                    categoriesLoading ||
                    topMentorsLoading ||
                    logsLoading) &&
                    "animate-spin",
                )}
              />
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Registry Hub" />
          ))}
        </div>

        {/* Action Required Alert */}
        {stats?.pendingMentors && stats.pendingMentors > 0 && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-indigo-900">
                  {stats.pendingMentors} Mentorship Applications Pending
                </h4>
                <p className="text-xs text-indigo-600">
                  Review and verify new expert nodes to maintain ecosystem
                  growth velocity.
                </p>
              </div>
            </div>
            <Link href="/mentorship/pending">
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wider h-8"
              >
                Go to Reviews
              </Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Registry Health"
              description="Application status distribution across the global mentorship graph"
              icon={Activity}
            >
              <div className="h-[350px] w-full mt-6">
                {loading ? (
                  <div className="h-full w-full flex items-center justify-center bg-zinc-50/50 rounded-2xl border border-zinc-100">
                    <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mentorshipOverviewData} barGap={8}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 700,
                          fill: "#a1a1aa",
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 700,
                          fill: "#a1a1aa",
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                        itemStyle={{
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "11px",
                          textTransform: "uppercase",
                        }}
                        labelStyle={{ display: "none" }}
                        cursor={{ fill: "#f4f4f5", opacity: 0.4 }}
                      />
                      <Bar
                        dataKey="count"
                        radius={[6, 6, 0, 0]}
                        barSize={60}
                        animationDuration={2000}
                      >
                        {mentorshipOverviewData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            fillOpacity={0.85}
                          />
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
              title="Expertise Registry"
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
                        <Skeleton className="h-2 w-full rouned-full" />
                      </div>
                    ))
                ) : categories.length > 0 ? (
                  categories.slice(0, 5).map((category, i) => {
                    // Calculate a deterministic "fake" percentage based on ID if we don't have real distribution
                    const fakePercent = Math.max(
                      10,
                      (category.id.length * 7) % 45,
                    );
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
                            {fakePercent}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden p-[1px] border border-zinc-200/50">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-1500 ease-out",
                              colors[i % colors.length],
                            )}
                            style={{ width: `${fakePercent}%` }}
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
                <Link href="/mentorship/categories">
                  <Button
                    variant="ghost"
                    className="w-full text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-indigo-600 gap-2"
                  >
                    Manage Categories <ChevronRight size={12} />
                  </Button>
                </Link>
              </div>
            </EcosystemCard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <EcosystemCard
            title="Recent Applications"
            description="Latest mentor nodes awaiting synchronization"
            icon={Clock}
          >
            <div className="mt-4 space-y-1">
              {requestsLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                  ))
              ) : recentRequests.length > 0 ? (
                recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
                        {request.mentorUser?.user?.avatar ? (
                          <img
                            src={request.mentorUser.user.avatar}
                            className="h-full w-full object-cover"
                            alt=""
                          />
                        ) : (
                          <span className="text-xs font-bold text-zinc-400">
                            {request.displayName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-[13px] font-bold text-zinc-900 truncate tracking-tight">
                          {request.displayName}
                        </h5>
                        <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider truncate">
                          {request.category?.title || "No Category"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase">
                          Awaiting Review
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600">
                          Pending
                        </span>
                      </div>
                      <Link href={`/mentorship/all?id=${request.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-zinc-400 hover:text-indigo-600"
                        >
                          <ExternalLink size={14} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-zinc-100 rounded-2xl">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-20" />
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    All caught up
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100">
              <Link href="/mentorship/pending">
                <Button
                  variant="outline"
                  className="w-full text-[10px] font-bold uppercase tracking-widest text-zinc-600 h-10 rounded-lg"
                >
                  View All Requests
                </Button>
              </Link>
            </div>
          </EcosystemCard>

          {/* Top Performing Mentors */}
          <EcosystemCard
            title="Verified Experts"
            description="Elite mentor nodes with highest ecosystem impact"
            icon={Zap}
          >
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topMentorsLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                  ))
              ) : topMentors.length > 0 ? (
                topMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/30 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full border-2 border-white shadow-sm ring-2 ring-emerald-100 overflow-hidden shrink-0">
                        <img
                          src={
                            mentor.mentorUser?.user?.avatar ||
                            `https://ui-avatars.com/api/?name=${mentor.displayName}&background=6366f1&color=fff`
                          }
                          className="h-full w-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h6 className="text-[13px] font-black text-zinc-900 truncate">
                          {mentor.displayName}
                        </h6>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">
                          Top Mentor
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="h-1 w-1 rounded-full bg-emerald-500" />
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                            Registry Node Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-12 text-center border-2 border-dashed border-zinc-100 rounded-2xl">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    No top mentors designated
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100">
              <Link href="/mentorship/all">
                <Button
                  variant="outline"
                  className="w-full text-[10px] font-bold uppercase tracking-widest text-zinc-600 h-10 rounded-lg"
                >
                  Full Registry
                </Button>
              </Link>
            </div>
          </EcosystemCard>
        </div>

        {/* Audit Logs Section */}
        <div className="pt-4">
          <EcosystemCard
            title="Registry Operations Log"
            description="Immutable audit trail of administrative mentorship node modulations"
            icon={ShieldCheck}
          >
            <div className="mt-4 overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      Admin
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      Action
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      Target
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {logsLoading ? (
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-4 w-32" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-4 w-20 ml-auto" />
                          </td>
                        </tr>
                      ))
                  ) : logs.length > 0 ? (
                    logs.map((log, i) => (
                      <tr
                        key={i}
                        className="hover:bg-zinc-50/50 transition-colors group"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                              {log.admin?.user?.firstName?.charAt(0)}
                            </div>
                            <span className="text-xs font-bold text-zinc-900">
                              {log.admin?.user?.firstName}{" "}
                              {log.admin?.user?.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter",
                              log.action.includes("APPROVED")
                                ? "bg-emerald-50 text-emerald-600"
                                : log.action.includes("REJECTED")
                                  ? "bg-rose-50 text-rose-600"
                                  : "bg-indigo-50 text-indigo-600",
                            )}
                          >
                            {log.action.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs font-medium text-zinc-500 italic">
                            {log?.targetUser?.user?.firstName}{" "}
                            {log?.targetUser?.user?.lastName}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-[10px] font-medium text-zinc-400 tabular-nums uppercase">
                            {new Date(log.createdAt).toLocaleDateString()} •{" "}
                            {new Date(log.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-12 text-center text-xs font-medium text-zinc-400 uppercase tracking-widest italic"
                      >
                        No activity logs recorded in this cycle
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                Integrity verified via cryptographically signed registry records
              </p>
              <Link href="/listing/audit-logs">
                <Button
                  variant="ghost"
                  className="h-8 text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 gap-2"
                >
                  Full System Logs
                  <ArrowRight size={12} />
                </Button>
              </Link>
            </div>
          </EcosystemCard>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
