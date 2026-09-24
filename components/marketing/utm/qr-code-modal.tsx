"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Copy, Check, QrCode, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { UtmCampaignItem } from "@/types/utm";

interface QrCodeModalProps {
  campaign: UtmCampaignItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QrCodeModal({ campaign, open, onOpenChange }: QrCodeModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);

  if (!campaign) return null;

  const url = campaign.generatedUrl;
  const shortUrl = campaign.shortCode
    ? `https://${campaign.shortCode}`
    : `https://thrc.io/${campaign.utmCampaign.slice(0, 8)}`;

  // SVG QR code using standard API
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    url
  )}`;

  const handleCopy = (text: string, isShort: boolean) => {
    navigator.clipboard.writeText(text);
    if (isShort) {
      setCopiedShort(true);
      setTimeout(() => setCopiedShort(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
    toast.success("Copied to clipboard!");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col justify-between overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          <SheetHeader className="p-0 space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                <QrCode className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-base font-bold text-foreground truncate">
                  QR Code & Links
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground truncate">
                  {campaign.name}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* QR Code Presentation Box */}
          <div className="flex flex-col items-center justify-center p-6 bg-muted/20 border border-border/70 rounded-2xl space-y-4">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSvgUrl}
                alt={`QR Code for ${campaign.name}`}
                className="w-48 h-48 object-contain"
              />
            </div>
            <p className="text-[11.5px] text-muted-foreground text-center max-w-xs">
              Scan with any mobile camera or scan app to test attribution and touchpoint capture.
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-3">
            {/* Short Link */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Short Link</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400">Easy sharing</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <div className="truncate text-xs font-mono pr-2 font-medium text-foreground">
                  {shortUrl}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(shortUrl, true)}
                    className="h-7 text-xs px-2 cursor-pointer"
                  >
                    {copiedShort ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Full Tracking URL */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Full UTM Tracking URL</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <div className="truncate text-xs font-mono text-muted-foreground pr-2">
                  {url}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(url, false)}
                    className="h-7 text-xs px-2 cursor-pointer"
                  >
                    {copiedUrl ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="p-6 pt-3 border-t border-border/60 bg-muted/10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full h-9 text-xs font-medium cursor-pointer"
          >
            Close Drawer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
