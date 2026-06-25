"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { UserList } from "./user-list";
import { useGetAllUser, useSearchUserWithAI } from "@/graphql/actions/membership/membership-queries";
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
  Sparkles,
  Search,
  Loader2,
  Network,
  AlertTriangle,
  Lock,
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
    color: "text-muted-foreground",
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

const User = ({ status: initialStatus, subscriptionInfo }: { status?: string; subscriptionInfo?: any }) => {
  const router = useRouter();
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

  const [aiSearch, setAiSearch] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);
  const [searchUserWithAI, { data: aiData, loading: aiLoading }] =
    useSearchUserWithAI();

  const { data, loading, refetch } = useGetAllUser({
    status: status === "ALL" ? "ALL" : status,
    industryId: selectedIndustry === "ALL" ? null : selectedIndustry,
    search: debouncedSearch.trim() || null,
    limit,
    offset,
  });

  // AI search handler
  const handleAiSearch = () => {
    if (!aiSearch.trim()) return;
    setIsAiMode(true);
    searchUserWithAI({
      variables: { query: aiSearch.trim(), limit, offset },
    });
  };

  const handleClearAiSearch = () => {
    setIsAiMode(false);
    setAiSearch("");
  };

  const usersList = isAiMode
    ? aiData?.searchUserWithAI?.data || []
    : data?.getAllUser?.data || [];
  const totalCount = isAiMode
    ? aiData?.searchUserWithAI?.totalCount || 0
    : data?.getAllUser?.totalCount || 0;
  const hasNextPage = isAiMode
    ? aiData?.searchUserWithAI?.hasNextPage || false
    : data?.getAllUser?.hasNextPage || false;
  const isLoading = isAiMode ? aiLoading : loading;

  const effectiveTotalCount = subscriptionInfo?.maxUsersAllowed 
    ? Math.min(totalCount, subscriptionInfo.maxUsersAllowed)
    : totalCount;

  const pageTitle =
    status === "ALL"
      ? "Members"
      : `${status.charAt(0) + status.slice(1).toLowerCase()} Members`;

  return (
    <EcosystemWrapper>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText={isAiMode ? "AI Search" : "Member List"}
        description={
          isLoading
            ? "Loading members…"
            : isAiMode
              ? `Found ${totalCount} members matching your AI search.`
              : `${totalCount} total members in your community.`
        }
        icon={isAiMode ? Sparkles : Users}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", isLoading && "animate-spin")}
              />
            </Button>
            <ViewToggle value={view} onChange={setView} />
            <Button
              variant="default"
              className="h-9 px-3 rounded-lg text-xs font-semibold gap-1.5 transition-all bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => router.push("/members/classifications")}
            >
              <Network className="h-3.5 w-3.5" />
              Entity Nodes
            </Button>
          </div>
        }
      />

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            {isAiMode ? (
              <div className="flex items-center gap-2 w-full">
                <div className="relative flex-1">
                  <Sparkles className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-violet-500" />
                  <input
                    type="text"
                    value={aiSearch}
                    onChange={(e) => setAiSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
                    placeholder="e.g. Software engineers in India with AI skills…"
                    className="w-full h-9 pl-8 pr-3 rounded-lg border border-violet-200 bg-violet-50/50 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 transition-all"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleAiSearch}
                  disabled={aiLoading || !aiSearch.trim()}
                  className="h-9 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold gap-1.5 transition-all"
                >
                  {aiLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Search className="h-3.5 w-3.5" />
                  )}
                  Search
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAiSearch}
                  className="h-9 px-3 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
                >
                  Clear
                </Button>
              </div>
            ) : (
              <EcosystemActionBar.Search
                value={search}
                onChange={setSearch}
                placeholder="Search by name or email…"
              />
            )}
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
            <Button
              variant={isAiMode ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (isAiMode) {
                  handleClearAiSearch();
                } else {
                  setIsAiMode(true);
                }
              }}
              className={cn(
                "h-9 px-3 rounded-lg text-xs font-semibold gap-1.5 transition-all",
                isAiMode
                  ? "bg-violet-600 hover:bg-violet-700 text-white"
                  : "border-border hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700",
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Search
            </Button>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Inline status quick-select (mirrors the tabs for mobile accessibility) */}
        <EcosystemActionBar.Group>
          {!isAiMode && (
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
          )}

          {!isAiMode && (
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
          )}
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active={usersList.length > 0}>
            Showing {usersList.length} of {totalCount} Members
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* Subscription Limit Warning Banner */}
      {subscriptionInfo && !isAiMode && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 text-sm font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
            <div>
              <p className="font-bold text-amber-900 text-base">
                {subscriptionInfo.hasReachedLimit ? "Subscription Limit Reached" : "Subscription Usage"}
              </p>
              <p className="text-amber-700 text-xs mt-0.5">
                {subscriptionInfo.message || "You have reached the maximum number of users allowed by your subscription."}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="flex items-center gap-4 bg-amber-100/60 px-5 py-2.5 rounded-lg border border-amber-200/60 shrink-0">
               <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-amber-600/80 tracking-widest mb-0.5">Current</p>
                  <p className="text-xl font-black text-amber-900 leading-none">{subscriptionInfo.currentCount?.toLocaleString()}</p>
               </div>
               <div className="w-px h-8 bg-amber-300/60"></div>
               <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-amber-600/80 tracking-widest mb-0.5">Max Allowed</p>
                  <p className="text-xl font-black text-amber-900 leading-none">{subscriptionInfo.maxUsersAllowed ? subscriptionInfo.maxUsersAllowed.toLocaleString() : "∞"}</p>
               </div>
            </div>
            <Button
              variant="outline"
              className="bg-white hover:bg-amber-100/50 text-amber-900 border-amber-300 hover:border-amber-400 transition-all shadow-sm h-[52px]"
              onClick={() => router.push("/settings/subscription")}
            >
              Manage
            </Button>
          </div>
        </div>
      )}

      {/* Fallback to getAllUser message if no subscriptionInfo */}
      {!subscriptionInfo && data?.getAllUser?.message && !isAiMode && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm font-medium flex items-center gap-2 mb-4 shadow-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>{data.getAllUser.message}</span>
        </div>
      )}

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section heading (non-ALL statuses only) */}
        <SectionHeader
          status={status}
          count={totalCount}
          loading={loading}
        />

        <ContentArea view={view} loading={isLoading} users={usersList} />
        
        {/* Pagination Controls */}
        {!isLoading && effectiveTotalCount > 0 && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <Pagination
              currentPage={Math.floor(offset / limit) + 1}
              totalPages={Math.ceil(effectiveTotalCount / limit)}
              totalItems={effectiveTotalCount}
              pageSize={limit}
              onPageChange={(page) => setOffset((page - 1) * limit)}
            />
          </div>
        )}

        {/* Upgrade Block Bar */}
        {!isLoading && subscriptionInfo?.hasReachedLimit && totalCount > (subscriptionInfo.maxUsersAllowed || 0) && (
          <div className="mt-6 p-8 rounded-xl border border-dashed border-amber-300 bg-gradient-to-b from-amber-50/50 to-amber-100/50 flex flex-col items-center justify-center text-center space-y-4 shadow-sm relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
             <div className="h-12 w-12 rounded-full bg-white shadow-sm border border-amber-200 flex items-center justify-center relative z-10">
                <Lock className="h-5 w-5 text-amber-600" />
             </div>
             <div className="relative z-10">
               <h3 className="text-base font-bold text-amber-900">Unlock {totalCount - (subscriptionInfo.maxUsersAllowed || 0)} More Records</h3>
               <p className="text-sm text-amber-700 max-w-md mt-1.5 leading-relaxed">
                 Your current plan limits visibility to the first {subscriptionInfo.maxUsersAllowed} members. Upgrade your subscription to access your entire directory.
               </p>
             </div>
             <Button
               variant="default"
               className="bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm transition-all relative z-10"
               onClick={() => router.push("/settings/subscription")}
             >
               Upgrade Subscription
             </Button>
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
