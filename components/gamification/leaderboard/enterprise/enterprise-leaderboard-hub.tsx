"use client";

import React, { useState } from "react";
import {
  useGetEnterpriseClient,
  useGetEnterpriseLeaderboards,
  EnterpriseLeaderboardConfig,
} from "@/graphql/actions/enterprise-leaderboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Trophy,
  KeyRound,
  Globe,
  Code2,
  Gauge,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { EnterpriseLeaderboardsTable } from "./enterprise-leaderboards-table";
import { ApiCredentialsCard } from "./api-credentials-card";
import { AllowedDomainsCard } from "./allowed-domains-card";
import { EmbedCodeCard } from "./embed-code-card";
import { CreateLeaderboardDialog } from "./create-leaderboard-dialog";

export interface EnterpriseLeaderboardHubProps {
  className?: string;
}

export function EnterpriseLeaderboardHub({ className }: EnterpriseLeaderboardHubProps = {}) {
  const [activeTab, setActiveTab] = useState("leaderboards");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEmbedCode, setSelectedEmbedCode] = useState<string | undefined>(undefined);

  // Queries
  const {
    data: clientData,
    loading: clientLoading,
    refetch: refetchClient,
  } = useGetEnterpriseClient({
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: leaderboardsData,
    loading: leaderboardsLoading,
    refetch: refetchLeaderboards,
  } = useGetEnterpriseLeaderboards({
    notifyOnNetworkStatusChange: true,
  });

  const client = clientData?.getEnterpriseClient || null;
  const leaderboards = (leaderboardsData?.getEnterpriseLeaderboards ||
    []) as EnterpriseLeaderboardConfig[];

  const activeLeaderboardsCount = leaderboards.filter(
    (l) => l.status === "ACTIVE"
  ).length;

  const handleSelectEmbed = (code: string) => {
    setSelectedEmbedCode(code);
    setActiveTab("embed");
  };

  const handleRefetchAll = () => {
    refetchClient();
    refetchLeaderboards();
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* ── Top Metric Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Leaderboards */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card shadow-2xs">
          <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary">
            <Trophy className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">
              Configured Leaderboards
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-foreground tracking-tight">
                {leaderboards.length}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                ({activeLeaderboardsCount} Active)
              </span>
            </div>
          </div>
        </div>

        {/* Client Status */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card shadow-2xs">
          <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-muted-foreground">
              Client Authentication
            </span>
            <span className="text-sm font-bold text-foreground truncate">
              {client?.isActive ? "Live & Provisioned" : "Client Suspended"}
            </span>
          </div>
        </div>

        {/* Whitelisted Domains */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card shadow-2xs">
          <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Globe className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">
              Allowed Domains (CORS)
            </span>
            <span className="text-xl font-bold text-foreground tracking-tight">
              {client?.allowedDomains?.length || 0}
            </span>
          </div>
        </div>

        {/* Rate Limit */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card shadow-2xs">
          <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Gauge className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">
              Throughput Rate Limit
            </span>
            <span className="text-xl font-bold text-foreground tracking-tight">
              {client?.rateLimitPerMinute?.toLocaleString() || "3,000"}{" "}
              <span className="text-xs font-normal text-muted-foreground">/min</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Sub Navigation Tabs ────────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <TabsList className="bg-muted p-0.5 rounded-lg border border-border h-9">
            <TabsTrigger
              value="leaderboards"
              className="text-xs h-8 px-3.5 gap-2 font-medium"
            >
              <Trophy className="h-3.5 w-3.5" />
              Leaderboards
              {leaderboards.length > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  {leaderboards.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="credentials"
              className="text-xs h-8 px-3.5 gap-2 font-medium"
            >
              <KeyRound className="h-3.5 w-3.5" />
              API Credentials
            </TabsTrigger>
            <TabsTrigger
              value="domains"
              className="text-xs h-8 px-3.5 gap-2 font-medium"
            >
              <Globe className="h-3.5 w-3.5" />
              Allowed Domains
              {client?.allowedDomains && client.allowedDomains.length > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  {client.allowedDomains.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="embed"
              className="text-xs h-8 px-3.5 gap-2 font-medium"
            >
              <Code2 className="h-3.5 w-3.5" />
              Embed & SDK
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefetchAll}
              disabled={clientLoading || leaderboardsLoading}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              title="Refresh data"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  clientLoading || leaderboardsLoading ? "animate-spin" : ""
                }`}
              />
            </Button>
            <Button
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="h-8 gap-1.5 text-xs font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              New Leaderboard
            </Button>
          </div>
        </div>

        {/* Tab 1: Leaderboards Table */}
        <TabsContent value="leaderboards" className="p-0 m-0">
          <EnterpriseLeaderboardsTable
            leaderboards={leaderboards}
            loading={leaderboardsLoading}
            onCreateNew={() => setShowCreateDialog(true)}
            onSelectEmbed={handleSelectEmbed}
          />
        </TabsContent>

        {/* Tab 2: API Credentials & Security */}
        <TabsContent value="credentials" className="p-0 m-0">
          <ApiCredentialsCard client={client} loading={clientLoading} />
        </TabsContent>

        {/* Tab 3: Allowed Domains */}
        <TabsContent value="domains" className="p-0 m-0">
          <AllowedDomainsCard client={client} loading={clientLoading} />
        </TabsContent>

        {/* Tab 4: Embed & SDK */}
        <TabsContent value="embed" className="p-0 m-0">
          <EmbedCodeCard
            client={client}
            leaderboards={leaderboards}
            selectedCode={selectedEmbedCode}
          />
        </TabsContent>
      </Tabs>

      {/* Create Leaderboard Modal */}
      <CreateLeaderboardDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => refetchLeaderboards()}
      />
    </div>
  );
}
