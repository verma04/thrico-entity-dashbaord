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
import { Loader2, Zap, Palette, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useUpdateEntityCurrencyConfig } from "@/graphql/actions";
import { toast } from "sonner";

interface EconomicConfigProps {
  data: any;
  loading: boolean;
}

export function EconomicConfiguration({ data, loading }: EconomicConfigProps) {
  const [config, setConfig] = useState({
    currencyName: "",
    normalizationFactor: 1,
    tcConversionRate: 1,
    tcCoinsAllowed: true,
  });

  useEffect(() => {
    if (data?.getEntityCurrencyConfig) {
      setConfig({
        currencyName: data.getEntityCurrencyConfig.currencyName || "",
        normalizationFactor:
          data.getEntityCurrencyConfig.normalizationFactor || 1,
        tcConversionRate: data.getEntityCurrencyConfig.tcConversionRate || 1,
        tcCoinsAllowed: data.getEntityCurrencyConfig.tcCoinsAllowed,
      });
    }
  }, [data]);

  const [updateConfig, { loading: updating }] = useUpdateEntityCurrencyConfig({
    onCompleted: () => toast.success("Economic configuration updated"),
    onError: (err: any) => toast.error(err.message),
  });

  const handleSave = () => {
    updateConfig({
      variables: {
        input: {
          currencyName: config.currencyName,
          normalizationFactor: parseInt(config.normalizationFactor.toString()),
          tcCoinsAllowed: config.tcCoinsAllowed,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Advisory Message Section */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex gap-4 items-start">
        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
          <Info className="h-5 w-5 text-blue-600" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">
            Economic Guidance
          </h4>
          <p className="text-xs text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
            This configuration directly affects your currency circulation and
            user earning power.
            <span className="block mt-1 font-medium italic">
              "What is a safe option?" - For most entities, a Normalization
              Factor of 100 is a stable starting point. If you remain confused
              or need custom economic modeling, please contact the Thrico team
              for assistance.
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Currency Branding
            </CardTitle>
            <CardDescription>
              Customize the name of your local entity currency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Currency Name</Label>
              <Input
                placeholder="e.g., Thrico Gems, Credits, Stars"
                value={config.currencyName}
                onChange={(e) =>
                  setConfig({ ...config, currencyName: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Zap className="h-5 w-5" />
              Earning: Normalization Factor
            </CardTitle>
            <CardDescription>
              Activity Points ÷ Normalization Factor ={" "}
              {config.currencyName || "EC"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Normalization Factor</Label>
              <Input
                type="number"
                value={config.normalizationFactor}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    normalizationFactor: parseInt(e.target.value),
                  })
                }
                className="bg-background/50 font-mono font-bold"
              />
            </div>
            <div className="text-[10px] text-muted-foreground bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/10">
              <span className="font-bold uppercase tracking-wider block mb-1">
                Live Calculation
              </span>
              100 Activity Points ÷ {config.normalizationFactor || 1} ={" "}
              <span className="font-bold text-emerald-600">
                {100 / (config.normalizationFactor || 1)}{" "}
                {config.currencyName || "EC"}
              </span>{" "}
              earned.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button
          onClick={handleSave}
          disabled={updating}
          className="min-w-[200px] shadow-lg shadow-primary/20"
        >
          {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
