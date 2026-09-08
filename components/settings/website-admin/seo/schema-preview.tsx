"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SchemaPreviewProps {
  schemaMarkup: string;
}

export function SchemaPreview({ schemaMarkup }: SchemaPreviewProps) {
  let parsedJson: any = null;
  let isValid = false;

  if (schemaMarkup) {
    try {
      parsedJson = JSON.parse(schemaMarkup);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  return (
    <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900/40 p-3.5 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#303030] dark:text-zinc-200">
          <Code2 className="h-4 w-4" />
          <span>Structured Data (JSON-LD)</span>
        </div>
        {schemaMarkup && (
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-semibold",
              isValid
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-rose-50 text-[#d72c0d] border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
            )}
          >
            {isValid ? "Valid JSON" : "Invalid Syntax"}
          </Badge>
        )}
      </div>
      {isValid && parsedJson ? (
        <div className="text-[11px] font-mono text-[#303030] dark:text-zinc-300 space-y-1 bg-white dark:bg-zinc-900 p-2.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800">
          <p>
            <span className="text-[#616161] dark:text-zinc-500">@type:</span>{" "}
            <span className="font-semibold text-[#303030] dark:text-zinc-100">
              {parsedJson["@type"] || "WebPage"}
            </span>
          </p>
          {parsedJson.name && (
            <p>
              <span className="text-[#616161] dark:text-zinc-500">name:</span> {parsedJson.name}
            </p>
          )}
          {parsedJson.description && (
            <p className="line-clamp-2">
              <span className="text-[#616161] dark:text-zinc-500">description:</span>{" "}
              {parsedJson.description}
            </p>
          )}
        </div>
      ) : (
        <p className="text-[11.5px] text-[#616161] dark:text-zinc-400">
          Schema markup allows search engines to show rich snippets (breadcrumbs, site navigation, and product features).
        </p>
      )}
    </div>
  );
}
