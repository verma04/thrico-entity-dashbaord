"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Loader2, Info } from "lucide-react";
import {
  useGetEntityCurrencyConfig,
  useGetTCConversionCap,
  useUpdateTCConversionCap,
} from "@/graphql/actions";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function RiskManagement() {
  const { data: configData, loading: loadingConfig } = useGetEntityCurrencyConfig();
  const { data: convData, loading: loadingConv } = useGetTCConversionCap();

  const [tcCaps, setTcCaps] = useState({
    maxTcPerDay: 0,
    maxTcPerMonth: 0,
    maxTcPerEntity: 0,
  });

  const currencyName = configData?.getEntityCurrencyConfig?.currencyName || "TC";

  useEffect(() => {
    if (convData?.getTCConversionCap) {
      setTcCaps({
        maxTcPerDay: convData.getTCConversionCap.maxTcPerDay,
        maxTcPerMonth: convData.getTCConversionCap.maxTcPerMonth,
        maxTcPerEntity: convData.getTCConversionCap.maxTcPerEntity,
      });
    }
  }, [convData]);

  const [updateTcCap, { loading: updating }] = useUpdateTCConversionCap({
    onCompleted: () => toast.success(`${currencyName} guardrails updated`),
    onError: (err: any) => toast.error(err.message),
  });

  if (loadingConfig || loadingConv) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const capFields = [
    {
      key: "maxTcPerDay" as const,
      label: `Max ${currencyName} per Day`,
      description: "Resets every 24 hours",
    },
    {
      key: "maxTcPerMonth" as const,
      label: `Max ${currencyName} per Month`,
      description: "Resets on the 1st of each month",
    },
    {
      key: "maxTcPerEntity" as const,
      label: `Global Limit (Entity Total)`,
      description: "Hard ceiling — no more generation once reached",
    },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50/60 border border-amber-100">
        <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-semibold text-amber-900">How risk controls work</p>
          <p className="text-xs text-amber-800/80 leading-relaxed">
            These caps control how much {currencyName} can be minted through TC conversions. Setting a <strong>Global Limit</strong> acts as an emergency brake — once hit, no more {currencyName} can be generated until it is raised.
          </p>
        </div>
      </div>

      {/* Guardrails Card */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Generation Caps</p>
            <p className="text-xs text-muted-foreground">{currencyName} minting limits via TC conversions</p>
          </div>
        </div>

        <div className="space-y-4">
          {capFields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground">{field.label}</Label>
                <span className="text-[10px] text-muted-foreground">{field.description}</span>
              </div>
              <Input
                type="number"
                className="font-mono"
                value={tcCaps[field.key]}
                onChange={(e) =>
                  setTcCaps({ ...tcCaps, [field.key]: parseInt(e.target.value) })
                }
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <Button
            onClick={() => updateTcCap({ variables: { input: tcCaps } })}
            disabled={updating}
            className="min-w-[160px] gap-2"
          >
            {updating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save Guardrails
          </Button>
        </div>
      </div>
    </div>
  );
}
