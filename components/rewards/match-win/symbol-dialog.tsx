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
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import { IconSelector } from "@/components/ui/icon-selector";
import { MatchWinSymbol } from "./types";

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditingExisting ? "Edit Symbol" : "Add Symbol"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Key */}
            <div className="space-y-2">
              <Label>Symbol Key (Unique ID, e.g. cherry)</Label>
              <Input
                value={editingSymbol?.key ?? ""}
                onChange={(e) =>
                  setEditingSymbol({ ...editingSymbol!, key: e.target.value })
                }
                disabled={isEditingExisting}
              />
            </div>

            {/* Label */}
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={editingSymbol?.label ?? ""}
                onChange={(e) =>
                  setEditingSymbol({ ...editingSymbol!, label: e.target.value })
                }
              />
            </div>

            {/* Icon Picker */}
            <div className="space-y-2">
              <Label>Icon</Label>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-3 h-10"
                onClick={() => setIconSelectorOpen(true)}
              >
                {SelectedIconComponent ? (
                  <>
                    <SelectedIconComponent
                      className="h-4 w-4"
                      style={{ color: editingSymbol?.color }}
                    />
                    <span className="font-mono text-sm">
                      {editingSymbol?.icon}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Choose an icon…</span>
                )}
              </Button>
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-3 flex-wrap">
                {SYMBOL_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      "w-7 h-7 rounded-full transition-transform",
                      editingSymbol?.color === c
                        ? "ring-2 ring-offset-2 ring-slate-900 scale-110"
                        : "hover:scale-110",
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
              <div className="space-y-1">
                <Label>Preview</Label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
                  {SelectedIconComponent && (
                    <div className="p-2 rounded bg-white border w-fit">
                      <SelectedIconComponent
                        className="h-6 w-6"
                        style={{ color: editingSymbol?.color ?? "#000" }}
                      />
                    </div>
                  )}
                  <span className="font-medium">
                    {editingSymbol?.label || "—"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={onSave} disabled={saving}>
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
