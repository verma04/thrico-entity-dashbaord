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
import { Progress } from "@/components/ui/progress";
import { ShieldAlert, Loader2, Info } from "lucide-react";
import {
  useGetEntityCurrencyConfig,
  useGetTCConversionCap,
  useUpdateTCConversionCap,
} from "@/graphql/actions";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function RiskManagement() {
  const { data: configData, loading: loadingConfig } =
    useGetEntityCurrencyConfig();
  const { data: convData, loading: loadingConv } = useGetTCConversionCap();

  const [tcCaps, setTcCaps] = useState({
    maxTcPerDay: 0,
    maxTcPerMonth: 0,
    maxTcPerEntity: 0,
  });

  const currencyName =
    configData?.getEntityCurrencyConfig?.currencyName || "TC";

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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Risk Logic Advisory */}
      <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 flex gap-4 items-start">
        <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
          <Info className="h-5 w-5 text-orange-600" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-orange-900 dark:text-orange-100">
            How Risk Logic Works
          </h4>
          <p className="text-xs text-orange-800/80 dark:text-orange-200/80 leading-relaxed text-pretty">
            These guardrails control the <strong>Liquidity Velocity</strong> of
            your {currencyName}. They prevent sudden depletion of your entity's
            treasury by setting hard ceilings on how much {currencyName} can be
            minted through TC conversions daily and monthly.
            <span className="block mt-2 font-medium italic">
              A Global Limit (Entity) is your ultimate emergency brake—once hit,
              no more {currencyName} can be generated until the limit is raised.
              If you need help setting these safely, please contact the Thrico
              team.
            </span>
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            Financial Guardrails
          </CardTitle>
          <CardDescription>
            {currencyName} generation and movement caps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Max {currencyName} Per Day</Label>
                <span className="text-muted-foreground font-mono">
                  {tcCaps.maxTcPerDay}
                </span>
              </div>
              <Input
                type="number"
                value={tcCaps.maxTcPerDay}
                onChange={(e) =>
                  setTcCaps({
                    ...tcCaps,
                    maxTcPerDay: parseInt(e.target.value),
                  })
                }
              />
              <Progress value={45} className="h-1" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Max {currencyName} Per Month</Label>
                <span className="text-muted-foreground font-mono">
                  {tcCaps.maxTcPerMonth}
                </span>
              </div>
              <Input
                type="number"
                value={tcCaps.maxTcPerMonth}
                onChange={(e) =>
                  setTcCaps({
                    ...tcCaps,
                    maxTcPerMonth: parseInt(e.target.value),
                  })
                }
              />
              <Progress value={60} className="h-1" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Max {currencyName} Global Limit (Entity)</Label>
                <span className="text-muted-foreground font-mono">
                  {tcCaps.maxTcPerEntity}
                </span>
              </div>
              <Input
                type="number"
                value={tcCaps.maxTcPerEntity}
                onChange={(e) =>
                  setTcCaps({
                    ...tcCaps,
                    maxTcPerEntity: parseInt(e.target.value),
                  })
                }
              />
              <Progress value={20} className="h-1" />
            </div>
          </div>

          <Button
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={() => updateTcCap({ variables: { input: tcCaps } })}
            disabled={updating}
          >
            {updating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Update Guardrails
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
