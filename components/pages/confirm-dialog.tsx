"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive";
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  const isDestructive = confirmVariant === "destructive";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 shadow-2xl rounded-xl bg-white dark:bg-zinc-900">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center border shrink-0",
                isDestructive
                  ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40"
                  : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40",
              )}
            >
              {isDestructive ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                {title}
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                Action confirmation
              </DialogDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-7 w-7 rounded-md hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-xs text-[#303030] dark:text-zinc-200 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-8.5 px-3 text-xs border-[#d2d5d9] dark:border-zinc-700 cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "h-8.5 px-4 text-xs font-medium shadow-2xs cursor-pointer",
              isDestructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white",
            )}
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
