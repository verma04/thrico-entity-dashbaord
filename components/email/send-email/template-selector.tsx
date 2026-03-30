"use client";

import React from "react";
import { Mail, Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmailTemplate } from "./types";
import { useRouter } from "next/navigation";

interface TemplateSelectorProps {
  templates: EmailTemplate[];
  selectedTemplateId: string | null;
  onSelect: (id: string, subject: string) => void;
  loading: boolean;
}

export function TemplateSelector({ templates, selectedTemplateId, onSelect, loading }: TemplateSelectorProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Choose a template
            {templates.length > 0 && (
              <span className="ml-2 text-xs font-medium text-slate-400">{templates.length} available</span>
            )}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Select a template to use for this campaign.</p>
        </div>
        <button
          onClick={() => router.push("/email/templates/create")}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all"
        >
          <Plus className="h-4 w-4" />
          New Template
        </button>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
          <RefreshCw className="h-5 w-5 text-slate-300 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t.id, t.subject || "")}
              className={cn(
                "text-left p-5 rounded-2xl border transition-all flex flex-col gap-4",
                selectedTemplateId === t.id
                  ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900/10"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              )}
            >
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center border transition-all",
                selectedTemplateId === t.id
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-slate-50 border-slate-200 text-slate-500"
              )}>
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 truncate">{t.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{t.subject || "No subject set"}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
                {selectedTemplateId === t.id && (
                  <span className="text-xs font-semibold text-slate-900">Selected</span>
                )}
              </div>
            </button>
          ))}

          {templates.length === 0 && (
            <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
              <p className="text-sm text-slate-500">No templates yet. Create one to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
