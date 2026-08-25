"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Info, Zap, Calendar, Globe } from "lucide-react";
import {
  useGetEntityCurrencyConfig,
  useGetTCConversionCap,
  useUpdateTCConversionCap,
} from "@/graphql/actions";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { toast } from "sonner";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInfoBanner,
  PolarisInput,
} from "@/components/gamification/shared/polaris-form-ui";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";

export function RiskManagement() {
  const { data: configData, loading: loadingConfig } =
    useGetEntityCurrencyConfig();
  const { data: convData, loading: loadingConv } = useGetTCConversionCap();

  const [tcCaps, setTcCaps] = useState({
    maxTcPerDay: 0,
    maxTcPerMonth: 0,
    maxTcPerEntity: 0,
  });
  const [originalTcCaps, setOriginalTcCaps] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const currencyName =
    configData?.getEntityCurrencyConfig?.currencyName || "Currency";

  useEffect(() => {
    if (convData?.getTCConversionCap) {
      const formatted = {
        maxTcPerDay: convData.getTCConversionCap.maxTcPerDay || 0,
        maxTcPerMonth: convData.getTCConversionCap.maxTcPerMonth || 0,
        maxTcPerEntity: convData.getTCConversionCap.maxTcPerEntity || 0,
      };
      setTcCaps(formatted);
      setOriginalTcCaps(formatted);
    }
  }, [convData]);

  const hasChanged = originalTcCaps
    ? JSON.stringify(tcCaps) !== JSON.stringify(originalTcCaps)
    : false;

  const handleReset = () => {
    if (originalTcCaps) setTcCaps(originalTcCaps);
  };

  const [updateTcCap, { loading: updating }] = useUpdateTCConversionCap({
    onCompleted: () => {
      toast.success(`${currencyName} anti-abuse guardrails updated`);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setOriginalTcCaps(tcCaps);
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (loadingConfig || loadingConv) {
    return <PolarisFormSkeleton showHeader={false} />;
  }

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <>
            {/* Guardrails Overview Sidebar Card */}
            <PolarisSidebarCard
              title="Guardrail Snapshot"
              badge="Active Limits"
              icon={ShieldAlert}
            >
              <div className="space-y-1">
                <PolarisSummaryRow
                  label="Daily Rate Limit"
                  value={
                    tcCaps.maxTcPerDay > 0
                      ? `${tcCaps.maxTcPerDay.toLocaleString()} ${currencyName}`
                      : "Unlimited (0)"
                  }
                />
                <PolarisSummaryRow
                  label="Monthly Cadence Limit"
                  value={
                    tcCaps.maxTcPerMonth > 0
                      ? `${tcCaps.maxTcPerMonth.toLocaleString()} ${currencyName}`
                      : "Unlimited (0)"
                  }
                />
                <PolarisSummaryRow
                  label="Entity Hard Ceiling"
                  value={
                    tcCaps.maxTcPerEntity > 0
                      ? `${tcCaps.maxTcPerEntity.toLocaleString()} ${currencyName}`
                      : "Unlimited (0)"
                  }
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Circuit Breaker Best Practice Tip */}
            <PolarisTipCard title="Circuit Breaker Safeguards">
              Setting a <strong>Global Limit</strong> serves as an emergency circuit breaker. If anomalous member reward farming or script loops trigger excessive reward generation, the system automatically stops minting when the cap is reached.
            </PolarisTipCard>
          </>
        }
      >
        <div className="space-y-3.5">
          {/* Info Banner */}
          <PolarisInfoBanner
            title={`About ${currencyName} Velocity Controls`}
            description={`These parameters enforce systemic caps on how much ${currencyName} can be minted and credited to member wallets across rolling 24-hour windows, monthly calendar billing cycles, and lifetime entity bounds.`}
          />

          {/* Step 1: Minting & Allocation Velocity Caps */}
          <PolarisFormCard
            step={1}
            title="Minting & Allocation Velocity Caps"
            description={`Configure maximum velocity thresholds for ${currencyName} issuance.`}
            badge="Anti-Fraud"
          >
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <PolarisInput
                  id="maxTcPerDay"
                  type="number"
                  min={0}
                  label={`Max ${currencyName} per Day`}
                  prefix={<Zap className="h-3.5 w-3.5" />}
                  suffix={currencyName.toUpperCase()}
                  placeholder="0 for unlimited"
                  helperText="Resets automatically every 24 hours (rolling UTC window)."
                  value={tcCaps.maxTcPerDay}
                  onChange={(e) =>
                    setTcCaps({
                      ...tcCaps,
                      maxTcPerDay: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                />

                <PolarisInput
                  id="maxTcPerMonth"
                  type="number"
                  min={0}
                  label={`Max ${currencyName} per Month`}
                  prefix={<Calendar className="h-3.5 w-3.5" />}
                  suffix={currencyName.toUpperCase()}
                  placeholder="0 for unlimited"
                  helperText="Resets on the 1st day of each calendar month."
                  value={tcCaps.maxTcPerMonth}
                  onChange={(e) =>
                    setTcCaps({
                      ...tcCaps,
                      maxTcPerMonth: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                />
              </div>

              <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisInput
                  id="maxTcPerEntity"
                  type="number"
                  min={0}
                  label={`Global Entity Hard Cap (Lifetime Total)`}
                  prefix={<Globe className="h-3.5 w-3.5" />}
                  suffix={currencyName.toUpperCase()}
                  placeholder="0 for unlimited"
                  helperText="Hard ceiling across all members. Once reached, all currency generation halts until adjusted."
                  value={tcCaps.maxTcPerEntity}
                  onChange={(e) =>
                    setTcCaps({
                      ...tcCaps,
                      maxTcPerEntity: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                />
              </div>
            </div>
          </PolarisFormCard>
        </div>
      </PolarisFormLayout>

      <FloatingSavePanel
        hasChanged={hasChanged}
        saved={saved}
        isSaving={updating}
        onSave={() => updateTcCap({ variables: { input: tcCaps } })}
        onReset={handleReset}
        title="Unsaved Guardrail Settings"
        description="You have modified the anti-abuse velocity guardrails."
        buttonText="Save Guardrails"
      />
    </div>
  );
}
