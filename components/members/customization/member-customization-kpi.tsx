"use client";

import React from "react";
import { Layers, Database, ShieldCheck, Gift, CheckCircle2, Lock, Sparkles, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MemberOnboardingConfig } from "./types";

interface MemberCustomizationKpisProps {
  config: MemberOnboardingConfig;
  loading?: boolean;
}

export function MemberCustomizationKpis({ config, loading }: MemberCustomizationKpisProps) {
  const customFields = config.customFields || [];
  const requiredFieldsCount = customFields.filter((f) => f.required).length;
  const rosterFieldsCount = customFields.filter(
    (f) => f.validationMode === "CSV_ROSTER" || f.validationMode === "BOTH"
  ).length;
  const regexFieldsCount = customFields.filter(
    (f) => f.validationMode === "REGEX" || f.validationMode === "BOTH"
  ).length;

  const authLabel =
    config.authMethod === "BOTH"
      ? "Email OTP + Google SSO"
      : config.authMethod === "EMAIL_ONLY"
      ? "Email OTP Only"
      : "Google SSO Only";

  const referralLabel = !config.referral.enabled
    ? "Disabled"
    : config.referral.required
    ? "Mandatory Code"
    : "Optional Invites";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Custom Registration Fields */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Custom Registration Fields
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/40">
              <Layers className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground tracking-tight">
                {customFields.length}
              </span>
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-bold bg-muted text-muted-foreground rounded-[3px]"
              >
                {requiredFieldsCount} Required
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1 truncate">
              <Sparkles className="h-3 w-3 text-purple-500 shrink-0" />
              <span>{customFields.length > 0 ? "Signup form inputs configured" : "Default basic inputs"}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Gatekeeping Rosters */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Gatekeeping & Whitelists
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
              <Database className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                {rosterFieldsCount}
              </span>
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 py-0 font-bold border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-[3px]"
              >
                {regexFieldsCount} Regex Rules
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1 truncate">
              {rosterFieldsCount > 0 ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span>CSV Whitelists Active</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 text-zinc-400 shrink-0" />
                  <span>Open Registration</span>
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Authentication Protocol */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Authentication Protocol
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-foreground truncate">
                {authLabel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-[3px]"
              >
                {config.authMethod === "BOTH" ? "Dual SSO + Passcode" : "Single Auth Mode"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Referral & Invites */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Referrals & Invites
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/40">
              <Gift className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-foreground tracking-tight">
                {referralLabel}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1 truncate">
              {config.referral.enabled ? (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  {config.referral.required ? "Strict invite-only network" : "Organic member invites on"}
                </span>
              ) : (
                <span className="text-muted-foreground">Referral system disabled</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
