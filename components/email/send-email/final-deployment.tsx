"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Shield, Send } from "lucide-react";
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
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground">Review &amp; Send</h2>
        <p className="text-sm text-muted-foreground mt-1">Check everything looks good before sending your campaign.</p>
      </div>

      {/* Status Checks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {checks.map((check, i) => (
          <div
            key={i}
            className={cn(
              "p-4 rounded-2xl border flex items-start gap-3",
              check.ok
                ? "bg-emerald-50 dark:bg-emerald-500/10/50 border-emerald-100"
                : "bg-red-50/50 border-red-100"
            )}
          >
            <div className={cn(
              "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border",
              check.ok
                ? "bg-card border-emerald-100 text-emerald-600 dark:text-emerald-400"
                : "bg-card border-red-100 text-red-500"
            )}>
              {check.ok
                ? <CheckCircle2 className="h-4 w-4" />
                : <AlertTriangle className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{check.label}</p>
              <p className={cn("text-xs mt-0.5", check.ok ? "text-emerald-700" : "text-red-600")}>
                {check.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-muted border border-border/50 flex items-center justify-center">
            <Send className="h-4 w-4 text-foreground/80" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Campaign Summary</h3>
            <p className="text-xs text-muted-foreground">Ready to send</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-50">
          {[
            { label: "Template", value: selectedTemplate?.name || "—" },
            { label: "Recipients", value: recipientsCount.toLocaleString() },
            { label: "Sender", value: isDomainVerified ? `@${domain?.domain}` : "@thrico.com" },
            { label: "Priority", value: "Standard" },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground/80">{item.label}</span>
              <p className="text-sm font-semibold text-foreground truncate">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {!allOk && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-start gap-3">
          <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium">
            Some checks have not passed. Please fix the issues above before sending.
          </p>
        </div>
      )}
    </div>
  );
}
