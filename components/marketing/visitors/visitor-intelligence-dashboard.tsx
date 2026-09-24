"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQuery } from "@apollo/client";
import {
  ADMIN_GET_VISITOR_INTELLIGENCE_SUMMARY,
  ADMIN_GET_VISITOR_INTELLIGENCE_PROFILES,
} from "@/graphql/actions/utm/admin-utm.graphql";
import {
  VisitorIntelligenceProfile,
  VisitorIntelligenceSummary,
  VisitorIntelligenceStatus,
  TimeRange,
  DateRangeInput,
} from "@/types/utm";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableItem,
  AdminTableText,
  AdminTableMetric,
  AdminTableDate,
  Pagination,
} from "@/components/shared/admin-table/admin-table";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { VisitorStatusBadge } from "./visitor-status-badge";
import { Visitor360Sheet } from "./visitor-360-sheet";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { useDebounce } from "use-debounce";
import {
  Users,
  Ghost,
  Fingerprint,
  Sparkles,
  Link2,
  AlertTriangle,
  RotateCcw,
  Upload,
  Eye,
  Compass,
  Globe,
  Laptop,
  Smartphone,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Default Empty Summary (no dummy data) ──────────────────────────────────
const EMPTY_SUMMARY: VisitorIntelligenceSummary = {
  totalVisitors: 0,
  anonymousCount: 0,
  identifiedCount: 0,
  connectedCount: 0,
  recentlyActiveCount: 0,
  activeCount: 0,
  dormantCount: 0,
  atRiskCount: 0,
  churnedCount: 0,
  utmAttributedCount: 0,
  convertedCount: 0,
  identityResolutionRate: 0,
  utmAttributionRate: 0,
  conversionRate: 0,
};

// Status options for selector matching member/all design
const VISITOR_STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses", dot: "" },
  { value: "ANONYMOUS", label: "Anonymous (Ghost)", dot: "bg-slate-400" },
  { value: "IDENTIFIED", label: "Identified Lead", dot: "bg-blue-500" },
  { value: "CONNECTED", label: "Connected Member", dot: "bg-indigo-500" },
  { value: "RECENTLY_ACTIVE", label: "Recently Active", dot: "bg-emerald-400" },
  { value: "ACTIVE", label: "Active Member", dot: "bg-emerald-600" },
  { value: "DORMANT", label: "Dormant", dot: "bg-amber-500" },
  { value: "AT_RISK", label: "At Risk", dot: "bg-rose-500" },
  { value: "CHURNED", label: "Churned", dot: "bg-rose-700" },
  { value: "UTM_ATTRIBUTED", label: "Campaign Attributed", dot: "bg-purple-500" },
  { value: "CONVERTED", label: "Converted", dot: "bg-teal-500" },
] as const;

interface VisitorIntelligenceDashboardProps {
  initialStatusFilter?: VisitorIntelligenceStatus | "ALL";
  tabTitle?: string;
}

