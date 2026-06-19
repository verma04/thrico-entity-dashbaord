"use client";

import React, { useState } from "react";
import {
  Activity,
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  Search,
  ShieldAlert,
  Award,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemCard } from "@/components/layout/ecosystem/ecosystem-analytics";
import { useGetImpactActivityLog } from "@/graphql/actions/impact";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export default function ImpactActivityLogPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, loading, error } = useGetImpactActivityLog({
    variables: {
      input: {
        limit: 100,
        offset: 0,
      },
    },
    fetchPolicy: "network-only",
  });

  const logs = data?.getImpactActivityLog || [];

  const filteredLogs = logs.filter((log: any) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const userName =
      `${log?.user?.firstName || ""} ${log?.user?.lastName || ""}`.toLowerCase();
    const reason = log?.changeReason?.toLowerCase() || "";
    return userName.includes(searchLower) || reason.includes(searchLower);
  });

  const LoadingSkeleton = () => (
    <div className="space-y-4 mt-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-4 rounded-xl border border-zinc-100 bg-white/50 animate-pulse"
        >
          <div className="w-10 h-10 rounded-full bg-zinc-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-zinc-200 rounded w-1/4" />
            <div className="h-3 bg-zinc-200 rounded w-1/2" />
          </div>
          <div className="w-16 h-8 rounded-full bg-zinc-200" />
        </div>
      ))}
    </div>
  );

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Activity Log"
        description="Real-time stream of points awarded and deducted by the engine."
        badgeText="Monitoring"
        icon={Activity}
      />
      <EcosystemContainer className="p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <EcosystemCard
            title="User Activity Stream"
            description="Live view of impact score events across your community."
            icon={Zap}
          >
            <div className="mt-6 flex flex-col space-y-6">
              <div className="flex items-center gap-4 bg-zinc-50/50 p-2 rounded-lg border border-zinc-100/60">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    placeholder="Search by user name or reason..."
                    className="pl-9 bg-white border-zinc-200 shadow-sm w-full transition-all focus-visible:ring-brand-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="text-sm text-zinc-500 font-medium px-4 whitespace-nowrap">
                  {filteredLogs.length} events
                </div>
              </div>

              {loading ? (
                <LoadingSkeleton />
              ) : error ? (
                <div className="p-6 text-center border border-red-100 bg-red-50/50 rounded-xl mt-6">
                  <ShieldAlert className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-red-800">
                    Error loading activity log
                  </p>
                  <p className="text-xs text-red-600 mt-1">{error.message}</p>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-100 rounded-xl bg-zinc-50/50 mt-6">
                  <Activity className="h-10 w-10 text-zinc-300 mb-4" />
                  <p className="text-base font-semibold text-zinc-700">
                    No activity found
                  </p>
                  <p className="text-sm text-zinc-500 mt-1 max-w-sm">
                    {searchTerm
                      ? "No events match your search criteria."
                      : "User impact events will be displayed here once actions are tracked."}
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4 -mr-4 mt-6">
                  <div className="space-y-4">
                    {filteredLogs.map((log: any) => {
                      const isPositive = log?.changeAmount > 0;
                      const isNegative = log?.changeAmount < 0;

                      return (
                        <div
                          key={log?.id}
                          className="group flex items-start gap-4 p-4 rounded-xl border border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm transition-all duration-200"
                        >
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-zinc-100">
                            <AvatarImage src={log?.user?.avatarUrl} />
                            <AvatarFallback className="bg-brand-50 text-brand-700 font-semibold text-xs">
                              {log?.user?.firstName?.charAt(0) || ""}
                              {log?.user?.lastName?.charAt(0) || ""}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4 mb-1">
                              <h4 className="text-sm font-semibold text-zinc-900 truncate">
                                {log?.user?.firstName || "Unknown"}{" "}
                                {log?.user?.lastName || "User"}
                              </h4>
                              <div className="flex items-center gap-1.5 text-xs text-zinc-400 shrink-0">
                                <Clock className="h-3 w-3" />
                                {log?.createdAt
                                  ? formatDistanceToNow(
                                      new Date(parseInt(log?.createdAt)),
                                      { addSuffix: true },
                                    )
                                  : "Unknown time"}
                              </div>
                            </div>

                            <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                              {log?.changeReason || "Action performed"}
                            </p>

                            <div className="flex items-center gap-3 mt-3">
                              <Badge
                                variant="outline"
                                className="bg-zinc-50 text-zinc-600 border-zinc-200 text-[10px] uppercase tracking-wider font-semibold py-0.5 px-2"
                              >
                                ID: {log?.id.substring(0, 8)}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 shrink-0 pl-4 border-l border-zinc-100">
                            <div
                              className={`flex items-center gap-1.5 font-bold text-sm px-2.5 py-1 rounded-full ${
                                isPositive
                                  ? "bg-emerald-50 text-emerald-600"
                                  : isNegative
                                    ? "bg-rose-50 text-rose-600"
                                    : "bg-zinc-50 text-zinc-600"
                              }`}
                            >
                              {isPositive ? (
                                <TrendingUp className="h-3.5 w-3.5" />
                              ) : isNegative ? (
                                <TrendingDown className="h-3.5 w-3.5" />
                              ) : (
                                <Award className="h-3.5 w-3.5" />
                              )}
                              {isPositive ? "+" : ""}
                              {log?.changeAmount} pts
                            </div>
                            <div className="text-[11px] font-medium text-zinc-400">
                              New Score:{" "}
                              <span className="text-zinc-700">
                                {log?.newScore}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </div>
          </EcosystemCard>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
