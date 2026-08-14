"use client";

import React, { ReactNode, useState } from "react";
import { CtaButton } from "@/components/ui/cta-button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, Check, ChevronRight, Settings2, Power, AlertTriangle, ExternalLink } from "lucide-react";
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
        "group relative flex flex-col justify-between rounded-xl border bg-card transition-all duration-200 shadow-2xs overflow-hidden",
        isConnected
          ? "border-border/80 dark:border-border/70 hover:border-foreground/20"
          : "border-border/60 hover:border-border hover:shadow-xs"
      )}
    >
      {/* Top Header & Info */}
      <div className="p-4 sm:p-4.5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          {/* Brand Icon + Title Header */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                "h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-102 border border-black/5 dark:border-white/10",
                iconBgColor
              )}
            >
              <Icon className={cn("h-5 w-5", iconColor)} />
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold tracking-tight text-foreground truncate">
                  {title}
                </h3>
                {category && (
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/40 shrink-0">
                    {category}
                  </span>
                )}
                {badge && (
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 shrink-0">
                    {badge}
                  </span>
                )}
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-1.5 pt-0.5">
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted/50 border border-border/50 px-1.5 py-0.2 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                    Not Connected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="shrink-0 flex items-center gap-1.5">
            {customAction ? (
              customAction
            ) : isConnected ? (
              <div className="flex items-center gap-1.5">
                {children && (
                  <CtaButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfig(!showConfig)}
                    className="h-7 text-xs px-2.5 text-muted-foreground hover:text-foreground"
                    title="Toggle Settings"
                  >
                    <Settings2 className="h-3.5 w-3.5 mr-1" />
                    {showConfig ? "Hide" : "Manage"}
                  </CtaButton>
                )}

                {onDisconnect && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <CtaButton
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs px-2.5 text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive/30 hover:text-destructive"
                      >
                        Disconnect
                      </CtaButton>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-xl p-5 max-w-[400px]">
                      <AlertDialogHeader>
                        <div className="flex items-center gap-2.5 mb-1">
                          <div className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                          <AlertDialogTitle className="text-base font-semibold">
                            Disconnect {title}?
                          </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
                          This will disconnect {title} from your workspace. Active data syncing and notifications will be paused immediately.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-3 gap-2 sm:gap-0">
                        <AlertDialogCancel className="h-8 text-xs">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onDisconnect}
                          className="h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
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
                  className="h-7 text-xs px-3 gap-1"
                  onClick={onConnect}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin mr-1" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Connect
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </>
                  )}
                </CtaButton>
              )
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Connected configuration drawer / Children */}
      {isConnected && children && showConfig && (
        <div className="border-t border-border/50 bg-muted/20 p-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

