"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Plus, Mail, RefreshCw } from "lucide-react";
import { useGetEmailTemplates, type EmailTemplate } from "@/graphql/actions/email";

import { TemplateHeader } from "./templates/template-header";
import { TemplateCard } from "./templates/template-card";
import { TemplatePreviewModal } from "./templates/template-preview-modal";
import { TemplateStarters } from "./templates/template-starters";

export default function TemplateList() {
  const router = useRouter();
  const { data, loading } = useGetEmailTemplates();
  const [preview, setPreview] = React.useState<EmailTemplate | null>(null);

  const templates = data?.getEmailTemplates || [];

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center">
        <RefreshCw className="h-5 w-5 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-in fade-in duration-500">
      <TemplateHeader
        count={templates.length}
        onCreate={() => router.push("/email/templates/create")}
      />

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {/* New template tile */}
        <button
          onClick={() => router.push("/email/templates/create")}
          className="group rounded-xl border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center hover:border-primary/30 hover:bg-muted/40 transition-all cursor-pointer"
          style={{ minHeight: 220 }}
        >
          <div className="h-9 w-9 rounded-lg border border-border bg-background group-hover:bg-primary group-hover:border-primary flex items-center justify-center transition-all">
            <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
          </div>
          <p className="text-[11px] font-medium text-muted-foreground mt-2 group-hover:text-foreground transition-colors">
            Create template
          </p>
        </button>

        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onPreview={setPreview}
          />
        ))}
      </div>

      {/* Starter Templates */}
      <TemplateStarters />

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <TemplatePreviewModal
            template={preview}
            onClose={() => setPreview(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
