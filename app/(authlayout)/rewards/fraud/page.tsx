"use client";

import React from "react";
import {
  ShieldAlert,
  UserCheck,
  Smartphone,
  Trophy,
  AlertTriangle,
  Save,
  Info,
  ShieldCheck,
  Activity,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import {
  useGetRewardSecuritySettings,
  useUpdateRewardSecuritySettings,
} from "@/graphql/actions/rewards";
import { Skeleton } from "@/components/ui/skeleton";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

export default function FraudPage() {
  const { toast } = useToast();
  const { data, loading } = useGetRewardSecuritySettings();
  const [updateSettings, { loading: updating }] =
    useUpdateRewardSecuritySettings();

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
        dailyRedemptionLimit: settings.dailyRedemptionLimit,
        requireKyc: settings.requireKyc,
        lockToDeviceId: settings.lockToDeviceId,
        maxIpVelocity: settings.maxIpVelocity,
      });
    }
  }, [settings]);

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
        title: "Security Settings Updated",
        description:
          "Fraud prevention parameters have been successfully applied.",
      });
    } catch (err) {
      toast({
        title: "Update Failed",
        description: "Could not save security settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <EcosystemWrapper anonymized-1="fraud-control">
      <EcosystemHeader
        title="Security Settings"
        badgeText="Fraud Prevention"
        description="Manage global security limits and fraud prevention settings for rewards."
        icon={ShieldCheck}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <Activity className="h-4 w-4 text-emerald-500" />
              <span>Security Shield Active</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
               <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
               <span>These settings apply to all reward programs.</span>
            </div>
          </div>
          
          <Button
            onClick={handleSave}
            disabled={loading || updating}
            className="h-10 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-[11px] uppercase tracking-wider gap-3 shadow-xl shadow-slate-200 transition-all active:scale-95 group"
          >
            {updating ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            )}
            {updating ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Global Thresholds */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 px-1">
                <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                   <ShieldAlert className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                   <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Global Limits</h3>
                   <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none mt-1">Limits for the entire platform</p>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-6">
                <div className="p-8 rounded-4xl bg-white border border-slate-100 shadow-sm space-y-8">
                   <div className="space-y-3">
                      <div className="flex items-center justify-between">
                         <Label className="text-[10px] font-semibold uppercase text-slate-400 tracking-widest ml-1">Daily Redemption Limit</Label>
                         <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3.5 w-3.5 text-slate-300 hover:text-indigo-500 transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent className="rounded-xl border-slate-100 shadow-2xl p-4 max-w-xs font-medium text-xs bg-slate-900 text-white">
                                The maximum total redemptions allowed across the platform in 24 hours.
                              </TooltipContent>
                            </Tooltip>
                         </TooltipProvider>
                      </div>
                      <div className="relative group">
                         <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                         <Input
                            type="number"
                            value={localSettings.dailyRedemptionLimit}
                            className="pl-12 h-14 rounded-2xl border-slate-200 font-semibold text-slate-900 text-lg focus:ring-indigo-500/10 transition-all"
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                dailyRedemptionLimit: parseInt(e.target.value) || 0,
                              })
                            }
                         />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <Label className="text-[10px] font-semibold uppercase text-slate-400 tracking-widest ml-1">Minimum Account Age (Days)</Label>
                      <div className="relative group">
                         <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                         <Input
                            type="number"
                            defaultValue={30}
                            className="pl-12 h-14 rounded-2xl border-slate-200 font-semibold text-slate-900 text-lg focus:ring-emerald-500/10 transition-all"
                         />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Verification Protocol */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 px-1">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                   <UserCheck className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                   <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Identity & Device</h3>
                   <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none mt-1">Verification and bot defense</p>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-6">
                <div className="p-8 rounded-4xl bg-white border border-slate-100 shadow-sm space-y-6">
                   <div className="flex items-start justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
                     <div className="space-y-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Label className="text-sm font-semibold text-slate-900 tracking-tight">Identity Verification (KYC)</Label>
                          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight leading-relaxed max-w-[200px]">
                          Restrict rewards to verified users.
                        </p>
                     </div>
                     <Switch
                        checked={localSettings.requireKyc}
                        onCheckedChange={(checked) =>
                          setLocalSettings({
                            ...localSettings,
                            requireKyc: checked,
                          })
                        }
                        className="data-[state=checked]:bg-indigo-600"
                      />
                   </div>

                   <div className="flex items-start justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
                     <div className="space-y-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Label className="text-sm font-semibold text-slate-900 tracking-tight">Device Lock</Label>
                          <Smartphone className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight leading-relaxed max-w-[200px]">
                          Bind accounts to specific devices.
                        </p>
                     </div>
                     <Switch
                        checked={localSettings.lockToDeviceId}
                        onCheckedChange={(checked) =>
                          setLocalSettings({
                            ...localSettings,
                            lockToDeviceId: checked,
                          })
                        }
                        className="data-[state=checked]:bg-indigo-600"
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Access Restrictions */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-1">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                 <Trophy className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                 <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Access Restrictions</h3>
                 <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none mt-1">Rank and network limits</p>
              </div>
           </div>

           <div className="p-8 rounded-4xl bg-white border border-slate-100 shadow-sm space-y-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 scale-150">
                <ShieldCheck className="h-40 w-40" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <Label className="text-sm font-bold text-slate-900 tracking-tight">Leaderboard Priority</Label>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Only top 100 global participants can access reward flow.</p>
                       </div>
                       <Switch defaultChecked={false} className="data-[state=checked]:bg-amber-500" />
                    </div>
                    <Separator className="bg-slate-50" />
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <Label className="text-sm font-bold text-slate-900 tracking-tight">Bot Prevention (IP Velocity)</Label>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Detect and nullify bot-driven burst activity.</p>
                       </div>
                       <Switch
                        checked={localSettings.maxIpVelocity > 0}
                        onCheckedChange={(checked) =>
                          setLocalSettings({
                            ...localSettings,
                            maxIpVelocity: checked ? 5 : 0,
                          })
                        }
                        className="data-[state=checked]:bg-amber-500"
                      />
                    </div>
                 </div>

                 <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100/50 flex items-start gap-4">
                    <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-1 animate-pulse" />
                    <div className="space-y-2">
                       <h4 className="text-sm font-bold text-amber-900 uppercase tracking-tight">Security Warning</h4>
                       <p className="text-[11px] font-bold text-amber-700/80 uppercase leading-relaxed tracking-tight">
                         Stricter security rules may affect some users. Monitor redemptions closely after saving.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
