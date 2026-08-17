"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Contact2,
  Users,
  GitMerge,
  ShieldCheck,
  FileText,
  Settings,
  RefreshCw,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Globe,
  Sliders,
  Sparkles,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetCRMHubStats,
  useGetCRMConnections,
  useGetCRMSyncLogs,
  useTriggerCRMSync,
  CRMProvider,
  CRMSyncType,
  CRM_PROVIDERS_CONFIG,
} from "@/graphql/actions";

export default function CRMDashboardPage() {
  const { data: statsData, loading: statsLoading, refetch: refetchStats } = useGetCRMHubStats();
  const { data: connectionsData, loading: connLoading, refetch: refetchConns } = useGetCRMConnections();
  const { data: logsData, loading: logsLoading, refetch: refetchLogs } = useGetCRMSyncLogs({
    input: { page: 1, limit: 5 },
  });

  const [triggerSync] = useTriggerCRMSync();
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);

  const stats = statsData?.getCRMHubStats;
  const connections = connectionsData?.getCRMConnections || [];
  const recentLogs = logsData?.getCRMSyncLogs?.logs || [];

  const handleSync = async (provider: CRMProvider) => {
    setSyncingProvider(provider);
    try {
      const res = await triggerSync({
        variables: {
          provider,
          syncType: CRMSyncType.MANUAL,
          async: true,
        },
      });

      if (res.data?.triggerCRMSync?.success) {
        toast.success(`Queued sync for ${CRM_PROVIDERS_CONFIG[provider]?.name || provider}`);
        refetchStats();
        refetchConns();
        refetchLogs();
      } else {
        toast.error(res.data?.triggerCRMSync?.message || "Failed to trigger sync");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to trigger CRM sync");
    } finally {
      setSyncingProvider(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "CONNECTED":
      case "SUCCESS":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]"
          >
            Connected
          </Badge>
        );
      case "ERROR":
      case "FAILED":
        return (
          <Badge variant="destructive" className="text-[10px]">
            Error
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] animate-pulse"
          >
            Syncing
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] text-muted-foreground">
            {status || "Disconnected"}
          </Badge>
        );
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="CRM Integration Hub"
        description="Unified bidirectional synchronization, object mapping, and community rule automation across your CRM platforms."
        breadcrumbs={[
          { label: "Integrations", href: "/settings/integrations" },
          { label: "CRM Hub" },
        ]}
        icon={Contact2}
        badgeText="Enterprise Pipeline"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 cursor-pointer"
              onClick={() => {
                refetchStats();
                refetchConns();
                refetchLogs();
                toast.success("CRM metrics refreshed");
              }}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button
              size="sm"
              asChild
              className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/integrations/crm/settings">
                <Settings className="h-3.5 w-3.5" />
                Configure Providers
              </Link>
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-6 space-y-6">
          {/* KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <EcosystemKPI
              label="Connected Providers"
              value={stats?.totalConnectedProviders ?? connections.filter((c) => c.status === "CONNECTED").length}
              sub={`${stats?.healthyProvidersCount ?? 0} healthy connections`}
              icon={Contact2}
              trend="neutral"
            />
            <EcosystemKPI
              label="Total Records Synced"
              value={(stats?.totalRecordsSynced ?? 0).toLocaleString()}
              sub="Across all CRM objects"
              icon={Database}
              trend="positive"
            />
            <EcosystemKPI
              label="Active CRM Members"
              value={(stats?.activeMembersCount ?? 0).toLocaleString()}
              sub={`${stats?.deactivatedMembersCount ?? 0} archived / inactive`}
              icon={Users}
              trend="neutral"
            />
            <EcosystemKPI
              label="Auto-Sync Engine"
              value="Active"
              sub={stats?.lastSyncAt ? `Last: ${new Date(stats.lastSyncAt).toLocaleTimeString()}` : "Real-time Ready"}
              icon={Zap}
              trend="positive"
            />
          </div>

          {/* Connected Providers Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <DashboardSectionHeading
                title="Connected CRM Platforms"
                description="Status and synchronization pipelines for your integrated CRM environments"
              />
              <Link
                href="/integrations/crm/settings"
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                Manage all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {Object.values(CRMProvider).map((providerKey) => {
                const config = CRM_PROVIDERS_CONFIG[providerKey];
                const conn = connections.find((c) => c.provider === providerKey);
                const isConnected = conn?.status === "CONNECTED";
                const isSyncing = syncingProvider === providerKey;

                return (
                  <div
                    key={providerKey}
                    className="p-4 rounded-xl border bg-card hover:border-border transition-all duration-200 shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: config?.color || "#333" }}
                          >
                            <Contact2 className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-foreground">
                              {config?.name || providerKey}
                            </h4>
                            <p className="text-[10px] text-muted-foreground">
                              {config?.category || "CRM"}
                            </p>
                          </div>
                        </div>
                        {renderStatusBadge(conn?.status || "DISCONNECTED")}
                      </div>

                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {config?.description}
                      </p>

                      {isConnected && (
                        <div className="pt-2 border-t border-border/40 space-y-1 text-[11px] text-muted-foreground">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1 text-[10px]">
                              <Globe className="h-3 w-3" /> Host:
                            </span>
                            <span className="font-mono text-foreground truncate max-w-[120px]">
                              {conn?.baseUrl}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px]">Last Sync:</span>
                            <span className="text-foreground">
                              {conn?.lastSyncAt
                                ? new Date(conn.lastSyncAt).toLocaleDateString()
                                : "Never"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      {isConnected ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] flex-1 gap-1"
                            onClick={() => handleSync(providerKey)}
                            disabled={isSyncing}
                          >
                            <RefreshCw className={cn("h-3 w-3", isSyncing && "animate-spin")} />
                            {isSyncing ? "Syncing" : "Sync Now"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-[11px] px-2"
                            asChild
                          >
                            <Link href={`/integrations/crm/mappings?provider=${providerKey}`}>
                              <GitMerge className="h-3 w-3" />
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-7 text-[11px] w-full"
                          asChild
                        >
                          <Link href="/integrations/crm/settings">
                            Connect Provider
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Feature Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <Link
              href="/integrations/crm/members"
              className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-all duration-200 group shadow-sm flex items-start gap-3.5"
            >
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Users className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    Member Directory
                  </h4>
                  <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Browse synced CRM contacts, leads, external IDs, and raw custom payload attributes.
                </p>
              </div>
            </Link>

            <Link
              href="/integrations/crm/mappings"
              className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-all duration-200 group shadow-sm flex items-start gap-3.5"
            >
              <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <GitMerge className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    Schema & Field Mapping
                  </h4>
                  <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Discover custom CRM objects and define transformations into Thrico profile fields.
                </p>
              </div>
            </Link>

            <Link
              href="/integrations/crm/rules"
              className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-all duration-200 group shadow-sm flex items-start gap-3.5"
            >
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    Community Routing Rules
                  </h4>
                  <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Automate member onboarding and membership tier assignments based on CRM attributes.
                </p>
              </div>
            </Link>
          </div>

          {/* Recent Sync Audit Activity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <DashboardSectionHeading
                title="Recent Synchronization Logs"
                description="Live audit trail of incremental and manual sync jobs"
              />
              <Link
                href="/integrations/crm/logs"
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                View all logs
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
              <div className="divide-y divide-border/40 text-xs">
                {recentLogs.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-xs">
                    No sync logs recorded yet. Connect a provider to initiate synchronization.
                  </div>
                ) : (
                  recentLogs.map((log) => (
                    <div
                      key={log.id || log.syncId}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-7 w-7 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                          style={{
                            backgroundColor: CRM_PROVIDERS_CONFIG[log.provider]?.color || "#444",
                          }}
                        >
                          {log.provider?.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {CRM_PROVIDERS_CONFIG[log.provider]?.name || log.provider}
                            </span>
                            <Badge variant="outline" className="text-[9.5px] px-1.5 py-0">
                              {log.syncType}
                            </Badge>
                            {renderStatusBadge(log.status)}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Started: {new Date(log.startedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground sm:text-right">
                        <div>
                          <span className="text-foreground font-medium">{log.readCount}</span> read
                        </div>
                        <div>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            +{log.createdCount}
                          </span>{" "}
                          created
                        </div>
                        <div>
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            ~{log.updatedCount}
                          </span>{" "}
                          updated
                        </div>
                        {log.failedCount > 0 && (
                          <div>
                            <span className="text-destructive font-medium">
                              !{log.failedCount}
                            </span>{" "}
                            failed
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
