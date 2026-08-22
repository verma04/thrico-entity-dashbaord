"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";

interface RewardGuardrailsSectionProps {
  formik: any;
  err: (field: string) => React.ReactNode;
}

export function RewardGuardrailsSection({
  formik,
  err,
}: RewardGuardrailsSectionProps) {
  return (
    <PolarisFormCard
      step={5}
      title="Anti-Abuse & Guardrails"
      description="Prevent multi-accounting, fraud, and bot exploitation."
      badge="Security Engine"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/40 space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="minAccountAge"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Min Account Age (Days)
            </Label>
            <span className="text-[10px] text-zinc-400">0 = Off</span>
          </div>
          <div className="relative">
            <Input
              id="minAccountAge"
              type="number"
              min={0}
              placeholder="0"
              className="h-10 bg-zinc-50/50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none"
              {...formik.getFieldProps("minAccountAge")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400">
              Days
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Blocks new accounts from claiming immediately.
          </p>
          {err("minAccountAge")}
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/40 space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="cooldownHours"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Claim Cooldown Period
            </Label>
            <span className="text-[10px] text-zinc-400">0 = Off</span>
          </div>
          <div className="relative">
            <Input
              id="cooldownHours"
              type="number"
              min={0}
              placeholder="0"
              className="h-10 bg-zinc-50/50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none"
              {...formik.getFieldProps("cooldownHours")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400">
              Hours
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Wait time before a member can claim this again.
          </p>
          {err("cooldownHours")}
        </div>
      </div>
    </PolarisFormCard>
  );
}
