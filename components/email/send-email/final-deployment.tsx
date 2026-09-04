"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Shield,
  Send,
  Sparkles,
  Layers,
  Users,
  Globe,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EmailTemplate, EmailDomain } from "./types";

interface FinalDeploymentProps {
  checks: { label: string; ok: boolean; message: string }[];
  selectedTemplate: EmailTemplate | null;
  recipientsCount: number;
  isDomainVerified: boolean;
  domain: EmailDomain | null;
}

export function FinalDeployment({
  checks,
  selectedTemplate,
  recipientsCount,
  isDomainVerified,
  domain,
}: FinalDeploymentProps) {
  const allOk = checks.every((c) => c.ok);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="pb-2 border-b border-border/60">
        <h2 className="text-[14px] font-bold text-foreground">
          Pre-Flight Review &amp; Dispatch
        </h2>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Verify configuration compliance and audience metrics before initiating transmission.
        </p>
      </div>

      {/* Pre-Flight Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {checks.map((check, i) => (
          <div
            key={i}
            className={cn(
              "p-3 rounded-[8px] border transition-all flex items-start gap-2.5 shadow-2xs",
              check.ok
                ? "bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800"
                : "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
            )}
          >
            <div
              className={cn(
                "h-6 w-6 rounded-[4px] flex items-center justify-center shrink-0 border mt-0.5",
                check.ok
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                  : "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
              )}
            >
              {check.ok ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5" />
              )}
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <p className="text-[12px] font-bold text-foreground truncate">
                  {check.label}
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] px-1 py-0 h-4 font-semibold rounded-[3px]",
                    check.ok
                      ? "text-emerald-700 dark:text-emerald-300 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40"
                      : "text-red-700 dark:text-red-300 border-red-200 bg-red-50 dark:bg-red-950/40"
                  )}
                >
                  {check.ok ? "Passed" : "Action Required"}
                </Badge>
              </div>
              <p
                className={cn(
                  "text-[11px] leading-tight",
                  check.ok ? "text-muted-foreground" : "text-red-600 dark:text-red-400 font-medium"
                )}
              >
                {check.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Summary Card */}
      <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 pb-2.5 border-b border-border/50">
          <div className="h-6 w-6 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-800 border border-border/60 flex items-center justify-center text-[#616161]">
            <Send className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-[12.5px] font-bold text-foreground">
              Campaign Configuration Summary
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[
            {
              label: "Template",
              value: selectedTemplate?.name || "None",
              icon: Layers,
            },
            {
              label: "Total Audience",
              value: `${recipientsCount.toLocaleString()} targets`,
              icon: Users,
            },
            {
              label: "Sender Domain",
              value: isDomainVerified ? `@${domain?.domain}` : "@thrico.com",
              icon: Globe,
            },
            {
              label: "Broadcast Priority",
              value: "High Throughput",
              icon: Zap,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="p-2.5 rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800/60 border border-border/60 space-y-1"
              >
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Icon className="h-3 w-3" />
                  <span className="text-[10.5px] font-medium uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
                <p className="text-[12px] font-bold text-foreground truncate">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {!allOk && (
        <div className="p-3 rounded-[6px] bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5">
          <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-[12px] text-amber-900 dark:text-amber-200 font-bold">
              Dispatch Verification Incomplete
            </p>
            <p className="text-[11.5px] text-amber-800/90 dark:text-amber-300">
              One or more pre-flight checks have not passed. Please review the checklist above before confirming campaign transmission.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

