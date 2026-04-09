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
  Search
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { 
  useGetHistory 
} from "@/graphql/moderation/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const LIMIT = 10;

export function HistorySection() {
  const [activeTab, setActiveTab] = useState("moderation");
  const [page, setPage] = useState(0);

  const { data, loading, error } = useGetHistory({
    limit: LIMIT,
    offset: page * LIMIT,
  });

  const moderationItems = data?.getModerationLogs.items || [];
  const tokenItems = data?.getAiTokenUsage.items || [];
  
  const totalModeration = data?.getModerationLogs.totalCount || 0;
  const totalTokens = data?.getAiTokenUsage.totalCount || 0;

  const currentTotal = activeTab === "moderation" ? totalModeration : totalTokens;
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
      <Badge variant="outline" className="text-zinc-500 font-bold text-[10px] uppercase tracking-tighter">
        {label}
      </Badge>
    );
  };

  const getDecisionBadge = (decision: string) => {
    const d = decision.toLowerCase();
    if (d === "approved" || d === "allow") {
      return <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold text-[10px] uppercase tracking-tighter">APPROVED</Badge>;
    }
    if (d === "rejected" || d === "block" || d === "flagged") {
      return <Badge className="bg-amber-50 text-amber-600 border-amber-100 font-bold text-[10px] uppercase tracking-tighter">FLAGGED</Badge>;
    }
    return <Badge variant="secondary" className="font-bold text-[10px] uppercase tracking-tighter">{decision}</Badge>;
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden min-h-[500px] flex flex-col">
      <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
            <History className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Audit Trail</h3>
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mt-0.5">Comprehensive activity and resource logs</p>
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
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <div className="p-0">
             <Table>
                <TableHeader className="bg-zinc-50/50">
                  <TableRow className="border-zinc-100 pointer-events-none hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">Timestamp</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">Entity</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">Metric</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">Status</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i} className="border-zinc-50">
                      <TableCell className="px-6 py-4"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="px-6 py-4"><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className="px-6 py-4"><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
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
            <p className="text-sm font-bold text-zinc-900">Failed to load logs</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">{error.message}</p>
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
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">Time</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">Content Type</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">AI Label</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">Decision</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">User</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10 text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moderationItems.length > 0 ? (
                    moderationItems.map((log) => (
                      <TableRow key={log.id} className="group hover:bg-zinc-50/80 transition-colors border-zinc-50">
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-zinc-500">
                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
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
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
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
                            <p className="text-sm font-bold text-zinc-900">No activity recorded</p>
                            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest mt-1">Logs will appear here once content is processed</p>
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
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">Time</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">Module</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">Tokens consumed</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10">Model</TableHead>
                    <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-6 h-10 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokenItems.length > 0 ? (
                    tokenItems.map((item, i) => (
                      <TableRow key={i} className="group hover:bg-zinc-50/80 transition-colors border-zinc-50">
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-zinc-500">
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
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
                          <Badge variant="outline" className="text-[10px] font-bold border-zinc-200 text-zinc-600 bg-zinc-50">
                            {item.model}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                              <span className="text-[9px] font-bold text-emerald-600 uppercase">SYNCHRONIZED</span>
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
                            <p className="text-sm font-bold text-zinc-900">No compute logs</p>
                            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest mt-1">Resource allocation data is empty</p>
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
          Total logs tracked: <span className="text-zinc-600">{currentTotal}</span>
        </p>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
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
            {totalPages > 5 && <span className="text-zinc-300 text-[10px] font-bold px-1">...</span>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || loading}
            className="h-8 px-2 text-[10px] font-bold uppercase tracking-widest gap-2 hover:bg-white border border-transparent hover:border-zinc-200 disabled:opacity-30 transition-all"
          >
            Next <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
