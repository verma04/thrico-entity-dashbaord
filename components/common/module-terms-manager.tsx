"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { 
  ShieldCheck, 
  AlertCircle,
  Save,
  RotateCcw
} from "lucide-react";
import {
  useGetTermsAndConditionsByModule,
  useUpdateTermsAndConditionsByModule,
} from "@/graphql/actions/faq";
import { PlatformCard, PlatformSection } from "@/components/ui/platform/card";
import { PlatformHeader } from "@/components/ui/platform/header";
import { PlatformButton } from "@/components/ui/platform/button";
import { PlatformSectionLabel } from "@/components/ui/platform/settings";
import { toast } from "sonner";

interface ModuleTermsManagerProps {
  moduleName: string;
  title?: string;
  description?: string;
  placeholder?: string;
}

export function ModuleTermsManager({
  moduleName,
  title = "Terms & Conditions",
  description = "Define the legal parameters and user agreements for this module.",
  placeholder = "Enter terms and conditions here...",
}: ModuleTermsManagerProps) {
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
      toast.success("Legal content published.");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <PlatformHeader
        title={title}
        description={description}
        icon={ShieldCheck}
        actions={
          <AnimatePresence>
            {hasChanged && (
              <motion.div
                initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 10, filter: "blur(8px)" }}
                className="flex items-center gap-3"
              >
                <PlatformButton
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={updating}
                  icon={RotateCcw}
                >
                  Discard
                </PlatformButton>
                <PlatformButton
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  isLoading={updating}
                  icon={Save}
                >
                  Publish
                </PlatformButton>
              </motion.div>
            )}
          </AnimatePresence>
        }
      />
      
      <PlatformSection title="Legal Framework">
        <div className="space-y-6">
          <PlatformSectionLabel>LEGAL CONTENT CANVAS</PlatformSectionLabel>

          <div className="rounded-[20px] border border-zinc-100 overflow-hidden shadow-sm bg-zinc-50/20 focus-within:border-zinc-200 focus-within:shadow-md transition-all">
            <RichTextEditor
              value={termsContent}
              onChange={handleContentChange}
              placeholder={placeholder}
              minHeight="500px"
            />
          </div>

          <div className="flex items-center justify-between px-2 pt-2">
            <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-2">
              <AlertCircle size={14} className="text-zinc-300" />
              Content is synchronized to blockchain node clusters.
            </div>
            
            <AnimatePresence>
              {hasChanged && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200/50 text-zinc-500 text-[10px] font-bold tracking-tight flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-zinc-400 animate-pulse" />
                  UNPUBLISHED DRAFT
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </PlatformSection>
    </div>
  );
}

