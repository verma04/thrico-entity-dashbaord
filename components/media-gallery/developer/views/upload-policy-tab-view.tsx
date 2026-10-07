"use client";

import React from "react";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UploadCloud,
  FolderOpen,
  Calendar,
  HardDrive,
  Users,
  Image as ImageIcon,
  Film,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useMediaGalleryDeveloper } from "../media-gallery-developer-context";
import { LiveUploaderPreview } from "../live-uploader-preview";
import { cn } from "@/lib/utils";

export function UploadPolicyTabView() {
  const { formik, albums } = useMediaGalleryDeveloper();
  const { values, errors, touched, handleChange, setFieldValue } = formik;

  return (
    <PolarisFormLayout
      sidebar={
        <div className="space-y-4">
          <LiveUploaderPreview values={values} albums={albums} />

          <PolarisTipCard title="Upload Policy & S3 Optimization">
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                • <strong>Pre-moderation Protection:</strong> Keeping moderation enabled prevents inappropriate or copyrighted files from appearing in public feeds automatically.
              </p>
              <p>
                • <strong>Per-Uploader Daily Caps:</strong> Enforcing a 5–10 items/day cap per visitor stops automated spam bots and protects entity bandwidth.
              </p>
              <p>
                • <strong>Destination Routing:</strong> Setting a designated &quot;Community Uploads&quot; album keeps raw visitor media segregated from curated marketing galleries.
              </p>
            </div>
          </PolarisTipCard>

          <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-sky-500" />
              <h4 className="text-xs font-bold text-foreground">
                Active Safeguards Checklist
              </h4>
            </div>
            <ul className="space-y-1.5 text-[11px] text-muted-foreground">
              <li className="flex items-start gap-1.5">
                <CheckCircle2
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 mt-0.5",
                    values.allowThirdPartyUploads
                      ? "text-emerald-600"
                      : "text-zinc-400"
                  )}
                />
                <span>
                  {values.allowThirdPartyUploads
                    ? "External uploads permitted via SDK widget."
                    : "External uploads temporarily paused."}
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 mt-0.5",
                    values.requireModeration
                      ? "text-emerald-600"
                      : "text-amber-500"
                  )}
                />
                <span>
                  {values.requireModeration
                    ? "Submissions placed in approval queue."
                    : "Direct publishing mode enabled (Caution)."}
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Daily quota capped at {values.maxDailyUploadsTotal} submissions entity-wide.
                </span>
              </li>
            </ul>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Step 1: Master Access & Moderation Gate */}
        <PolarisFormCard
          step={1}
          icon={UploadCloud}
          title="Master Access & Moderation Protocols"
          description="Control whether external websites can accept uploads and whether submissions require administrator approval."
          badge="Access Control"
        >
          <div className="space-y-3">
            {/* Allow Third-Party Uploads */}
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between gap-3">
              <div>
                <Label className="text-xs font-semibold text-foreground">
                  Allow Third-Party Uploads
                </Label>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  Permits public visitors, mobile apps, and partner domains to submit photos and videos through the SDK widget.
                </p>
              </div>
              <Switch
                checked={values.allowThirdPartyUploads}
                onCheckedChange={(checked) =>
                  setFieldValue("allowThirdPartyUploads", checked)
                }
              />
            </div>

            {/* Require Moderation */}
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Require Administrative Moderation
                  </Label>
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1.5 py-0 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                  >
                    Recommended
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  Holds external uploads in the Review Queue until an administrator approves or declines them.
                </p>
              </div>
              <Switch
                checked={values.requireModeration}
                onCheckedChange={(checked) =>
                  setFieldValue("requireModeration", checked)
                }
              />
            </div>
          </div>
        </PolarisFormCard>

        {/* Step 2: Destination Routing & Album Selection */}
        <PolarisFormCard
          step={2}
          icon={FolderOpen}
          title="Destination Album & Routing"
          description="Route submitted media to a specific default album and choose whether end users can pick from available albums."
          badge="Routing"
        >
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Default Destination Album
                </Label>
                <Select
                  value={values.defaultAlbumId || (albums[0]?.id ?? "")}
                  onValueChange={(val) => setFieldValue("defaultAlbumId", val)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select target album" />
                  </SelectTrigger>
                  <SelectContent>
                    {albums.map((album) => (
                      <SelectItem
                        key={album.id}
                        value={album.id}
                        className="text-xs"
                      >
                        {album.title} ({album.imageCount || 0} items)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-[11px] text-muted-foreground">
                  New submissions will automatically land in this album unless routed elsewhere.
                </span>
              </div>

              {/* Allow User Select Album */}
              <div className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between gap-3">
                <div>
                  <Label className="text-xs font-semibold text-foreground">
                    Allow User to Select Album
                  </Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    Shows an interactive album selector inside the embedded widget.
                  </p>
                </div>
                <Switch
                  checked={values.allowUserSelectAlbum}
                  onCheckedChange={(checked) =>
                    setFieldValue("allowUserSelectAlbum", checked)
                  }
                />
              </div>
            </div>
          </div>
        </PolarisFormCard>

        {/* Step 3: Daily Quotas & Abuse Prevention */}
        <PolarisFormCard
          step={3}
          icon={Calendar}
          title="Daily Quotas & Abuse Prevention"
          description="Protect entity cloud storage and prevent denial-of-service spam with strict per-user and community-wide limits."
          badge="Quota Limits"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Max Daily Uploads Per Uploader
              </Label>
              <Input
                type="number"
                name="maxDailyUploadsPerUploader"
                value={values.maxDailyUploadsPerUploader}
                onChange={handleChange}
                className={cn(
                  "h-9 text-xs",
                  touched.maxDailyUploadsPerUploader &&
                    errors.maxDailyUploadsPerUploader &&
                    "border-destructive"
                )}
              />
              <span className="text-[11px] text-muted-foreground">
                Maximum media items a single visitor or IP address can submit every 24 hours.
              </span>
              {touched.maxDailyUploadsPerUploader &&
                errors.maxDailyUploadsPerUploader && (
                  <p className="text-[11px] text-destructive font-medium mt-1">
                    {errors.maxDailyUploadsPerUploader}
                  </p>
                )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Max Daily Uploads Total (Entity Cap)
              </Label>
              <Input
                type="number"
                name="maxDailyUploadsTotal"
                value={values.maxDailyUploadsTotal}
                onChange={handleChange}
                className={cn(
                  "h-9 text-xs",
                  touched.maxDailyUploadsTotal &&
                    errors.maxDailyUploadsTotal &&
                    "border-destructive"
                )}
              />
              <span className="text-[11px] text-muted-foreground">
                Entity-wide daily aggregate cap to prevent unexpected cloud storage consumption.
              </span>
              {touched.maxDailyUploadsTotal && errors.maxDailyUploadsTotal && (
                <p className="text-[11px] text-destructive font-medium mt-1">
                  {errors.maxDailyUploadsTotal}
                </p>
              )}
            </div>
          </div>
        </PolarisFormCard>

        {/* Step 4: Media Constraints & File Formats */}
        <PolarisFormCard
          step={4}
          icon={HardDrive}
          title="Media Constraints & File Formats"
          description="Define accepted file types and enforce maximum file sizes and video durations."
          badge="Media Constraints"
        >
          <div className="space-y-4">
            {/* Interactive Selection Tiles for Media Type */}
            <div>
              <Label className="text-xs font-semibold text-foreground mb-2 block">
                Allowed Media Formats
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Tile 1: Photos & Videos */}
                <button
                  type="button"
                  onClick={() => setFieldValue("allowedMediaTypes", "ALL")}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-2xs",
                    values.allowedMediaTypes === "ALL"
                      ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-600"
                      : "border-border/70 bg-card hover:border-border"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    {values.allowedMediaTypes === "ALL" && (
                      <Badge className="bg-indigo-600 text-white text-[9px] px-1.5 py-0">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">
                      Photos & Videos
                    </h5>
                    <p className="text-[10.5px] text-muted-foreground mt-0.5">
                      Accept JPG, PNG, WEBP and MP4/MOV clips.
                    </p>
                  </div>
                </button>

                {/* Tile 2: Images Only */}
                <button
                  type="button"
                  onClick={() =>
                    setFieldValue("allowedMediaTypes", "IMAGE_ONLY")
                  }
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-2xs",
                    values.allowedMediaTypes === "IMAGE_ONLY"
                      ? "border-sky-600 bg-sky-50/40 dark:bg-sky-950/30 ring-1 ring-sky-600"
                      : "border-border/70 bg-card hover:border-border"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                    {values.allowedMediaTypes === "IMAGE_ONLY" && (
                      <Badge className="bg-sky-600 text-white text-[9px] px-1.5 py-0">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">
                      Images Only
                    </h5>
                    <p className="text-[10.5px] text-muted-foreground mt-0.5">
                      Restrict uploads to still photos and graphics.
                    </p>
                  </div>
                </button>

                {/* Tile 3: Videos Only */}
                <button
                  type="button"
                  onClick={() =>
                    setFieldValue("allowedMediaTypes", "VIDEO_ONLY")
                  }
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-2xs",
                    values.allowedMediaTypes === "VIDEO_ONLY"
                      ? "border-rose-600 bg-rose-50/40 dark:bg-rose-950/30 ring-1 ring-rose-600"
                      : "border-border/70 bg-card hover:border-border"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                      <Film className="h-4 w-4" />
                    </div>
                    {values.allowedMediaTypes === "VIDEO_ONLY" && (
                      <Badge className="bg-rose-600 text-white text-[9px] px-1.5 py-0">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">
                      Videos Only
                    </h5>
                    <p className="text-[10.5px] text-muted-foreground mt-0.5">
                      Accept only video files and reel recordings.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Numeric Size Limits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-border/50">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Max Image Size (MB)
                </Label>
                <Input
                  type="number"
                  name="maxImageSizeMb"
                  value={values.maxImageSizeMb}
                  onChange={handleChange}
                  className={cn(
                    "h-9 text-xs font-mono",
                    touched.maxImageSizeMb &&
                      errors.maxImageSizeMb &&
                      "border-destructive"
                  )}
                />
                <span className="text-[10px] text-muted-foreground">
                  Default 10 MB per image
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Max Video Size (MB)
                </Label>
                <Input
                  type="number"
                  name="maxVideoSizeMb"
                  value={values.maxVideoSizeMb}
                  onChange={handleChange}
                  className={cn(
                    "h-9 text-xs font-mono",
                    touched.maxVideoSizeMb &&
                      errors.maxVideoSizeMb &&
                      "border-destructive"
                  )}
                />
                <span className="text-[10px] text-muted-foreground">
                  Default 100 MB per video
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Max Video Duration (sec)
                </Label>
                <Input
                  type="number"
                  name="maxVideoDurationSeconds"
                  value={values.maxVideoDurationSeconds}
                  onChange={handleChange}
                  className={cn(
                    "h-9 text-xs font-mono",
                    touched.maxVideoDurationSeconds &&
                      errors.maxVideoDurationSeconds &&
                      "border-destructive"
                  )}
                />
                <span className="text-[10px] text-muted-foreground">
                  Default 120 seconds (2 mins)
                </span>
              </div>
            </div>
          </div>
        </PolarisFormCard>

        {/* Step 5: Contributor Information & Captions */}
        <PolarisFormCard
          step={5}
          icon={Users}
          title="Contributor Attribution & Captions"
          description="Specify whether external contributors must supply their contact identity or descriptive captions."
          badge="Metadata"
        >
          <div className="space-y-3">
            {/* Require Uploader Info */}
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between gap-3">
              <div>
                <Label className="text-xs font-semibold text-foreground">
                  Require Uploader Information (Name & Email)
                </Label>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  Forces external visitors to enter their full name and contact email address before the upload can initiate.
                </p>
              </div>
              <Switch
                checked={values.requireUploaderInfo}
                onCheckedChange={(checked) =>
                  setFieldValue("requireUploaderInfo", checked)
                }
              />
            </div>

            {/* Require Caption */}
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between gap-3">
              <div>
                <Label className="text-xs font-semibold text-foreground">
                  Require Caption & Description
                </Label>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  Mandates that photos or videos include descriptive context or titles before being submitted.
                </p>
              </div>
              <Switch
                checked={values.requireCaption}
                onCheckedChange={(checked) =>
                  setFieldValue("requireCaption", checked)
                }
              />
            </div>
          </div>
        </PolarisFormCard>
      </div>
    </PolarisFormLayout>
  );
}
