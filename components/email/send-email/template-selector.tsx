"use client";

import React from "react";
import { Mail, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { EmailTemplate } from "./types";
import { useRouter } from "next/navigation";

interface TemplateSelectorProps {
  templates: EmailTemplate[];
  selectedTemplateId: string | null;
  onSelect: (id: string, subject: string) => void;
  loading: boolean;
}

export function TemplateSelector({
  templates,
  selectedTemplateId,
  onSelect,
  loading,
}: TemplateSelectorProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Choose a template
            {templates.length > 0 && (
              <span className="ml-2 text-xs font-medium text-muted-foreground/80">
                {templates.length} available
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Select a template to use for this campaign.
          </p>
        </div>
        <button
          onClick={() => router.push("/email/templates/create")}
          className="flex items-center gap-1.5 text-xs font-semibold text-foreground px-3.5 py-1.5 rounded-[4px] border border-border/60 bg-card hover:bg-muted transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          New Template
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-border/50 bg-card space-y-4 shadow-2xs"
            >
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
              <div className="pt-3 border-t border-border/40 flex justify-between">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t.id, t.subject || "")}
              className={cn(
                "text-left p-5 rounded-2xl border transition-all flex flex-col gap-4 cursor-pointer",
                selectedTemplateId === t.id
                  ? "border-[#303030] dark:border-zinc-100 bg-muted/60 ring-1 ring-border"
                  : "border-border/50 bg-card hover:border-border hover:shadow-2xs"
              )}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center border transition-all shrink-0",
                  selectedTemplateId === t.id
                    ? "bg-[#303030] dark:bg-zinc-100 border-[#303030] text-white dark:text-zinc-900"
                    : "bg-muted border-border/50 text-muted-foreground"
                )}
              >
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">
                  {t.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {t.subject || "No subject set"}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground/80">
                  {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Saved"}
                </span>
                {selectedTemplateId === t.id && (
                  <span className="text-xs font-semibold text-foreground">
                    Selected
                  </span>
                )}
              </div>
            </button>
          ))}

          {templates.length === 0 && (
            <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-border/50 bg-muted/20">
              <p className="text-sm text-muted-foreground">
                No templates yet. Create one to get started.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
