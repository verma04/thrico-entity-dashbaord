"use client";

import React from "react";
import {
  Zap,
  Maximize2,
  ListFilter,
  Save,
  ArrowLeft,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAutomationStore } from "@/store/useAutomationStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface FlowHeaderProps {
  onSave?: () => Promise<void> | void;
  onCancel?: () => void;
  isSaving?: boolean;
  isEdit?: boolean;
  viewMode: "flow" | "form";
  onViewModeChange: (mode: "flow" | "form") => void;
  onOpenSimulation?: () => void;
  onFitView: () => void;
  onAutoLayout?: () => void;
}

export const FlowHeader: React.FC<FlowHeaderProps> = ({
  onSave,
  onCancel,
  isSaving = false,
  isEdit = false,
  viewMode,
  onViewModeChange,
  onFitView,
  onAutoLayout,
}) => {
  const name = useAutomationStore((s) => s.name);
  const setName = useAutomationStore((s) => s.setName);
  const isActive = useAutomationStore((s) => s.isActive);
  const setIsActive = useAutomationStore((s) => s.setIsActive);

  return (
    <header className="h-14 px-4 bg-card border-b border-border flex items-center justify-between gap-3 shrink-0 z-10">
      {/* Left: Back Button, Rule Name Input & Active Status */}
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

        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          <Zap className="w-4 h-4" />
        </div>

        <div className="flex items-center gap-2 min-w-0 flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Rule Name (e.g. Stanford Alumni Gold Tier Flow)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 text-xs font-bold bg-background border-border"
          />
        </div>

        {/* Active / Paused Rule Status Pill Controller */}
        <div
          onClick={() => {
            const next = !isActive;
            setIsActive(next);
            toast.info(
              next
                ? "Rule activated: will run in real-time for qualifying members"
                : "Rule paused: execution temporarily disabled"
            );
          }}
          className={cn(
            "flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer select-none shrink-0 shadow-2xs group hover:scale-[1.02]",
            isActive
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15"
              : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/15"
          )}
          title={
            isActive
              ? "Status: Active & Live. Click to pause workflow."
              : "Status: Paused. Click to activate workflow."
          }
        >
          <span className="relative flex h-2 w-2">
            {isActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={cn(
                "relative inline-flex rounded-full h-2 w-2 transition-colors",
                isActive ? "bg-emerald-500" : "bg-amber-500"
              )}
            />
          </span>

          <span className="font-bold text-[11px] tracking-tight">
            {isActive ? "Active Rule" : "Rule Paused"}
          </span>

          <Switch
            checked={isActive}
            onCheckedChange={(checked) => {
              setIsActive(checked);
              toast.info(
                checked
                  ? "Rule activated: will run in real-time for qualifying members"
                  : "Rule paused: execution temporarily disabled"
              );
            }}
            onClick={(e) => e.stopPropagation()}
            className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-zinc-300 dark:data-[state=unchecked]:bg-zinc-700 pointer-events-auto cursor-pointer"
          />
        </div>
      </div>

      {/* Right: Layout, Switcher, and Save */}
      <div className="flex items-center gap-2 shrink-0">
        {onAutoLayout && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAutoLayout}
            className="h-8 text-xs font-semibold gap-1.5 bg-background border-border hover:bg-muted text-foreground shadow-2xs cursor-pointer hover:border-purple-500/40 group"
            title="Auto-align and beautify all branches and nodes neatly"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500 group-hover:rotate-12 transition-transform" />
            <span className="hidden md:inline">Beautify Flow</span>
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onFitView}
          className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
          title="Recenter and Fit View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Fit View</span>
        </Button>

        {/* View Switcher: Canvas <-> Form */}
        <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => onViewModeChange("flow")}
            className={cn(
              "px-2 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer",
              viewMode === "flow"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Canvas</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("form")}
            className={cn(
              "px-2 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer",
              viewMode === "form"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Step Form</span>
          </button>
        </div>

        {/* Primary Save Button */}
        <Button
          type="button"
          size="sm"
          disabled={isSaving}
          onClick={onSave}
          className="h-8 px-3 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? "Saving..." : isEdit ? "Update Rule" : "Create Rule"}
        </Button>

        {/* Close Button (X) */}
        {onCancel && (
          <>
            <div className="h-4 w-px bg-border shrink-0 ml-0.5" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg shrink-0 cursor-pointer"
              title="Close Studio (Esc)"
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
