"use client";

import React, { useState } from "react";
import { useGetGamificationActivityLog } from "@/graphql/actions";
import { ActivityLogTable } from "./activity-log-table";
import { Button } from "@/components/ui/button";
import { History, RotateCcw, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { startOfDay, endOfDay } from "date-fns";

export function ActivityLogManager() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const pageSize = 20;

  const offset = (page - 1) * pageSize;

  const { data, loading, error, refetch } = useGetGamificationActivityLog({
    variables: {
      input: { 
        limit: pageSize, 
        offset,
        startDate: dateRange?.from ? startOfDay(dateRange.from) : undefined,
        endDate: dateRange?.to ? endOfDay(dateRange.to) : undefined,
      },
    },
    fetchPolicy: "network-only",
  });

  const logs = data?.getGamificationActivityLog || [];
  
  const filteredLogs = search
    ? logs.filter(log => 
        log.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        log.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        log.type.toLowerCase().includes(search.toLowerCase())
      )
    : logs;

  const hasNextPage = logs.length === pageSize;
  const hasPrevPage = page > 1;

  const handleNextPage = () => {
    if (hasNextPage) setPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (hasPrevPage) setPage(p => p - 1);
  };

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setPage(1);
  };

  if (error) {
    return (
      <EcosystemWrapper>
        <EcosystemHeader
          title="Activity Log"
          badgeText="Audit"
          description="Track all point emissions, badge awards, and rank changes."
          icon={History}
        />
        <EcosystemContainer className="p-12">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shadow-sm">
              <History className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Activity Log Unavailable
              </p>
              <p className="text-xs text-muted-foreground mt-1 px-4 leading-relaxed">
                {error.message}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl px-6">
              Retry
            </Button>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Activity Log"
        badgeText="Gamification"
        description="Track all point awards, badge grants, and rank changes across members."
        icon={History}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
           <EcosystemActionBar.Item grow className="max-w-xs">
              <EcosystemActionBar.Search 
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by name or activity..."
              />
           </EcosystemActionBar.Item>
           <EcosystemActionBar.Item>
             <DateRangePicker 
               date={dateRange}
               onDateChange={handleDateChange}
             />
           </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
           <EcosystemActionBar.Item>
              <div className="flex items-center gap-2 px-1">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                 <span className="text-[11px] text-muted-foreground font-medium">Live</span>
              </div>
           </EcosystemActionBar.Item>

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
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPage}
                disabled={!hasPrevPage || loading}
                className="h-8 w-8 border-border rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </Button>
              <span className="text-xs text-muted-foreground font-medium px-2 min-w-[60px] text-center">
                Page {page}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={!hasNextPage || loading}
                className="h-8 w-8 border-border rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={filteredLogs.length > 0}>
             {filteredLogs.length} Events
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-2">
           <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="h-7 w-7 rounded-lg bg-background flex items-center justify-center shadow-sm shrink-0 border border-border">
                <Activity className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                This log shows all gamification events including point awards, badge grants, and rank changes. Use the search and date filters above to find specific entries.
              </p>
            </div>
        </div>

        <div className="px-6">
          <ActivityLogTable logs={filteredLogs} isLoading={loading} />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
