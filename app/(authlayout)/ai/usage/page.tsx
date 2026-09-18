"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  BarChart3,
  Coins,
  CreditCard,
  Plus,
  RotateCcw,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Zap,
  Layers,
  Cpu,
  AlertCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetAiWalletOverview,
  useGetAiBillingHistory,
} from "@/graphql/actions/ai";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { AITopupModal } from "@/components/ai/ai-topup-modal";
import { AiUsageLedger } from "@/components/ai/ai-usage-ledger";
import { cn } from "@/lib/utils";

function AIUsageContent() {
  const searchParams = useSearchParams();
  const initialModule = searchParams.get("module") || undefined;
  const initialAction = searchParams.get("action") || undefined;
  const urlTab = searchParams.get("tab");
  const isInsufficientBalanceParam =
    searchParams.get("insufficient_balance") === "true";

  const [activeTab, setActiveTab] = useState<string>(
    urlTab === "topups" || urlTab === "quota" || isInsufficientBalanceParam
      ? "topups"
      : "ledger"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [hasAutoOpenedModal, setHasAutoOpenedModal] = useState(false);
  const { setShowBuyPlanDialog } = useSubscriptionStore();

  const {
    data,
    loading: overviewLoading,
    refetch: refetchOverview,
  } = useGetAiWalletOverview();

  const {
    data: historyData,
    loading: historyLoading,
    refetch: refetchHistory,
  } = useGetAiBillingHistory();

  // Automatically trigger top-up modal if redirected from chat due to zero balance
  useEffect(() => {
    if (isInsufficientBalanceParam && !hasAutoOpenedModal) {
      setShowTopupModal(true);
      setHasAutoOpenedModal(true);
    }
  }, [isInsufficientBalanceParam, hasAutoOpenedModal]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshKey((k) => k + 1);
    await Promise.all([refetchOverview(), refetchHistory()]);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const loading = overviewLoading || historyLoading;

  const quota = data?.getAiWalletOverview?.quota || {
    entityId: "",
    balance: 0,
    usedThisMonth: 0,
    totalUsed: 0,
    usagePercent: 0,
  };

  const balance = quota.balance || 0;
  const usedThisMonth = quota.usedThisMonth || 0;
  const totalUsed = quota.totalUsed || 0;
  const usagePercent = quota.usagePercent || 0;

  // Real billing history from backend
  const rawHistory: any[] =
    data?.getAiWalletOverview?.billingHistory ||
    historyData?.getAiBillingHistory ||
    [];

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title="AI Compute Usage & Token Ledger"
        description="Monitor inference token consumption, inspect top-up purchase history, and manage compute allowances"
        icon={BarChart3}
        badgeText="Audit & Quotas"
        breadcrumbs={[
          { label: "AI", href: "/ai" },
          { label: "Usage & Billing" },
        ]}
        actions={
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all cursor-pointer"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh All AI Metrics"
            >
              <RotateCcw
                size={14}
                className={cn(isRefreshing && "animate-spin")}
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBuyPlanDialog(true)}
              className="h-9 rounded-lg text-xs gap-1.5 font-medium border-border cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Manage Tier
            </Button>
            <Button
              size="sm"
              onClick={() => setShowTopupModal(true)}
              className="h-9 rounded-lg gap-2 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Credits
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        {/* ─── Zero Balance Notification Banner ─── */}
        {(isInsufficientBalanceParam || (!loading && balance <= 0)) && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  AI Chat Copilot Access Paused
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  Your token balance is currently{" "}
                  <span className="font-semibold text-foreground">0 tokens</span>.
                  AI Chat Copilot requires available compute tokens. Add credits below to restore immediate access.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <Button
                size="sm"
                onClick={() => setShowTopupModal(true)}
                className="h-8 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg gap-1.5 shadow-2xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Credits Now
              </Button>
            </div>
          </div>
        )}
        {/* ─── 4 Top Usage Metric Cards ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="border-border/60 bg-card shadow-2xs">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Available Token Balance
                </span>
                <Coins className="h-4 w-4 text-indigo-500" />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-28 rounded" />
              ) : (
                <p className="text-2xl font-black text-foreground tabular-nums tracking-tight">
                  {balance.toLocaleString()}
                </p>
              )}
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                Active wallet balance ready for compute
              </span>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-2xs">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Used This Month
                </span>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-28 rounded" />
              ) : (
                <p className="text-2xl font-black text-foreground tabular-nums tracking-tight">
                  {usedThisMonth.toLocaleString()}
                </p>
              )}
              <span className="text-[10px] text-muted-foreground block">
                Tokens consumed this billing cycle
              </span>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-2xs">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Monthly Quota Consumed
                </span>
                <Sparkles className="h-4 w-4 text-purple-500" />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16 rounded" />
              ) : (
                <p className="text-2xl font-black text-foreground tabular-nums tracking-tight">
                  {usagePercent}%
                </p>
              )}
              <Progress
                value={Math.min(100, usagePercent)}
                className="h-1.5 bg-muted"
              />
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-2xs">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Lifetime Tokens Consumed
                </span>
                <CreditCard className="h-4 w-4 text-amber-500" />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-28 rounded" />
              ) : (
                <p className="text-2xl font-black text-foreground tabular-nums tracking-tight">
                  {totalUsed.toLocaleString()}
                </p>
              )}
              <span className="text-[10px] text-muted-foreground block">
                Total inference across all entities
              </span>
            </CardContent>
          </Card>
        </div>

        {/* ─── Main Content Tabs ───────────────────────────────────────────── */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-border pb-1">
            <TabsList className="bg-muted/40 p-1 rounded-xl h-10 border border-border/60">
              <TabsTrigger
                value="ledger"
                className="text-xs font-semibold px-4 py-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-2xs gap-1.5"
              >
                <Coins className="h-3.5 w-3.5 text-indigo-500" />
                <span>Token Usage Ledger</span>
              </TabsTrigger>
              <TabsTrigger
                value="topups"
                className="text-xs font-semibold px-4 py-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-2xs gap-1.5"
              >
                <CreditCard className="h-3.5 w-3.5 text-amber-500" />
                <span>Top-Up & Invoices</span>
                {rawHistory.length > 0 && (
                  <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
                    {rawHistory.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="quota"
                className="text-xs font-semibold px-4 py-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-2xs gap-1.5"
              >
                <Cpu className="h-3.5 w-3.5 text-emerald-500" />
                <span>Allowance & Status</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ─── TAB 1: Token Usage Ledger ─────────────────────────────────── */}
          <TabsContent value="ledger" className="space-y-4 pt-1 focus-visible:outline-none">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span>Inference Token Deduction Ledger</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Detailed telemetry of granular token consumption across Moderation, Customer 360, AI Agents, and Content operations.
              </p>
            </div>

            <AiUsageLedger
              key={refreshKey}
              initialModule={initialModule}
              initialAction={initialAction}
              onRefreshParent={handleRefresh}
            />
          </TabsContent>

          {/* ─── TAB 2: Top-Up Purchase History ────────────────────────────── */}
          <TabsContent value="topups" className="space-y-4 pt-1 focus-visible:outline-none">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Top-Up Purchase History
                </h3>
                <p className="text-xs text-muted-foreground">
                  Token credit transactions and automated tax invoices
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTopupModal(true)}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Buy Top-up Pack
              </Button>
            </div>

            <Card className="border-border/60 bg-card overflow-hidden shadow-2xs">
              {rawHistory.length === 0 ? (
                <div className="py-14 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      No purchase transactions yet
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Token top-up orders and tax invoices will appear here once
                      purchased.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowTopupModal(true)}
                    className="h-8 text-xs font-semibold gap-1.5 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Buy Top-up Pack
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase font-bold tracking-wider border-b border-border">
                      <tr>
                        <th className="py-3 px-4">Package</th>
                        <th className="py-3 px-4">Tokens Credited</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-normal">
                      {rawHistory.map((item: any, idx: number) => (
                        <tr
                          key={item.id || item.billingId || idx}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-3 px-4 font-semibold text-foreground">
                            {item.name || item.packageName || "AI Token Pack"}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                            +
                            {(
                              item.numberOfTokens ||
                              item.tokens ||
                              0
                            ).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 tabular-nums font-bold text-foreground">
                            ₹
                            {(
                              item.totalAmount ||
                              item.amount ||
                              item.price ||
                              0
                            ).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString()
                              : "Recent"}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3" />
                              {item.status || "PAID"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* ─── TAB 3: Quota & Compute Status ─────────────────────────────── */}
          <TabsContent value="quota" className="space-y-4 pt-1 focus-visible:outline-none">
            <Card className="border-border/60 bg-card shadow-2xs">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Inference Quota Status
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Current allowance balance and compute status
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      Status:{" "}
                      <strong className="text-foreground">
                        {balance > 0 ? "Active & Healthy" : "Quota Depleted"}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-xl bg-muted/40 space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Current Available Compute
                    </span>
                    {loading ? (
                      <Skeleton className="h-6 w-32 rounded" />
                    ) : (
                      <p className="text-xl font-bold text-foreground tabular-nums">
                        {balance.toLocaleString()} Tokens
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground">
                      Remaining balance ready for autonomous execution
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Monthly Consumption
                    </span>
                    {loading ? (
                      <Skeleton className="h-6 w-32 rounded" />
                    ) : (
                      <p className="text-xl font-bold text-foreground tabular-nums">
                        {usedThisMonth.toLocaleString()} Tokens
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground">
                      Inference consumed by AI Copilot and agents
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Topup Modal */}
        {showTopupModal && (
          <AITopupModal
            onClose={() => setShowTopupModal(false)}
            quota={quota}
          />
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default function AIUsagePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-4">
          <Skeleton className="h-10 w-48 rounded" />
          <Skeleton className="h-28 w-full rounded" />
          <Skeleton className="h-64 w-full rounded" />
        </div>
      }
    >
      <AIUsageContent />
    </Suspense>
  );
}
