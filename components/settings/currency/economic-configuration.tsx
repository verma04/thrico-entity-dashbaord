"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Palette, Zap, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
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
    tcCoinsAllowed: true,
  });
  const [originalConfig, setOriginalConfig] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.getEntityCurrencyConfig) {
      const formatted = {
        currencyName: data.getEntityCurrencyConfig.currencyName || "",
        normalizationFactor: data.getEntityCurrencyConfig.normalizationFactor || 1,
        tcCoinsAllowed: data.getEntityCurrencyConfig.tcCoinsAllowed,
      };
      setConfig(formatted);
      setOriginalConfig(formatted);
    }
  }, [data]);

  const hasChanged = originalConfig ? JSON.stringify(config) !== JSON.stringify(originalConfig) : false;

  const handleReset = () => {
    if (originalConfig) setConfig(originalConfig);
  };

  const [updateConfig, { loading: updating }] = useUpdateEntityCurrencyConfig({
    onCompleted: () => {
      toast.success("Economic configuration updated");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setOriginalConfig(config);
    },
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
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50/60 border border-blue-100">
        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-semibold text-blue-900">How this works</p>
          <p className="text-xs text-blue-800/80 leading-relaxed">
            Activity Points ÷ Normalization Factor = Entity Currency earned. For most entities, a factor of <strong>100</strong> is a stable starting point.
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Currency Name */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Palette className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Currency Name</p>
              <p className="text-xs text-muted-foreground">Your local currency's display name</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Name</Label>
            <Input
              placeholder="e.g. Credits, Gems, Stars"
              value={config.currencyName}
              onChange={(e) => setConfig({ ...config, currencyName: e.target.value })}
            />
          </div>
        </div>

        {/* Normalization Factor */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Zap className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Normalization Factor</p>
              <p className="text-xs text-muted-foreground">Points ÷ Factor = {config.currencyName || "EC"}</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Factor</Label>
            <Input
              type="number"
              className="font-mono font-semibold"
              value={config.normalizationFactor}
              onChange={(e) =>
                setConfig({ ...config, normalizationFactor: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="px-3 py-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-800">
            <span className="font-medium">Example: </span>
            100 pts ÷ {config.normalizationFactor || 1} ={" "}
            <span className="font-bold">
              {(100 / (config.normalizationFactor || 1)).toFixed(2)} {config.currencyName || "EC"}
            </span>
          </div>
        </div>
      </div>

      <FloatingSavePanel
        hasChanged={hasChanged}
        saved={saved}
        isSaving={updating}
        onSave={handleSave}
        onReset={handleReset}
      />
    </div>
  );
}
