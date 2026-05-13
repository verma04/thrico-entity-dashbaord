"use client";

import React, { useState, useMemo } from "react";
import { UserList } from "./user-list";
import { useGetAllUser } from "@/graphql/actions/membership/membership-queries";
import { MembersListCards } from "../dashboard/members-listcards";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List as ListIcon,
  Users,
  RefreshCw,
  UserCheck,
  Clock,
  Ban,
  UserX,
  CheckCircle2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Pagination } from "@/components/shared/admin-table/admin-table";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_TABS = [
  {
    value: "ALL",
    label: "All",
    icon: Users,
    dot: "",
    color: "text-foreground",
  },
  {
    value: "APPROVED",
    label: "Approved",
    icon: UserCheck,
    dot: "bg-emerald-500",
    color: "text-emerald-600",
  },
  {
    value: "PENDING",
    label: "Pending",
    icon: Clock,
    dot: "bg-amber-500",
    color: "text-amber-600",
  },
  {
    value: "BLOCKED",
    label: "Blocked",
    icon: Ban,
    dot: "bg-red-500",
    color: "text-red-600",
  },
  {
    value: "REJECTED",
    label: "Rejected",
    icon: UserX,
    dot: "bg-slate-400",
    color: "text-slate-500",
  },
  {
    value: "DISABLED",
    label: "Disabled",
    icon: CheckCircle2,
    dot: "bg-orange-500",
    color: "text-orange-600",
  },
] as const;

type StatusValue = (typeof STATUS_TABS)[number]["value"];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** View-mode toggle: Grid / Table */
function ViewToggle({
  value,
  onChange,
}: {
  value: "grid" | "table";
  onChange: (v: "grid" | "table") => void;
}) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as "grid" | "table")}
      className="bg-muted p-0.5 rounded-lg border border-border"
    >
      <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
        <TabsTrigger
          value="grid"
          className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
        >
          <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
          Grid
        </TabsTrigger>
        <TabsTrigger
          value="table"
          className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
        >
          <ListIcon className="h-3.5 w-3.5 mr-1.5" />
          Table
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

