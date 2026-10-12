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
  UploadCloud,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { LogoAlignment } from "./types";

interface AuthLogoCardProps {
  logo?: string;
  logoAlignment?: LogoAlignment;
  logoSize?: number;
  entityName?: string;
  entityLogo?: string;
  onChange: (logoUrl: string) => void;
  onAlignmentChange?: (alignment: LogoAlignment) => void;
  onSizeChange?: (size: number) => void;
}

export function AuthLogoCard({
  logo = "",
  logoAlignment = "center",
  logoSize = 40,
  entityName = "Your Community",
  entityLogo = "",
  onChange,
  onAlignmentChange,
  onSizeChange,
}: AuthLogoCardProps) {
  const hasLogo = Boolean(logo && logo.trim().length > 0);
  const isUsingEntityLogo = hasLogo && entityLogo && logo === entityLogo;
  const canUseEntityLogo = Boolean(entityLogo && (!hasLogo || logo !== entityLogo));

  const handleRemoveLogo = () => {
    onChange("");
    toast.info("Logo removed. Defaulting to community name typography.");
  };

  const handleApplyEntityLogo = () => {
    if (!entityLogo) return;
    onChange(entityLogo);
    toast.success("Applied organization logo.");
  };

  const formatImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) {
      return url;
    }
    return `https://cdn.thrico.network/${url}`;
  };

  const alignmentClass =
    logoAlignment === "left"
      ? "justify-start"
      : logoAlignment === "right"
      ? "justify-end"
      : "justify-center";

  return (
    <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            ★
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
                Authentication Brand Logo
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 font-medium",
                  hasLogo
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                    : "text-muted-foreground border-border/80"
                )}
              >
                {hasLogo ? (isUsingEntityLogo ? "Org Logo Active" : "Custom Logo Active") : "Optional"}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
              Custom brand mark rendered at the top of your login & registration dialogs.
            </p>
          </div>
        </div>

        {hasLogo && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveLogo}
            className="h-7 text-xs gap-1.5 text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
            <span>Remove</span>
          </Button>
        )}
      </div>

      {/* ── Active State: 2-Column Responsive Layout ── */}
      {hasLogo ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Left: Interactive Preview & Replace Actions (5 cols) */}
          <div className="md:col-span-5 space-y-2">
            <div
              className={cn(
                "h-24 rounded-lg border border-border/80 bg-white dark:bg-zinc-900/90 p-3 flex items-center shadow-2xs overflow-hidden transition-all",
                alignmentClass
              )}
            >
              <img
                src={formatImageUrl(logo)}
                alt={`${entityName} Logo`}
                style={{ height: `${logoSize}px`, maxHeight: "100%" }}
                className="max-w-full object-contain transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
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
                  className="h-7 text-xs gap-1.5 cursor-pointer flex-1 border-border/80 hover:border-indigo-300 dark:hover:border-indigo-800"
                >
                  <UploadCloud className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  <span>Replace Image</span>
                </Button>
              </ImageUploadWithCrop>

              {canUseEntityLogo && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleApplyEntityLogo}
                  className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Use default organization logo"
                >
                  <Building2 className="h-3 w-3" />
                  <span>Org Logo</span>
                </Button>
              )}
            </div>
          </div>

          {/* Right: Controls (Alignment + Sizing) (7 cols) */}
          <div className="md:col-span-7 space-y-3.5 pl-0 md:pl-2">
            {/* Alignment Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground block">
                  Alignment
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Position within modal header
                </span>
              </div>

              <div className="inline-flex items-center rounded-lg border border-border/80 bg-muted/40 p-0.5 gap-0.5">
                <button
                  type="button"
                  onClick={() => onAlignmentChange?.("left")}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer",
                    logoAlignment === "left"
                      ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/80 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Align Left"
                >
                  <AlignLeft className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  <span>Left</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAlignmentChange?.("center")}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer",
                    logoAlignment === "center"
                      ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/80 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Align Center"
                >
                  <AlignCenter className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  <span>Center</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAlignmentChange?.("right")}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer",
                    logoAlignment === "right"
                      ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/80 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Align Right"
                >
                  <AlignRight className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  <span>Right</span>
                </button>
              </div>
            </div>

            {/* Sizing Row */}
            <div className="space-y-2 pt-1 border-t border-border/50">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-foreground">
                    Display Height
                  </span>
                  <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 h-4 bg-muted/40 font-semibold">
                    {logoSize}px
                  </Badge>
                </div>

                {/* Quick Presets */}
                <div className="inline-flex items-center gap-1 text-[11px]">
                  {[
                    { label: "S", size: 28, title: "Small (28px)" },
                    { label: "M", size: 40, title: "Medium (40px)" },
                    { label: "L", size: 56, title: "Large (56px)" },
                    { label: "XL", size: 72, title: "Big (72px)" },
                  ].map((p) => (
                    <button
                      key={p.size}
                      type="button"
                      onClick={() => onSizeChange?.(p.size)}
                      className={cn(
                        "h-6 px-2 rounded-md font-medium text-[11px] transition-all cursor-pointer border",
                        logoSize === p.size
                          ? "bg-white dark:bg-zinc-800 text-foreground border-border/80 shadow-2xs font-semibold"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      )}
                      title={p.title}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider */}
              <div className="flex items-center gap-2.5 pt-0.5">
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                  20px
                </span>
                <div className="flex-1">
                  <Slider
                    value={[logoSize]}
                    min={20}
                    max={84}
                    step={2}
                    onValueChange={(vals) => onSizeChange?.(vals[0])}
                    className="cursor-pointer"
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                  84px
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Empty State: Compact & Clear ── */
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
            uploadButtonText="Upload Brand Logo (Optional)"
            customDescription="Upload SVG, PNG, JPG, or WEBP (Max 5MB). If left empty, your organization title is rendered cleanly."
            dropzoneClassName="min-h-[96px] p-4 border-dashed border-border/80 hover:border-indigo-400 dark:hover:border-indigo-600 bg-muted/10 hover:bg-muted/30"
          />

          {canUseEntityLogo && (
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-border/70 bg-muted/20">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded border border-border/60 bg-white dark:bg-zinc-800 flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
                  <img
                    src={formatImageUrl(entityLogo)}
                    alt={entityName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  Quickly apply your default <strong className="text-foreground">{entityName}</strong> logo
                </span>
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
    </div>
  );
}
