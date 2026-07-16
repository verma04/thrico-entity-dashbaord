"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import { TemplateGallery } from "@/components/surveys/templates/template-gallery";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Layout, Sparkles, ArrowLeft, RotateCcw, Search, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModuleStore } from "@/store/useModuleStore";

function SurveyTemplatesPage() {
  const singularName = useModuleStore((state) => state.surveySingularName);
  const router = useRouter();

  return (
    <EcosystemWrapper anonymized-1="survey-templates">
      <EcosystemHeader
        title="Template Gallery"
        badgeText="Research Acceleration"
        description={`Leverage pre-instantiated architectural ${singularName.toLowerCase()} nodes designed for high engagement and quality community insights.`}
        icon={Sparkles}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Template Repository: Online
                 </span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                 <span>Curated Nodes Verified</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => router.push("/surveys/all")}
                className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-slate-50 transition-all shadow-sm"
              >
                <ArrowLeft className="h-4 w-4 text-indigo-500" />
                Return to Archive
              </Button>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-8 lg:p-12">
        <TemplateGallery />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(SurveyTemplatesPage, "SURVEYS", "canRead"),
  "surveys"
);
