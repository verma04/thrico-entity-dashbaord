"use client";

import React from "react";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Lock, Gift, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReferralConfigCardProps {
  enabled: boolean;
  required: boolean;
  helperText?: string;
  onUpdate: (updates: { enabled?: boolean; required?: boolean; helperText?: string }) => void;
}

export function ReferralConfigCard({
  enabled,
  required,
  onUpdate,
}: ReferralConfigCardProps) {
  return (
    <PolarisFormCard
      title="Referral & Invitation Protocol"
      description="Configure whether new members need an invite or referral code to join your community."
      badge="Viral Growth"
    >
      <div className="space-y-4">
        {/* Toggle 1: Enable referral code */}
        <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Enable Referral Code Input
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-semibold px-1.5 py-0",
                    enabled
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                  )}
                >
                  {enabled ? "Active" : "Disabled"}
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Displays a &quot;Referral Code&quot; field on the member registration form, enabling automated attribution and viral reward points.
              </p>
            </div>
          </div>

          <Switch
            checked={enabled}
            onCheckedChange={(checked) => {
              onUpdate({
                enabled: checked,
                // if disabling referral, also disable required
                required: checked ? required : false,
              });
            }}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>

        {/* Toggle 2: Mandatory referral requirement */}
        <div
          className={cn(
            "flex items-start justify-between gap-4 p-3.5 rounded-xl border transition-all duration-200",
            enabled
              ? "border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60"
              : "border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/20 opacity-60 pointer-events-none"
          )}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Require Referral Code (Mandatory Invite-Only)
                </span>
                {enabled && required && (
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800 text-[10px] font-semibold px-1.5 py-0"
                  >
                    Invite-Only Mode
                  </Badge>
                )}
                {enabled && !required && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 text-[10px] font-semibold px-1.5 py-0"
                  >
                    Optional Input
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                When enabled, registration will be locked behind a valid invite/referral code. Visitors without an invite code will not be able to create an account.
              </p>
            </div>
          </div>

          <Switch
            disabled={!enabled}
            checked={required}
            onCheckedChange={(checked) => onUpdate({ required: checked })}
            className="data-[state=checked]:bg-purple-600"
          />
        </div>

        {/* Insight callout */}
        {enabled && (
          <div
            className={cn(
              "flex items-center gap-2.5 p-3 rounded-lg border text-xs",
              required
                ? "bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900 text-purple-900 dark:text-purple-200"
                : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200"
            )}
          >
            {required ? (
              <AlertCircle className="w-4 h-4 text-purple-600 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span className="text-[11px] leading-snug">
              {required
                ? "Invite-Only Protocol Active: The referral field is marked with a mandatory asterisk (*) and validates before account generation."
                : "Open Growth Protocol: Referral field is optional. Members with an invite link or code can enter it to claim mutual incentives."}
            </span>
          </div>
        )}
      </div>
    </PolarisFormCard>
  );
}
