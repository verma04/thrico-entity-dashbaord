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
  Loader2,
  Network,
  Trophy,
  Users,
  Star,
  ChevronDown,
  Circle,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReferralsUI() {
  const [activeTab, setActiveTab] = useState("top");
  const [selectedReferrerId, setSelectedReferrerId] = useState<string>("all");
  const [selectedReferrerName, setSelectedReferrerName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
          <div className="flex items-center gap-2.5 py-1">
            <Avatar className="h-7 w-7">
              <AvatarImage
                src={`https://cdn.thrico.network/${referrer?.avatar}`}
              />
              <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                {referrer?.firstName?.[0]}
                {referrer?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-semibold">
              {referrer?.firstName} {referrer?.lastName}
            </span>
          </div>
        );
      },
    },
    {
      key: "referee",
      header: "REFEREE",
      cell: (row) => {
        const referee = row.referee?.user;
        return (
          <div className="flex items-center gap-2.5 py-1">
            <Avatar className="h-7 w-7 border border-primary/10">
              <AvatarImage
                src={`https://cdn.thrico.network/${referee?.avatar}`}
              />
              <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                {referee?.firstName?.[0]}
                {referee?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">
              {referee?.firstName} {referee?.lastName}
            </span>
          </div>
        );
      },
    },
    {
      key: "joined",
      header: "JOINED",
      cell: (row) => (
        <span className="text-xs text-muted-foreground font-medium">
          {safeLocaleDateString(row.referee?.user?.createdAt)}
        </span>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      cell: (row) => (
        <Badge
          variant="outline"
          className={
            row.referee?.isApproved
              ? "bg-emerald-50/50 text-emerald-600 border-emerald-100 text-[10px] font-semibold py-0.5"
              : "bg-amber-50/50 text-amber-600 border-amber-100 text-[10px] font-semibold py-0.5"
          }
        >
          {row.referee?.isApproved ? "Active" : "Pending"}
        </Badge>
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
      <EcosystemWrapper className="gap-6 m-4">
        <EcosystemHeader
          title="Referral Network"
          badgeText="Connections"
          description="Monitor who is actively referring new members and track the approval status of invited users."
          icon={Network}
          breadcrumbs={[
            { label: "Members", href: "/members/all" },
            { label: "Referrals" },
          ]}
        />

        <EcosystemContainer className="m-4">
          <div className="w-full space-y-6">
            <div className="border-b border-border w-full flex gap-6 h-12">
              <Skeleton className="h-4 w-24 mt-4" />
              <Skeleton className="h-4 w-32 mt-4" />
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[104px] rounded-xl" />
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <Skeleton className="xl:col-span-4 h-[500px] rounded-xl" />
                <Skeleton className="xl:col-span-8 h-[500px] rounded-xl" />
              </div>
            </div>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper className="">
      <EcosystemHeader
        title="Referral Network"
        badgeText="Connections"
        description="Monitor who is actively referring new members and track the approval status of invited users."
        icon={Network}
        breadcrumbs={[
          { label: "Members", href: "/members/all" },
          { label: "Referrals" },
        ]}
      />

      <SubscriptionLimitBanner subscriptionInfo={subscriptionInfo} />
      <SubscriptionFallbackMessage
        subscriptionInfo={subscriptionInfo}
        isAiMode={false}
      />

      <EcosystemContainer className="m-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full "
        >
          <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-12 p-0 gap-6">
            <TabsTrigger
              value="top"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0 font-semibold text-muted-foreground data-[state=active]:text-foreground"
            >
              Top Referrals
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0 font-semibold text-muted-foreground data-[state=active]:text-foreground"
            >
              Referral History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top" className="space-y-6 outline-none">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-sm rounded-xl">
                <CardHeader className="pb-2 pt-5">
                  <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Total Referrals
                  </CardDescription>
                  <CardTitle className="text-3xl font-bold">
                    {totalReferralsCount}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="shadow-sm rounded-xl">
                <CardHeader className="pb-2 pt-5">
                  <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Active Referrers
                  </CardDescription>
                  <CardTitle className="text-3xl font-bold">
                    {totalActiveReferrers}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="shadow-sm rounded-xl bg-indigo-50/50 border-indigo-100">
                <CardHeader className="pb-2 pt-5">
                  <CardDescription className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Top Referrer
                  </CardDescription>
                  {bestReferrer ? (
                    <>
                      <CardTitle className="text-xl font-bold text-indigo-950 mt-1">
                        {bestReferrer.referrer?.user?.firstName}{" "}
                        {bestReferrer.referrer?.user?.lastName}
                      </CardTitle>
                      <p className="text-xs text-indigo-600/80 font-medium mt-1">
                        {bestReferrer.referralsCount} referrals — highest in the
                        community
                      </p>
                    </>
                  ) : (
                    <CardTitle className="text-xl font-bold text-indigo-900/40 mt-1">
                      No referrers yet
                    </CardTitle>
                  )}
                </CardHeader>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Leaderboard */}
              <Card className="xl:col-span-4 shadow-sm rounded-xl border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-bold">
                    Referral leaderboard
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Members ranked by number of people referred
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col">
                    {topReferrers.map((referrer: any, index: number) => {
                      const isTop = index === 0;
                      return (
                        <div
                          key={referrer.referrer?.user?.email}
                          className={`flex items-center gap-3 p-4 border-t border-border ${isTop ? "bg-indigo-50/30" : ""}`}
                        >
                          <div
                            className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${isTop ? "bg-indigo-600 text-white" : "bg-secondary text-secondary-foreground"}`}
                          >
                            {index + 1}
                          </div>
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={`https://cdn.thrico.network/${referrer.referrer?.user?.avatar}`}
                            />
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                              {referrer.referrer?.user?.firstName?.[0]}
                              {referrer.referrer?.user?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-semibold truncate">
                              {referrer.referrer?.user?.firstName}{" "}
                              {referrer.referrer?.user?.lastName}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium">
                              {isTop ? "Top referrer" : "Referrer"}
                            </span>
                          </div>
                          <div className="flex flex-col items-end justify-center">
                            <span className="text-sm font-bold">
                              {referrer.referralsCount}
                            </span>
                            <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">
                              Referred
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {topReferrers.length === 0 && (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        No referrers found.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Log Table */}
              <Card className="xl:col-span-8 shadow-sm rounded-xl border-border overflow-hidden">
                <CardHeader className="pb-4 border-b border-border">
                  <CardTitle className="text-sm font-bold">
                    Referrer → Referee log
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Every referral pair, most recent first
                  </CardDescription>
                </CardHeader>
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
                    emptyDescription="The referral network is currently empty. Connections will appear here as members invite others."
                  />
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 outline-none">
            <Card className="shadow-sm rounded-xl border-border">
              <CardHeader className="pb-4 border-b border-border flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold">
                    Referral history
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Chronological referral timeline for a single member
                  </CardDescription>
                </div>
                <div>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[280px] h-9 text-xs font-semibold bg-white justify-between"
                      >
                        {selectedReferrerId === "all"
                          ? "All Members"
                          : selectedReferrerName || selectedReferrerId || "Select a member..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search member..."
                          className="h-9 text-xs"
                          value={searchQuery}
                          onValueChange={handleSearch}
                        />
                        <CommandList>
                          {!searchLoading && <CommandEmpty className="text-xs p-4 text-center text-muted-foreground">No member found.</CommandEmpty>}
                          <CommandGroup>
                            <CommandItem
                              value="all members"
                              onSelect={() => {
                                setSelectedReferrerId("all");
                                setSelectedReferrerName(null);
                                setOpen(false);
                                setSearchQuery("");
                              }}
                              className="text-xs font-medium"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedReferrerId === "all" ? "opacity-100" : "opacity-0"
                                )}
                              />
                              All Members
                            </CommandItem>
                            
                            {searchLoading && searchQuery.trim().length > 2 && (
                              <div className="p-4 text-center text-xs text-muted-foreground">Searching backend...</div>
                            )}

                            {searchQuery.trim().length > 2 && searchData?.searchUserWithAI?.data ? (
                              searchData.searchUserWithAI.data.map((u: any) => (
                                <CommandItem
                                  key={u.email}
                                  value={`${u.firstName} ${u.lastName} ${u.email}`}
                                  onSelect={() => {
                                    setSelectedReferrerId(u.email);
                                    setSelectedReferrerName(`${u.firstName} ${u.lastName}`);
                                    setOpen(false);
                                    setSearchQuery("");
                                  }}
                                  className="text-xs font-medium"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedReferrerId === u.email ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {u.firstName} {u.lastName}
                                </CommandItem>
                              ))
                            ) : (
                              topReferrers
                                .filter((r: any) =>
                                  !searchQuery.trim() ||
                                  `${r.referrer?.user?.firstName} ${r.referrer?.user?.lastName} ${r.referrer?.user?.email}`
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())
                                )
                                .map((r: any) => (
                                <CommandItem
                                  key={r.referrer?.user?.email}
                                  value={`${r.referrer?.user?.firstName} ${r.referrer?.user?.lastName} ${r.referrer?.user?.email}`}
                                  onSelect={() => {
                                    setSelectedReferrerId(r.referrer?.user?.email);
                                    setSelectedReferrerName(`${r.referrer?.user?.firstName} ${r.referrer?.user?.lastName}`);
                                    setOpen(false);
                                    setSearchQuery("");
                                  }}
                                  className="text-xs font-medium"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedReferrerId === r.referrer?.user?.email ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {r.referrer?.user?.firstName} {r.referrer?.user?.lastName} ({r.referralsCount} referrals)
                                </CommandItem>
                              ))
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {timelineHistory.length > 0 ? (
                  <div className="relative border-l border-border/50 ml-4 space-y-8 pb-4">
                    {timelineHistory.map((row: any, i: number) => {
                      const referee = row.referee?.user;
                      const isFirst = i === timelineHistory.length - 1;
                      return (
                        <div
                          key={`${referee?.email}-${i}`}
                          className="relative pl-8"
                        >
                          {/* Timeline node */}
                          <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full border-2 border-indigo-600 bg-white shadow-sm" />

                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 bg-indigo-50/50 text-indigo-600 border border-indigo-100">
                                <AvatarImage src={`https://cdn.thrico.network/${referee?.avatar}`} />
                                <AvatarFallback className="text-[10px] font-bold bg-transparent">
                                  {referee?.firstName?.[0]}
                                  {referee?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold">
                                  Referred {referee?.firstName}{" "}
                                  {referee?.lastName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {row.referee?.isApproved
                                    ? "Active member"
                                    : "Invite pending activation"}
                                  {isFirst &&
                                    selectedReferrerId !== "all" &&
                                    " · First referral"}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap pt-1">
                              {safeLocaleDateString(referee?.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No referrals match the selected criteria.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <SubscriptionUpgradeBlock
          subscriptionInfo={subscriptionInfo}
          totalCount={totalReferralsCount}
          isLoading={loading}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
