"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  Sparkles,
  Play,
  Maximize2,
  SlidersHorizontal,
  Zap,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRewardsAutomationStore } from "@/store/useRewardsAutomationStore";
import { getModuleVisuals } from "./rewards-custom-nodes";
import { cn } from "@/lib/utils";

interface RewardsFlowHeaderProps {
  onSave?: () => Promise<void> | void;
  onCancel?: () => void;
  isSaving?: boolean;
  isEdit?: boolean;
  viewMode?: "flow" | "form";
  onViewModeChange?: (mode: "flow" | "form") => void;
  onFitView?: () => void;
  onAutoLayout?: () => void;
  onOpenSimulation?: () => void;
}

export const RewardsFlowHeader: React.FC<RewardsFlowHeaderProps> = ({
  onSave,
  onCancel,
  isSaving = false,
  isEdit = false,
  viewMode = "flow",
  onViewModeChange,
  onFitView,
  onAutoLayout,
  onOpenSimulation,
}) => {
  const name = useRewardsAutomationStore((s) => s.name);
  const setName = useRewardsAutomationStore((s) => s.setName);
  const module = useRewardsAutomationStore((s) => s.module);
  const isActive = useRewardsAutomationStore((s) => s.isActive);
  const setIsActive = useRewardsAutomationStore((s) => s.setIsActive);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const modMeta = getModuleVisuals(module);
  const ModIcon = modMeta.icon;

  return (
    <header className="h-14 px-4 bg-card border-b border-border flex items-center justify-between gap-3 shrink-0 z-20 shadow-xs">
      {/* Left: Back + Rule Identifier */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {onCancel && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 px-2.5 text-xs font-semibold gap-1.5 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              title="Back to Automation Rules"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="h-4 w-px bg-border shrink-0" />
          </>
        )}

        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs font-bold",
              modMeta.bg
            )}
          >
            <ModIcon className="w-4 h-4" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase leading-none">
                {modMeta.label}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[8.5px] font-bold px-1 py-0 h-3.5",
                  modMeta.bg,
                  modMeta.border
                )}
              >
                Automation Flow
              </Badge>
            </div>

            {isEditingTitle ? (
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingTitle(false);
                }}
                className="h-6 text-xs font-bold px-1 py-0 w-64 bg-background"
                placeholder="Name your automation rule..."
              />
            ) : (
              <span
                onClick={() => setIsEditingTitle(true)}
                className="text-xs font-bold text-foreground hover:text-primary cursor-pointer truncate max-w-xs sm:max-w-md leading-tight"
                title="Click to rename"
              >
                {name || "Untitled Rewards Rule"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Fit View */}
        {onFitView && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onFitView}
            className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground hidden sm:flex"
            title="Fit canvas to viewport"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        )}

        {/* Beautify Flow */}
        {onAutoLayout && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAutoLayout}
            className="h-8 px-2.5 text-xs font-semibold gap-1.5 border-border hover:bg-muted/40 cursor-pointer hidden md:flex"
            title="Snap nodes into clean non-overlapping multi-branch lanes"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Beautify Flow
          </Button>
        )}

        {/* Test Simulation */}
        {onOpenSimulation && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenSimulation}
            className="h-8 px-2.5 text-xs font-bold gap-1.5 border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/5 hover:bg-purple-500/10 cursor-pointer shadow-2xs"
            title="Test rule against sample participant states"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Test Pipeline
          </Button>
        )}

        {/* Mode Switcher */}
        {onViewModeChange && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onViewModeChange(viewMode === "flow" ? "form" : "flow")
            }
            className="h-8 px-2.5 text-xs font-semibold gap-1.5 text-muted-foreground hover:text-foreground hidden lg:flex"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {viewMode === "flow" ? "Form View" : "Canvas View"}
          </Button>
        )}

        {/* Save CTA */}
        <Button
          type="button"
          size="sm"
          disabled={isSaving}
          onClick={() => onSave?.()}
          className="h-8 px-3 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer ml-1"
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? "Saving..." : isEdit ? "Update Rule" : "Create Rule"}
        </Button>
      </div>
    </header>
  );
};
