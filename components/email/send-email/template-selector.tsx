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
          <h2 className="text-base font-semibold text-foreground">
            Choose a template
            {templates.length > 0 && (
              <span className="ml-2 text-xs font-medium text-muted-foreground/80">{templates.length} available</span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Select a template to use for this campaign.</p>
        </div>
        <button
          onClick={() => router.push("/email/templates/create")}
          className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-foreground px-4 py-2 rounded-xl border border-border/50 bg-card hover:bg-muted transition-all"
        >
          <Plus className="h-4 w-4" />
          New Template
        </button>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center rounded-2xl border border-dashed border-border/50 bg-muted">
          <RefreshCw className="h-5 w-5 text-muted-foreground/50 animate-spin" />
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
                  ? "border-slate-900 bg-muted ring-1 ring-slate-900/10"
                  : "border-border/50 bg-card hover:border-border hover:shadow-sm"
              )}
            >
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center border transition-all",
                selectedTemplateId === t.id
                  ? "bg-slate-900 dark:bg-slate-100 border-slate-900 text-white dark:text-slate-900"
                  : "bg-muted border-border/50 text-muted-foreground"
              )}>
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">{t.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.subject || "No subject set"}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground/80">
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
                {selectedTemplateId === t.id && (
                  <span className="text-xs font-semibold text-foreground">Selected</span>
                )}
              </div>
            </button>
          ))}

          {templates.length === 0 && (
            <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-border/50 bg-muted">
              <p className="text-sm text-muted-foreground">No templates yet. Create one to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
