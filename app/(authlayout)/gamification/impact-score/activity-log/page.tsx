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
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { useGetImpactActivityLog } from "@/graphql/actions/impact";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { AdminTable } from "@/components/shared/admin-table/admin-table";
import { cn } from "@/lib/utils";

export default function ImpactActivityLogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data, loading, error } = useGetImpactActivityLog({
    variables: {
      input: {
        limit: 500, // Fetch more for client-side pagination
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

  const PAGE_SIZE = 15;
  const paginatedLogs = filteredLogs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const columns = [
    {
      key: "user",
      header: "User",
      cell: (log: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-zinc-200 shadow-sm">
            <AvatarImage src={log?.user?.avatarUrl} />
            <AvatarFallback className="bg-zinc-100 text-zinc-900 text-[10px] font-semibold">
              {log?.user?.firstName?.charAt(0) || ""}
              {log?.user?.lastName?.charAt(0) || ""}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">
              {log?.user?.firstName || "Unknown"} {log?.user?.lastName || "User"}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              ID: {log?.id.substring(0, 8)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action / Event",
      cell: (log: any) => (
        <span className="text-xs text-foreground line-clamp-1 max-w-[250px]">
          {log?.changeReason || "Action performed"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Impact",
      cell: (log: any) => {
        const isPositive = log?.changeAmount > 0;
        const isNegative = log?.changeAmount < 0;
        return (
          <span
            className={cn(
              "font-mono text-xs font-bold px-2.5 py-1 rounded-md border shadow-sm",
              isPositive
                ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                : isNegative
                  ? "text-rose-600 bg-rose-50 border-rose-100"
                  : "text-zinc-600 bg-zinc-50 border-zinc-100",
            )}
          >
            {isPositive ? "+" : ""}
            {log?.changeAmount}
          </span>
        );
      },
    },
    {
      key: "newScore",
      header: "New Score",
      cell: (log: any) => (
        <span className="text-[11px] font-mono font-bold text-foreground bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded">
          {log?.newScore}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Time",
      cell: (log: any) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 shrink-0" />
          <span className="whitespace-nowrap">
            {log?.createdAt
              ? formatDistanceToNow(new Date(log?.createdAt), {
                  addSuffix: true,
                })
              : "Unknown time"}
          </span>
        </div>
      ),
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Impact Score Overview"
        description="Real-time overview of member impact score"
        badgeText="Monitoring"
        icon={Activity}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Impact Score", href: "/impact-score" },
          { label: "Activity Log" },
        ]}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-md">
            <EcosystemActionBar.Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by user name or reason..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 overflow-hidden border border-zinc-200 shadow-sm rounded-xl bg-white mt-4">
        {error ? (
          <div className="p-6 text-center border-b border-red-100 bg-red-50/50">
            <ShieldAlert className="h-8 w-8 text-red-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-red-800">
              Error loading activity log
            </p>
            <p className="text-xs text-red-600 mt-1">{error.message}</p>
          </div>
        ) : null}
        <div className="px-0 py-0">
          <AdminTable
            columns={columns}
            data={paginatedLogs}
            loading={loading}
            keyExtractor={(log) => log.id}
            size="sm"
            emptyTitle="No activity found"
            emptyDescription={
              searchTerm
                ? "No events match your search criteria."
                : "User impact events will be displayed here once actions are tracked."
            }
            pagination={{
              pageIndex: page - 1,
              pageSize: PAGE_SIZE,
              pageCount: Math.ceil(filteredLogs.length / PAGE_SIZE) || 1,
              onPageChange: (i) => setPage(i + 1),
            }}
          />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
