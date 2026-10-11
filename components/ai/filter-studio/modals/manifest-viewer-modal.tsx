"use client";

import React, { useState } from "react";
import { Code2, Copy, Check, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFilterStudioStore } from "@/store/useFilterStudioStore";
import { toast } from "sonner";

interface ManifestViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManifestViewerModal({
  open,
  onOpenChange,
}: ManifestViewerModalProps) {
  const { manifest } = useFilterStudioStore();
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(manifest, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    toast.success("AR Manifest JSON copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${manifest.filterId}-v${manifest.version}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Manifest downloaded!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-card border-border/80 p-6 select-none max-h-[85vh] flex flex-col">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Code2 className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold text-foreground">
                  Compiled AR Filter Manifest
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground font-mono">
                  Schema Version: {manifest.manifestVersion} • {manifest.filterId}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="h-7 text-xs px-2 gap-1"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span>Copy</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                className="h-7 text-xs px-2 gap-1"
              >
                <Download className="h-3 w-3" />
                <span>Export JSON</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto rounded-lg bg-zinc-950 p-4 border border-zinc-800 text-zinc-200 font-mono text-[11px] leading-relaxed my-2">
          <pre>{jsonString}</pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
