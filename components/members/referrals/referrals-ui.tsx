"use client";

import React, { useState, useMemo } from "react";
import {
  useGetAllReferrals,
  useGetTopReferrals,
  useSearchUserWithAI,
} from "@/graphql/actions/membership/membership-queries";
import {
  AdminTable,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { safeLocaleDateString } from "@/lib/date-utils";
import { Badge } from "@/components/ui/badge";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import {
  Network,
  Trophy,
  Users,
  Sparkles,
  Check,
  ChevronsUpDown,
  Search,
  Upload,
} from "lucide-react";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import { UserHoverCard } from "@/components/shared/user-hover-card";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  SubscriptionLimitBanner,
  SubscriptionFallbackMessage,
  SubscriptionUpgradeBlock,
} from "@/components/members/manage/subscription-alerts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReferralsUI() {
  const [activeTab, setActiveTab] = useState("top");
  const [selectedReferrerId, setSelectedReferrerId] = useState<string>("all");
  const [selectedReferrerName, setSelectedReferrerName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();

  const [searchUserWithAI, { data: searchData, loading: searchLoading }] =
    useSearchUserWithAI();

  const handleSearch = (value: string) => {
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length > 2) {
      searchTimeoutRef.current = setTimeout(() => {
        searchUserWithAI({
          variables: {
            query: value,
            limit: 10,
            offset: 0,
          },
        });
      }, 500);
    }
  };

  const { data: allReferralsData, loading: allLoading } = useGetAllReferrals({
    limit: 500,
    offset: 0,
  });
  const { data: topReferralsData, loading: topLoading } = useGetTopReferrals({
    limit: 50,
  });
  const { data: subData, loading: subLoading } = useCheckMemberSubscription();

  const referrals = allReferralsData?.getAllReferrals?.data || [];
  const totalReferralsCount =
    allReferralsData?.getAllReferrals?.totalCount || 0;

  const topReferrers = topReferralsData?.getTopReferrals?.data || [];
  const totalActiveReferrers =
    topReferralsData?.getTopReferrals?.totalCount || 0;
  const bestReferrer = topReferrers.length > 0 ? topReferrers[0] : null;

  const subscriptionInfo = subData?.checkMemberSubscription;
  const loading = allLoading || topLoading || subLoading;

  const columns: AdminTableColumn<any>[] = [
    {
      key: "referrer",
      header: "REFERRER",
      cell: (row) => {
        const referrer = row.referrer?.user;
        return (
          <UserHoverCard userId={referrer?.id}>
            <div className="flex items-center gap-2.5 py-1">
              <Avatar className="h-7 w-7 border border-zinc-200 dark:border-zinc-800">
                <AvatarImage
                  src={`https://cdn.thrico.network/${referrer?.avatar}`}
                />
                <AvatarFallback className="text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {referrer?.firstName?.[0]}
                  {referrer?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {referrer?.firstName} {referrer?.lastName}
              </span>
            </div>
          </UserHoverCard>
        );
      },
    },
    {
      key: "referee",
      header: "REFEREE",
      cell: (row) => {
        const referee = row.referee?.user;
        return (
          <UserHoverCard userId={referee?.id}>
            <div className="flex items-center gap-2.5 py-1">
              <Avatar className="h-7 w-7 border border-zinc-200 dark:border-zinc-800">
                <AvatarImage
                  src={`https://cdn.thrico.network/${referee?.avatar}`}
                />
                <AvatarFallback className="text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {referee?.firstName?.[0]}
                  {referee?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                {referee?.firstName} {referee?.lastName}
              </span>
            </div>
          </UserHoverCard>
        );
      },
    },
    {
      key: "joined",
      header: "JOINED",
      cell: (row) => (
        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          {safeLocaleDateString(row.referee?.user?.createdAt)}
        </span>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      cell: (row) => (
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border",
            row.referee?.isApproved
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
          )}
        >
          {row.referee?.isApproved ? "Active" : "Pending"}
        </span>
      ),
    },
  ];

  // For Timeline view
  const timelineHistory = useMemo(() => {
    if (selectedReferrerId === "all") {
      return referrals;
    }
    return referrals.filter(
      (r) => r.referrer?.user?.email === selectedReferrerId,
    );
  }, [referrals, selectedReferrerId]);

  if (loading && !referrals.length && !topReferrers.length) {
    return (
      <EcosystemWrapper>
        <EcosystemHeader
          title="Member Referral Network"
          badgeText="Growth & Acquisition"
          description="Monitor member referral velocity, acquisition funnels, and reward attribution."
          icon={Network}
          breadcrumbs={[
            { label: "Members", href: "/members/all" },
            { label: "Referral Network" },
          ]}
        />

        <EcosystemContainer className="p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <Skeleton className="xl:col-span-4 h-96 rounded-2xl" />
            <Skeleton className="xl:col-span-8 h-96 rounded-2xl" />
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Member Referral Network"
        badgeText="Growth & Acquisition"
        description="Monitor member referral velocity, acquisition funnels, and reward attribution across the ecosystem."
        icon={Network}
        breadcrumbs={[
          { label: "Members", href: "/members/all" },
          { label: "Referral Network" },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>
        }
      />

      <SubscriptionLimitBanner subscriptionInfo={subscriptionInfo} />
      <SubscriptionFallbackMessage
        subscriptionInfo={subscriptionInfo}
        isAiMode={false}
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-6"
        >
          <TabsList className="bg-transparent border-b border-zinc-200/80 dark:border-zinc-800 w-full justify-start rounded-none h-11 p-0 gap-6">
            <TabsTrigger
              value="top"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 dark:data-[state=active]:border-zinc-100 rounded-none h-11 px-0 font-bold text-xs text-zinc-500 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 transition-all"
            >
              Top Referrals & Leaderboard
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 dark:data-[state=active]:border-zinc-100 rounded-none h-11 px-0 font-bold text-xs text-zinc-500 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 transition-all"
            >
              Referral Timeline History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top" className="space-y-6 outline-none">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Total Ecosystem Referrals
                </span>
                <p className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                  {totalReferralsCount.toLocaleString()}
                </p>
                <p className="text-[11px] text-zinc-400 font-medium">
                  Cumulative invitations dispatched
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Active Member Referrers
                </span>
                <p className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                  {totalActiveReferrers.toLocaleString()}
                </p>
                <p className="text-[11px] text-zinc-400 font-medium">
                  Members with ≥ 1 confirmed invite
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-zinc-900/20 dark:border-zinc-100/20 bg-zinc-50 dark:bg-zinc-900/90 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                    <Trophy className="h-3 w-3" /> Top Referrer
                  </span>
                  {bestReferrer && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                      Rank #1
                    </span>
                  )}
                </div>
                {bestReferrer ? (
                  <>
                    <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate mt-1">
                      {bestReferrer.referrer?.user?.firstName}{" "}
                      {bestReferrer.referrer?.user?.lastName}
                    </p>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold">
                      {bestReferrer.referralsCount} successful member invites
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-zinc-400 mt-2">
                    No referrers active yet
                  </p>
                )}
              </div>
            </div>

            {/* Leaderboard & Log Table Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Referral Leaderboard */}
              <div className="xl:col-span-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
                <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                      Referral Leaderboard
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Top members ranked by invitations
                    </p>
                  </div>
                  <Sparkles className="h-4 w-4 text-zinc-400" />
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 max-h-[460px] overflow-y-auto">
                  {topReferrers.map((referrer: any, index: number) => {
                    const isTop = index === 0;
                    return (
                      <div
                        key={referrer.referrer?.user?.email}
                        className={cn(
                          "flex items-center gap-3 p-3.5 transition-colors",
                          isTop
                            ? "bg-zinc-900/[0.02] dark:bg-zinc-100/5"
                            : "hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30",
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-bold shrink-0",
                            isTop
                              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                          )}
                        >
                          {index + 1}
                        </div>
                        <UserHoverCard userId={referrer.referrer?.user?.id}>
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-700">
                              <AvatarImage
                                src={`https://cdn.thrico.network/${referrer.referrer?.user?.avatar}`}
                              />
                              <AvatarFallback className="text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                {referrer.referrer?.user?.firstName?.[0]}
                                {referrer.referrer?.user?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                {referrer.referrer?.user?.firstName}{" "}
                                {referrer.referrer?.user?.lastName}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-medium">
                                {isTop ? "Primary Advocate" : "Advocate"}
                              </span>
                            </div>
                          </div>
                        </UserHoverCard>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                            {referrer.referralsCount}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">
                            Invites
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {topReferrers.length === 0 && (
                    <div className="p-8 text-center text-xs text-zinc-400 font-medium">
                      No referral records found.
                    </div>
                  )}
                </div>
              </div>

              {/* Referrer → Referee Log Table */}
              <div className="xl:col-span-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
                <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    Referral Attribution Log
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Individual referrer-to-referee connection pairs
                  </p>
                </div>
                <div className="overflow-hidden">
                  <AdminTable
                    columns={columns}
                    data={referrals}
                    loading={loading}
                    keyExtractor={(row, index) =>
                      `${row.referrer?.user?.email}-${row?.referee?.user?.email}-${index}`
                    }
                    pageSize={10}
                    emptyTitle="No referrals found"
                    emptyDescription="The referral network is currently empty. Connections will appear here as members invite peers."
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Referral Timeline History */}
          <TabsContent value="history" className="space-y-6 outline-none">
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    Chronological Referral Timeline
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Filter by specific member to audit invitation activity
                  </p>
                </div>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[280px] h-9 text-xs font-semibold bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 justify-between"
                    >
                      {selectedReferrerId === "all"
                        ? "All Members"
                        : selectedReferrerName || selectedReferrerId || "Filter by member..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search member name..."
                        className="h-9 text-xs"
                        value={searchQuery}
                        onValueChange={handleSearch}
                      />
                      <CommandList>
                        {!searchLoading && (
                          <CommandEmpty className="text-xs p-3 text-center text-zinc-400">
                            No member found.
                          </CommandEmpty>
                        )}
                        <CommandGroup>
                          <CommandItem
                            value="all members"
                            onSelect={() => {
                              setSelectedReferrerId("all");
                              setSelectedReferrerName(null);
                              setOpen(false);
                              setSearchQuery("");
                            }}
                            className="text-xs font-semibold cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-3.5 w-3.5",
                                selectedReferrerId === "all"
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            All Members
                          </CommandItem>

                          {searchLoading && searchQuery.trim().length > 2 && (
                            <div className="p-3 text-center text-xs text-zinc-400">
                              Searching database...
                            </div>
                          )}

                          {searchQuery.trim().length > 2 &&
                          searchData?.searchUserWithAI?.data
                            ? searchData.searchUserWithAI.data.map((u: any) => (
                                <CommandItem
                                  key={u.email}
                                  value={`${u.firstName} ${u.lastName} ${u.email}`}
                                  onSelect={() => {
                                    setSelectedReferrerId(u.email);
                                    setSelectedReferrerName(
                                      `${u.firstName} ${u.lastName}`,
                                    );
                                    setOpen(false);
                                    setSearchQuery("");
                                  }}
                                  className="text-xs font-semibold cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-3.5 w-3.5",
                                      selectedReferrerId === u.email
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {u.firstName} {u.lastName}
                                </CommandItem>
                              ))
                            : topReferrers
                                .filter(
                                  (r: any) =>
                                    !searchQuery.trim() ||
                                    `${r.referrer?.user?.firstName} ${r.referrer?.user?.lastName} ${r.referrer?.user?.email}`
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase()),
                                )
                                .map((r: any) => (
                                  <CommandItem
                                    key={r.referrer?.user?.email}
                                    value={`${r.referrer?.user?.firstName} ${r.referrer?.user?.lastName} ${r.referrer?.user?.email}`}
                                    onSelect={() => {
                                      setSelectedReferrerId(
                                        r.referrer?.user?.email,
                                      );
                                      setSelectedReferrerName(
                                        `${r.referrer?.user?.firstName} ${r.referrer?.user?.lastName}`,
                                      );
                                      setOpen(false);
                                      setSearchQuery("");
                                    }}
                                    className="text-xs font-semibold cursor-pointer"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-3.5 w-3.5",
                                        selectedReferrerId ===
                                          r.referrer?.user?.email
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {r.referrer?.user?.firstName}{" "}
                                    {r.referrer?.user?.lastName} (
                                    {r.referralsCount} invites)
                                  </CommandItem>
                                ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="p-6">
                {timelineHistory.length > 0 ? (
                  <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 space-y-6 pb-2">
                    {timelineHistory.map((row: any, i: number) => {
                      const referee = row.referee?.user;
                      const isFirst = i === timelineHistory.length - 1;
                      return (
                        <div
                          key={`${referee?.email}-${i}`}
                          className="relative pl-6"
                        >
                          {/* Timeline node */}
                          <div className="absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full border-2 border-zinc-900 bg-white dark:bg-zinc-900 dark:border-zinc-100 shadow-xs" />

                          <div className="flex items-start justify-between gap-4">
                            <UserHoverCard userId={referee?.id}>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-700">
                                  <AvatarImage
                                    src={`https://cdn.thrico.network/${referee?.avatar}`}
                                  />
                                  <AvatarFallback className="text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                    {referee?.firstName?.[0]}
                                    {referee?.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                    Invited {referee?.firstName}{" "}
                                    {referee?.lastName}
                                  </span>
                                  <span className="text-[11px] text-zinc-400 font-medium">
                                    {row.referee?.isApproved
                                      ? "Active member account"
                                      : "Invitation pending activation"}
                                    {isFirst &&
                                      selectedReferrerId !== "all" &&
                                      " · First referral"}
                                  </span>
                                </div>
                              </div>
                            </UserHoverCard>

                            <span className="text-xs font-semibold text-zinc-400 whitespace-nowrap pt-1">
                              {safeLocaleDateString(referee?.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-zinc-400 text-xs font-medium">
                    No referral events match the selected criteria.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <SubscriptionUpgradeBlock
          subscriptionInfo={subscriptionInfo}
          totalCount={totalReferralsCount}
          isLoading={loading}
        />
      </EcosystemContainer>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="referrals"
        description="Export all referral pairs as CSV. Includes referrer name, referee name, email, status, and join date."
        totalCount={totalReferralsCount}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = referrals as any[];
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: "No referral records found." });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Referrer First Name", getValue: (r) => r.referrer?.user?.firstName || "" },
            { header: "Referrer Last Name",  getValue: (r) => r.referrer?.user?.lastName || "" },
            { header: "Referrer Email",      getValue: (r) => r.referrer?.user?.email || "" },
            { header: "Referee First Name",  getValue: (r) => r.referee?.user?.firstName || "" },
            { header: "Referee Last Name",   getValue: (r) => r.referee?.user?.lastName || "" },
            { header: "Referee Email",       getValue: (r) => r.referee?.user?.email || "" },
            { header: "Status",              getValue: (r) => r.referee?.isApproved ? "Active" : "Pending" },
            { header: "Joined",              getValue: (r) => r.referee?.user?.createdAt ? new Date(r.referee.user.createdAt).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `referrals-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} referral${rows.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}
