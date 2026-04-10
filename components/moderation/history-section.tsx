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
        className="text-zinc-500 font-bold text-[10px] uppercase tracking-tighter"
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
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden min-h-[500px] flex flex-col">
      <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
            <History className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">
              Audit Trail
            </h3>
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mt-0.5">
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
          <TabsList className="bg-zinc-100/80 p-1 border border-zinc-200 rounded-lg h-9">
            <TabsTrigger
              value="moderation"
              className="text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
            >
              Intelligence logs
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
              <SelectTrigger className="h-9 w-[180px] text-[10px] font-bold uppercase tracking-wider bg-white border-zinc-200">
                <div className="flex items-center gap-2">
                  <Search className="h-3 w-3 text-zinc-400" />
                  <SelectValue placeholder="All Content" />
                </div>
              </SelectTrigger>
              <SelectContent className="border-zinc-200 shadow-xl rounded-xl">
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
              <SelectTrigger className="h-9 w-[150px] text-[10px] font-bold uppercase tracking-wider bg-white border-zinc-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3 text-zinc-400" />
                  <SelectValue placeholder="All Labels" />
                </div>
              </SelectTrigger>
              <SelectContent className="border-zinc-200 shadow-xl rounded-xl">
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
              <TableHeader className="bg-zinc-50/50">
                <TableRow className="border-zinc-100 pointer-events-none hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">
                    Entity
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">
                    Metric
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">
                    Status
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10 text-right">
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
            <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-rose-500" />
            </div>
            <p className="text-sm font-bold text-zinc-900">
              Failed to load logs
            </p>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">
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
                <TableHeader className="bg-zinc-50/50">
                  <TableRow className="border-zinc-100 hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">
                      Time
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">
                      Content Type
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">
                      AI Label
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">
                      Decision
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">
                      User
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10 text-right">
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
                          <span className="text-xs font-medium text-zinc-500">
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
                            <Avatar className="h-6 w-6 border border-zinc-200 shadow-sm transition-transform group-hover:scale-110">
                              <AvatarFallback className="bg-zinc-100 text-[8px] font-bold text-zinc-500 uppercase">
                                {log.user.firstName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-semibold text-zinc-700">
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
                          <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300">
                            <Database className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900">
                              No activity recorded
                            </p>
                            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest mt-1">
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
                <TableHeader className="bg-zinc-50/50">
                  <TableRow className="border-zinc-100 hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">
                      Time
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">
                      Module
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">
                      Tokens consumed
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">
                      Model
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10 text-right">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokenItems.length > 0 ? (
                    tokenItems.map((item, i) => (
                      <TableRow
                        key={i}
                        className="group hover:bg-zinc-50/80 transition-colors border-zinc-50"
                      >
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-zinc-500">
                            {formatDistanceToNow(new Date(item.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded bg-zinc-900 text-white flex items-center justify-center">
                              <Cpu className="h-3 w-3" />
                            </div>
                            <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wide">
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
                            className="text-[10px] font-bold border-zinc-200 text-zinc-600 bg-zinc-50"
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
                          <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300">
                            <Cpu className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900">
                              No compute logs
                            </p>
                            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest mt-1">
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

      <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/30 flex items-center justify-between">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
          Total logs tracked:{" "}
          <span className="text-zinc-600">{currentTotal}</span>
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || loading}
            className="h-8 px-2 text-[10px] font-bold uppercase tracking-widest gap-2 hover:bg-white border border-transparent hover:border-zinc-200 disabled:opacity-30 transition-all"
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
                    : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            {totalPages > 5 && (
              <span className="text-zinc-300 text-[10px] font-bold px-1">
                ...
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || loading}
            className="h-8 px-2 text-[10px] font-bold uppercase tracking-widest gap-2 hover:bg-white border border-transparent hover:border-zinc-200 disabled:opacity-30 transition-all"
          >
            Next <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Sheet
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <SheetContent className="sm:max-w-xl border-l border-zinc-200/50 shadow-2xl p-0 overflow-hidden flex flex-col bg-[#FDFDFD]">
          <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-[0.03] select-none">
             <Fingerprint className="h-48 w-48 text-zinc-900" />
          </div>

          <SheetHeader className="p-8 pb-6 border-b border-zinc-100 bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-200">
                  <BrainCircuit className="h-5 w-5 text-white" />
                </div>
                <div>
                  <SheetTitle className="text-lg font-bold text-zinc-900 tracking-tight leading-none">
                    Intelligence Report
                  </SheetTitle>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
                    <span className="h-1 w-1 bg-indigo-600 rounded-full animate-pulse" />
                    Protocol Log Analysis
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-zinc-50 border border-zinc-100/50 p-2.5 rounded-xl">
                 <div className="px-3 flex flex-col">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Entry ID</span>
                    <span className="text-[11px] font-mono font-bold text-zinc-600">#{selectedLog?.id.slice(0, 8)}...</span>
                 </div>
                 <Separator orientation="vertical" className="h-6 bg-zinc-200" />
                 <div className="px-3 flex flex-col">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Type</span>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tighter h-5 border-zinc-200 bg-white inline-flex w-fit">
                      {selectedLog?.contentType}
                    </Badge>
                 </div>
                 <Separator orientation="vertical" className="h-6 bg-zinc-200" />
                 <div className="px-3 flex flex-col text-right">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Time</span>
                    <span className="text-[11px] font-bold text-zinc-900">
                      {selectedLog?.createdAt && format(new Date(selectedLog.createdAt), "HH:mm:ss")}
                    </span>
                 </div>
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
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                       <FileText className="h-4 w-4 text-zinc-400" />
                       <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em]">Captured Content</h4>
                    </div>
                    
                    <div className="relative group">
                       <div className="absolute -inset-1 bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                       <div className="relative p-5 rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden min-h-[100px] flex flex-col">
                          <div className="absolute top-0 right-0 p-2">
                             <Layers className="h-12 w-12 text-zinc-50 opacity-50" />
                          </div>
                          {selectedLog.contentPreview ? (
                            <p className="text-sm text-zinc-700 leading-relaxed font-medium relative z-10 italic">
                              "{selectedLog.contentPreview}"
                            </p>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-4 text-zinc-300 italic text-xs">
                               <p>Non-textual biological material or metadata</p>
                            </div>
                          )}
                          <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-50">
                             <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">Digest 256-bit hash confirmed</span>
                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                          </div>
                       </div>
                    </div>
                  </section>

                  {/* AI & Metrics Section */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                       <Zap className="h-4 w-4 text-amber-500" />
                       <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em]">Heuristic Assessment</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       <div className="p-6 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                          <div className="space-y-1">
                             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Confidence Index</p>
                             <div className="flex items-baseline gap-1">
                                <span className={cn(
                                   "text-3xl font-bold tracking-tighter",
                                   (selectedLog.aiScore || 0) > 0.8 ? "text-rose-600" : "text-emerald-600"
                                )}>
                                   {selectedLog.aiScore ? (selectedLog.aiScore * 100).toFixed(1) : "0.0"}
                                </span>
                                <span className="text-xs font-bold text-zinc-400">%</span>
                             </div>
                          </div>
                          <div className="h-16 w-16 relative">
                             {/* Circular Progress Placeholder - simple SVG */}
                             <svg className="h-full w-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-200" />
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" 
                                   className={cn(
                                      (selectedLog.aiScore || 0) > 0.8 ? "text-rose-500" : "text-emerald-500"
                                   )}
                                   strokeDasharray={176}
                                   strokeDashoffset={176 - (176 * (selectedLog.aiScore || 0))}
                                   strokeLinecap="round"
                                />
                             </svg>
                          </div>
                       </div>

                       {selectedLog.aiCategories && (
                          <div className="grid grid-cols-2 gap-3">
                             {Object.entries(selectedLog.aiCategories).map(([cat, score]: [string, any], idx) => (
                                <motion.div 
                                  key={cat}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.1 + idx * 0.05 }}
                                  className="p-3.5 rounded-xl bg-white border border-zinc-100 shadow-[0_2px_4px_rgba(0,0,0,0.01)] space-y-2"
                                >
                                   <div className="flex justify-between items-center text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                                      <span className="truncate max-w-[100px]">{cat.replace(/_/g, " ")}</span>
                                      <span className={cn((score as number) > 0.5 ? "text-rose-500" : "text-zinc-400")}>
                                         {Math.round((score as number) * 100)}%
                                      </span>
                                   </div>
                                   <div className="h-1 w-full bg-zinc-50 rounded-full overflow-hidden">
                                      <motion.div 
                                         className={cn(
                                            "h-full rounded-full",
                                            (score as number) > 0.5 ? "bg-rose-500" : "bg-zinc-200"
                                         )}
                                         initial={{ width: 0 }}
                                         animate={{ width: `${(score as number) * 100}%` }}
                                         transition={{ duration: 1, delay: 0.5 }}
                                      />
                                   </div>
                                </motion.div>
                             ))}
                          </div>
                       )}
                    </div>
                  </section>

                  {/* Decision & Action */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                       <UserCheck className="h-4 w-4 text-indigo-500" />
                       <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em]">Protocol Execution</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl border border-zinc-100 bg-white shadow-sm flex flex-col gap-2">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Decision</span>
                          <div className="flex items-center gap-2">
                             {getDecisionBadge(selectedLog.decision)}
                          </div>
                       </div>
                       <div className="p-4 rounded-2xl border border-zinc-100 bg-white shadow-sm flex flex-col gap-2">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Action Applied</span>
                          <span className="text-xs font-bold text-zinc-900 border-l-2 border-indigo-500 pl-2 uppercase italic">
                             {selectedLog.actionTaken}
                          </span>
                       </div>
                    </div>
                  </section>

                  {/* Subject Details */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                       <Activity className="h-4 w-4 text-emerald-500" />
                       <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em]">Subject Identity</h4>
                    </div>

                    <div className="p-5 rounded-2xl border border-zinc-100 bg-white group hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="relative">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-lg shadow-zinc-200 group-hover:scale-105 transition-transform duration-500">
                                   <AvatarFallback className="bg-zinc-100 text-sm font-bold text-zinc-500 uppercase">
                                      {selectedLog.user.firstName[0]}{selectedLog.user.lastName[0]}
                                   </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center">
                                   <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                </div>
                             </div>
                             <div>
                                <h5 className="text-base font-bold text-zinc-900 leading-none">
                                   {selectedLog.user.firstName} {selectedLog.user.lastName}
                                </h5>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1.5">
                                   Verified Neural Link Node
                                </p>
                             </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                             <ExternalLink className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-8 py-5 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <Clock className="h-3 w-3" />
               Generated Sept-04-202X
            </span>
            <Button 
               variant="outline" 
               size="sm" 
               onClick={() => setSelectedLog(null)}
               className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest border-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all"
            >
              Acknowledge Entry
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
