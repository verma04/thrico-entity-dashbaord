"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
      <div className="space-y-4">
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
                htmlFor="cooldownPeriod"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Claim Cooldown Period
              </Label>
              <span className="text-[10px] text-zinc-400">0 = Off</span>
            </div>
            <div className="relative">
              <Input
                id="cooldownPeriod"
                type="number"
                min={0}
                placeholder="0"
                className="h-10 bg-zinc-50/50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none"
                {...formik.getFieldProps("cooldownPeriod")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400">
                Hours
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Wait time before a member can claim this again.
            </p>
            {err("cooldownPeriod")}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="minActivityRequired"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Min Activity Required
              </Label>
              <span className="text-[10px] text-zinc-400">0 = Off</span>
            </div>
            <div className="relative">
              <Input
                id="minActivityRequired"
                type="number"
                min={0}
                placeholder="0"
                className="h-10 bg-zinc-50/50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none"
                {...formik.getFieldProps("minActivityRequired")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400">
                Points
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Minimum engagement activity score required to unlock claim.
            </p>
            {err("minActivityRequired")}
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/40 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label
                htmlFor="blockWarnedUsers"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                Block Warned Members
              </Label>
              <p className="text-[11px] text-zinc-500">
                Disallow members with active moderation warnings from redeeming.
              </p>
            </div>
            <Switch
              id="blockWarnedUsers"
              checked={Boolean(formik.values.blockWarnedUsers)}
              onCheckedChange={(checked) =>
                formik.setFieldValue("blockWarnedUsers", checked)
              }
            />
          </div>
        </div>
      </div>
    </PolarisFormCard>
  );
}
