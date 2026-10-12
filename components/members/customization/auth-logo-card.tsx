/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import {
  Trash2,
  Sparkles,
  Building2,
  CheckCircle2,
  Info,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AuthLogoCardProps {
  logo?: string;
  entityName?: string;
  entityLogo?: string;
  onChange: (logoUrl: string) => void;
}

export function AuthLogoCard({
  logo = "",
  entityName = "Your Community",
  entityLogo = "",
  onChange,
}: AuthLogoCardProps) {
  const hasLogo = Boolean(logo && logo.trim().length > 0);
  const isUsingEntityLogo = hasLogo && entityLogo && logo === entityLogo;
  const canUseEntityLogo = Boolean(entityLogo && (!hasLogo || logo !== entityLogo));

  const handleRemoveLogo = () => {
    onChange("");
    toast.info("Auth logo removed. Falling back to default text heading.");
  };

  const handleApplyEntityLogo = () => {
    if (!entityLogo) return;
    onChange(entityLogo);
    toast.success("Applied organization logo to authentication screen.");
  };

  const formatImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) {
      return url;
    }
    return `https://cdn.thrico.network/${url}`;
  };

  return (
    <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            ★
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
                Authentication Modal Brand Logo
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 font-normal",
                  hasLogo
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 font-semibold"
                    : "text-muted-foreground border-border/80"
                )}
              >
                {hasLogo ? "Active Logo" : "Optional"}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
              Custom brand mark rendered at the top of member login and registration dialogs.
            </p>
          </div>
        </div>

        {hasLogo && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveLogo}
            className="h-8 text-xs gap-1.5 text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Remove Logo</span>
          </Button>
        )}
      </div>

      {/* ── Logo View: Active State ── */}
      {hasLogo ? (
        <div className="space-y-3">
          <div className="relative rounded-lg border border-border/80 bg-muted/20 dark:bg-zinc-950/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Visual Logo Render Container */}
            <div className="flex items-center gap-3">
              <div className="h-16 w-44 rounded-md border border-border/70 bg-white dark:bg-zinc-900 flex items-center justify-center p-2.5 shadow-2xs overflow-hidden">
                <img
                  src={formatImageUrl(logo)}
                  alt={`${entityName} Logo`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-foreground">
                    {isUsingEntityLogo ? "Organization Default Logo" : "Custom Auth Screen Logo"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Rendered at the top of your login & signup modal previews.
                </p>
              </div>
            </div>

            {/* Actions for active logo */}
            <div className="flex items-center gap-2 flex-wrap">
              <ImageUploadWithCrop
                currentImage={logo}
                onImageUpdate={(cdnUrl) => onChange(cdnUrl)}
                label="Change Auth Logo"
                recommendedWidth={240}
                recommendedHeight={60}
                aspectRatio={4 / 1}
                allowFreeDimensions={true}
                defaultDimensionMode="free"
                maxFileSize={5}
                showDimensions={false}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 cursor-pointer shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-800"
                >
                  <UploadCloud className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Replace Logo</span>
                </Button>
              </ImageUploadWithCrop>

              {canUseEntityLogo && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleApplyEntityLogo}
                  className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Use default organization logo"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Revert to Org Logo</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── Logo View: Empty / Upload State ── */
        <div className="space-y-3">
          <ImageUploadWithCrop
            currentImage=""
            onImageUpdate={(cdnUrl) => onChange(cdnUrl)}
            label="Upload Auth Screen Logo"
            recommendedWidth={240}
            recommendedHeight={60}
            aspectRatio={4 / 1}
            allowFreeDimensions={true}
            defaultDimensionMode="free"
            maxFileSize={5}
            uploadButtonText="Upload Auth Logo (Optional)"
            customDescription="Click to browse or drag and drop SVG, PNG, JPG, or WEBP (Max 5MB). Horizontal or square logo with transparent background recommended."
            dropzoneClassName="min-h-[120px] p-5 border-dashed border-border/80 hover:border-indigo-400 dark:hover:border-indigo-600 bg-muted/10 hover:bg-muted/30"
          />

          {/* Quick Apply Organization Logo Shortcut if available */}
          {canUseEntityLogo && (
            <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/70 bg-muted/20 dark:bg-zinc-900/40">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-md border border-border/60 bg-white dark:bg-zinc-800 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  <img
                    src={formatImageUrl(entityLogo)}
                    alt={entityName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-xs font-semibold text-foreground block">
                    Organization Logo Available
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Quickly reuse your community brand logo ({entityName}) without re-uploading.
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleApplyEntityLogo}
                className="h-7 text-xs gap-1 font-medium cursor-pointer shrink-0 border-border/80 hover:border-indigo-300 dark:hover:border-indigo-800"
              >
                <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                <span>Use Org Logo</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Brand Guidance Info Banner ── */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border/60 bg-muted/20 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-[11px]">
          <p>
            <strong className="text-foreground font-semibold">Optional Brand Element:</strong> If no logo is uploaded, your community name is cleanly displayed in title typography.
          </p>
          <p>
            For best visual results on both light and dark themes, upload an SVG or transparent PNG with a 3:1 to 5:1 horizontal ratio.
          </p>
        </div>
      </div>
    </div>
  );
}
