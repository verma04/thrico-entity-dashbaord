"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { PolarisInput, PolarisLabel } from "@/components/gamification/shared/polaris-form-ui";

interface UTMGeneratorProps {
  entityName: string;
  baseUrl: string;
  onUrlChange: (url: string) => void;
}

export function UTMGenerator({
  entityName,
  baseUrl,
  onUrlChange,
}: UTMGeneratorProps) {
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!baseUrl) {
      setGeneratedUrl("");
      onUrlChange("");
      return;
    }

    try {
      const url = new URL(baseUrl);
      // Simplify entity name for UTM
      const campaign = entityName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      url.searchParams.set("utm_source", "thrico");
      url.searchParams.set("utm_medium", "shop");
      url.searchParams.set("utm_campaign", campaign);

      const finalUrl = url.toString();
      setGeneratedUrl(finalUrl);
      onUrlChange(finalUrl);
    } catch (e) {
      // Invalid URL input
      setGeneratedUrl("");
    }
  }, [baseUrl, entityName]);

  const copyToClipboard = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#616161]">
        <LinkIcon className="w-3.5 h-3.5" />
        <span>3rd Party Link Generator</span>
      </div>

      <PolarisInput
        id="externalLink"
        name="externalLink"
        label="External Product Link"
        placeholder="https://example.com/product"
        value={baseUrl}
        onChange={(e) => onUrlChange(e.target.value)}
        helperText="Paste the vendor's product link here. We'll automatically add tracking tags."
      />

      {generatedUrl && (
        <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-800/40 p-2.5 flex items-center justify-between gap-2 break-all">
          <code className="text-[11.5px] text-[#303030] dark:text-zinc-200 font-mono">{generatedUrl}</code>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 shrink-0 cursor-pointer rounded-[4px] hover:bg-[#e1e3e5]"
            onClick={copyToClipboard}
            type="button"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#616161]" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
