"use client";

import React from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Save,
  Info,
  ShieldCheck,
  Activity,
  Zap,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  useGetRewardSecuritySettings,
  useUpdateRewardSecuritySettings,
} from "@/graphql/actions/rewards";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemCard } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useModuleStore } from "@/store/useModuleStore";

interface ToggleRowProps {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
  badge?: "enabled" | "disabled";
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
  icon,
  badge,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors group">
      <div className="flex items-center gap-3 pr-4 flex-1 min-w-0">
        {icon && (
          <div
            className={cn(
              "h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors",
              checked
                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                : "bg-muted border-border text-muted-foreground",
            )}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-semibold text-foreground cursor-pointer">
              {label}
            </Label>
            {badge && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border",
                  checked
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-muted text-muted-foreground border-border",
                )}
              >
                {checked ? (
                  <CheckCircle2 className="h-2.5 w-2.5" />
                ) : (
                  <XCircle className="h-2.5 w-2.5" />
                )}
                {checked ? "Active" : "Off"}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

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
        description: "Security configuration updated successfully.",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast({
        title: "Update failed",
        description: "Could not save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Compute a rough "security score"
  const score = [
    localSettings.dailyRedemptionLimit > 0,
  ].filter(Boolean).length;

  const maxScore = 1;
  const scoreLabel = score === maxScore ? "Strong" : "Weak";
  const scoreColor =
    score === maxScore
      ? "text-emerald-600"
      : "text-rose-600";
  const scoreBg =
    score === maxScore
      ? "bg-emerald-500"
      : "bg-rose-500";

  return (
    <EcosystemWrapper data-section="fraud-control">
      <EcosystemHeader
        title="Security Settings"
        badgeText="Fraud Prevention"
        description={`Set limits and verification rules to protect your ${rewardsModuleName.toLowerCase()} from misuse.`}
        icon={ShieldCheck}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Fraud Prevention" },
        ]}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">
            Protection active
          </span>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            Changes apply immediately after saving
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-6 p-6 lg:p-8 max-w-4xl">
        {/* Security score overview */}
        <div className="flex items-center gap-5 p-5 rounded-2xl border border-border bg-card">
          <div className="relative h-16 w-16 shrink-0">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={
                  score === maxScore ? "#10b981" : "#f43f5e"
                }
                strokeWidth="3"
                strokeDasharray={`${(score / maxScore) * 87.96} 87.96`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black text-foreground">
                {score}/{maxScore}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">
                Security Score
              </h3>
              <span className={cn("text-sm font-bold", scoreColor)}>
                {scoreLabel}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {score < maxScore
                ? `Enable ${maxScore - score} more protection rule${maxScore - score > 1 ? "s" : ""} to maximize reward security.`
                : "All protection rules are active. Your rewards are well secured."}
            </p>
            <div className="flex items-center gap-1 mt-3">
              {[...Array(maxScore)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all duration-500",
                    i < score ? scoreBg : "bg-muted",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Redemption Limits */}
        <EcosystemCard
          title="Redemption Limits"
          description="Cap how many rewards can be claimed per day to prevent abuse"
          icon={ShieldAlert}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Daily Redemption Limit
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      The maximum total redemptions allowed across the platform
                      in 24 hours. Set to 0 for unlimited.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <Input
                  type="number"
                  value={localSettings.dailyRedemptionLimit}
                  className="pl-10 h-10"
                  onChange={(e) =>
                    set("dailyRedemptionLimit", parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <p className="text-[11px] text-muted-foreground/60">
                Set to 0 for unlimited
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Minimum Account Age (Days)
              </Label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <Input type="number" defaultValue={30} className="pl-10 h-10" />
              </div>
              <p className="text-[11px] text-muted-foreground/60">
                Members must be this old before redeeming
              </p>
            </div>
          </div>
        </EcosystemCard>

        {/* Access Restrictions */}
        <EcosystemCard
          title="Access Restrictions"
          description="Rank and network-level controls for redemption eligibility"
          icon={ShieldCheck}
        >
          <div className="space-y-2 mt-2">
            <ToggleRow
              label="Leaderboard Priority"
              desc="Only top 100 participants can redeem rewards"
              checked={false}
              onChange={() => {}}
              icon={<Activity className="h-4 w-4" />}
            />
          </div>

          <div className="mt-4 flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                Fair warning
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-400/80 leading-relaxed">
                Stricter rules may block some legitimate users. Monitor
                redemption activity closely after changes.
              </p>
            </div>
          </div>
        </EcosystemCard>
      </EcosystemContainer>

      <FloatingSavePanel
        hasChanged={hasChanged}
        saved={saved}
        isSaving={updating}
        onSave={handleSave}
        onReset={handleReset}
        title="Unsaved Changes"
        description="Security configuration has been modified."
        buttonText="Apply Changes"
      />
    </EcosystemWrapper>
  );
}