/** Status section bar — appears between action bar and content */
function SectionHeader({
  status,
  count,
  loading,
}: {
  status: StatusValue;
  count: number;
  loading: boolean;
}) {
  const tab = STATUS_TABS.find((t) => t.value === status) ?? STATUS_TABS[0];
  const Icon = tab.icon;

  if (status === "ALL") return null; // no extra header for All

  return (
    <div className="flex items-center gap-3 pb-1">
      <div
        className={cn(
          "flex items-center gap-2 text-sm font-semibold",
          tab.color,
        )}
      >
        {tab.dot && (
          <span
            className={cn(
              "h-2 w-2 rounded-full shrink-0 animate-pulse",
              tab.dot,
            )}
          />
        )}
        <Icon className="h-4 w-4" />
        <span>{tab.label} Members</span>
      </div>
      <div className="h-px flex-1 bg-border" />
      {!loading && (
        <span className="text-[11px] font-medium text-muted-foreground">
          {count} {count === 1 ? "record" : "records"}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Content area (animated)
// ─────────────────────────────────────────────────────────────────────────────

function ContentArea({
  view,
  loading,
  users,
}: {
  view: "grid" | "table";
  loading: boolean;
  users: any[];
}) {
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-2"
        >
          {/* Inline skeleton matching table rows */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="h-10 border-b border-border bg-muted/30 px-5 flex items-center gap-4">
              {[120, 180, 100, 80, 80, 90].map((w, i) => (
                <Skeleton
                  key={i}
                  className="h-2.5 rounded"
                  style={{ width: w }}
                />
              ))}
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-3 border-b border-border/40 last:border-0"
              >
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3 w-32 rounded" />
                  <Skeleton className="h-2.5 w-20 rounded" />
                </div>
                <Skeleton className="h-3 w-40 rounded hidden sm:block" />
                <Skeleton className="h-3 w-20 rounded hidden md:block" />
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md hidden lg:block" />
                <Skeleton className="h-3 w-20 rounded hidden lg:block" />
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {view === "grid" ? (
            <MembersListCards manualData={users} />
          ) : (
            <UserList users={users} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main User component
// ─────────────────────────────────────────────────────────────────────────────

import { useGetIndustries } from "@/graphql/quries/industries/industry-queries";

const User = ({ status: initialStatus }: { status?: string }) => {
  const [view, setView] = useState<"grid" | "table">("table");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [status, setStatus] = useState<StatusValue>(
    (initialStatus as StatusValue) || "ALL",
  );
  const [selectedIndustry, setSelectedIndustry] = useState<string>("ALL");

  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data: industryData } = useGetIndustries();
  const industries = industryData?.getIndustries || [];

  // Reset offset when filters change
  React.useEffect(() => {
    setOffset(0);
  }, [debouncedSearch, status, selectedIndustry]);

  const { data, loading, refetch } = useGetAllUser({
    status: status === "ALL" ? "ALL" : status,
    industryId: selectedIndustry === "ALL" ? null : selectedIndustry,
    search: debouncedSearch.trim() || null,
    limit,
    offset,
  });

  const usersList = data?.getAllUser?.data || [];
  const totalCount = data?.getAllUser?.totalCount || 0;
  const hasNextPage = data?.getAllUser?.hasNextPage || false;

  const pageTitle =
    status === "ALL"
      ? "Members"
      : `${status.charAt(0) + status.slice(1).toLowerCase()} Members`;

  return (
    <EcosystemWrapper>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Member List"
        description={
          loading
            ? "Loading members…"
            : `${totalCount} total members in your community.`
        }
        icon={Users}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
              />
            </Button>
            <ViewToggle value={view} onChange={setView} />
          </div>
        }
      />

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search by name or email…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Inline status quick-select (mirrors the tabs for mobile accessibility) */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as StatusValue)}
            >
              <SelectTrigger className="w-[130px] h-9 rounded-lg border-border bg-card text-xs font-semibold text-foreground shadow-none focus:ring-2 focus:ring-ring/20">
                <div className="flex items-center gap-2">
                  {STATUS_TABS.find((t) => t.value === status)?.dot && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        STATUS_TABS.find((t) => t.value === status)?.dot,
                      )}
                    />
                  )}
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                {STATUS_TABS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-lg text-xs font-semibold py-2"
                  >
                    <div className="flex items-center gap-2">
                      {opt.dot && (
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            opt.dot,
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

          <EcosystemActionBar.Item>
            <Select
              value={selectedIndustry}
              onValueChange={(v) => setSelectedIndustry(v)}
            >
              <SelectTrigger className="w-[160px] h-9 rounded-lg border-border bg-card text-xs font-semibold text-foreground shadow-none focus:ring-2 focus:ring-ring/20">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                <SelectItem
                  value="ALL"
                  className="rounded-lg text-xs font-semibold py-2"
                >
                  All Industries
                </SelectItem>
                {industries.map((ind) => (
                  <SelectItem
                    key={ind.id}
                    value={ind.id}
                    className="rounded-lg text-xs font-semibold py-2"
                  >
                    {ind.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active={usersList.length > 0}>
            Showing {usersList.length} of {totalCount} Members
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section heading (non-ALL statuses only) */}
        <SectionHeader
          status={status}
          count={totalCount}
          loading={loading}
        />

        <ContentArea view={view} loading={loading} users={usersList} />
        
        {/* Pagination Controls */}
        {!loading && totalCount > 0 && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <Pagination
              currentPage={Math.floor(offset / limit) + 1}
              totalPages={Math.ceil(totalCount / limit)}
              totalItems={totalCount}
              pageSize={limit}
              onPageChange={(page) => setOffset((page - 1) * limit)}
            />
          </div>
        )}
      </EcosystemContainer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </EcosystemWrapper>
  );
};

export default User;
