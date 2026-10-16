"use client";

import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  Download,
  Share2,
  Sparkles,
  CheckCircle2,
  Clock,
  Film,
  Loader2,
  Rss,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAdminConfirmMomentUpload, Moment } from "@/graphql/actions/moments";
import {
  MomentCampaign,
  useGenerateCampaignAssetUploadUrl,
  useCreateMomentCompositingJob,
  useGetMomentCompositingJobById,
  CompositingJob,
} from "@/graphql/actions/moments/campaigns";
import { MobilePortraitRecorder } from "./mobile-portrait-recorder";
import { FramePreviewCanvas } from "./frame-preview-canvas";

interface CompositorStudioProps {
  campaign: MomentCampaign;
}

export function CompositorStudio({ campaign }: CompositorStudioProps) {
  // Input mode: "camera" vs "upload"
  const [activeMode, setActiveMode] = useState<"camera" | "upload">(
    campaign.allowCameraRecording ? "camera" : "upload"
  );

  // Selected or recorded raw video
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload & Job state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // GraphQL mutations & polling
  const [generateUploadUrl] = useGenerateCampaignAssetUploadUrl();
  const [createJob] = useCreateMomentCompositingJob();

  // Poll job status every 2.5 seconds while processing
  const { data: jobData } = useGetMomentCompositingJobById(
    activeJobId || "",
    activeJobId ? 2500 : 0
  );

  const currentJob: CompositingJob | undefined =
    jobData?.getMomentCompositingJobById;

  // Publishing to Moments & Community Feed state
  const [publishCaption, setPublishCaption] = useState(
    `#${campaign.slug} - ${campaign.title}`
  );
  const [shareInFeed, setShareInFeed] = useState(campaign.shareInFeed ?? true);
  const [publishedMoment, setPublishedMoment] = useState<Moment | null>(null);

  const [confirmMomentUpload, { loading: isPublishing }] = useAdminConfirmMomentUpload({
    onCompleted: (res) => {
      setPublishedMoment(res.adminConfirmMomentUpload);
      toast.success(
        shareInFeed
          ? "Moment published successfully and broadcasted to Community Feed!"
          : "Moment published to community library!"
      );
    },
    onError: (err: unknown) => {
      toast.error((err as Error).message || "Failed to publish moment.");
    },
  });

  const handlePublishMoment = async () => {
    if (!currentJob?.outputVideoUrl) return;
    try {
      await confirmMomentUpload({
        variables: {
          input: {
            fileUrl: currentJob.outputVideoUrl,
            thumbnailUrl: currentJob.thumbnailUrl || campaign.frameUrl || undefined,
            caption: publishCaption.trim() || campaign.title,
            shareInFeed,
          },
        },
      });
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to publish moment.");
    }
  };

  // ── Handle Recorded Video from Mobile Recorder ────────────────────────────
  const handleRecordingComplete = (blob: Blob, previewUrl: string) => {
    setSelectedFile(blob);
    setSelectedPreviewUrl(previewUrl);
    toast.success("Camera take captured! Ready to render.");
  };

  // ── Handle File Upload Selection ──────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a valid video file (MP4, WebM, MOV).");
      return;
    }

    if (file.size > 250 * 1024 * 1024) {
      toast.error("Video file size cannot exceed 250 MB.");
      return;
    }

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setSelectedPreviewUrl(url);
    toast.success("Video selected! Preview updated.");
  };

  // ── Upload to S3 with Progress ────────────────────────────────────────────
  const uploadToS3WithProgress = (
    url: string,
    fileOrBlob: File | Blob,
    onProgress: (pct: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", fileOrBlob.type || "video/mp4");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const pct = Math.round((event.loaded / event.total) * 100);
          onProgress(pct);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`S3 upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during S3 upload."));
      xhr.send(fileOrBlob);
    });
  };

  // ── Submit for Compositing ────────────────────────────────────────────────
  const handleStartCompositing = async () => {
    if (!selectedFile) {
      toast.error("Please record a camera take or upload a video first.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Generate Presigned URL
      const fileType = selectedFile.type || "video/mp4";
      let rawVideoUrl = "";

      const fileName =
        selectedFile instanceof File
          ? selectedFile.name
          : `camera-recording-${Date.now()}.mp4`;

      const { data: uploadRes } = await generateUploadUrl({
        variables: {
          input: {
            fileName,
            fileType,
            type: "VIDEO",
          },
        },
      });

      if (!uploadRes?.generateCampaignAssetUploadUrl?.uploadUrl) {
        throw new Error("Failed to obtain secure upload URL from server.");
      }

      const { uploadUrl, fileUrl } =
        uploadRes.generateCampaignAssetUploadUrl;
      await uploadToS3WithProgress(uploadUrl, selectedFile, setUploadProgress);
      rawVideoUrl = fileUrl;

      setIsUploading(false);

      // 2. Dispatch Compositing Job
      const { data: jobRes } = await createJob({
        variables: {
          input: {
            campaignId: campaign.id,
            rawVideoUrl,
            sourceType: activeMode === "camera" ? "CAMERA" : "UPLOAD",
          },
        },
      });

      if (jobRes?.createMomentCompositingJob?.id) {
        setActiveJobId(jobRes.createMomentCompositingJob.id);
        toast.success("Compositing job queued on FFmpeg worker!");
      } else {
        throw new Error("No job ID returned from compositing service.");
      }
    } catch (error: unknown) {
      setIsUploading(false);
      toast.error(
        (error as Error).message || "Failed to initiate video compositing."
      );
    }
  };

  // ── Download MP4 ──────────────────────────────────────────────────────────
  const handleDownload = (videoUrl: string) => {
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `${campaign.slug}-composed-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Download started!");
  };

  return (
    <div className="space-y-6">
      {/* Campaign Header Banner */}
      <div className="rounded-2xl border border-border/70 p-5 bg-card shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 text-[10px] font-bold tracking-wide uppercase">
              Campaign Studio
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {campaign.aspectRatio || "9:16"} Portrait
            </Badge>
            {campaign.isFilterActive && (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                Filter Active for Users
              </Badge>
            )}
          </div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            {campaign.title}
          </h2>
          {campaign.description && (
            <p className="text-xs text-muted-foreground max-w-xl">
              {campaign.description}
            </p>
          )}
        </div>

        {/* Sequence Badges */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-muted/30 border border-border/50 text-[11px]">
            <Film className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-medium text-foreground">
              {campaign.introMomentId ? "Intro Included" : "No Intro"}
            </span>
            <span className="text-muted-foreground">➔</span>
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span className="font-medium text-foreground">Framed Video</span>
            <span className="text-muted-foreground">➔</span>
            <Film className="h-3.5 w-3.5 text-purple-500" />
            <span className="font-medium text-foreground">
              {campaign.outroMomentId ? "Outro Included" : "No Outro"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Modes & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Step 1: Capture or Select User Video
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Max {campaign.maxUserDurationSeconds || 60}s
              </span>
            </div>

            <Tabs
              value={activeMode}
              onValueChange={(val) => setActiveMode(val as "camera" | "upload")}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full h-10 bg-muted/40 p-1">
                <TabsTrigger
                  value="camera"
                  disabled={!campaign.allowCameraRecording}
                  className="text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="h-3.5 w-3.5" />
                  Record Live Camera
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  disabled={!campaign.allowFileUpload}
                  className="text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Video File
                </TabsTrigger>
              </TabsList>

              {/* Mode A: In-Browser Mobile Portrait Camera Recorder */}
              <TabsContent value="camera" className="mt-4 pt-1">
                <MobilePortraitRecorder
                  frameUrl={campaign.frameUrl}
                  minDurationSeconds={campaign.minUserDurationSeconds || 3}
                  maxDurationSeconds={campaign.maxUserDurationSeconds || 60}
                  onRecordingComplete={handleRecordingComplete}
                />
              </TabsContent>

              {/* Mode B: Drag & Drop Video File Upload */}
              <TabsContent value="upload" className="mt-4 pt-1 space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border/80 hover:border-indigo-500/60 rounded-2xl p-8 text-center cursor-pointer bg-muted/10 hover:bg-muted/20 transition-all flex flex-col items-center justify-center gap-3"
                >
                  <div className="h-12 w-12 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Click to choose video or drag and drop here
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      MP4, WebM or MOV • 9:16 portrait recommended • Max 250MB
                    </p>
                  </div>
                  {selectedFile && (
                    <Badge variant="outline" className="text-xs mt-2 bg-card">
                      Selected:{" "}
                      {"name" in selectedFile
                        ? selectedFile.name
                        : "Recorded Take"}{" "}
                      (
                      {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                    </Badge>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Action Trigger Card */}
          <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Step 2: Generate Merged MP4
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Stitches [Intro] + [Your Framed Video] + [Outro] into a single 1080p MP4.
                </p>
              </div>
            </div>

            {isUploading && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Uploading video to S3...</span>
                  <span className="font-mono">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <Button
              type="button"
              onClick={handleStartCompositing}
              disabled={!selectedFile || isUploading}
              className="w-full h-10 text-xs font-medium bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading Assets...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  Generate Composite Video Now
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Column: Live Frame Preview & Output Player (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Completed Video Player */}
          {currentJob?.status === "COMPLETED" && currentJob.outputVideoUrl ? (
            <div className="rounded-2xl border border-emerald-500/40 p-5 bg-card shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-500 text-white text-[10px] font-bold">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Rendering Complete
                </Badge>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {currentJob.duration ? `${currentJob.duration.toFixed(1)}s` : "Ready"}
                </span>
              </div>

              <div className="rounded-xl overflow-hidden aspect-[9/16] bg-black max-w-[280px] mx-auto shadow-md">
                <video
                  src={currentJob.outputVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => handleDownload(currentJob.outputVideoUrl!)}
                  className="w-full h-9 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Download className="h-4 w-4" />
                  Download Final MP4
                </Button>
              </div>

              {/* Publication Status & Manual Publish Section */}
              {publishedMoment || currentJob.momentId ? (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-3.5 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        Published to Community Moments
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {shareInFeed
                          ? "Broadcasted to community social feed & media queue."
                          : "Added to moments library."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] flex-1 cursor-pointer"
                    >
                      <a href="/moments/all" target="_blank" rel="noopener noreferrer">
                        View Moments <ArrowUpRight className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                    {shareInFeed && (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] flex-1 cursor-pointer"
                      >
                        <a href="/feed" target="_blank" rel="noopener noreferrer">
                          View Feed <ArrowUpRight className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border/70 p-3.5 bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Share2 className="h-3.5 w-3.5 text-indigo-500" /> Publish to Community
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      Media-Queue
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="publishCaption" className="text-xs font-semibold text-foreground">
                      Story Caption
                    </Label>
                    <Input
                      id="publishCaption"
                      value={publishCaption}
                      onChange={(e) => setPublishCaption(e.target.value)}
                      placeholder={`#${campaign.slug} take`}
                      className="h-8 text-xs bg-background"
                    />
                  </div>

                  <div className="p-2 rounded-lg border border-border/60 flex items-center justify-between bg-card">
                    <div>
                      <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Rss className="h-3.5 w-3.5 text-indigo-500" /> Share in Community Feed
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-snug">
                        Broadcast to social feed for all members
                      </p>
                    </div>
                    <Switch
                      checked={shareInFeed}
                      onCheckedChange={setShareInFeed}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handlePublishMoment}
                    disabled={isPublishing}
                    className="w-full h-8 text-xs font-medium bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Publishing to Media-Queue...
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3.5 w-3.5" />
                        Publish to Moments {shareInFeed ? "& Feed" : ""}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : currentJob?.status === "PROCESSING" || currentJob?.status === "QUEUED" ? (
            /* Processing Progress Card */
            <div className="rounded-2xl border border-indigo-500/40 p-6 bg-card shadow-lg text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto animate-spin">
                <Loader2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Video Compositing in Progress
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Worker is normalizing video codecs, applying the PNG frame, and concatenating clips.
                </p>
              </div>

              {/* Step indicator */}
              <div className="space-y-2 text-left pt-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" /> 1. Uploaded to S3
                </div>
                <div className="flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" /> 2. Queued in SQS (media-jobs)
                </div>
                <div className="flex items-center gap-2 text-indigo-500 font-semibold animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin" /> 3. FFmpeg Processing & Concatenating
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" /> 4. S3 Output & Ready to Download
                </div>
              </div>
            </div>
          ) : (
            /* Live Frame Simulation Preview */
            <div className="rounded-2xl border border-border/70 p-5 bg-card shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Live Viewport Preview
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  9:16 Canvas
                </span>
              </div>

              <FramePreviewCanvas
                frameUrl={campaign.frameUrl}
                videoUrl={selectedPreviewUrl}
                introVideoUrl={campaign.introVideoUrl || campaign.introMoment?.videoUrl}
                outroVideoUrl={campaign.outroVideoUrl || campaign.outroMoment?.videoUrl}
                fitMode={campaign.fitMode}
                introDuration={campaign.introMomentId ? 5 : undefined}
                outroDuration={campaign.outroMomentId ? 4 : undefined}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