export function VisitorIntelligenceDashboard({
  initialStatusFilter = "ALL",
  tabTitle = "All Visitors",
}: VisitorIntelligenceDashboardProps) {
  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(30);
  const [activeTab, setActiveTab] = useState<VisitorIntelligenceStatus | "ALL">(initialStatusFilter);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorIntelligenceProfile | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync tab with props if navigation changes
  React.useEffect(() => {
    setActiveTab(initialStatusFilter);
    setPage(1);
  }, [initialStatusFilter]);

  // Map timeRange and dateRange safely to GraphQL Enum and DateRangeInput
  const graphqlTimeRange: TimeRange | undefined = useMemo(() => {
    if (timeRange === "24h" || timeRange === "1d") return "LAST_24_HOURS";
    if (timeRange === "7d") return "LAST_7_DAYS";
    if (timeRange === "30d") return "LAST_30_DAYS";
    if (timeRange === "90d") return "LAST_90_DAYS";
    return "LAST_30_DAYS";
  }, [timeRange]);

  const graphqlDateRange: DateRangeInput | undefined = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return {
        startDate: new Date(dateRange.from).toISOString(),
        endDate: new Date(dateRange.to).toISOString(),
      };
    }
    return undefined;
  }, [dateRange]);

  // Summary Query
  const {
    data: summaryData,
    loading: summaryLoading,
    refetch: refetchSummary,
  } = useQuery(ADMIN_GET_VISITOR_INTELLIGENCE_SUMMARY, {
    variables: {
      timeRange: graphqlTimeRange,
      dateRange: graphqlDateRange,
    },
    fetchPolicy: "cache-and-network",
  });

  // Profiles Query
  const filterInput = useMemo(() => {
    const input: any = {
      page,
      limit,
      timeRange: graphqlTimeRange,
      dateRange: graphqlDateRange,
    };
    if (activeTab !== "ALL") input.status = activeTab;
    if (debouncedSearch.trim()) input.search = debouncedSearch.trim();
    return input;
  }, [activeTab, debouncedSearch, page, limit, graphqlTimeRange, graphqlDateRange]);

  const {
    data: profilesData,
    loading: profilesLoading,
    refetch: refetchProfiles,
  } = useQuery(ADMIN_GET_VISITOR_INTELLIGENCE_PROFILES, {
    variables: { input: filterInput },
    fetchPolicy: "cache-and-network",
  });

  const summary: VisitorIntelligenceSummary =
    summaryData?.getVisitorIntelligenceSummary || EMPTY_SUMMARY;

  const rawProfiles: VisitorIntelligenceProfile[] =
    profilesData?.getVisitorIntelligenceProfiles?.profiles || [];

  const totalCount =
    profilesData?.getVisitorIntelligenceProfiles?.total ?? rawProfiles.length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.allSettled([refetchSummary(), refetchProfiles()]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // ── Column Visibility State (Matching member/all design) ───────────────────
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    actions: true,
    visitor: true,
    status: true,
    firstTouch: true,
    lastTouch: true,
    activity: true,
    device: true,
    recency: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ── Table Column Definitions (Matching member/all user-list.tsx) ────────────
  const columns: AdminTableColumn<VisitorIntelligenceProfile>[] = useMemo(
    () => [
      {
        key: "serial",
        header: "S.No",
        headerClassName: "w-10 text-center",
        className: "text-center text-[11px] font-medium text-muted-foreground",
        cell: (_, index) => (page - 1) * limit + index + 1,
      },
      {
        key: "actions",
        header: "Action",
        headerClassName: "w-12 text-left",
        className: "text-left",
        isFixedLeft: true,
        cell: (row) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedVisitor(row);
            }}
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md cursor-pointer"
            title="Inspect 360 Profile"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        ),
      },
      {
        key: "visitor",
        header: "Visitor / Member",
        cell: (row) => {
          const isUser = !!row.user?.email || !!row.user?.firstName;
          const fullName = isUser
            ? `${row.user?.firstName || ""} ${row.user?.lastName || ""}`.trim() ||
              row.user?.email
            : `Ghost Visitor (${row.anonymousId?.slice(0, 10) || "Anon"}…)`;
          const subText = isUser
            ? row.user?.email
            : `Cookie ID: ${row.anonymousId || row.id}`;
          const fallback = isUser
            ? `${row.user?.firstName?.[0] || ""}${row.user?.lastName?.[0] || ""}` || "U"
            : "GV";

          const itemContent = (
            <AdminTableItem
              avatar={row.user?.avatar}
              title={fullName}
              subtitle={subText}
              fallbackText={fallback}
              shape="circle"
              onClick={() => setSelectedVisitor(row)}
            />
          );

          if (row.user?.id) {
            return (
              <UserProfileHoverCard
                user={{
                  id: row.user.id,
                  firstName: row.user.firstName,
                  lastName: row.user.lastName,
                  avatar: row.user.avatar,
                  headline: row.statusLabel,
                }}
              >
                <div>{itemContent}</div>
              </UserProfileHoverCard>
            );
          }

          return itemContent;
        },
      },
      {
        key: "status",
        header: "Lifecycle Status",
        cell: (row) => (
          <VisitorStatusBadge status={row.status} label={row.statusLabel} />
        ),
      },
      {
        key: "firstTouch",
        header: "First Touch",
        cell: (row) => (
          <AdminTableText
            primary={
              row.firstTouch?.campaign || row.campaignName || "Direct / Organic"
            }
            secondary={
              row.firstTouch?.source
                ? `${row.firstTouch.source} / ${row.firstTouch.medium || "cpc"}`
                : row.source
                ? `${row.source} / ${row.medium || "web"}`
                : undefined
            }
            icon={row.firstTouch?.campaign ? Link2 : Globe}
          />
        ),
      },
      {
        key: "lastTouch",
        header: "Last Touch",
        cell: (row) => (
          <AdminTableText
            primary={
              row.lastTouch?.campaign ||
              row.firstTouch?.campaign ||
              "Direct Conversion"
            }
            secondary={row.lastTouch?.landingPage || "/"}
            icon={Compass}
          />
        ),
      },
      {
        key: "activity",
        header: "Activity",
        cell: (row) => (
          <div className="flex items-center gap-2">
            <AdminTableMetric
              value={`${row.totalSessions || 0} sessions`}
              variant="indigo"
            />
            <span className="text-[10px] text-muted-foreground/60">•</span>
            <span className="text-[11px] font-mono text-muted-foreground">
              {row.totalPageViews || 0} views
            </span>
          </div>
        ),
      },
      {
        key: "device",
        header: "Device & Geo",
        cell: (row) => (
          <AdminTableText
            primary={row.device || "Desktop"}
            secondary={`${row.browser || "Chrome"} • ${row.country || "Global"}`}
            icon={row.device?.includes("Phone") ? Smartphone : Laptop}
          />
        ),
      },
      {
        key: "recency",
        header: "Last Active",
        cell: (row) => (
          <AdminTableDate
            date={row.lastSeenAt}
            format="MMM d, h:mm a"
            icon={true}
          />
        ),
      },
    ],
    [page, limit]
  );

  const activeColumns = useMemo(() => {
    return columns.filter((col) => visibleColumns[col.key] !== false);
  }, [columns, visibleColumns]);

  const currentStatusOption = VISITOR_STATUS_OPTIONS.find(
    (o) => o.value === activeTab
  );

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={tabTitle}
        description="Stitch anonymous sessions to authenticated members, track multi-touch journeys, and resolve customer 360 identities"
        icon={Users}
        badgeText="Visitor 360"
        breadcrumbs={[
          { label: "Marketing", href: "/marketing" },
          { label: "Visitor Intelligence", href: "/marketing/visitors" },
          { label: tabTitle },
        ]}
        actions={
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_30_DAYS"
            />
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all cursor-pointer"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RotateCcw
                size={14}
                className={cn(isRefreshing && "animate-spin")}
              />
            </Button>
          </div>
        }
      />

      {/* ── Summary KPI Scorecards (with Loaders) ────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Total Visitors */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Visitors</span>
            <Users className="h-3.5 w-3.5 text-blue-500" />
          </div>
          {summaryLoading ? (
            <Skeleton className="h-7 w-20 rounded-md" />
          ) : (
            <div className="text-xl font-bold tracking-tight text-foreground">
              {summary.totalVisitors.toLocaleString()}
            </div>
          )}
          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />
            <span>Aggregate count</span>
          </div>
        </div>

        {/* Ghost Visitors */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Ghost Visitors</span>
            <Ghost className="h-3.5 w-3.5 text-slate-500" />
          </div>
          {summaryLoading ? (
            <Skeleton className="h-7 w-20 rounded-md" />
          ) : (
            <div className="text-xl font-bold tracking-tight text-foreground">
              {summary.anonymousCount.toLocaleString()}
            </div>
          )}
          <div className="text-[10px] text-muted-foreground">
            {summary.totalVisitors > 0
              ? `${Math.round((summary.anonymousCount / summary.totalVisitors) * 100)}% anonymous`
              : "0% anonymous"}
          </div>
        </div>

        {/* Stitched Members */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Stitched Members</span>
            <Fingerprint className="h-3.5 w-3.5 text-indigo-500" />
          </div>
          {summaryLoading ? (
            <Skeleton className="h-7 w-20 rounded-md" />
          ) : (
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {summary.connectedCount.toLocaleString()}
            </div>
          )}
          <div className="text-[10px] text-muted-foreground">
            {summary.identityResolutionRate}% stitched
          </div>
        </div>

        {/* Campaign Attributed */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Attributed</span>
            <Link2 className="h-3.5 w-3.5 text-purple-500" />
          </div>
          {summaryLoading ? (
            <Skeleton className="h-7 w-20 rounded-md" />
          ) : (
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {summary.utmAttributedCount.toLocaleString()}
            </div>
          )}
          <div className="text-[10px] text-muted-foreground">
            {summary.utmAttributionRate}% campaigns
          </div>
        </div>

        {/* Converted */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Converted</span>
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          {summaryLoading ? (
            <Skeleton className="h-7 w-20 rounded-md" />
          ) : (
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {summary.convertedCount.toLocaleString()}
            </div>
          )}
          <div className="text-[10px] text-muted-foreground">
            {summary.conversionRate}% conversion rate
          </div>
        </div>

        {/* At Risk / Churned */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">At Risk / Churned</span>
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
          </div>
          {summaryLoading ? (
            <Skeleton className="h-7 w-20 rounded-md" />
          ) : (
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
              {(summary.atRiskCount + summary.churnedCount).toLocaleString()}
            </div>
          )}
          <div className="text-[10px] text-muted-foreground">
            Inactive &gt;45 days
          </div>
        </div>
      </div>

      {/* ── Action / Filter Bar (Exact member/all pattern) ───────────────── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search by name, email, cookie ID..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Primary Status Filter */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <Select
              value={activeTab}
              onValueChange={(v) => {
                setActiveTab(v as any);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[170px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <div className="flex items-center gap-2 truncate">
                  {currentStatusOption?.dot && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        currentStatusOption.dot
                      )}
                    />
                  )}
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[180px]">
                {VISITOR_STATUS_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {opt.dot && (
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            opt.dot
                          )}
                        />
                      )}
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          {/* Column Toggle Dropdown (matching member/all) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5 cursor-pointer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                Toggle Columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns
                .filter((c) => c.key !== "actions" && c.key !== "serial")
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={visibleColumns[col.key] !== false}
                    onCheckedChange={() => toggleColumn(col.key)}
                    className="text-xs font-medium cursor-pointer"
                  >
                    {col.header}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Button */}
          <Button
            variant="outline"
            onClick={() => {}}
            className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5 cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>

          <EcosystemActionBar.Separator />
          <EcosystemActionBar.Status active={rawProfiles.length > 0}>
            Showing {rawProfiles.length} of {totalCount} Visitors
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Table Container Area (Matching member/all design) ─────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Status section bar if a specific status is active */}
        {activeTab !== "ALL" && (
          <div className="flex items-center gap-3 pb-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              {currentStatusOption?.dot && (
                <span
                  className={cn(
                    "h-2 w-2 rounded-full shrink-0 animate-pulse",
                    currentStatusOption.dot
                  )}
                />
              )}
              <span>{currentStatusOption?.label}</span>
            </div>
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] font-medium text-muted-foreground">
              {totalCount} {totalCount === 1 ? "visitor" : "visitors"}
            </span>
          </div>
        )}

        {/* Standard AdminTable from member/all with full skeleton loading */}
        <div
          className="cursor-pointer"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            const rowEl = target.closest("tr");
            if (rowEl) {
              const rowIndex = (rowEl as HTMLTableRowElement).sectionRowIndex;
              if (
                rowIndex !== undefined &&
                rowIndex >= 0 &&
                rawProfiles[rowIndex]
              ) {
                setSelectedVisitor(rawProfiles[rowIndex]);
              }
            }
          }}
        >
          <AdminTable<VisitorIntelligenceProfile>
            columns={activeColumns}
            data={rawProfiles}
            keyExtractor={(p) => p.id}
            loading={profilesLoading}
            loadingRows={8}
            emptyIcon={Users}
            emptyTitle="No visitors tracked yet"
            emptyDescription="Visitor sessions and identity-resolved profiles will populate here in real-time as traffic arrives."
            pageSize={limit}
            baseIndex={(page - 1) * limit}
          />
        </div>

        {/* Pagination Controls (Matching member/all user-list.tsx) */}
        {!profilesLoading && totalCount > 0 && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <Pagination
              currentPage={page}
              totalPages={Math.max(1, Math.ceil(totalCount / limit))}
              totalItems={totalCount}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Slide-Out Customer 360 Sheet Drawer ───────────────────────────── */}
      <Visitor360Sheet
        visitor={selectedVisitor}
        open={!!selectedVisitor}
        onOpenChange={(open) => {
          if (!open) setSelectedVisitor(null);
        }}
      />
    </EcosystemWrapper>
  );
}
