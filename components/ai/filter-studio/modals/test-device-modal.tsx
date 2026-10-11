"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFilterStudioStore } from "@/store/useFilterStudioStore";
import { Iphone } from "@/components/ui/iphone";
import { toast } from "sonner";

interface TestDeviceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestDeviceModal({ open, onOpenChange }: TestDeviceModalProps) {
  const { manifest } = useFilterStudioStore();
  const [copied, setCopied] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  const previewUrl = `https://ar.thrico.io/preview/${manifest.filterId}?v=${manifest.version}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    toast.success("Mobile AR Preview link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/80 p-6 select-none">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-foreground">
                Test on Physical Device
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Scan with iOS Camera or Android Chrome to launch instant Web AR.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-white dark:bg-zinc-900 border border-border/70 space-y-3">
            <div className="p-3 bg-white rounded-xl shadow-md border border-zinc-200">
              {/* Scalable SVG QR Code Representation */}
              <svg
                width="160"
                height="160"
                viewBox="0 0 160 160"
                className="block"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="160" height="160" fill="#FFFFFF" />
                {/* QR Pattern simulated matrix */}
                {/* Top-left marker */}
                <rect x="15" y="15" width="40" height="40" fill="#000000" />
                <rect x="22" y="22" width="26" height="26" fill="#FFFFFF" />
                <rect x="28" y="28" width="14" height="14" fill="#000000" />

                {/* Top-right marker */}
                <rect x="105" y="15" width="40" height="40" fill="#000000" />
                <rect x="112" y="22" width="26" height="26" fill="#FFFFFF" />
                <rect x="118" y="28" width="14" height="14" fill="#000000" />

                {/* Bottom-left marker */}
                <rect x="15" y="105" width="40" height="40" fill="#000000" />
                <rect x="22" y="112" width="26" height="26" fill="#FFFFFF" />
                <rect x="28" y="118" width="14" height="14" fill="#000000" />

                {/* Data blocks */}
                <rect x="65" y="20" width="8" height="8" fill="#000000" />
                <rect x="80" y="20" width="8" height="8" fill="#000000" />
                <rect x="65" y="35" width="8" height="8" fill="#000000" />
                <rect x="80" y="35" width="8" height="8" fill="#000000" />
                <rect x="65" y="65" width="8" height="8" fill="#000000" />
                <rect x="75" y="75" width="12" height="12" fill="#4F46E5" />
                <rect x="95" y="65" width="8" height="8" fill="#000000" />
                <rect x="120" y="65" width="8" height="8" fill="#000000" />
                <rect x="135" y="80" width="8" height="8" fill="#000000" />
                <rect x="65" y="95" width="8" height="8" fill="#000000" />
                <rect x="80" y="110" width="8" height="8" fill="#000000" />
                <rect x="95" y="95" width="8" height="8" fill="#000000" />
                <rect x="110" y="110" width="8" height="8" fill="#000000" />
                <rect x="125" y="125" width="8" height="8" fill="#000000" />
                <rect x="140" y="110" width="8" height="8" fill="#000000" />
                <rect x="65" y="125" width="8" height="8" fill="#000000" />
                <rect x="95" y="125" width="8" height="8" fill="#000000" />
                <rect x="65" y="140" width="8" height="8" fill="#000000" />
                <rect x="80" y="140" width="8" height="8" fill="#000000" />
                <rect x="110" y="140" width="8" height="8" fill="#000000" />
              </svg>
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              Scan with mobile camera to try <strong>{manifest.name}</strong>
            </p>
          </div>

          {/* Direct Link Copy */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-foreground">
              Direct Sandbox URL
            </span>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={previewUrl}
                className="h-8 text-xs font-mono bg-background"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="h-8 px-2.5 gap-1 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick simulator toggle */}
          <div className="pt-2 border-t border-border/50 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              Preview inside iPhone Mock
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSimulator(!showSimulator)}
              className="h-7 text-xs text-indigo-600 dark:text-indigo-400"
            >
              {showSimulator ? "Hide Simulator" : "Show Simulator"}
            </Button>
          </div>

          {showSimulator && (
            <div className="flex justify-center p-3 rounded-xl bg-muted/20 border border-border/60">
              <div className="w-[180px]">
                <Iphone className="shadow-lg">
                  <div className="h-full w-full bg-zinc-950 flex flex-col items-center justify-center p-2 text-center text-white">
                    <Sparkles className="h-6 w-6 text-amber-400 mb-2 animate-bounce" />
                    <p className="text-[10px] font-bold">{manifest.name}</p>
                    <p className="text-[8px] text-zinc-400 mt-1 font-mono">
                      v{manifest.version}
                    </p>
                    <span className="mt-3 px-2 py-0.5 rounded-full text-[8px] bg-indigo-600 font-semibold">
                      Live Face Tracking Active
                    </span>
                  </div>
                </Iphone>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
