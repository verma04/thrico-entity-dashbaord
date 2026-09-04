"use client";

import React, { useState, useMemo } from "react";
import { Mail, Plus, Search, Check, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  const [search, setSearch] = useState("");

  const filteredTemplates = useMemo(() => {
    if (!search.trim()) return templates;
    const q = search.toLowerCase();
    return templates.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q)
    );
  }, [templates, search]);

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-bold text-foreground">
              Select Email Template
            </h2>
            {templates.length > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 font-semibold rounded-[3px]"
              >
                {templates.length}
              </Badge>
            )}
          </div>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Choose the layout and design foundation for this campaign.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="pl-8 h-[30px] rounded-[4px] text-[12px] bg-background border-border/80"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/email/templates/create")}
            className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            New Template
          </Button>
        </div>
      </div>

      {/* Skeletons Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3 shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-8 w-8 rounded-[6px]" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3.5 w-3/4 rounded-[3px]" />
                  <Skeleton className="h-3 w-1/2 rounded-[3px]" />
                </div>
              </div>
              <div className="pt-2 border-t border-border/40 flex justify-between items-center">
                <Skeleton className="h-3 w-16 rounded-[3px]" />
                <Skeleton className="h-5 w-14 rounded-[3px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Templates Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTemplates.map((t) => {
            const isSelected = selectedTemplateId === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelect(t.id, t.subject || "")}
                className={cn(
                  "group text-left p-4 rounded-[8px] border transition-all flex flex-col justify-between gap-3 cursor-pointer shadow-2xs relative",
                  isSelected
                    ? "border-[#303030] dark:border-zinc-100 ring-1 ring-[#303030] dark:ring-zinc-100 bg-[#f9fafb] dark:bg-zinc-800/80"
                    : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600"
                )}
              >
                {/* Header info */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-[6px] flex items-center justify-center shrink-0 border transition-all",
                      isSelected
                        ? "bg-[#303030] dark:bg-zinc-100 border-[#303030] text-white dark:text-zinc-900"
                        : "bg-[#f6f6f7] dark:bg-zinc-800 border-border/60 text-[#616161] group-hover:text-foreground"
                    )}
                  >
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4 className="text-[12.5px] font-bold text-foreground truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {t.subject || "No default subject"}
                    </p>
                  </div>
                </div>

                {/* Footer status */}
                <div className="flex items-center justify-between pt-2.5 border-t border-border/50 text-[11px]">
                  <span className="text-muted-foreground/80 flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleDateString()
                      : "Ready"}
                  </span>
                  {isSelected ? (
                    <Badge
                      variant="default"
                      className="h-5 px-1.5 text-[10px] font-semibold bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-[3px] gap-1"
                    >
                      <Check className="h-2.5 w-2.5" />
                      Selected
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-[10.5px] font-medium group-hover:text-foreground">
                      Click to choose
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {filteredTemplates.length === 0 && (
            <div className="col-span-full py-12 text-center rounded-[8px] border border-dashed border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
              <div className="w-9 h-9 rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800 flex items-center justify-center mx-auto text-[#616161]">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <p className="text-[13px] font-semibold text-foreground">
                {search ? "No templates match your search" : "No templates found"}
              </p>
              <p className="text-[11.5px] text-muted-foreground max-w-sm mx-auto">
                {search
                  ? "Try searching for a different keyword or create a new template."
                  : "Create an email template in the builder to start broadcasting."}
              </p>
              <Button
                type="button"
                onClick={() => router.push("/email/templates/create")}
                className="h-[30px] px-3 text-[12px] font-semibold gap-1.5 mt-2 bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-[4px] cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Create First Template
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

