"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  RotateCcw,
  ArrowRight,
  X,
  AlertCircle,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { useGetImpactActivityLog } from "@/graphql/actions/impact";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminTable, AdminTableColumn } from "@/components/shared/admin-table/admin-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { UserProfileHoverCard, UserProfileHoverData } from "@/components/shared/user-profile-hover-card";
import { format, startOfDay, endOfDay } from "date-fns";
import { safeFormat } from "@/lib/date-utils";
import Link from "next/link";

export default function ImpactActivityLogPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const { dateRange, handleDateChange } = useUrlDateRange(7);

  const { data, loading, error, refetch } = useGetImpactActivityLog({
    variables: {
      input: { 
        limit: 500, 
        offset: 0,
        type: filterType !== "ALL" ? filterType : undefined
      },
    },
    fetchPolicy: "network-only",
  });

  const logs = data?.getImpactActivityLog || [];

  const filteredLogs = useMemo(() => {
    return logs.filter((log: any) => {
      // 1. Search text filter
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const firstName = log.user?.firstName || "";
        const lastName = log.user?.lastName || "";
        const fullName = `${firstName} ${lastName}`.toLowerCase();
        const userId = (log.user?.id || log.id || "").toLowerCase();
        const reason = (log.changeReason || "").toLowerCase();

        const matchesSearch =
          fullName.includes(q) || userId.includes(q) || reason.includes(q);

        if (!matchesSearch) return false;
      }

      // 2. Date range filter
      if (dateRange?.from) {
        const txDate = log.createdAt ? new Date(log.createdAt).getTime() : NaN;
        if (!isNaN(txDate)) {
          const fromTime = startOfDay(dateRange.from).getTime();
          const toTime = dateRange.to
            ? endOfDay(dateRange.to).getTime()
            : endOfDay(dateRange.from).getTime();

          if (txDate < fromTime || txDate > toTime) {
            return false;
          }
        }
      }

      return true;
    });
  }, [logs, search, dateRange]);

  const hasActiveFilters = Boolean(search.trim() || dateRange?.from || filterType !== "ALL");

  const handleClearFilters = () => {
    setSearch("");
    setFilterType("ALL");
    handleDateChange(undefined);
  };

  const columns: AdminTableColumn<any>[] = [
    {
      key: "rank",
      header: "#",
      className: "w-14",
      cell: (_log, index) => (
        <span className="font-mono text-xs text-muted-foreground font-semibold">
          #{index + 1}
        </span>
      ),
    },
    {
      key: "user",
      header: "Member",
      cell: (log) => {
        const user = log.user || {};
        const firstName = user.firstName || "Member";
        const lastName = user.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();
        const avatarUrl = user.avatarUrl || "";
        const fullAvatar = avatarUrl.startsWith("http")
          ? avatarUrl
          : avatarUrl
            ? `https://cdn.thrico.network/${avatarUrl}`
            : "";
        const initials = firstName.substring(0, 2).toUpperCase();

        const hoverUser: UserProfileHoverData = {
          id: user.id || "",
          firstName,
          lastName,
          avatar: avatarUrl,
        };

        return (
          <UserProfileHoverCard user={hoverUser}>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="h-8 w-8 border border-border shrink-0">
                <AvatarImage
                  src={fullAvatar}
                  alt={fullName}
                  className="object-cover"
                />
                <AvatarFallback className="text-[10px] bg-muted text-muted-foreground font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground leading-tight hover:underline">
                  {fullName}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  ID: {(user.id || log.id || "").substring(0, 8)}
                </span>
              </div>
            </div>
          </UserProfileHoverCard>
        );
      },
    },
    {
      key: "action",
      header: "Action / Event",
      cell: (log: any) => (
        <span className="text-xs font-medium text-foreground line-clamp-1 max-w-[250px]">
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
          <div
            className={cn(
              "flex items-center gap-1 font-mono text-sm font-semibold",
              isNegative
                ? "text-rose-600 dark:text-rose-400"
                : isPositive 
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-zinc-600 dark:text-zinc-400"
            )}
          >
            {isNegative ? (
              <ArrowDownRight className="h-3.5 w-3.5" />
            ) : isPositive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : null}
            <span>
              {isPositive ? "+" : ""}
              {Number(log?.changeAmount || 0).toLocaleString()}
            </span>
          </div>
        );
      },
    },
    {
      key: "newScore",
      header: "New Score",
      cell: (log: any) => (
        <span className="font-mono text-xs font-medium text-foreground">
          {Number(log?.newScore || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date & Time",
      cell: (log: any) => {
        const dateObj = log.createdAt ? new Date(log.createdAt) : null;
        const validDate = dateObj && !isNaN(dateObj.getTime());
        return (
          <div className="flex flex-col">
            <span className="text-xs text-foreground">
              {validDate
                ? format(dateObj, "MMM d, yyyy")
                : safeFormat(log.createdAt, "MMM dd, yyyy")}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {validDate
                ? format(dateObj, "hh:mm a")
                : safeFormat(log.createdAt, "HH:mm")}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Impact Score Overview"
        description="Real-time overview of member impact score activities."
        badgeText="Quick Trace"
        icon={Activity}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Impact Score", href: "/impact-score" },
          { label: "Quick Trace" },
        ]}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          {/* 1. Search Field */}
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search by user name or reason..."
            />
          </EcosystemActionBar.Item>

          {/* 2. Type Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="h-9 min-w-[150px] text-xs bg-background border-border rounded-xl">
                <SelectValue placeholder="All Activities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Activities</SelectItem>
                <SelectItem value="POSITIVE">Earned (Positive)</SelectItem>
                <SelectItem value="DECAY">Decay (Negative)</SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* 3. Date Range Filter */}
          <EcosystemActionBar.Item>
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
          </EcosystemActionBar.Item>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <EcosystemActionBar.Item>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1 rounded-xl"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            </EcosystemActionBar.Item>
          )}

          <div className="hidden lg:flex items-center gap-2 px-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              Live Feed
            </span>
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-9 w-9 border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <RotateCcw
                className={cn(loading && "animate-spin")}
                size={14}
              />
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Link href="/gamification/impact-score/audit-log">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-9 rounded-xl text-xs"
              >
                Full Audit Log
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={filteredLogs.length > 0}>
            {filteredLogs.length} Activities
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {error ? (
        <EcosystemContainer className="p-12 mt-4">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shadow-sm">
              <AlertCircle className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Unable to Load Activity Trace
              </p>
              <p className="text-xs text-muted-foreground mt-1 px-4 leading-relaxed">
                {error.message}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="rounded-xl px-6"
            >
              Retry
            </Button>
          </div>
        </EcosystemContainer>
      ) : (
        <EcosystemContainer className="p-0 border border-zinc-200 shadow-sm rounded-xl bg-white mt-4 overflow-hidden">
          <AdminTable
            columns={columns}
            data={filteredLogs}
            loading={loading}
            keyExtractor={(log, index) => log.id || `log-${index}`}
            emptyTitle="No activity found"
            emptyDescription={
              hasActiveFilters
                ? "No activities match the selected search or date criteria."
                : "No member impact score movements recorded yet."
            }
            emptyIcon={Activity}
            pageSize={30}
          />
        </EcosystemContainer>
      )}
    </EcosystemWrapper>
  );
}
