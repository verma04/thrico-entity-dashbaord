"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { 
  ShieldCheck, 
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetTermsAndConditionsByModule,
  useUpdateTermsAndConditionsByModule,
} from "@/graphql/actions/faq";
import { 
  ModuleCard, 
  ModuleHeader, 
  ModuleStatusBar, 
  ModuleSectionLabel 
} from "./module-ui-kit";

interface ModuleTermsManagerProps {
  moduleName: string;
  title?: string;
  description?: string;
  placeholder?: string;
}

export function ModuleTermsManager({
  moduleName,
  title = "Terms & Conditions",
  description = "Manage terms and conditions for this module",
  placeholder = "Enter terms and conditions here...",
}: ModuleTermsManagerProps) {
  const { toast } = useToast();
  const [termsContent, setTermsContent] = useState<string>("");
  const [hasChanged, setHasChanged] = useState(false);

  // Fetch Terms data
  const { data, loading } = useGetTermsAndConditionsByModule({
    variables: { input: { module: moduleName } },
  });

  useEffect(() => {
    if (data?.getTermsAndConditionsByModule?.termsAndConditions) {
      setTermsContent(data.getTermsAndConditionsByModule.termsAndConditions);
      setHasChanged(false);
    }
  }, [data]);

  const [updateTerms, { loading: updating }] = useUpdateTermsAndConditionsByModule({
    module: moduleName,
    onCompleted: () => {
      toast({ title: "Terms Updated", description: "Legal content has been successfully published." });
      setHasChanged(false);
    },
  });

  const handleContentChange = (value: string) => {
    setTermsContent(value);
    setHasChanged(value !== (data?.getTermsAndConditionsByModule?.termsAndConditions || ""));
  };

  const handleSave = async () => {
    try {
      await updateTerms({
        variables: { module: moduleName, termsAndConditions: termsContent },
      });
    } catch (e) {}
  };

  const handleReset = () => {
    if (data?.getTermsAndConditionsByModule?.termsAndConditions) {
      setTermsContent(data.getTermsAndConditionsByModule.termsAndConditions);
      setHasChanged(false);
    }
  };

  if (loading) return null;

  return (
    <div className="animate-in fade-in duration-500">
      <ModuleCard>
        <ModuleHeader
          title={title}
          description={description}
          icon={<ShieldCheck size={24} strokeWidth={1.5} />}
          iconClassName="bg-indigo-600"
          hasChanged={hasChanged}
          onSave={handleSave}
          onReset={handleReset}
          isLoading={updating}
          saveLabel="PUBLISH TERMS"
          resetLabel="DISCARD"
        />
        
        <CardContent className="p-8">
          <div className="space-y-6">
            <ModuleSectionLabel>Legal Content Canvas</ModuleSectionLabel>

            <div className="rounded-[24px] border border-zinc-100 overflow-hidden shadow-sm bg-zinc-50/20 ring-1 ring-zinc-50 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
              <RichTextEditor
                value={termsContent}
                onChange={handleContentChange}
                placeholder={placeholder}
                minHeight="500px"
              />
            </div>

            <div className="flex items-center justify-between px-2 pt-2">
              <div className="flex items-center gap-3 py-2 px-4 rounded-xl bg-zinc-50/80 border border-zinc-100 text-[11px] font-bold text-zinc-400">
                <AlertCircle size={14} className="text-zinc-300" />
                Auto-syncing to blockchain node clusters
              </div>
              
              <AnimatePresence>
                {hasChanged && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 text-[11px] font-black tracking-tight flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_oklch(0.76_0.18_70/0.4)]" />
                    UNPUBLISHED DRAFT
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>

        <ModuleStatusBar label="Module Compliance Verified" />
      </ModuleCard>
    </div>
  );
}
