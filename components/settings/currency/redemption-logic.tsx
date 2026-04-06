"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollText, Loader2, Info, ShieldCheck } from "lucide-react";
import {
  useGetRedemptionCap,
  useUpdateRedemptionCap,
  useGetEntityCurrencyConfig,
  useUpdateEntityCurrencyConfig,
} from "@/graphql/actions";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function RedemptionLogic() {
  const { data: capData, loading: loadingCaps } = useGetRedemptionCap();
  const { data: configData, loading: loadingConfig } = useGetEntityCurrencyConfig();

  const [caps, setCaps] = useState({ maxTcPerOrder: 0, maxTcPerMonth: 0 });
  const [spendingRules, setSpendingRules] = useState({
    maxTcPercentage: 30,
    minEntityActivityRequired: true,
  });

  useEffect(() => {
    if (capData?.getRedemptionCap) {
      setCaps({
        maxTcPerOrder: capData.getRedemptionCap.maxTcPerOrder,
        maxTcPerMonth: capData.getRedemptionCap.maxTcPerMonth,
      });
    }
  }, [capData]);

  useEffect(() => {
    if (configData?.getEntityCurrencyConfig) {
      setSpendingRules({
        maxTcPercentage: configData.getEntityCurrencyConfig.maxTcPercentage,
        minEntityActivityRequired: configData.getEntityCurrencyConfig.minEntityActivityRequired,
      });
    }
  }, [configData]);

  const [updateCap, { loading: updatingCaps }] = useUpdateRedemptionCap({
    onCompleted: () => toast.success("Redemption caps updated"),
    onError: (err: any) => toast.error(err.message),
  });

  const [updateConfig, { loading: updatingConfig }] = useUpdateEntityCurrencyConfig({
    onCompleted: () => toast.success("Spending rules updated"),
    onError: (err: any) => toast.error(err.message),
  });

  const handleSavePolicy = () => {
    updateConfig({
      variables: {
        input: {
          maxTcPercentage: parseInt(spendingRules.maxTcPercentage.toString()),
          minEntityActivityRequired: spendingRules.minEntityActivityRequired,
        },
      },
    });
    updateCap({ variables: { input: caps } });
  };

  if (loadingCaps || loadingConfig) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currencyName = configData?.getEntityCurrencyConfig?.currencyName || "EC";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start max-w-4xl">
      {/* Main Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Info */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            The <strong>70/30 Rule</strong>: members must earn at least 70% of a reward's value using {currencyName}. TC Coins can cover at most {spendingRules.maxTcPercentage}% of the remainder.
          </p>
        </div>

        {/* TC Percentage Cap */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <ScrollText className="h-4 w-4 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Max TC Percentage</p>
              <p className="text-xs text-muted-foreground">Maximum share of cost covered by TC Coins</p>
            </div>
            <span className="ml-auto text-sm font-bold text-violet-600">{spendingRules.maxTcPercentage}%</span>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Percentage (10–30)</Label>
            <Input
              type="number"
              value={spendingRules.maxTcPercentage}
              onChange={(e) =>
                setSpendingRules({
                  ...spendingRules,
                  maxTcPercentage: Math.min(30, Math.max(10, parseInt(e.target.value) || 10)),
                })
              }
            />
          </div>
        </div>

        {/* Activity Guardrail */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">Activity Guardrail</p>
            <p className="text-xs text-muted-foreground">
              Require minimum local activity before TC Coins can be used
            </p>
          </div>
          <Switch
            checked={spendingRules.minEntityActivityRequired}
            onCheckedChange={(val) =>
              setSpendingRules({ ...spendingRules, minEntityActivityRequired: val })
            }
            className="data-[state=checked]:bg-emerald-500 shrink-0"
          />
        </div>

        {/* Per-Order & Per-Month Caps */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <p className="text-sm font-semibold text-foreground">TC Spending Caps</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Max TC per Order</Label>
              <Input
                type="number"
                className="font-mono"
                value={caps.maxTcPerOrder}
                onChange={(e) => setCaps({ ...caps, maxTcPerOrder: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Max TC per Month</Label>
              <Input
                type="number"
                className="font-mono"
                value={caps.maxTcPerMonth}
                onChange={(e) => setCaps({ ...caps, maxTcPerMonth: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end border-t border-border pt-4">
          <Button
            onClick={handleSavePolicy}
            disabled={updatingCaps || updatingConfig}
            className="min-w-[160px] gap-2"
          >
            {(updatingCaps || updatingConfig) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save Rules
          </Button>
        </div>
      </div>

      {/* Sidebar: How it works */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-5 sticky top-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-500" />
          <p className="text-sm font-semibold text-foreground">How it works</p>
        </div>

        <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
          {[
            {
              step: "1",
              title: "3-Layer Currency Model",
              body: "Activity Points → Entity Currency (via normalization) → TC Coins (global).",
            },
            {
              step: "2",
              title: "The 70/30 Rule",
              body: "TC Coins act as a discount layer. Members must earn ≥70% locally; TC can only cover the rest.",
            },
            {
              step: "3",
              title: "Your Control",
              body: "You decide if TC Coins are accepted and set redemption caps to prevent misuse.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {item.step}
              </span>
              <div>
                <p className="font-semibold text-foreground mb-0.5">{item.title}</p>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-border text-xs text-muted-foreground">
          Need help with your economic model?{" "}
          <span className="font-medium text-blue-600">Contact Thrico support.</span>
        </div>
      </div>
    </div>
  );
}
