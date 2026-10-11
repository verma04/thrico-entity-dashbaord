"use client";

import React from "react";
import {
  Sparkles,
  Plus,
  Loader2,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useFilterStudioStore } from "@/store/useFilterStudioStore";
import { GenerationOutputItem } from "../types/ar-manifest";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function GeneratedGalleryPanel() {
  const {
    generationJobs,
    activeJobId,
    isGenerating,
    applyVariationToCanvas,
    loadTemplate,
  } = useFilterStudioStore();

  const activeJob =
    generationJobs.find((j) => j.generationId === activeJobId) ||
    generationJobs[0];

  const handleApply = (variation: GenerationOutputItem) => {
    applyVariationToCanvas(variation);
    toast.success(`Applied ${variation.name} to Canvas!`);
  };

  return (
    <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3 text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-wide text-foreground">
            Generated Variations
          </span>
        </div>
        {activeJob && (
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] capitalize font-medium",
              activeJob.status === "completed" &&
                "border-emerald-500/40 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30",
              activeJob.status === "processing" &&
                "border-amber-500/40 text-amber-600 bg-amber-50/50 dark:bg-amber-950/30",
              activeJob.status === "failed" &&
                "border-rose-500/40 text-rose-600 bg-rose-50/50 dark:bg-rose-950/30"
            )}
          >
            {activeJob.status}
          </Badge>
        )}
      </div>

      {/* Generation Progress Bar */}
      {isGenerating && activeJob && (
        <div className="p-3 rounded-lg border border-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>AI Diffusion Pipeline generating texture maps...</span>
            </div>
            <span className="font-mono text-muted-foreground">{activeJob.progress}%</span>
          </div>
          <Progress value={activeJob.progress} className="h-1.5 bg-muted" />
        </div>
      )}

      {/* Variations Grid */}
      {activeJob && activeJob.previewOutputs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {activeJob.previewOutputs.map((output, idx) => (
            <div
              key={output.id}
              className="group relative rounded-lg border border-border/70 bg-background overflow-hidden p-2 flex flex-col justify-between hover:border-indigo-500/70 transition-all shadow-2xs"
            >
              {/* Thumbnail Container with transparent checkered pattern */}
              <div className="relative aspect-video rounded-md overflow-hidden bg-zinc-900 border border-border/40 flex items-center justify-center p-2">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(#ffffff 1px, transparent 1px)",
                    backgroundSize: "8px 8px",
                  }}
                />
                <img
                  src={output.previewUrl}
                  alt={output.name}
                  className="relative max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                  Var {String.fromCharCode(65 + idx)}
                </span>
              </div>

              {/* Variation Info */}
              <div className="pt-2 pb-1 space-y-1">
                <p className="text-[11px] font-semibold text-foreground truncate">
                  {output.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                    anchor: {output.suggestedAnchor}
                  </span>
                </div>
              </div>

              {/* Action */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleApply(output)}
                className="w-full h-7 text-[11px] gap-1 font-medium hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Apply to Canvas
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center border border-dashed border-border rounded-lg text-muted-foreground space-y-1.5">
          <Sparkles className="h-5 w-5 mx-auto text-muted-foreground/60" />
          <p className="text-xs font-medium">No variations yet</p>
          <p className="text-[11px]">Enter a prompt above and click generate.</p>
        </div>
      )}

      {/* Starter Templates Quick Swapper */}
      <div className="pt-2 border-t border-border/50 flex items-center justify-between flex-wrap gap-2">
        <span className="text-[10px] text-muted-foreground font-medium">
          Load Pre-validated Template:
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              loadTemplate("festive-crown");
              toast.success("Loaded Festive Crown template");
            }}
            className="h-6 text-[10px] px-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
          >
            Festive Crown
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              loadTemplate("cyber-visor");
              toast.success("Loaded Cyberpunk Visor template");
            }}
            className="h-6 text-[10px] px-2 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/30"
          >
            Cyber Visor
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              loadTemplate("mystic-butterflies");
              toast.success("Loaded Butterfly Tiara template");
            }}
            className="h-6 text-[10px] px-2 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/30"
          >
            Butterfly Tiara
          </Button>
        </div>
      </div>
    </div>
  );
}
