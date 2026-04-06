"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetModerationSettings,
  useUpdateModerationSettings,
} from "@/graphql/moderation/hooks";
import { toast } from "sonner";
import { Settings, Shield, ShieldCheck, ShieldAlert, Cpu, Users, Save, RotateCcw } from "lucide-react";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

export function ModerationSettingsPanel() {
  const { data, loading, error, refetch } = useGetModerationSettings();
  const [updateSettings, { loading: updating }] = useUpdateModerationSettings();

  const [settings, setSettings] = useState({
    autoModerationEnabled: true,
    bannedWordsAction: "FLAG",
    blockedLinksAction: "BLOCK",
    spamDetectionEnabled: true,
    spamThreshold: 80,
    autoFlagThreshold: 3,
    autoHideThreshold: 5,
  });

  useEffect(() => {
    if (data?.getModerationSettings) {
      const { id, __typename, ...rest } = data.getModerationSettings;
      setSettings(rest as any);
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateSettings({
        variables: {
          input: settings,
        },
      });
      toast.success("Moderation settings updated");
      refetch();
    } catch (err) {
      toast.error("Failed to update settings");
    }
  };

  if (error) {
     return (
        <div className="p-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-600">
           <p className="text-sm font-medium">Failed to load moderation settings.</p>
        </div>
     );
  }

  return (
    <div className="min-h-screen flex flex-col">
       <EcosystemHeader
        title="Moderation Engine"
        description="Global parameters for AI filtering, community reporting thresholds, and automated safety protocols."
        badgeText="Core Settings"
        icon={Settings}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
            <div className="flex items-center gap-2 px-1">
               <ShieldCheck className={cn("h-4 w-4", settings.autoModerationEnabled ? "text-emerald-500" : "text-muted-foreground")} />
               <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  System Status: {settings.autoModerationEnabled ? "Active" : "Disabled"}
               </span>
            </div>
        </EcosystemActionBar.Group>
        <EcosystemActionBar.Group align="right">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="h-8 gap-1.5">
             <RotateCcw className="h-3.5 w-3.5" />
             Reload
          </Button>
          <Button size="sm" onClick={handleSave} disabled={updating} className="h-8 gap-1.5 font-bold">
            <Save className="h-3.5 w-3.5" />
            {updating ? "Saving..." : "Save Changes"}
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 max-w-4xl mx-auto w-full">
         <div className="grid gap-6">
            {/* Master Toggle */}
            <div className="p-5 rounded-xl border border-border bg-card flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-4">
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", 
                     settings.autoModerationEnabled ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"
                  )}>
                     <Shield className="h-5 w-5" />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-foreground">Global Auto-Moderation</p>
                     <p className="text-xs text-muted-foreground">Toggle all autonomous content review pipelines across the platform.</p>
                  </div>
               </div>
               <Switch
                checked={settings.autoModerationEnabled}
                onCheckedChange={(c) =>
                  setSettings({ ...settings, autoModerationEnabled: c })
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               {/* Content Filters */}
               <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center gap-3">
                     <ShieldAlert className="h-4 w-4 text-indigo-600" />
                     <p className="text-sm font-bold text-foreground">Policy Enforcement</p>
                  </div>
                  <div className="p-5 space-y-5">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Banned Words Policy</Label>
                        <Select
                           value={settings.bannedWordsAction}
                           onValueChange={(v) =>
                           setSettings({ ...settings, bannedWordsAction: v })
                           }
                        >
                           <SelectTrigger className="h-10">
                           <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                           <SelectItem value="FLAG" className="font-medium">Flag for Review</SelectItem>
                           <SelectItem value="BLOCK" className="font-medium">Block Immediately</SelectItem>
                           <SelectItem value="REPLACE" className="font-medium">Obfuscate (***)</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Restricted Link Policy</Label>
                        <Select
                           value={settings.blockedLinksAction}
                           onValueChange={(v) =>
                           setSettings({ ...settings, blockedLinksAction: v })
                           }
                        >
                           <SelectTrigger className="h-10">
                           <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                           <SelectItem value="BLOCK" className="font-medium">Block Immediately</SelectItem>
                           <SelectItem value="WARN" className="font-medium">Warn User</SelectItem>
                           <SelectItem value="FLAG" className="font-medium">Flag for Review</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  </div>
               </div>

               {/* AI Intelligence */}
               <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Cpu className="h-4 w-4 text-emerald-600" />
                        <p className="text-sm font-bold text-foreground">AI Intelligence</p>
                     </div>
                     <Switch
                        checked={settings.spamDetectionEnabled}
                        onCheckedChange={(c) =>
                           setSettings({ ...settings, spamDetectionEnabled: c })
                        }
                     />
                  </div>
                  <div className="p-5 space-y-6">
                     <div className="space-y-4">
                        <div className="flex justify-between items-end">
                           <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Sensitivity Threshold</Label>
                           <span className="text-sm font-bold text-emerald-600 font-mono">
                           {settings.spamThreshold}%
                           </span>
                        </div>
                        <Slider
                           value={[settings.spamThreshold]}
                           max={100}
                           step={1}
                           onValueChange={([v]) =>
                           setSettings({ ...settings, spamThreshold: v })
                           }
                           className="py-1"
                        />
                        <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                           <span>Aggressive</span>
                           <span>Lenient</span>
                        </div>
                     </div>
                     <p className="text-[10px] leading-relaxed text-muted-foreground italic bg-muted/30 p-2.5 rounded-lg border border-border/50">
                        AI analyzes linguistic patterns and metadata to predict spam. Higher sensitivity targets borderline behavior.
                     </p>
                  </div>
               </div>
            </div>

            {/* Community Reporting */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
               <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center gap-3">
                  <Users className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-bold text-foreground">Community Consensus</p>
               </div>
               <div className="p-6 grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Auto-Flag Count</Label>
                     <Input
                        type="number"
                        value={settings.autoFlagThreshold}
                        onChange={(e) =>
                           setSettings({
                              ...settings,
                              autoFlagThreshold: parseInt(e.target.value) || 0,
                           })
                        }
                        className="h-10 text-sm font-bold"
                     />
                     <p className="text-[11px] text-muted-foreground leading-snug pt-1">
                        Reports required to automatically move content into the manual review queue.
                     </p>
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Auto-Hide Count</Label>
                     <Input
                        type="number"
                        value={settings.autoHideThreshold}
                        onChange={(e) =>
                           setSettings({
                              ...settings,
                              autoHideThreshold: parseInt(e.target.value) || 0,
                           })
                        }
                        className="h-10 text-sm font-bold"
                     />
                     <p className="text-[11px] text-muted-foreground leading-snug pt-1">
                        Critical threshold where content is hidden from the public feed until manually verified.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </EcosystemContainer>
    </div>
  );
}
