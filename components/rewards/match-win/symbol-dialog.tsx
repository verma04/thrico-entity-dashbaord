"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import { IconSelector } from "@/components/ui/icon-selector";
import { MatchWinSymbol } from "./types";
import { Sparkles, Loader2 } from "lucide-react";

const SYMBOL_COLORS = [
  "#FBBF24",
  "#F87171",
  "#60A5FA",
  "#34D399",
  "#A78BFA",
  "#F472B6",
];

interface SymbolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSymbol: MatchWinSymbol | null;
  setEditingSymbol: (s: MatchWinSymbol) => void;
  isEditingExisting: boolean;
  onSave: () => void;
  saving: boolean;
}

export const SymbolDialog = ({
  open,
  onOpenChange,
  editingSymbol,
  setEditingSymbol,
  isEditingExisting,
  onSave,
  saving,
}: SymbolDialogProps) => {
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false);

  const SelectedIconComponent = editingSymbol?.icon
    ? (Icons as any)[editingSymbol.icon]
    : null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md rounded-2xl border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-7 w-7 rounded-lg bg-[#008060]/10 text-[#008060] flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {isEditingExisting ? "Edit Reel Symbol" : "Add Reel Symbol"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-zinc-500">
              Customize the icon, label, and visual theme for this reel symbol.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Key */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Symbol Key (Unique ID, e.g. cherry)
              </Label>
              <Input
                value={editingSymbol?.key ?? ""}
                onChange={(e) =>
                  setEditingSymbol({ ...editingSymbol!, key: e.target.value })
                }
                disabled={isEditingExisting}
                className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none"
              />
            </div>

            {/* Label */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Display Label
              </Label>
              <Input
                value={editingSymbol?.label ?? ""}
                onChange={(e) =>
                  setEditingSymbol({ ...editingSymbol!, label: e.target.value })
                }
                className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none"
              />
            </div>

            {/* Icon Picker */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Icon Asset
              </Label>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-3 h-10 border-zinc-200 dark:border-zinc-700 text-xs rounded-lg"
                onClick={() => setIconSelectorOpen(true)}
              >
                {SelectedIconComponent ? (
                  <>
                    <SelectedIconComponent
                      className="h-4 w-4"
                      style={{ color: editingSymbol?.color }}
                    />
                    <span className="font-mono text-xs font-semibold">
                      {editingSymbol?.icon}
                    </span>
                  </>
                ) : (
                  <span className="text-zinc-400">Choose an icon asset…</span>
                )}
              </Button>
            </div>

            {/* Color Picker */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Accent Theme Color
              </Label>
              <div className="flex gap-2.5 flex-wrap pt-1">
                {SYMBOL_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      "w-7 h-7 rounded-full transition-transform cursor-pointer border border-white/40 shadow-xs",
                      editingSymbol?.color === c
                        ? "ring-2 ring-offset-2 ring-zinc-900 dark:ring-zinc-100 scale-110"
                        : "hover:scale-105",
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() =>
                      setEditingSymbol({ ...editingSymbol!, color: c })
                    }
                  />
                ))}
              </div>
            </div>

            {/* Live Preview */}
            {(SelectedIconComponent || editingSymbol?.label) && (
              <div className="space-y-1.5 pt-2">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Visual Preview
                </Label>
                <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  {SelectedIconComponent && (
                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xs">
                      <SelectedIconComponent
                        className="h-6 w-6"
                        style={{ color: editingSymbol?.color ?? "#000" }}
                      />
                    </div>
                  )}
                  <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                    {editingSymbol?.label || "—"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-lg text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={saving}
              className="rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 gap-2"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {saving ? "Saving…" : "Save Symbol"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full-screen Icon Selector */}
      <IconSelector
        open={iconSelectorOpen}
        onOpenChange={setIconSelectorOpen}
        selectedIcon={editingSymbol?.icon}
        onSelect={(iconName) =>
          setEditingSymbol({ ...editingSymbol!, icon: iconName })
        }
      />
    </>
  );
};
