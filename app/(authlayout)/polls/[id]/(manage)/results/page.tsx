"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Download,
  BarChart3,
  Users,
  TrendingUp,
  Award,
  Clock,
  Search,
  Copy,
  Check,
  PieChart as PieChartIcon,
  Table as TableIcon,
  Sparkles,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import moment from "moment";
import { toast } from "sonner";
import { getPollResult, getPollByIdForUser } from "@/graphql/actions/polls";
import { useModuleStore } from "@/store/useModuleStore";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";

// Modern, high-contrast chart colors
const PALETTE = [
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#14B8A6", // Teal
];

export default function PollResultsPage() {
  const moduleName = useModuleStore((state) => state.pollModuleName);
  const singularName = useModuleStore((state) => state.pollSingularName);
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [viewMode, setViewMode] = useState<"bars" | "donut" | "table">("bars");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptionFilter, setSelectedOptionFilter] = useState("all");
  const [copied, setCopied] = useState(false);

  const {
    data: pollData,
    loading: pollLoading,
    refetch: refetchPoll,
  } = getPollByIdForUser({
    variables: {
      input: { pollId: id },
    },
    skip: !id,
  });

  const {
    data: resultData,
    loading: resultLoading,
    refetch: refetchResults,
  } = getPollResult({
    variables: {
      input: { pollId: id },
    },
    skip: !id,
  });

  const selectedPoll = pollData?.getPollByIdForUser;
  const pollResult = resultData?.getPollResult;
  const options = useMemo(() => pollResult?.options || [], [pollResult]);
  const individualVotes = useMemo(
    () => pollResult?.individualVotes || [],
    [pollResult]
  );

  const totalVotes = useMemo(() => {
    return options.reduce(
      (acc: number, opt: any) => acc + (opt.votes || 0),
      0
    );
  }, [options]);

  const topOption = useMemo(() => {
    if (!options.length) return null;
    return [...options].sort((a: any, b: any) => (b.votes || 0) - (a.votes || 0))[0];
  }, [options]);

  const topPercent = useMemo(() => {
    if (!totalVotes || !topOption) return 0;
    return Math.round(((topOption.votes || 0) / totalVotes) * 100);
  }, [totalVotes, topOption]);

  const avgVotesPerOption = useMemo(() => {
    if (!options.length || !totalVotes) return 0;
    return (totalVotes / options.length).toFixed(1);
  }, [options, totalVotes]);

  const chartData = useMemo(() => {
    return options.map((opt: any, index: number) => ({
      name: opt.text,
      value: opt.votes || 0,
      color: PALETTE[index % PALETTE.length],
      percentage: totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0,
    }));
  }, [options, totalVotes]);

  // Filtered individual votes for the audit log
  const filteredVotes = useMemo(() => {
    return individualVotes.filter((vote: any) => {
      const voterName = `${vote?.user?.firstName || ""} ${
        vote?.user?.lastName || ""
      }`.toLowerCase();
      const optionText = (vote?.pollOptions?.text || "").toLowerCase();
      const matchesSearch =
        voterName.includes(searchTerm.toLowerCase()) ||
        optionText.includes(searchTerm.toLowerCase());

      const matchesOption =
        selectedOptionFilter === "all" ||
        vote?.pollOptions?.id === selectedOptionFilter ||
        vote?.pollOptions?.text === selectedOptionFilter;

      return matchesSearch && matchesOption;
    });
  }, [individualVotes, searchTerm, selectedOptionFilter]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Results link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    if (!selectedPoll) return;

    const csvRows = [
      [`${singularName} Results Export`],
      ["Title", selectedPoll.title || ""],
      ["Question", selectedPoll.question || ""],
      ["Total Votes", totalVotes.toString()],
      ["Status", selectedPoll.status || ""],
      ["Visibility", selectedPoll.resultVisibility || ""],
      ["Created Date", moment(selectedPoll.createdAt).format("YYYY-MM-DD HH:mm:ss")],
      [],
      ["Option Summary", "Votes Count", "Percentage"],
      ...options.map((opt: any) => [
        `"${opt.text.replace(/"/g, '""')}"`,
        (opt.votes || 0).toString(),
        `${totalVotes > 0 ? (((opt.votes || 0) / totalVotes) * 100).toFixed(2) : 0}%`,
      ]),
      [],
      ["Individual Votes Log", "Voter Name", "Voted Option", "Timestamp"],
      ...individualVotes.map((vote: any) => [
        vote?.votedBy || "USER",
        `"${`${vote?.user?.firstName || ""} ${vote?.user?.lastName || ""}`.trim() || "Anonymous"}"`,
        `"${(vote?.pollOptions?.text || "").replace(/"/g, '""')}"`,
        moment(vote?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${singularName.toLowerCase()}-results-${selectedPoll.id}-${moment().format(
      "YYYY-MM-DD"
    )}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Export downloaded successfully");
  };

  const handleRefresh = async () => {
    toast.promise(Promise.all([refetchPoll(), refetchResults()]), {
      loading: "Refreshing results...",
      success: "Poll results updated",
      error: "Failed to refresh",
    });
  };

  if (pollLoading || resultLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!selectedPoll) {
    return (
      <div className="bg-card border border-border/80 rounded-xl p-12 text-center max-w-lg mx-auto">
        <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-60" />
        <h3 className="text-base font-semibold">{singularName} Not Found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          The requested {singularName.toLowerCase()} could not be loaded or has been removed.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/polls/all")}>
          Back to All {moduleName}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Top Action Bar ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-sm border border-border/70 rounded-xl p-4 shadow-sm">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Analytics & Results
            </span>
            <Badge
              variant={selectedPoll.status === "APPROVED" ? "default" : "secondary"}
              className="px-2 py-0 text-[10px] font-semibold uppercase tracking-wider rounded-md"
            >
              {selectedPoll.status || "Active"}
            </Badge>
            {selectedPoll.resultVisibility && (
              <Badge variant="outline" className="px-2 py-0 text-[10px] font-medium text-muted-foreground">
                Visibility: {selectedPoll.resultVisibility}
              </Badge>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground truncate">
            {selectedPoll.question}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            title="Refresh results"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="h-8 text-xs font-medium gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
            {copied ? "Copied" : "Share"}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleExport}
            className="h-8 text-xs font-medium gap-1.5 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* ─── KPI Metric Cards Strip (Shopify Polaris Metric Tiles) ───────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Votes */}
        <div className="bg-card border border-border/80 rounded-xl p-4 shadow-sm hover:border-border transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-muted-foreground">Total Votes</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center">
              <Users className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {totalVotes.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 truncate">
            {totalVotes > 0 ? "100% participation accounted" : "No votes recorded yet"}
          </p>
        </div>

        {/* Leading Choice */}
        <div className="bg-card border border-border/80 rounded-xl p-4 shadow-sm hover:border-border transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-muted-foreground">Leading Choice</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center">
              <Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2 min-w-0">
            <span className="text-lg font-bold tracking-tight text-foreground truncate" title={topOption?.text}>
              {topOption ? topOption.text : "N/A"}
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            {topOption && totalVotes > 0
              ? `${topPercent}% of total (${topOption.votes || 0} votes)`
              : "Awaiting votes"}
          </p>
        </div>

        {/* Average Vote Velocity */}
        <div className="bg-card border border-border/80 rounded-xl p-4 shadow-sm hover:border-border transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-muted-foreground">Options Distribution</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {options.length}
            </span>
            <span className="text-xs text-muted-foreground">choices</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            ~{avgVotesPerOption} avg votes per choice
          </p>
        </div>

        {/* Timeline & Duration */}
        <div className="bg-card border border-border/80 rounded-xl p-4 shadow-sm hover:border-border transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-muted-foreground">Timeline</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900 flex items-center justify-center">
              <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight text-foreground truncate">
              {selectedPoll.endDate
                ? `Ends ${moment(selectedPoll.endDate).format("MMM D, YYYY")}`
                : "No End Date"}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Created {moment(selectedPoll.createdAt).format("MMM D, YYYY")}
          </p>
        </div>
      </div>

      {/* ─── Main Content Grid: 2/3 Left Content & 1/3 Right Insights ────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* ─── Left Column (2/3) ────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-6">
          {/* Visual Results Card */}
          <div className="bg-card border border-border/80 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between flex-wrap gap-2 bg-muted/20">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Results Breakdown</h3>
                <span className="text-xs text-muted-foreground">({options.length} options)</span>
              </div>

              {/* View Switcher Controls */}
              <div className="flex items-center bg-muted/60 border border-border/80 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode("bars")}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md transition-all",
                    viewMode === "bars"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <BarChart3 className="h-3 w-3" />
                  Bars
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("donut")}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md transition-all",
                    viewMode === "donut"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <PieChartIcon className="h-3 w-3" />
                  Donut
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md transition-all",
                    viewMode === "table"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <TableIcon className="h-3 w-3" />
                  Table
                </button>
              </div>
            </div>

            <div className="p-5">
              {options.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No options configured for this {singularName.toLowerCase()}.
                </div>
              ) : viewMode === "bars" ? (
                <div className="space-y-4">
                  {options.map((opt: any, index: number) => {
                    const votesCount = opt.votes || 0;
                    const percent = totalVotes > 0 ? (votesCount / totalVotes) * 100 : 0;
                    const isLeader = topOption?.id === opt.id && totalVotes > 0;
                    const color = PALETTE[index % PALETTE.length];

                    return (
                      <div
                        key={opt.id || index}
                        className={cn(
                          "group relative p-3 rounded-xl border transition-all duration-200",
                          isLeader
                            ? "border-emerald-500/30 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04]"
                            : "border-border/70 hover:border-border bg-card"
                        )}
                      >
                        {/* Header line */}
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={cn(
                                "flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold shrink-0",
                                isLeader
                                  ? "bg-emerald-500 text-white shadow-sm"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {index + 1}
                            </span>
                            <span
                              className={cn(
                                "text-sm font-medium text-foreground truncate",
                                isLeader && "font-semibold text-emerald-950 dark:text-emerald-300"
                              )}
                            >
                              {opt.text}
                            </span>
                            {isLeader && (
                              <Badge
                                variant="outline"
                                className="px-1.5 py-0 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 gap-1 shrink-0"
                              >
                                <Award className="h-3 w-3" />
                                Leader
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-semibold tabular-nums text-foreground">
                              {votesCount.toLocaleString()}{" "}
                              <span className="text-[11px] font-normal text-muted-foreground">
                                {votesCount === 1 ? "vote" : "votes"}
                              </span>
                            </span>
                            <span
                              className={cn(
                                "text-xs font-bold tabular-nums min-w-[42px] text-right",
                                isLeader ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                              )}
                            >
                              {percent.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar Track */}
                        <div className="relative w-full h-2 rounded-full bg-muted/60 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full rounded-full transition-all"
                            style={{
                              backgroundColor: isLeader ? "#10B981" : color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : viewMode === "donut" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="h-64 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {chartData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any, name: any) => [
                            `${value} votes (${totalVotes > 0 ? Math.round((value / totalVotes) * 100) : 0}%)`,
                            name,
                          ]}
                          contentStyle={{
                            backgroundColor: "var(--background)",
                            borderColor: "var(--border)",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2.5">
                    {chartData.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium text-foreground truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 tabular-nums">
                          <span className="text-muted-foreground">{item.value} votes</span>
                          <span className="font-bold text-foreground w-10 text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-border/70 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead className="text-[11px] font-semibold uppercase">Choice</TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase text-right">Votes</TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase text-right">Share</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {options.map((opt: any, index: number) => {
                        const votesCount = opt.votes || 0;
                        const percent = totalVotes > 0 ? (votesCount / totalVotes) * 100 : 0;
                        return (
                          <TableRow key={opt.id || index}>
                            <TableCell className="font-medium text-xs text-foreground">
                              {opt.text}
                            </TableCell>
                            <TableCell className="text-xs text-right tabular-nums font-semibold">
                              {votesCount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-xs text-right tabular-nums font-bold text-muted-foreground">
                              {percent.toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Bottom Insight Footer */}
              {totalVotes > 0 && topOption && (
                <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>
                      <strong className="text-foreground">{topOption.text}</strong> is leading with{" "}
                      <strong className="text-foreground">{topPercent}%</strong> of all recorded responses.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── Individual Voter Activity Log Table (Shopify Style) ─────── */}
          <div className="bg-card border border-border/80 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Voter Activity Log</h3>
                <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0">
                  {individualVotes.length} Records
                </Badge>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search voter or choice..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 pl-8 pr-3 text-xs w-[180px] sm:w-[200px] bg-background"
                  />
                </div>

                <Select value={selectedOptionFilter} onValueChange={setSelectedOptionFilter}>
                  <SelectTrigger className="h-8 text-xs w-[130px] bg-background">
                    <SelectValue placeholder="All Choices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Choices</SelectItem>
                    {options.map((opt: any) => (
                      <SelectItem key={opt.id} value={opt.id || opt.text}>
                        {opt.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredVotes.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-xs space-y-1">
                <Users className="h-8 w-8 mx-auto opacity-40 mb-2" />
                <p className="font-medium text-foreground">No voter records found</p>
                <p className="text-muted-foreground">
                  {searchTerm || selectedOptionFilter !== "all"
                    ? "Try adjusting your search query or filter."
                    : "Individual votes will appear here once participants cast their ballots."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead className="text-[11px] font-semibold uppercase">Participant</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase">Voted Choice</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase">Type</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase text-right">Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVotes.slice(0, 50).map((vote: any, index: number) => {
                      const voterName = `${vote?.user?.firstName || ""} ${
                        vote?.user?.lastName || ""
                      }`.trim();
                      const voterInitial =
                        vote?.user?.firstName?.charAt(0) ||
                        vote?.user?.lastName?.charAt(0) ||
                        "V";
                      const choiceText = vote?.pollOptions?.text || "Unknown Option";

                      return (
                        <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                          {/* Voter Profile */}
                          <TableCell className="py-2.5">
                            {vote?.user?.id ? (
                              <UserProfileHoverCard user={vote.user}>
                                <div className="flex items-center gap-2.5 group/voter cursor-pointer">
                                  <Avatar className="h-7 w-7 rounded-lg border border-border/60 group-hover/voter:ring-2 group-hover/voter:ring-primary/20 transition-all">
                                    <AvatarImage src={vote?.user?.avatar} />
                                    <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
                                      {voterInitial}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-foreground group-hover/voter:text-primary transition-colors">
                                      {voterName || "Anonymous Voter"}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">
                                      ID: {vote.user.id.slice(0, 8)}...
                                    </span>
                                  </div>
                                </div>
                              </UserProfileHoverCard>
                            ) : (
                              <div className="flex items-center gap-2.5">
                                <Avatar className="h-7 w-7 rounded-lg border border-border/60">
                                  <AvatarImage src={vote?.user?.avatar} />
                                  <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
                                    {voterInitial}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-xs font-semibold text-foreground">
                                    {voterName || "Anonymous Voter"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </TableCell>

                          {/* Choice Selected */}
                          <TableCell className="py-2.5">
                            <Badge
                              variant="outline"
                              className="text-xs font-medium bg-muted/40 border-border/80 text-foreground py-0.5 px-2 max-w-[220px] truncate"
                              title={choiceText}
                            >
                              {choiceText}
                            </Badge>
                          </TableCell>

                          {/* Voter Category */}
                          <TableCell className="py-2.5">
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0 rounded"
                            >
                              {vote?.votedBy || "User"}
                            </Badge>
                          </TableCell>

                          {/* Timestamp */}
                          <TableCell className="py-2.5 text-right tabular-nums text-xs text-muted-foreground">
                            <span title={moment(vote?.createdAt).format("YYYY-MM-DD HH:mm:ss")}>
                              {vote?.createdAt ? moment(vote.createdAt).fromNow() : "Recently"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {filteredVotes.length > 50 && (
                  <div className="p-3 text-center text-xs text-muted-foreground border-t border-border/60 bg-muted/20">
                    Showing first 50 of {filteredVotes.length} records. Export CSV to view complete logs.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Column (1/3 Sidebar Insights & Settings Snapshot) ───── */}
        <div className="space-y-6">
          {/* Quick Insights Card */}
          <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h4 className="text-sm font-semibold text-foreground">Poll Health & Metadata</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Total Options</span>
                <span className="font-semibold text-foreground">{options.length}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Result Visibility</span>
                <span className="font-semibold text-foreground capitalize">
                  {selectedPoll.resultVisibility?.toLowerCase() || "Everyone"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Created Date</span>
                <span className="font-semibold text-foreground">
                  {moment(selectedPoll.createdAt).format("MMM D, YYYY")}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">Expiration</span>
                <span className="font-semibold text-foreground">
                  {selectedPoll.endDate
                    ? moment(selectedPoll.endDate).format("MMM D, YYYY")
                    : "No Expiry"}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs justify-between h-8 text-muted-foreground hover:text-foreground"
                onClick={() => router.push(`/polls/${id}/manage`)}
              >
                <span>Edit {singularName}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs justify-between h-8 text-muted-foreground hover:text-foreground"
                onClick={() => router.push(`/polls/${id}/settings`)}
              >
                <span>Configuration Settings</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-sm font-semibold text-indigo-950 dark:text-indigo-200">
                Outcome Summary
              </h4>
            </div>

            <p className="text-xs text-indigo-900/80 dark:text-indigo-300 leading-relaxed">
              {totalVotes === 0 ? (
                `This ${singularName.toLowerCase()} currently has no cast votes. Once participants submit votes, analysis and percentages will be calculated in real-time.`
              ) : (
                <>
                  With <strong className="text-foreground">{totalVotes}</strong> total votes recorded,{" "}
                  <strong className="text-foreground">{topOption?.text}</strong> commands the plurality with{" "}
                  <strong className="text-foreground">{topPercent}%</strong> of the voting share.
                </>
              )}
            </p>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="w-full h-8 text-xs bg-background/80 hover:bg-background border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 gap-1.5 shadow-none"
              >
                <Download className="h-3.5 w-3.5" />
                Download Report (.CSV)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
