"use client";

import React from "react";
import {
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Link2,
  Unlink,
  Clock,
  Radio,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { ShopifyConnection } from "@/graphql/actions";

interface ShopifyConnectionCardProps {
  connection?: ShopifyConnection | null;
  isConnected: boolean;
  syncStatus?: string;
  onOpenConnect: () => void;
  onOpenDisconnect: () => void;
}

export function ShopifyConnectionCard({
  connection,
  isConnected,
  syncStatus,
  onOpenConnect,
  onOpenDisconnect,
}: ShopifyConnectionCardProps) {
  const renderSyncBadge = () => {
    if (isConnected && connection?.requiresReconnect) {
      return (
        <Badge
          variant="destructive"
          className="text-[10px] px-2 py-0.5 font-bold gap-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
        >
          <AlertTriangle className="h-3 w-3" />
          Reconnect Required
        </Badge>
      );
    }

    switch (syncStatus) {
      case "SYNCED_TODAY":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] px-2 py-0.5 font-bold gap-1"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Synced Today
          </Badge>
        );
      case "SYNC_AVAILABLE":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] px-2 py-0.5 font-bold gap-1"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Sync Available
          </Badge>
        );
      case "NEVER_SYNCED":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] px-2 py-0.5 font-bold gap-1"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Never Synced
          </Badge>
        );
      case "UNAUTHORIZED":
        return (
          <Badge
            variant="destructive"
            className="text-[10px] px-2 py-0.5 font-bold gap-1"
          >
            <AlertTriangle className="h-3 w-3" />
            Unauthorized
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-[10px] px-2 py-0.5 font-bold gap-1 text-muted-foreground"
          >
            Disconnected
          </Badge>
        );
    }
  };

  return (
    <PolarisFormCard
      step={1}
      title="Store Connection & OAuth Credentials"
      description="Manage connected merchant store credentials, verified OAuth scopes, and sync status."
      badge={isConnected ? (connection?.requiresReconnect ? "Action Required" : "Active Store") : "Not Linked"}
    >
      <div className="space-y-4">
        {/* Missing Scopes / Reconnect Alert */}
        {isConnected && connection?.requiresReconnect && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Additional Scopes Required</span>
              </div>
              <Button
                size="sm"
                onClick={onOpenConnect}
                className="h-7 px-2.5 text-[11px] font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg gap-1 shadow-xs"
              >
                <Link2 className="h-3 w-3" />
                Grant Permissions
              </Button>
            </div>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
              Your Shopify app needs updated permissions to support automated discounts and syncs.
              {connection.missingScopes?.length > 0 && (
                <> Missing scopes: <code className="font-mono text-[10px] bg-amber-500/20 px-1 py-0.5 rounded">{connection.missingScopes.join(", ")}</code></>
              )}
            </p>
          </div>
        )}

        {/* Main Store Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0 shadow-xs">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {connection?.shopDomain || "No Shopify Store Connected"}
                </span>
                {renderSyncBadge()}
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {isConnected
                  ? `Connected via Shopify OAuth with ${connection?.hasAllPermissions ? "full verified permissions" : "active credentials"} for orders, customers, and discounts.`
                  : "Connect your Shopify merchant store to automate customer sync and loyalty rewards."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {isConnected ? (
              <>
                {connection?.shopDomain && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-8 px-2.5 text-xs gap-1.5 rounded-lg border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                  >
                    <a
                      href={`https://${connection.shopDomain}/admin`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Admin
                    </a>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenConnect}
                  className="h-8 px-2.5 text-xs gap-1.5 rounded-lg border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  Reconnect
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenDisconnect}
                  className="h-8 px-2.5 text-xs gap-1.5 rounded-lg border-red-500/20 text-red-600 hover:bg-red-500/10 dark:text-red-400 font-medium"
                >
                  <Unlink className="h-3.5 w-3.5" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={onOpenConnect}
                className="h-8 px-3 text-xs font-semibold rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 gap-1.5 shadow-xs"
              >
                <Link2 className="h-3.5 w-3.5" />
                Connect Shopify
              </Button>
            )}
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Radio className="h-3 w-3 text-emerald-500" />
              Status
            </span>
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {isConnected
                ? connection?.requiresReconnect
                  ? "Needs Reconnect"
                  : "Active & Linked"
                : "Not Linked"}
            </p>
          </div>

          <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Clock className="h-3 w-3 text-blue-500" />
              Last Synced
            </span>
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {connection?.lastSyncAt
                ? new Date(connection.lastSyncAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Never"}
            </p>
          </div>

          <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-purple-500" />
              Scopes
            </span>
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {connection?.grantedScopes?.length
                ? `${connection.grantedScopes.length} Scopes Active`
                : isConnected
                  ? "Read / Write"
                  : "None"}
            </p>
          </div>

          <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-amber-500" />
              Installed
            </span>
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {connection?.installedAt
                ? new Date(connection.installedAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </PolarisFormCard>
  );
}
