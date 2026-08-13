"use client";

import React, { ReactNode } from "react";
import { CtaButton } from "@/components/ui/cta-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, Check, ExternalLink, ChevronRight } from "lucide-react";
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

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  children?: ReactNode;
}

export const IntegrationCard = ({
  title,
  description,
  icon: Icon,
  iconColor = "text-white",
  iconBgColor = "bg-primary",
  isConnected,
  isConnecting,
  onConnect,
  onDisconnect,
  children,
}: IntegrationCardProps) => {
  return (
    <Card
      className={cn(
        "group transition-all duration-300 overflow-hidden border-muted/60",
        isConnected
          ? "border-primary/20 bg-primary/5 shadow-sm"
          : "hover:border-primary/20 hover:shadow-md bg-card"
      )}
    >
      <div className="flex flex-col sm:flex-row p-4 gap-4">
        {/* Icon Section */}
        <div className="shrink-0">
          <div
            className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105",
              iconBgColor
            )}
          >
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            {isConnected && (
              <Badge
                variant="outline"
                className="gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50/50 border-emerald-200 px-2 py-0 rounded-full h-5"
              >
                <Check className="w-2.5 h-2.5" />
                Active
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            {description}
          </p>

          {/* Connected Content / Children */}
          {isConnected ? (
            <div className="pt-3 mt-1">
              {children || (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/50 p-2.5 rounded-lg border border-transparent">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Integration is active and running smoothly.
                </div>
              )}
            </div>
          ) : (
            <div className="pt-1"></div>
          )}
        </div>

        {/* Action Section */}
        <div className="flex sm:flex-col items-center sm:items-end justify-center sm:justify-start gap-2 sm:pl-4 sm:border-l border-muted/50 w-full sm:w-auto mt-2 sm:mt-0">
          {isConnected ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <CtaButton
                  variant="outline"
                  className="w-full sm:w-28 text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive/30 hover:text-destructive"
                >
                  Uninstall
                </CtaButton>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Uninstall {title}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to disconnect this integration? This
                    action may stop data syncing and disable related features.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDisconnect}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Uninstall
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <CtaButton
              className="w-full sm:w-28 group-hover:shadow-primary/25"
              onClick={onConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin mr-1.5" />
                  Installing
                </>
              ) : (
                <>
                  Install
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 transition-transform ml-1" />
                </>
              )}
            </CtaButton>
          )}

          {!isConnected && (
            <p className="hidden sm:block text-[9px] text-muted-foreground text-center sm:text-right mt-1.5 max-w-[110px] leading-tight">
              Enable to sync data & alerts
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
