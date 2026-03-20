"use client";

import React from "react";
import { ModuleSettingsForm } from "@/components/common/module-settings-form";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2, Settings, Zap, ShieldCheck, Activity, Share2, Sparkles, LayoutGrid, RotateCcw } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const StoriesSettings = () => {
  const { data, loading, refetch } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const fields = [
    {
      key: "allowStories",
      label: "Allow Stories",
      description: "Enable or disable the ability to create new stories within the registry.",
    },
    {
      key: "autoApproveStories",
      label: "Auto Approve Stories",
      description: "Automatically validate and approve new story nodes in real-time.",
    },
  ];

  if (loading) {
    return (
      <EcosystemWrapper anonymized-1="stories-settings">
         <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-xl shadow-indigo-600/10" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Hydrating Settings Registry...</p>
         </div>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper anonymized-1="stories-settings">
      <EcosystemHeader
        title="Stories Protocol"
        badgeText="Module Settings"
        description="Configure story instantiation parameters, validation workflows, and architectural moderation protocols."
        icon={Share2}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Settings Node: Synchronized
                 </span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm bg-white"
                onClick={() => refetch()}
              >
                <RotateCcw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 overflow-hidden border-none shadow-xl shadow-slate-200/50 rounded-4xl bg-white ring-1 ring-slate-100">
        <div className="p-10 lg:p-14">
          <ModuleSettingsForm
            title="Registry Parameters"
            description="Foundational stories module configuration protocols."
            fields={fields}
            onSave={(settings) => {
              update({
                variables: {
                  input: settings,
                },
              });
            }}
            isLoading={loadingBtn}
            data={{
              allowStories: data?.getEntitySettings?.allowStories ?? true,
              autoApproveStories:
                data?.getEntitySettings?.autoApproveStories ?? false,
            }}
          />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default StoriesSettings;
