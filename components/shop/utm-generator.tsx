"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

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
    <Card className="bg-muted/30">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <LinkIcon className="w-4 h-4" />
            <span>3rd Party Link Generator</span>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="externalLink">External Product Link</Label>
            <Input
              id="externalLink"
              placeholder="https://example.com/product"
              value={baseUrl}
              onChange={(e) => onUrlChange(e.target.value)} // We pass raw input back to parent forms usually, but here we want to modify it?
              // Actually usually we want to store the RAW link or the UTM link?
              // Requirement says "user upload link... and generate utm".
              // Let's assume we store the FINAL link with UTMs.
            />
            <p className="text-xs text-muted-foreground">
              Paste the vendor's product link here. We'll automatically add
              tracking tags.
            </p>
          </div>

          {generatedUrl && (
            <div className="rounded-md bg-muted p-3 flex items-center justify-between gap-2 break-all">
              <code className="text-xs text-primary">{generatedUrl}</code>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                onClick={copyToClipboard}
                type="button"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
