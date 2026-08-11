"use client";

import React from "react";
import {
  Trophy,
  Star,
  Hash,
  Award,
  Clock,
  TrendingUp,
  Coins,
  Gift,
  Activity,
  TrendingDown,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetUserActivityLog,
  useGetUserEarnedBadges,
  useGetGamificationSummary,
} from "@/graphql/actions/gamification/gamification-quiries";
import { useGetCurrencyTransactions } from "@/graphql/actions/currency";
import { useGetRedemptions } from "@/graphql/actions/rewards";
import {
  safeFormatDistanceToNow,
  safeLocaleDateString,
} from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { useMemberDetails } from "./member-context";

/* ── Summary Cards ───────────────────────────────────────────────────────── */

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconClassName?: string;
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("p-2 rounded-lg bg-muted", iconClassName)}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Badges List ─────────────────────────────────────────────────────────── */

function MemberBadgesList({ userId }: { userId: string }) {
  const { data, loading } = useGetUserEarnedBadges(userId, 6);
  const badges = data?.getUserEarnedBadges?.edges || [];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
        No badges earned yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {badges.map((edge: any, idx: number) => (
        <Card key={idx} className="border-border">
          <CardContent className="p-3 flex items-start gap-3">
            <div className="h-9 w-9 shrink-0 bg-muted rounded-lg flex items-center justify-center text-lg">
              {edge.node.icon || (
                <Award className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-medium truncate">{edge.node.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {edge.node.description}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {edge.node.userProgress?.createdAt
                  ? safeLocaleDateString(edge.node.userProgress.createdAt)
                  : "Active"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ── Activity Log ────────────────────────────────────────────────────────── */

function MemberActivityLog({ userId }: { userId: string }) {
  const [limit, setLimit] = React.useState(5);
  const { data, loading } = useGetUserActivityLog(userId, limit);
  const logs = data?.getUserActivityLog || [];

  if (loading && logs.length === 0) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
        No recent activity.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log: any, idx: number) => (
        <div
          key={idx}
          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
        >
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
              log.type === "BADGE"
                ? "bg-amber-50 text-amber-600"
                : "bg-primary/10 text-primary",
            )}
          >
            {log.type === "BADGE" ? (
              <Award className="h-4 w-4" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {log.ruleDescription ||
                log.badgeName ||
                log.ruleAction ||
                log.type ||
                "Activity recorded"}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold text-primary">+{log.points}</p>
            <p className="text-[10px] text-muted-foreground">
              {safeFormatDistanceToNow(log.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}

      {logs.length >= limit && (
        <Button
          variant="outline"
          className="w-full mt-2"
          size="sm"
          onClick={() => setLimit((prev) => prev + 10)}
          disabled={loading}
        >
          {loading ? "Loading..." : "View More"}
        </Button>
      )}
    </div>
  );
}

/* ── Coins Log ───────────────────────────────────────────────────────────── */

function MemberCoinsLog({ userId }: { userId: string }) {
  const { data, loading, fetchMore } = useGetCurrencyTransactions({
    userId,
    limit: 20,
  });
  const transactions = data?.getCurrencyTransactions?.items || [];
  const nextCursor = data?.getCurrencyTransactions?.nextCursor;
  const [fetchingMore, setFetchingMore] = React.useState(false);

  const handleLoadMore = async () => {
    if (!nextCursor) return;
    setFetchingMore(true);
    try {
      await fetchMore({
        variables: { cursor: nextCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            getCurrencyTransactions: {
              ...fetchMoreResult.getCurrencyTransactions,
              items: [
                ...prev.getCurrencyTransactions.items,
                ...fetchMoreResult.getCurrencyTransactions.items,
              ],
            },
          };
        },
      });
    } finally {
      setFetchingMore(false);
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
        No recent coin transactions.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((txn: any, idx: number) => (
        <div
          key={idx}
          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
        >
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
              txn.amount > 0
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600",
            )}
          >
            {txn.amount > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {txn.metadata?.description || txn.type || "Transaction"}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p
              className={cn(
                "text-sm font-semibold",
                txn.amount > 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {txn.amount > 0 ? "+" : ""}
              {txn.amount}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {safeFormatDistanceToNow(txn.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}

      {nextCursor && (
        <Button
          variant="outline"
          className="w-full mt-2"
          size="sm"
          onClick={handleLoadMore}
          disabled={loading || fetchingMore}
        >
          {fetchingMore ? "Loading..." : "View More"}
        </Button>
      )}
    </div>
  );
}

/* ── Rewards Log ─────────────────────────────────────────────────────────── */

function MemberRewardsLog({ userId }: { userId: string }) {
  const [limit, setLimit] = React.useState(10);
  const { data, loading } = useGetRedemptions({
    userId,
    pagination: { page: 1, limit },
  });

  const redemptions = data?.getRedemptions || [];

  if (loading && redemptions.length === 0) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  if (redemptions.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
        No rewards redeemed yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {redemptions.map((redemption: any, idx: number) => (
        <div
          key={idx}
          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
        >
          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-purple-50 text-purple-600">
            {redemption.reward?.image ? (
              <img
                src={redemption.reward.image}
                alt="Reward"
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <Gift className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {redemption.reward?.title || "Unknown Reward"}
            </p>
            <p className="text-xs text-muted-foreground">
              Status:{" "}
              <span className="capitalize">
                {redemption.status?.toLowerCase()}
              </span>
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold text-purple-600">
              -{redemption.totalCost || 0}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {safeFormatDistanceToNow(
                redemption.claimedAt || redemption.createdAt,
                { addSuffix: true },
              )}
            </p>
          </div>
        </div>
      ))}

      {redemptions.length >= limit && (
        <Button
          variant="outline"
          className="w-full mt-2"
          size="sm"
          onClick={() => setLimit((prev) => prev + 10)}
          disabled={loading}
        >
          {loading ? "Loading..." : "View More"}
        </Button>
      )}
    </div>
  );
}

/* ── Main Tab ────────────────────────────────────────────────────────────── */

export function GamificationTab({ userId }: { userId: string }) {
  const { data: gamificationData, loading } = useGetGamificationSummary(userId);
  const summary = gamificationData?.getUserGamificationSummary;
  const { member } = useMemberDetails();

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <SummaryCard
          label="Impact Score"
          value={member?.impactScore || 0}
          icon={Activity}
          iconClassName="text-green-500"
        />
        <SummaryCard
          label="Total Points"
          value={loading ? "..." : `${summary?.totalPointsEarned || 0} `}
          icon={Trophy}
          iconClassName="text-primary"
        />
        <SummaryCard
          label="Badges Earned"
          value={loading ? "..." : summary?.totalBadgesEarned || 0}
          icon={Award}
          iconClassName="text-blue-500"
        />
        <SummaryCard
          label="Current Rank"
          value={loading ? "..." : `#${summary?.rankPosition || "N/A"}`}
          icon={Hash}
          iconClassName="text-orange-500"
        />
        <SummaryCard
          label="Coins Balance"
          value={member?.entityCurrencyWallet?.balance || 0}
          icon={Coins}
          iconClassName="text-yellow-500"
        />
        <SummaryCard
          label="Rewards Redeemed"
          value={member?.entityCurrencyWallet?.totalSpent || 0}
          icon={Gift}
          iconClassName="text-purple-500"
        />
      </div>

      <Tabs defaultValue="badges" className="w-full mt-8">
        <div className="overflow-x-auto overflow-y-hidden border-b border-border/60 mb-6 pb-[1px] no-scrollbar">
          <TabsList className="w-auto flex justify-start gap-2 bg-transparent p-0 h-auto rounded-none">
            <TabsTrigger
              value="badges"
              className="gap-2 px-4 py-3 text-xs font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              <Award className="h-4 w-4" /> Badges
            </TabsTrigger>
            <TabsTrigger
              value="points"
              className="gap-2 px-4 py-3 text-xs font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              <Clock className="h-4 w-4" /> Points
            </TabsTrigger>
            <TabsTrigger
              value="coins"
              className="gap-2 px-4 py-3 text-xs font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              <Coins className="h-4 w-4" /> Coins
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="gap-2 px-4 py-3 text-xs font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              <Gift className="h-4 w-4" /> Rewards
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="badges"
          className="mt-0 outline-none animate-in fade-in-50 duration-500"
        >
          <MemberBadgesList userId={userId} />
        </TabsContent>
        <TabsContent
          value="points"
          className="mt-0 outline-none animate-in fade-in-50 duration-500"
        >
          <MemberActivityLog userId={userId} />
        </TabsContent>
        <TabsContent
          value="coins"
          className="mt-0 outline-none animate-in fade-in-50 duration-500"
        >
          <MemberCoinsLog userId={userId} />
        </TabsContent>
        <TabsContent
          value="rewards"
          className="mt-0 outline-none animate-in fade-in-50 duration-500"
        >
          <MemberRewardsLog userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
