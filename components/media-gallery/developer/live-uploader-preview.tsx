"use client";

import React from "react";
import { PolarisSidebarCard } from "@/components/gamification/shared/polaris-form-ui";
import {
  UploadCloud,
  Image as ImageIcon,
  Film,
  FolderOpen,
  Info,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MediaGalleryPolicyFormValues } from "./types";
import { MediaGalleryAlbumSummary } from "./media-gallery-developer-context";

interface LiveUploaderPreviewProps {
  values: MediaGalleryPolicyFormValues;
  albums: MediaGalleryAlbumSummary[];
}

export function LiveUploaderPreview({ values, albums }: LiveUploaderPreviewProps) {
  const currentAlbum =
    albums.find((a) => a.id === values.defaultAlbumId) || albums[0];
  const albumTitle = currentAlbum ? currentAlbum.title : "Community Uploads";

  return (
    <PolarisSidebarCard
      title="Live Widget Simulator"
      badge="Real-time"
      icon={Sparkles}
    >
      <div className="space-y-3.5">
        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
          Interactive preview mirroring how the third-party drop-in uploader and embedded SDK widget will appear to external visitors.
        </p>

        {/* Mock Widget Container */}
        <div className="rounded-xl border border-border/80 bg-background/95 p-3.5 space-y-3 shadow-2xs">
          {/* Destination Header */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
            <div className="flex items-center gap-1.5 min-w-0">
              <FolderOpen className="h-3.5 w-3.5 text-sky-500 shrink-0" />
              <span className="text-xs font-semibold text-foreground truncate">
                {albumTitle}
              </span>
            </div>
            {values.allowUserSelectAlbum && (
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 py-0 text-muted-foreground border-border/60 shrink-0"
              >
                Album Switcher On
              </Badge>
            )}
          </div>

          {/* Interactive Dropzone Box */}
          <div className="rounded-lg border-2 border-dashed border-border/80 hover:border-sky-500/60 bg-muted/20 p-4 text-center space-y-2 transition-all cursor-pointer">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <UploadCloud className="h-4.5 w-4.5" />
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground">
                Drop files here or click to browse
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] text-muted-foreground flex-wrap">
                {values.allowedMediaTypes !== "VIDEO_ONLY" && (
                  <span className="inline-flex items-center gap-0.5">
                    <ImageIcon className="h-2.5 w-2.5 text-sky-500" />
                    Max {values.maxImageSizeMb}MB
                  </span>
                )}
                {values.allowedMediaTypes === "ALL" && <span>•</span>}
                {values.allowedMediaTypes !== "IMAGE_ONLY" && (
                  <span className="inline-flex items-center gap-0.5">
                    <Film className="h-2.5 w-2.5 text-rose-500" />
                    Max {values.maxVideoSizeMb}MB ({values.maxVideoDurationSeconds}s)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Optional Form Inputs */}
          {values.requireUploaderInfo && (
            <div className="space-y-2 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Your Full Name <span className="text-destructive">*</span>
                </label>
                <div className="h-7 rounded-md border border-border/70 bg-background px-2 text-[11px] text-muted-foreground flex items-center">
                  Jane Doe
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Contact Email <span className="text-destructive">*</span>
                </label>
                <div className="h-7 rounded-md border border-border/70 bg-background px-2 text-[11px] text-muted-foreground flex items-center">
                  jane@company.com
                </div>
              </div>
            </div>
          )}

          {values.requireCaption && (
            <div className="space-y-1 pt-1">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Media Caption <span className="text-destructive">*</span>
              </label>
              <div className="h-10 rounded-md border border-border/70 bg-background p-2 text-[11px] text-muted-foreground flex items-start">
                Tell us about this photo or clip…
              </div>
            </div>
          )}

          {/* Moderation Alert Banner */}
          {values.requireModeration && (
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 flex items-start gap-2 text-[10.5px] text-amber-700 dark:text-amber-300">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>
                Moderation Active: Uploaded media will be reviewed by administrators before being published.
              </span>
            </div>
          )}

          {/* Daily Quota Helper */}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
            <span className="flex items-center gap-1">
              <Info className="h-2.5 w-2.5 text-zinc-400" />
              Quota: {values.maxDailyUploadsPerUploader} uploads/day
            </span>
            <span className="font-semibold text-foreground">
              {values.allowThirdPartyUploads ? "Ready to accept uploads" : "Uploads paused"}
            </span>
          </div>
        </div>
      </div>
    </PolarisSidebarCard>
  );
}
