"use client";

import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2, Settings2, ShieldCheck, Zap, ArrowRight, Activity, Globe, Search, Plus, RotateCcw, Timer, Sparkles, Sliders } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const EventsSettings = () => {
  const { data, loading, refetch } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});
  
  const [settings, setSettings] = useState({
    allowEvents: true,
    autoApproveEvents: false,
  });

  useEffect(() => {
    if (data?.getEntitySettings) {
      setSettings({
        allowEvents: data.getEntitySettings.allowEvents ?? true,
        autoApproveEvents: data.getEntitySettings.autoApproveEvents ?? false,
      });
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success("Institutional parameters updated successfully.");
      refetch();
    } catch (err) {
      toast.error("Failed to synchronize institutional parameters.");
    }
  };

  if (loading) {
    return (
      <EcosystemWrapper anonymized-1="events-settings-loading">
        <EcosystemHeader
          title="Protocol Configuration"
          badgeText="System Foundation"
          description="Synchronizing event module parameters with the global registry node."
          icon={Settings2}
        />
        <EcosystemActionBar shadow="none">
           <Skeleton className="h-10 w-48 rounded-xl" />
        </EcosystemActionBar>
        <EcosystemContainer className="space-y-12 p-12">
           <Skeleton className="h-[400px] w-full rounded-[3.5rem]" />
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper anonymized-1="events-settings">
      <EcosystemHeader
        title="Protocol Configuration"
        badgeText="Event Registry"
        description="Configure institutional event instantiation rules, approval protocols, and foundational module parameters."
        icon={Settings2}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Configuration Stream: Active
                 </span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                 <span>Verified Administrative Node</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button 
                className="h-10 px-6 rounded-xl bg-slate-900 border-slate-800 font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl hover:bg-black transition-all disabled:opacity-50"
                onClick={handleSave}
                disabled={loadingBtn}
              >
                {loadingBtn ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                Commit Protocol
              </Button>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <div className="lg:col-span-8">
              <div className="p-10 rounded-[3.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 group relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform duration-1000 group-hover:scale-[1.7]">
                    <Sliders className="h-48 w-48 text-indigo-500" />
                 </div>
                 
                 <div className="relative z-10 space-y-12">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl shadow-slate-200 flex items-center justify-center text-white">
                          <Settings2 className="h-6 w-6" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Institutional Rules</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1.5">Event instantiation & approval protocols</p>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="flex items-center justify-between p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500 group/item">
                          <div className="space-y-1">
                             <Label className="text-sm font-black text-slate-900 uppercase tracking-widest">Allow Event Creation</Label>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enable or disable the ability to instantiate new events across the node.</p>
                          </div>
                          <Switch 
                            checked={settings.allowEvents} 
                            onCheckedChange={(val) => setSettings(prev => ({ ...prev, allowEvents: val }))} 
                            className="data-[state=checked]:bg-indigo-600 shadow-lg"
                          />
                       </div>

                       <div className="flex items-center justify-between p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500 group/item">
                          <div className="space-y-1">
                             <Label className="text-sm font-black text-slate-900 uppercase tracking-widest">Auto Approve Events</Label>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Automatically authorize new event creation requests in the registry.</p>
                          </div>
                          <Switch 
                            checked={settings.autoApproveEvents} 
                            onCheckedChange={(val) => setSettings(prev => ({ ...prev, autoApproveEvents: val }))} 
                            className="data-[state=checked]:bg-indigo-600 shadow-lg"
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className="p-10 rounded-[3rem] bg-slate-900 border border-slate-800 shadow-2xl shadow-slate-200 relative overflow-hidden group">
                 <div className="absolute -top-10 -right-10 h-40 w-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-1000" />
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-400 border border-white/10 group-hover:scale-110 transition-transform">
                          <Sparkles className="h-5 w-5" />
                       </div>
                       <h4 className="text-sm font-black text-white uppercase tracking-widest">Protocol Tip</h4>
                    </div>
                    <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                       Disabling auto-approval allows for manual verification of each event node before it is broadcasted to the global registry.
                    </p>
                 </div>
              </div>

              <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6 group">
                 <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-500" />
                    System Status
                 </h4>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync Status</span>
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Synchronized</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 italic">
                       <div className="h-full w-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Mandates</span>
                       <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Operational</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default EventsSettings;
