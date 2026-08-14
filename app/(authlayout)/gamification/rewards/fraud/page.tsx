"use client";

import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  Sparkles,
  Lock,
  Smartphone,
  Globe,
  UserCheck,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  useGetRewardSecuritySettings,
  useUpdateRewardSecuritySettings,
} from "@/graphql/actions/rewards";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useModuleStore } from "@/store/useModuleStore";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { cn } from "@/lib/utils";

export default function FraudPage() {
  const rewardsModuleName = useModuleStore((state) => state.rewardsModuleName);
  const { toast } = useToast();
  const { data, loading } = useGetRewardSecuritySettings();
  const [updateSettings, { loading: updating }] =
    useUpdateRewardSecuritySettings();
  const [saved, setSaved] = React.useState(false);

  const settings = data?.getRewardSecuritySettings;

  const [localSettings, setLocalSettings] = React.useState<any>({
    dailyRedemptionLimit: 500,
    requireKyc: true,
    lockToDeviceId: false,
    maxIpVelocity: 5,
  });

  React.useEffect(() => {
    if (settings) {
      setLocalSettings({
        dailyRedemptionLimit: settings.dailyRedemptionLimit || 0,
        requireKyc: settings.requireKyc || false,
        lockToDeviceId: settings.lockToDeviceId || false,
        maxIpVelocity: settings.maxIpVelocity || 0,
      });
    }
  }, [settings]);

  const hasChanged = React.useMemo(() => {
    if (!settings) return false;
    return (
      localSettings.dailyRedemptionLimit !==
        (settings.dailyRedemptionLimit || 0) ||
      localSettings.requireKyc !== (settings.requireKyc || false) ||
      localSettings.lockToDeviceId !== (settings.lockToDeviceId || false) ||
      localSettings.maxIpVelocity !== (settings.maxIpVelocity || 0)
    );
  }, [localSettings, settings]);

  const handleReset = () => {
    if (settings) {
      setLocalSettings({
        dailyRedemptionLimit: settings.dailyRedemptionLimit || 0,
        requireKyc: settings.requireKyc || false,
        lockToDeviceId: settings.lockToDeviceId || false,
        maxIpVelocity: settings.maxIpVelocity || 0,
      });
    }
  };

  const set = (key: string, val: any) =>
    setLocalSettings((s: any) => ({ ...s, [key]: val }));

  const handleSave = async () => {
    try {
      await updateSettings({
        variables: {
          input: {
            dailyRedemptionLimit: localSettings.dailyRedemptionLimit,
            requireKyc: localSettings.requireKyc,
            lockToDeviceId: localSettings.lockToDeviceId,
            maxIpVelocity: localSettings.maxIpVelocity,
          },
        },
      });
      toast({
        title: "Settings saved",
        description: "Fraud prevention and security rules updated successfully.",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast({
        title: "Update failed",
        description: "Could not save security configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Fraud Prevention & Security"
        badgeText="Rewards Engine"
        description={`Configure redemption rate limits, identity requirements, and abuse prevention rules for your ${rewardsModuleName.toLowerCase()}.`}
        icon={ShieldCheck}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Fraud Prevention" },
        ]}
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-6">
              {/* Live Security Posture Preview */}
              <PolarisSidebarCard
                title="Protection Status"
                badge="Active Shield"
                icon={Sparkles}
              >
                <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 space-y-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                        Fraud Defense Network
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Real-time transaction scoring active
                      </p>
                    </div>
                  </div>
                </div>

                {/* Structured Configuration Breakdown */}
                <div className="space-y-1.5 pt-2">
                  <PolarisSummaryRow
                    label="Daily Limit"
                    value={
                      localSettings.dailyRedemptionLimit
                        ? `${localSettings.dailyRedemptionLimit} claims/day`
                        : "Unlimited"
                    }
                  />
                  <PolarisSummaryRow
                    label="IP Velocity"
                    value={
                      localSettings.maxIpVelocity
                        ? `Max ${localSettings.maxIpVelocity} claims/IP`
                        : "Uncapped"
                    }
                  />
                  <PolarisSummaryRow
                    label="KYC Gate"
                    value={localSettings.requireKyc ? "Enforced" : "Disabled"}
                  />
                  <PolarisSummaryRow
                    label="Device Lock"
                    value={localSettings.lockToDeviceId ? "Locked" : "Flexible"}
                    isLast
                  />
                </div>
              </PolarisSidebarCard>

              {/* Security Best Practice Tip */}
              <PolarisTipCard title="Fraud Defense Strategy">
                Enforcing IP velocity caps and device locking deters sybil account generation and automated coupon harvesting by over 92%.
              </PolarisTipCard>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Step 1: Daily Velocity & Rate Limiting */}
            <PolarisFormCard
              step={1}
              title="Redemption Rate Limits & Velocity Caps"
              description="Establish platform-wide daily redemption ceilings and per-IP transaction rate limiting."
              badge="Velocity Limits"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dailyLimit" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-zinc-400" />
                    Daily Platform Redemption Cap
                  </Label>
                  <div className="relative">
                    <Input
                      id="dailyLimit"
                      type="number"
                      min={0}
                      value={localSettings.dailyRedemptionLimit}
                      onChange={(e) =>
                        set("dailyRedemptionLimit", parseInt(e.target.value) || 0)
                      }
                      className="h-10 pr-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 uppercase">
                      claims
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Max total rewards redeemable across 24h · 0 for unlimited
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ipVelocity" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-zinc-400" />
                    Max IP Velocity (Per Hour)
                  </Label>
                  <div className="relative">
                    <Input
                      id="ipVelocity"
                      type="number"
                      min={0}
                      value={localSettings.maxIpVelocity}
                      onChange={(e) =>
                        set("maxIpVelocity", parseInt(e.target.value) || 0)
                      }
                      className="h-10 pr-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 uppercase">
                      per IP
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Max redemptions allowed from a single IP address per hour
                  </p>
                </div>
              </div>
            </PolarisFormCard>

            {/* Step 2: Verification Boundaries & Identity Assurance */}
            <PolarisFormCard
              step={2}
              title="Identity Assurance & Device Fingerprinting"
              description="Protect catalog rewards by demanding verified member credentials and unique device binding."
              badge="Identity & Device"
            >
              <div className="space-y-3">
                {/* KYC Toggle Card */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
                      <UserCheck className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Mandatory Identity Verification (KYC)
                      </Label>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        Require members to have verified identity credentials before claiming high-value rewards.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={localSettings.requireKyc}
                    onCheckedChange={(v) => set("requireKyc", v)}
                  />
                </div>

                {/* Device ID Lock Toggle Card */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
                      <Smartphone className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Hardware & Device ID Lock
                      </Label>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        Restrict reward redemptions strictly to the member's registered primary device identifier.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={localSettings.lockToDeviceId}
                    onCheckedChange={(v) => set("lockToDeviceId", v)}
                  />
                </div>
              </div>
            </PolarisFormCard>
          </div>

          {/* Floating Action Bar */}
          <FloatingSavePanel
            hasChanged={hasChanged}
            saved={saved}
            isSaving={updating}
            onSave={handleSave}
            onReset={handleReset}
            title="Save Security Policy"
            description="You have unsaved changes to fraud prevention rules."
            buttonText="Apply Settings"
          />
        </PolarisFormLayout>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
