"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import TemplateBuilder from "@/components/email/template-builder";
import { useGetEmailTemplate } from "@/graphql/actions/email";
import { RefreshCw } from "lucide-react";
import { STARTER_TEMPLATES } from "@/lib/email-templates";

export default function CreateTemplatePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  // Fetch data if editing
  const { data, loading } = useGetEmailTemplate(id || "");

  const initialData = useMemo(() => {
    if (id && data?.getEmailTemplate) {
      return data.getEmailTemplate;
    }
    // If we have a type, use a starter template
    if (type && STARTER_TEMPLATES[type as keyof typeof STARTER_TEMPLATES]) {
      const starter = STARTER_TEMPLATES[type as keyof typeof STARTER_TEMPLATES];
      return {
        id: "",
        name: starter.name,
        subject: starter.subject,
        json: JSON.stringify(starter.blocks),
        html: "", // Will be generated in TemplateBuilder
        updatedAt: new Date().toISOString(),
      };
    }
    return undefined;
  }, [id, data, type]);

  if (id && loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" strokeWidth={1.5} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Resolving Template Manifest...
          </p>
        </div>
      </div>
    );
  }

  return <TemplateBuilder id={id || undefined} initialData={initialData} />;
}
