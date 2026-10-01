"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Video,
  Upload,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Play,
  X,
} from "lucide-react";
import {
  useGetMediaGalleryUploadUrl,
  useAddMediaGalleryVideo,
} from "@/graphql/actions/mediaGallery";

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
          `Video duration (${Math.round(dur)}s) exceeds the maximum limit of 2 minutes (120 seconds). Please trim your video.`
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
    onProgress: (pct: number) => void
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
    setUploadStatus("Requesting direct upload channel...");

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

      // 3. Confirm video record creation in database
      setUploadStatus("Queuing FFmpeg background processing...");
      await addVideo({
        variables: {
          input: {
            albumId,
            url: fileUrl,
            caption: caption.trim() || null,
            duration: duration ? Math.round(duration) : null,
            order: currentCount,
          },
        },
      });

      toast.success("Video uploaded! FFmpeg is optimizing it in the background.");
      onUploaded();
      handleClose();
    } catch (err: any) {
      console.error("Video upload error:", err);
      toast.error(err.message || "Failed to upload video");
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-600" />
            Upload Album Video
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Directly upload an MP4 video to this album. Video length must be less than 2 minutes.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {!videoFile ? (
            <div
              className="border-2 border-dashed border-gray-200 hover:border-indigo-400 bg-gray-50/50 hover:bg-indigo-50/20 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
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
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">
                  Click to choose video or drag & drop
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  MP4, MOV, or WebM (strictly under 2 minutes)
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200/60 mt-1">
                <Clock className="w-3.5 h-3.5" />
                Max Duration: 2 mins (120 seconds)
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Video Preview */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-gray-200">
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
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                <div className="flex items-center gap-2 truncate pr-2">
                  <Video className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-medium text-gray-700 truncate">
                    {videoFile.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-muted-foreground">
                    {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded ${
                      duration && duration > 120
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {formatDuration(duration)}
                  </span>
                </div>
              </div>

              {/* Duration Error Warning */}
              {durationError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{durationError}</span>
                </div>
              )}

              {/* Caption Input */}
              <div className="space-y-1.5">
                <Label htmlFor="video-caption" className="text-xs font-semibold text-gray-700">
                  Caption (Optional)
                </Label>
                <Textarea
                  id="video-caption"
                  placeholder="Describe this video..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  disabled={uploading}
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2 p-3.5 rounded-lg bg-indigo-50/60 border border-indigo-100">
                  <div className="flex items-center justify-between text-xs font-medium text-indigo-900">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      {uploadStatus || "Uploading..."}
                    </span>
                    <span className="font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-indigo-100 h-2 rounded-full overflow-hidden">
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

        <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={uploading}
            className="text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleUpload}
            disabled={!videoFile || !!durationError || uploading}
            className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Upload Video
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
