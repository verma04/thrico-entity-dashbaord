"use client";

import React, { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useAddMediaGalleryImage,
  useAddMediaGalleryVideo,
  useGetMediaGalleryUploadUrl,
} from "@/graphql/actions/mediaGallery";
import { Badge } from "@/components/ui/badge";
import { VideoUploadDialog } from "./video-upload-dialog";
import { LinkUploadDialog } from "./link-upload-dialog";
import { Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadZone({
  albumId,
  imageCount,
  onUploaded,
}: {
  albumId: string;
  imageCount: number;
  onUploaded: () => void;
}) {
  const [addImage] = useAddMediaGalleryImage(albumId);
  const [addVideo] = useAddMediaGalleryVideo(albumId);
  const [getUploadUrl] = useGetMediaGalleryUploadUrl();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFileWithProgress = (
    url: string,
    file: File,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response as string);
        } else {
          reject(new Error(`Upload failed with HTTP ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(file);
    });
  };

  const checkVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => reject(new Error("Failed to load video metadata"));
      video.src = URL.createObjectURL(file);
    });
  };

  const processFiles = async (files: FileList) => {
    setUploading(true);
    const fileArray = Array.from(files);

    const imageFiles = fileArray.filter((f) => f.type.startsWith("image/"));
    const videoFiles = fileArray.filter((f) => f.type.startsWith("video/"));

    if (imageFiles.length === 0 && videoFiles.length === 0) {
      toast.error("Please drop images or MP4 videos.");
      setUploading(false);
      return;
    }

    let successCount = 0;

    // 1. Process Video Files (direct S3 upload with duration limit check)
    for (let i = 0; i < videoFiles.length; i++) {
      const file = videoFiles[i];
      try {
        setUploadProgress(`Checking duration for ${file.name}...`);
        const duration = await checkVideoDuration(file).catch(() => null);

        if (duration && duration > 120) {
          toast.error(
            `${file.name} exceeds 2 minutes limit (${Math.round(duration)}s). Skipping.`,
          );
          continue;
        }

        setUploadProgress(`Uploading ${file.name} to S3...`);
        const { data } = await getUploadUrl({
          variables: {
            input: {
              albumId,
              fileName: file.name,
              fileType: file.type || "video/mp4",
            },
          },
        });

        if (!data?.getMediaGalleryUploadUrl) {
          throw new Error("Could not obtain S3 upload URL");
        }

        const { uploadUrl, fileUrl } = data.getMediaGalleryUploadUrl;
        await uploadFileWithProgress(uploadUrl, file);

        await addVideo({
          variables: {
            input: {
              albumId,
              url: fileUrl,
              duration: duration ? Math.round(duration) : null,
              order: imageCount + successCount,
            },
          },
        });

        successCount++;
        toast.success(`Uploaded ${file.name}! Processing in background.`);
      } catch (err: unknown) {
        toast.error(`Failed to upload ${file.name}: ${(err as Error)?.message}`);
      }
    }

    // 2. Process Image Files (standard upload)
    if (imageFiles.length > 0) {
      setUploadProgress(`Uploading ${imageFiles.length} photo(s)...`);
      await Promise.all(
        imageFiles.map(async (file, index) => {
          try {
            await addImage({
              variables: {
                input: {
                  albumId,
                  imageUpload: file,
                  order: imageCount + successCount + index,
                },
              },
            });
            successCount++;
          } catch {
            toast.error(`Failed to upload ${file.name}`);
          }
        }),
      );
    }

    if (successCount > 0) {
      onUploaded();
    }

    setUploading(false);
    setUploadProgress(null);
  };

  return (
    <>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-[10px] aspect-square flex flex-col items-center justify-center gap-2 cursor-pointer transition-all p-3",
          dragOver
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40"
            : "border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb]/60 dark:bg-zinc-900/40 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-900",
        )}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/mp4,video/quicktime,video/webm"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-1.5 p-2 text-center">
            <Loader2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <span className="text-[11px] font-medium text-[#303030] dark:text-zinc-200 line-clamp-1">
              {uploadProgress || "Uploading media..."}
            </span>
          </div>
        ) : (
          <>
            <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              <Upload className="w-4 h-4" />
            </div>
            <div className="text-center px-1">
              <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100 block">
                Add Photos, Video, or Link
              </span>
              <span className="text-[10px] text-[#616161] dark:text-zinc-400 block mt-0.5 leading-snug">
                Drop files or add web link
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge
                variant="outline"
                className="text-[9px] font-mono px-1 py-0 text-muted-foreground border-border/80"
              >
                Video &lt; 2m
              </Badge>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLinkModal(true);
                }}
                className="text-[9.5px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer bg-indigo-50/80 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800"
              >
                <Link2 className="w-2.5 h-2.5" />
                Add Link
              </button>
            </div>
          </>
        )}
      </div>

      <VideoUploadDialog
        open={showVideoModal}
        onOpenChange={setShowVideoModal}
        albumId={albumId}
        currentCount={imageCount}
        onUploaded={onUploaded}
      />

      <LinkUploadDialog
        open={showLinkModal}
        onOpenChange={setShowLinkModal}
        currentAlbumId={albumId}
        onUploaded={onUploaded}
      />
    </>
  );
}
