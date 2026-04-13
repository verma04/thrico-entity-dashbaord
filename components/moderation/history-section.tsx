"use client";

import React, { useState } from "react";
import {
  History,
  Cpu,
  ShieldCheck,
  AlertCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Database,
  ExternalLink,
  User as UserIcon,
  Search,
  Activity,
  FileText,
  BrainCircuit,
  UserCheck,
  Clock,
  Fingerprint,
  Layers,
  Zap,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import { useGetHistory } from "@/graphql/moderation/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import {
  ModerationContentType,
  AiClassification,
  ModerationLog,
} from "@/graphql/moderation/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const LIMIT = 10;

export function HistorySection() {
  const [activeTab, setActiveTab] = useState("moderation");
  const [page, setPage] = useState(0);
  const [selectedLog, setSelectedLog] = useState<ModerationLog | null>(null);
  const [contentType, setContentType] = useState<ModerationContentType | "ALL">(
    "ALL",
  );
  const [aiLabel, setAiLabel] = useState<AiClassification | "ALL">("ALL");

  const { data, loading, error } = useGetHistory({
    limit: LIMIT,
    offset: page * LIMIT,
    contentType: contentType === "ALL" ? undefined : contentType,
    aiLabel: aiLabel === "ALL" ? undefined : aiLabel,
  });

  const moderationItems = data?.getModerationLogs.items || [];
  const tokenItems = data?.getAiTokenUsage.items || [];

  const totalModeration = data?.getModerationLogs.totalCount || 0;
  const totalTokens = data?.getAiTokenUsage.totalCount || 0;

  const currentTotal =
    activeTab === "moderation" ? totalModeration : totalTokens;
  const totalPages = Math.ceil(currentTotal / LIMIT);

  const getLabelBadge = (label: string) => {
    const l = label.toLowerCase();
    if (l === "safe") {
      return (
        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 transition-colors gap-1.5 px-2 font-bold text-[10px] uppercase tracking-tighter">
          <ShieldCheck className="w-3 h-3" />
          CLEAN
        </Badge>
      );
    }
    if (l === "spam") {
      return (
        <Badge className="bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100 transition-colors gap-1.5 px-2 font-bold text-[10px] uppercase tracking-tighter">
          <AlertCircle className="w-3 h-3" />
          SPAM
        </Badge>
      );
    }
    if (l === "offensive" || l === "harassment") {
      return (
        <Badge className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 transition-colors gap-1.5 px-2 font-bold text-[10px] uppercase tracking-tighter">
          <AlertCircle className="w-3 h-3" />
          {l}
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="text-muted-foreground font-bold text-[10px] uppercase tracking-tighter"
      >
        {label}
      </Badge>
    );
  };

  const getDecisionBadge = (decision: string) => {
    const d = decision.toLowerCase();
    if (d === "approved" || d === "allow") {
      return (
        <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold text-[10px] uppercase tracking-tighter">
          APPROVED
        </Badge>
      );
    }
    if (d === "rejected" || d === "block" || d === "flagged") {
      return (
        <Badge className="bg-amber-50 text-amber-600 border-amber-100 font-bold text-[10px] uppercase tracking-tighter">
          FLAGGED
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="font-bold text-[10px] uppercase tracking-tighter"
      >
        {decision}
      </Badge>
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden min-h-[500px] flex flex-col">
      <div className="px-6 py-5 border-b border-border bg-muted/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm">
            <History className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">
              Audit Trail
            </h3>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
              Comprehensive activity and resource logs
            </p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v);
            setPage(0);
          }}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-zinc-100/80 p-1 border border-border rounded-lg h-9">
            <TabsTrigger
              value="moderation"
              className="text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
            >
              System logs
            </TabsTrigger>
            <TabsTrigger
              value="tokens"
              className="text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
            >
              Compute usage
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "moderation" && (
          <div className="flex items-center gap-3 ml-auto md:ml-0">
            <Select
              value={contentType}
              onValueChange={(v) => {
                setContentType(v as ModerationContentType | "ALL");
                setPage(0);
              }}
            >
              <SelectTrigger className="h-9 w-[180px] text-[10px] font-bold uppercase tracking-wider bg-background border-border">
                <div className="flex items-center gap-2">
                  <Search className="h-3 w-3 text-muted-foreground" />
                  <SelectValue placeholder="All Content" />
                </div>
              </SelectTrigger>
              <SelectContent className="border-border shadow-xl rounded-xl">
                <SelectItem
                  value="ALL"
                  className="text-[10px] font-bold uppercase tracking-wider"
                >
                  All Categories
                </SelectItem>
                {[
                  "POST",
                  "COMMENT",
                  "MARKETPLACE",
                  "COMMUNITY",
                  "EVENT",
                  "SHOP",
                  "OFFER",
                  "JOB",
                  "DISCUSSION_FORUM",
                  "DISCUSSION_FORUM_COMMENT",
                  "MESSAGE",
                ].map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="text-[10px] font-bold uppercase tracking-wider"
                  >
                    {type.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={aiLabel}
              onValueChange={(v) => {
                setAiLabel(v as AiClassification | "ALL");
                setPage(0);
              }}
            >
              <SelectTrigger className="h-9 w-[150px] text-[10px] font-bold uppercase tracking-wider bg-background border-border">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3 text-muted-foreground" />
                  <SelectValue placeholder="All Labels" />
                </div>
              </SelectTrigger>
              <SelectContent className="border-border shadow-xl rounded-xl">
                <SelectItem
                  value="ALL"
                  className="text-[10px] font-bold uppercase tracking-wider"
                >
                  All Labels
                </SelectItem>
                {["safe", "spam", "offensive", "harassment"].map((label) => (
                  <SelectItem
                    key={label}
                    value={label}
                    className="text-[10px] font-bold uppercase tracking-wider"
                  >
                    {label.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <div className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border pointer-events-none hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10">
                    Entity
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10">
                    Metric
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10">
                    Status
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10 text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i} className="border-zinc-50">
                    <TableCell className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Skeleton className="h-8 w-8 ml-auto rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12">
            <div className="h-12 w-12 rounded-full bg-card shadow-sm border border-border flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-rose-500" />
            </div>
            <p className="text-sm font-bold text-foreground">
              Failed to load logs
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              {error.message}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 font-bold text-[10px] uppercase tracking-widest"
              onClick={() => window.location.reload()}
            >
              Retry Sync
            </Button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {activeTab === "moderation" ? (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10">
                      Time
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10">
                      Content Type
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10">
                      System Label
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10">
                      Decision
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10">
                      User
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10 text-right">
                      Details
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moderationItems.length > 0 ? (
                    moderationItems.map((log) => (
                      <TableRow
                        key={log.id}
                        className="group hover:bg-zinc-50/80 transition-colors border-zinc-50"
                      >
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-muted-foreground">
                            {formatDistanceToNow(new Date(log.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wide">
                            {log.contentType}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {getLabelBadge(log.aiLabel)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {getDecisionBadge(log.decision)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border border-border shadow-sm transition-transform group-hover:scale-110">
                              <AvatarFallback className="bg-muted text-[8px] font-bold text-muted-foreground uppercase">
                                {log.user.firstName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-semibold text-foreground">
                              {log.user.firstName} {log.user.lastName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            onClick={() => setSelectedLog(log)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground">
                            <Database className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              No activity recorded
                            </p>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
                              Logs will appear here once content is processed
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10">
                      Time
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10">
                      Module
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10">
                      Tokens consumed
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10">
                      Model
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 h-10 text-right">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokenItems.length > 0 ? (
                    tokenItems.map((item, i) => (
                      <TableRow
                        key={i}
                        className="group hover:bg-muted/80 transition-colors border-border"
                      >
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-muted-foreground">
                            {formatDistanceToNow(new Date(item.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded bg-primary text-primary-foreground flex items-center justify-center">
                              <Cpu className="h-3 w-3" />
                            </div>
                            <span className="text-[11px] font-bold text-foreground uppercase tracking-wide">
                              {item.module}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100/50">
                            {item.tokens.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-bold border-border text-muted-foreground bg-muted"
                          >
                            {item.model}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                            <span className="text-[9px] font-bold text-emerald-600 uppercase">
                              SYNCHRONIZED
                            </span>
                            <div className="h-1 w-1 rounded-full bg-emerald-500" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground">
                            <Cpu className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              No compute logs
                            </p>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
                              Resource allocation data is empty
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Total logs tracked:{" "}
          <span className="text-foreground">{currentTotal}</span>
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || loading}
            className="h-8 px-2 text-[10px] font-bold uppercase tracking-widest gap-2 hover:bg-background border border-transparent hover:border-border disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="h-3 w-3" /> Previous
          </Button>
          <div className="flex items-center gap-1 mx-2">
            {[...Array(Math.min(5, totalPages))].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-6 w-6 rounded text-[10px] font-bold transition-all ${
                  page === i
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {i + 1}
              </button>
            ))}
            {totalPages > 5 && (
              <span className="text-border text-[10px] font-bold px-1">
                ...
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || loading}
            className="h-8 px-2 text-[10px] font-bold uppercase tracking-widest gap-2 hover:bg-background border border-transparent hover:border-border disabled:opacity-30 transition-all"
          >
            Next <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Sheet
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <SheetContent className="sm:max-w-xl border-l p-0 overflow-hidden flex flex-col bg-background">
          <SheetHeader className="p-6 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold">
                  Report Summary
                </SheetTitle>
                <SheetDescription className="text-xs">
                  Detailed breakdown of the moderation event #
                  {selectedLog?.id.slice(0, 8)}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {selectedLog && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="p-8 space-y-10 pb-16"
                >
                  {/* Content Preview Section */}
                  <section className="space-y-3">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Flagged Content
                    </Label>

                    <div className="p-4 rounded-lg border bg-muted/30">
                      {selectedLog.contentPreview ? (
                        <p className="text-sm leading-relaxed text-foreground">
                          {selectedLog.contentPreview}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No text preview available for this item.
                        </p>
                      )}
                    </div>
                  </section>

                  {/* Metrics Section */}
                  <section className="space-y-4">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      AI Assessment
                    </Label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border bg-background flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground font-medium">
                          Flag Score
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-2xl font-bold",
                              (selectedLog.aiScore || 0) > 0.8
                                ? "text-destructive"
                                : "text-emerald-600",
                            )}
                          >
                            {selectedLog.aiScore
                              ? (selectedLog.aiScore * 100).toFixed(0)
                              : "0"}
                            %
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-bold"
                          >
                            Confidence
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border bg-background flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground font-medium">
                          Classification
                        </span>
                        <div className="flex items-center gap-2">
                          {getLabelBadge(selectedLog.aiLabel)}
                        </div>
                      </div>
                    </div>

                    {selectedLog.aiCategories && (
                      <div className="p-4 rounded-lg border bg-muted/30 space-y-4">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">
                          Detection Probabilities
                        </span>
                        <div className="grid grid-cols-1 gap-3">
                          {Object.entries(selectedLog.aiCategories).map(
                            ([cat, score]: [string, any]) => (
                              <div key={cat} className="space-y-1.5">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                                  <span className="text-zinc-600">
                                    {cat.replace(/_/g, " ")}
                                  </span>
                                  <span
                                    className={cn(
                                      (score as number) > 0.5
                                        ? "text-destructive"
                                        : "text-muted-foreground",
                                    )}
                                  >
                                    {Math.round((score as number) * 100)}%
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                                  <div
                                    className={cn(
                                      "h-full rounded-full transition-all",
                                      (score as number) > 0.5
                                        ? "bg-destructive"
                                        : "bg-primary",
                                    )}
                                    style={{
                                      width: `${(score as number) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Decision & Action */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-indigo-500" />
                      <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                        Protocol Execution
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-2">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                          Decision
                        </span>
                        <div className="flex items-center gap-2">
                          {getDecisionBadge(selectedLog.decision)}
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-2">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                          Action Applied
                        </span>
                        <span className="text-xs font-bold text-foreground border-l-2 border-indigo-500 pl-2 uppercase italic">
                          {selectedLog.actionTaken}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Subject Details */}
                  <section className="space-y-4">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Author Details
                    </Label>

                    <div className="p-4 rounded-lg border bg-background flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {selectedLog.user.firstName[0]}
                            {selectedLog.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold">
                            {selectedLog.user.firstName}{" "}
                            {selectedLog.user.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            User Account #{selectedLog?.user?.id?.slice(0, 6)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 border-t bg-muted/30 flex items-center justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Log timestamp:{" "}
              {selectedLog && format(new Date(selectedLog.createdAt), "PPP p")}
            </p>
            <Button size="sm" onClick={() => setSelectedLog(null)}>
              Close Report
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
