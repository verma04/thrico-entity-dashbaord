"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Copy,
  Clock,
  Cpu,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFilterStudioStore } from "@/store/useFilterStudioStore";
import { GenerationOutputItem } from "@/components/ai/filter-studio/types/ar-manifest";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function GenerationHistoryView() {
  const router = useRouter();
  const { generationJobs, applyVariationToCanvas } = useFilterStudioStore();

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    toast.success("Prompt copied to clipboard!");
  };

  const handleApplyVariation = (variation: GenerationOutputItem) => {
    applyVariationToCanvas(variation);
    toast.success(`Applied ${variation.name} to Studio!`);
    router.push("/ai/filter-studio");
  };

  return (
    <div className="p-6 space-y-6 select-none max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            AI Generations Ledger
          </h2>
          <p className="text-xs text-muted-foreground">
            Audit history of generative AR runs, model latency, token costs, and outputs.
          </p>
        </div>

        <Button
          onClick={() => router.push("/ai/filter-studio")}
          className="h-9 text-xs gap-2 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs font-medium cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>New Generation Job</span>
        </Button>
      </div>

      {/* Generations List */}
      <div className="space-y-4">
        {generationJobs.map((job) => (
          <div
            key={job.generationId}
            className="rounded-xl border border-border/70 bg-card p-5 shadow-2xs space-y-4"
          >
            {/* Top row: Status, ID, Timestamp, Provider */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-mono capitalize",
                    job.status === "completed"
                      ? "border-emerald-500/30 text-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20"
                      : "border-amber-500/30 text-amber-600 bg-amber-50/40 dark:bg-amber-950/20"
                  )}
                >
                  {job.status}
                </Badge>
                <span className="font-mono text-xs font-semibold text-foreground">
                  {job.generationId}
                </span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(job.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Cpu className="h-3 w-3" />
                  Diffusion Engine v3.1
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="flex items-center gap-1 text-indigo-500 font-mono text-[11px] font-semibold">
                  <Coins className="h-3 w-3" />
                  {job.tokenCost} Compute Tokens
                </span>
              </div>
            </div>

            {/* Prompt & Config Card */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs text-foreground font-medium leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/50 flex-1">
                  &ldquo;{job.prompt}&rdquo;
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyPrompt(job.prompt)}
                  className="h-8 text-xs gap-1 shrink-0 cursor-pointer"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy Prompt</span>
                </Button>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1">
                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                  {job.category}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  Style: {job.style}
                </Badge>
                {job.colorPalette && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-border/60 text-[10px]">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: job.colorPalette }}
                    />
                    <span className="font-mono">{job.colorPalette}</span>
                  </div>
                )}
                {job.animationPreference && (
                  <Badge variant="outline" className="text-[10px]">
                    Motion: {job.animationPreference}
                  </Badge>
                )}
              </div>
            </div>

            {/* Generated Variations Output Thumbnails */}
            {job.previewOutputs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/40">
                <span className="text-xs font-semibold text-foreground">
                  Generated Variations ({job.previewOutputs.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {job.previewOutputs.map((v) => (
                    <div
                      key={v.id}
                      className="rounded-lg border border-border/60 bg-background p-2.5 flex items-center justify-between gap-3 group hover:border-indigo-500/60 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-10 w-10 rounded bg-zinc-950 border border-border/40 overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <img
                            src={v.previewUrl}
                            alt=""
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {v.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            anchor: {v.suggestedAnchor}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleApplyVariation(v)}
                        className="h-7 text-[11px] gap-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 cursor-pointer"
                      >
                        <span>Apply</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
