"use client";

import React, { useState } from "react";
import { FaqItem } from "@/types/faq-types";
import { FaqFilters } from "@/components/faq/faq-filters";
import { FaqList } from "@/components/faq/faq-list";
import { FaqEditor } from "@/components/faq/faq-editor";
import { FaqPreview } from "@/components/faq/faq-preview";
import { Button } from "@/components/ui/button";
import { Plus, HelpCircle, Zap, ShieldCheck, Activity, Share2, Sparkles, LayoutGrid, RotateCcw, Search, Eye, ArrowRight } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemCard, EcosystemStatusIndicator } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";

export default function FaqPage() {
  const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleEdit = (faq: FaqItem) => {
    setSelectedFaq(faq);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setSelectedFaq(null);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedFaq(null);
  };

  return (
    <EcosystemWrapper anonymized-1="faq-intelligence">
      <EcosystemHeader
        title="Knowledge Intelligence"
        badgeText="Support Registry"
        description="Monitor query resolution velocity, knowledge instantiation protocols, and architectural support expansion across the global registry."
        icon={HelpCircle}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <EcosystemStatusIndicator status="active" label="Reality Core: Operational" />
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                 <span>Verified Knowledge Node</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <FaqFilters />
              <div className="h-4 w-px bg-slate-200 mx-1" />
              <Button 
                onClick={handleCreate}
                className="h-10 px-6 rounded-xl bg-slate-900 border-slate-800 font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl hover:bg-black transition-all active:scale-95 group"
              >
                 <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                 Provision FAQ
              </Button>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* FAQ Management */}
           <div className="lg:col-span-7">
              <EcosystemCard 
                title="Foundational Registry" 
                description="Manage and organize architectural query nodes" 
                icon={LayoutGrid}
                decorationIcon={Search}
              >
                 <div className="mt-4">
                    <FaqList onEdit={handleEdit} />
                 </div>
              </EcosystemCard>
           </div>

           {/* FAQ Preview */}
           <div className="lg:col-span-5">
              <EcosystemCard 
                title="Visual Registry" 
                description="Monitor real-time node instantiation manifestation" 
                icon={Eye}
                decorationIcon={Sparkles}
                className="bg-slate-50/50"
              >
                 <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 mt-4 overflow-hidden">
                    <FaqPreview />
                 </div>
              </EcosystemCard>
           </div>
        </div>
      </EcosystemContainer>

      {/* FAQ Editor */}
      <FaqEditor
        faq={selectedFaq}
        open={isEditorOpen}
        onOpenChange={handleCloseEditor}
      />
    </EcosystemWrapper>
  );
}
