"use client";

import React, { ReactNode, useState } from "react";
import { CtaButton } from "@/components/ui/cta-button";
import {
  LucideIcon,
  ChevronRight,
  Settings2,
  AlertTriangle,
  ChevronDown,
  Unplug,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export interface IntegrationCardProps {
  title: string;
  category?: string;
  description: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBgColor?: string;
  isConnected: boolean;
  isConnecting?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  children?: ReactNode;
  badge?: string;
  docsUrl?: string;
  customAction?: ReactNode;
}

export const IntegrationCard = ({
  title,
  category,
  description,
  icon: Icon,
  iconColor = "text-white",
  iconBgColor = "bg-primary",
  isConnected,
  isConnecting = false,
  onConnect,
  onDisconnect,
  children,
  badge,
  docsUrl,
  customAction,
}: IntegrationCardProps) => {
  const [showConfig, setShowConfig] = useState(true);

  return (
    <div
      className={cn(
        "group/card relative flex flex-col justify-between rounded-xl border bg-card transition-all duration-200 ease-out overflow-hidden",
        "shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]",
        "hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.06),0_1px_3px_0_rgba(0,0,0,0.03)]",
        isConnected
          ? "border-border/70 dark:border-border/60 hover:border-border"
          : "border-border/50 hover:border-border/80"
      )}
    >
      {/* Subtle top indicator bar for connected state */}
      {isConnected && (
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500/90 via-emerald-400/70 to-emerald-500/90" />
      )}

      {/* Main Content Area - Compact Density */}
      <div className="p-3.5 sm:p-4 flex flex-col gap-2.5">
        {/* Top Header: Brand Icon + Title + Action */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Brand Icon + Titles */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Compact Brand Icon */}
            <div className="relative shrink-0">
              <div
                className={cn(
                  "h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-lg flex items-center justify-center transition-all duration-200",
                  "shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.12)]",
                  "group-hover/card:scale-105",
                  iconBgColor
                )}
              >
                <Icon className={cn("h-4.5 w-4.5", iconColor)} />
              </div>
              {/* Mini Status Dot */}
              <div
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card transition-colors duration-200",
                  isConnected ? "bg-emerald-500" : "bg-muted-foreground/30"
                )}
              />
            </div>

            {/* Title + Badges + Status */}
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-[13px] font-semibold tracking-tight text-foreground truncate leading-tight">
                  {title}
                </h3>
                {category && (
                  <span className="text-[9px] font-medium text-muted-foreground/80 bg-muted/60 px-1.5 py-[0.5px] rounded border border-border/30 shrink-0 uppercase tracking-wider">
                    {category}
                  </span>
                )}
                {badge && (
                  <span className="text-[9px] font-semibold text-primary bg-primary/10 px-1.5 py-[0.5px] rounded border border-primary/20 shrink-0">
                    {badge}
                  </span>
                )}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5">
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400 leading-none">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-muted-foreground/60 leading-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                    Not connected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Compact Action Buttons */}
          <div className="shrink-0 flex items-center gap-1">
            {customAction ? (
              customAction
            ) : isConnected ? (
              <div className="flex items-center gap-1">
                {children && (
                  <CtaButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfig(!showConfig)}
                    className={cn(
                      "h-7 text-[11px] px-2 font-medium rounded-md text-muted-foreground hover:text-foreground transition-all duration-150",
                      showConfig && "bg-muted/60 text-foreground"
                    )}
                    title="Toggle Settings"
                  >
                    <Settings2
                      className={cn(
                        "h-3 w-3 mr-1 transition-transform duration-200",
                        showConfig && "rotate-45"
                      )}
                    />
                    {showConfig ? "Hide" : "Manage"}
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 ml-0.5 opacity-50 transition-transform duration-200",
                        showConfig && "rotate-180"
                      )}
                    />
                  </CtaButton>
                )}

                {onDisconnect && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <CtaButton
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all duration-150"
                        title="Disconnect"
                      >
                        <Unplug className="h-3 w-3" />
                      </CtaButton>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-xl p-5 max-w-[380px] border-border/80">
                      <AlertDialogHeader>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className="h-8.5 w-8.5 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                          <div>
                            <AlertDialogTitle className="text-sm font-semibold">
                              Disconnect {title}?
                            </AlertDialogTitle>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Syncing will be paused immediately
                            </p>
                          </div>
                        </div>
                        <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed pl-11">
                          You can reconnect at any time. Existing imported data will remain saved.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-3 gap-1.5 sm:gap-2">
                        <AlertDialogCancel className="h-8 text-xs rounded-md">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onDisconnect}
                          className="h-8 text-xs rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          <Unplug className="h-3 w-3 mr-1" />
                          Disconnect
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ) : (
              onConnect && (
                <CtaButton
                  size="sm"
                  className="h-7 text-[11px] px-3 gap-1 rounded-md font-semibold transition-all duration-150 active:scale-98 shadow-xs"
                  onClick={onConnect}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin mr-1" />
                      <span>Connecting…</span>
                    </>
                  ) : (
                    <>
                      <span>Connect</span>
                      <ChevronRight className="w-3 h-3 opacity-60 group-hover/card:translate-x-0.5 transition-transform duration-150" />
                    </>
                  )}
                </CtaButton>
              )
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-[12px] text-muted-foreground/80 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Connected Drawer / Settings Area */}
      {isConnected && children && showConfig && (
        <div className="border-t border-border/40 bg-muted/25 px-3.5 py-3 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Compact Skeleton Loader for Integration Card
 * Used during data loading / query resolution.
 */
export const IntegrationCardSkeleton = () => {
  return (
    <div className="relative flex flex-col justify-between rounded-xl border border-border/50 bg-card p-3.5 sm:p-4 gap-2.5 overflow-hidden shadow-2xs">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Avatar + Title & Status */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <Skeleton className="h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-lg shrink-0" />
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-3 w-12 rounded" />
            </div>
            <Skeleton className="h-2.5 w-16 rounded-full" />
          </div>
        </div>

        {/* Right: Button skeleton */}
        <Skeleton className="h-7 w-18 rounded-md shrink-0" />
      </div>

      {/* Description lines */}
      <div className="space-y-1.5 pt-1">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-4/5 rounded" />
      </div>
    </div>
  );
};
