"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollText, Loader2, ShieldCheck } from "lucide-react";
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
  const { data: configData, loading: loadingConfig } =
    useGetEntityCurrencyConfig();

  const [caps, setCaps] = useState({
    maxTcPerOrder: 0,
    maxTcPerMonth: 0,
  });

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
        minEntityActivityRequired:
          configData.getEntityCurrencyConfig.minEntityActivityRequired,
      });
    }
  }, [configData]);

  const [updateCap, { loading: updatingCaps }] = useUpdateRedemptionCap({
    onCompleted: () => toast.success("Redemption caps updated"),
    onError: (err: any) => toast.error(err.message),
  });

  const [updateConfig, { loading: updatingConfig }] =
    useUpdateEntityCurrencyConfig({
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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <ScrollText className="h-5 w-5" />
              Spending: Redemption Policy
            </CardTitle>
            <CardDescription>
              Rules for using EC and Global TC Coins
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Max TC Percentage</Label>
                  <span className="text-xs font-bold text-purple-600">
                    {spendingRules.maxTcPercentage}%
                  </span>
                </div>
                <Input
                  type="number"
                  value={spendingRules.maxTcPercentage}
                  onChange={(e) =>
                    setSpendingRules({
                      ...spendingRules,
                      maxTcPercentage: Math.min(
                        30,
                        Math.max(10, parseInt(e.target.value) || 10),
                      ),
                    })
                  }
                />
                <p className="text-[10px] text-muted-foreground italic">
                  The 70/30 Rule: Users must earn at least 70% of the value
                  locally (
                  {configData?.getEntityCurrencyConfig?.currencyName || "EC"}).
                  TC Coins can cover the remaining gap, but only up to{" "}
                  {spendingRules.maxTcPercentage}%.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-purple-500/10">
                <div className="space-y-0.5">
                  <Label className="text-sm">Activity Guardrail</Label>
                  <p className="text-[10px] text-muted-foreground">
                    Require minimum local activity
                  </p>
                </div>
                <Switch
                  checked={spendingRules.minEntityActivityRequired}
                  onCheckedChange={(val) =>
                    setSpendingRules({
                      ...spendingRules,
                      minEntityActivityRequired: val,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Max TC/Order</Label>
                  <Input
                    type="number"
                    size={32}
                    value={caps.maxTcPerOrder}
                    onChange={(e) =>
                      setCaps({
                        ...caps,
                        maxTcPerOrder: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Max TC/Month</Label>
                  <Input
                    type="number"
                    value={caps.maxTcPerMonth}
                    onChange={(e) =>
                      setCaps({
                        ...caps,
                        maxTcPerMonth: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleSavePolicy}
              disabled={updatingCaps || updatingConfig}
            >
              {(updatingCaps || updatingConfig) && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Save Spending Rules
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Design Flow Sidebar */}
      <Card className="border-blue-500/20 bg-blue-500/5 h-fit sticky top-6">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            System Design Flow
          </CardTitle>
          <CardDescription className="text-[10px]">
            Thrico Gamification & Multi-Currency Logic
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs space-y-4 text-pretty leading-relaxed">
          <div className="space-y-2">
            <h5 className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-1">
              <span className="h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px]">
                1
              </span>
              The 3-Layer Model
            </h5>
            <div className="pl-5 space-y-1.5 border-l border-blue-200 dark:border-blue-800 ml-2">
              <p>
                <strong>Activity Points</strong>: Raw engagement scores defined
                by you (Likes, Comments, etc).
              </p>
              <p>
                <strong>Entity Currency</strong>: Normalized value (Points ÷
                Normalization Factor).
              </p>
              <p>
                <strong>TC Coins</strong>: Global platform currency for
                cross-entity benefits.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-1">
              <span className="h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px]">
                2
              </span>
              How TC Coins Work
            </h5>
            <div className="pl-5 space-y-1.5 border-l border-blue-200 dark:border-blue-800 ml-2">
              <p>
                TC Coins work as a <strong>discount layer</strong>, not direct
                redemption.
              </p>
              <p className="bg-blue-100/50 dark:bg-blue-900/50 p-2 rounded italic text-[11px]">
                "The 70/30 Rule": TC Coins can cover max 30% of a reward cost.
                Users must always earn at least 70% locally.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-1">
              <span className="h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px]">
                3
              </span>
              Partner Control
            </h5>
            <div className="pl-5 space-y-1.5 border-l border-blue-200 dark:border-blue-800 ml-2">
              <p>
                You decide if TC Coins are accepted and set your own redemption
                caps to prevent abuse.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-blue-500/10">
            <p className="text-[10px] text-muted-foreground italic">
              Need assistance with your economic model?
              <span className="block font-medium text-blue-600">
                Contact the Thrico team.
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
