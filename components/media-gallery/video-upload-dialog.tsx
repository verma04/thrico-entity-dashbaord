"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Video,
  Upload,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Layers,
} from "lucide-react";
import {
  useGetMediaGalleryUploadUrl,
  useAddMediaGalleryVideo,
  useGetMediaGalleryAlbums,
} from "@/graphql/actions/mediaGallery";
import { cn } from "@/lib/utils";

interface GalleryAlbum {
  id: string;
  title?: string | null;
  [key: string]: unknown;
}

export function VideoUploadDialog({
  open,
  onOpenChange,
  albumId,
  currentCount = 0,
  onUploaded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albumId: string;
  currentCount?: number;
  onUploaded: () => void;
}) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);

  // Multi-Gallery Upload state
  const { data: albumsData } = useGetMediaGalleryAlbums();
  const allAlbums: GalleryAlbum[] = albumsData?.getMediaGalleryAlbums || [];
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([albumId]);

  useEffect(() => {
    if (albumId && open) {
      setSelectedAlbumIds((prev) =>
        prev.includes(albumId) ? prev : [albumId, ...prev],
      );
    }
  }, [albumId, open]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [getUploadUrl] = useGetMediaGalleryUploadUrl();
  const [addVideo] = useAddMediaGalleryVideo(albumId);

  const resetState = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setVideoFile(null);
    setPreviewUrl(null);
    setDuration(null);
    setCaption("");
    setUploading(false);
    setUploadProgress(0);
    setUploadStatus(null);
    setDurationError(null);
    setSelectedAlbumIds([albumId]);
  };

  const handleClose = () => {
    if (uploading) return;
    resetState();
    onOpenChange(false);
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file (MP4, MOV, or WebM)");
      return;
    }

    if (file.size > 250 * 1024 * 1024) {
      toast.error("Video file size cannot exceed 250MB");
      return;
    }

    setDurationError(null);
    const objectUrl = URL.createObjectURL(file);

    // Probe duration using an in-memory video element
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const dur = video.duration;
      setDuration(dur);
      if (dur > 120) {
        setDurationError(
          `Video duration (${Math.round(dur)}s) exceeds the maximum limit of 2 minutes (120 seconds). Please trim your video.`,
        );
      }
    };
    video.onerror = () => {
      toast.error("Could not read video metadata");
    };
    video.src = objectUrl;

    setVideoFile(file);
    setPreviewUrl(objectUrl);
  };

  const uploadFileWithProgress = (
    url: string,
    file: File,
    onProgress: (pct: number) => void,
  ) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type || "video/mp4");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Upload failed with HTTP ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload to S3"));
      xhr.send(file);
    });
  };

  const handleUpload = async () => {
    if (!videoFile) return;

    if (duration && duration > 120) {
      toast.error("Video duration must be less than 2 minutes (120 seconds).");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus("Requesting direct S3 upload authorization...");

    try {
      // 1. Get presigned S3 upload URL from admin-graphql
      const { data } = await getUploadUrl({
        variables: {
          input: {
            albumId,
            fileName: videoFile.name,
            fileType: videoFile.type || "video/mp4",
          },
        },
      });

      if (!data?.getMediaGalleryUploadUrl) {
        throw new Error("Failed to obtain upload authorization");
      }

      const { uploadUrl, fileUrl } = data.getMediaGalleryUploadUrl;

      // 2. Upload MP4 directly to S3 with live progress
      setUploadStatus("Uploading MP4 directly to S3...");
      await uploadFileWithProgress(uploadUrl, videoFile, (pct) => {
        setUploadProgress(pct);
      });

      // 3. Confirm video record creation in database across selected albums (Single SQS job)
      const targetAlbums =
        selectedAlbumIds.length > 0 ? selectedAlbumIds : [albumId];

      setUploadStatus(
        targetAlbums.length > 1
          ? `Dispatching single transcode job to ${targetAlbums.length} galleries...`
          : "Queuing FFmpeg background processing...",
      );

      await addVideo({
        variables: {
          input: {
            albumId,
            albumIds: targetAlbums,
            url: fileUrl,
            caption: caption.trim() || null,
            duration: duration ? Math.round(duration) : null,
            order: currentCount,
          },
        },
      });

      toast.success(
        targetAlbums.length > 1
          ? `Video uploaded to ${targetAlbums.length} galleries! 1 transcode job started.`
          : "Video uploaded! FFmpeg is optimizing it in the background.",
      );
      onUploaded();
      handleClose();
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to upload video");
    } finally {
      setUploading(false);
      setUploadStatus(null);
    }
  };

  const formatDuration = (sec: number | null) => {
    if (!sec) return "--:--";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const toggleAlbum = (targetId: string) => {
    if (targetId === albumId) return; // Keep current album selected
    setSelectedAlbumIds((prev) =>
      prev.includes(targetId)
        ? prev.filter((id) => id !== targetId)
        : [...prev, targetId],
    );
  };

  const selectAllAlbums = () => {
    setSelectedAlbumIds(allAlbums.map((a) => a.id));
  };

  const selectOnlyCurrent = () => {
    setSelectedAlbumIds([albumId]);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 shadow-2xl rounded-xl bg-white dark:bg-zinc-900">
        {/* Header (Pattern C: Modal Dialog) */}
        <div className="p-5 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <Video className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                Upload Video (Multi-Gallery Support)
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                Directly upload MP4 video. Uploads 1 source file to S3 and attaches to selected galleries.
              </DialogDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={uploading}
            className="h-7 w-7 rounded-md hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {!videoFile ? (
            <div
              className="border-2 border-dashed border-[#d2d5d9] dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-[#f9fafb]/60 dark:bg-zinc-900/40 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFileSelect(file);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
              <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                  Click to choose video or drag & drop
                </p>
                <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5">
                  MP4, MOV, or WebM (strictly under 2 minutes)
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10.5px] font-medium border border-amber-500/20">
                <Clock className="w-3 h-3" />
                Max Duration: 2 mins (120 seconds)
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Video Preview */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-[#d2d5d9] dark:border-zinc-800">
                {previewUrl && (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
                {!uploading && (
                  <button
                    onClick={resetState}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Video Stats */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#f6f6f7] dark:bg-zinc-800/50 border border-[#d2d5d9] dark:border-zinc-800 text-xs">
                <div className="flex items-center gap-2 truncate pr-2">
                  <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="font-medium text-[#303030] dark:text-zinc-100 truncate">
                    {videoFile.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-[#616161] dark:text-zinc-400">
                    {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                  </span>
                  <span
                    className={cn(
                      "font-semibold px-2 py-0.5 rounded text-[10.5px]",
                      duration && duration > 120
                        ? "bg-red-500/10 text-red-600 border border-red-500/20"
                        : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
                    )}
                  >
                    {formatDuration(duration)}
                  </span>
                </div>
              </div>

              {/* Multi-Gallery Selector */}
              {allAlbums.length > 1 && (
                <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.03] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                        Multi-Gallery Upload (Single Source)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={
                          selectedAlbumIds.length === allAlbums.length
                            ? selectOnlyCurrent
                            : selectAllAlbums
                        }
                        className="text-[10.5px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        {selectedAlbumIds.length === allAlbums.length
                          ? "Reset"
                          : "Select All"}
                      </button>
                      <Badge
                        variant="outline"
                        className="text-[9.5px] font-mono px-1.5 py-0 border-border/80 text-muted-foreground"
                      >
                        {selectedAlbumIds.length} of {allAlbums.length} selected
                      </Badge>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-relaxed">
                    Source video is uploaded to S3 only once and processed by a single FFmpeg worker. Shared across selected galleries with zero duplicated storage.
                  </p>

                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pt-1">
                    {allAlbums.map((alb) => {
                      const isCurrent = alb.id === albumId;
                      const isSelected = selectedAlbumIds.includes(alb.id);
                      return (
                        <button
                          key={alb.id}
                          type="button"
                          onClick={() => toggleAlbum(alb.id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all border cursor-pointer",
                            isSelected
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800 shadow-2xs"
                              : "bg-white dark:bg-zinc-900 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-800 hover:border-[#aeb4b9]",
                          )}
                        >
                          <CheckCircle2
                            className={cn(
                              "w-3 h-3 shrink-0",
                              isSelected
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-muted-foreground/30",
                            )}
                          />
                          <span className="truncate max-w-[150px]">
                            {alb.title}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-500/80">
                              (this)
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Duration Error Warning */}
              {durationError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{durationError}</span>
                </div>
              )}

              {/* Caption Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="video-caption"
                    className="text-xs font-semibold text-[#303030] dark:text-zinc-100"
                  >
                    Caption (Optional)
                  </Label>
                  <span className="text-[11px] text-[#616161] dark:text-zinc-400 font-mono">
                    {caption.length}/500
                  </span>
                </div>
                <Textarea
                  id="video-caption"
                  placeholder="Describe this video..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  disabled={uploading}
                  rows={2}
                  className="text-xs resize-none h-16"
                />
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2 p-3.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <div className="flex items-center justify-between text-xs font-medium text-foreground">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                      {uploadStatus || "Uploading..."}
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer (Pattern C: Modal Dialog) */}
        <div className="p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
            className="h-8.5 px-3 text-xs border-[#d2d5d9] dark:border-zinc-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!videoFile || !!durationError || uploading}
            className="h-8.5 px-4 text-xs font-medium bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                {selectedAlbumIds.length > 1
                  ? `Publish (${selectedAlbumIds.length} Albums)`
                  : "Upload Video"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
