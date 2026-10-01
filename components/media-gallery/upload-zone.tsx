"use client";

import React, { useRef, useState } from "react";
import { Upload, Loader2, Video, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  useAddMediaGalleryImage,
  useAddMediaGalleryVideo,
  useGetMediaGalleryUploadUrl,
} from "@/graphql/actions/mediaGallery";
import { VideoUploadDialog } from "./video-upload-dialog";

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

  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFileWithProgress = (
    url: string,
    file: File
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
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
      video.onerror = () => reject("Failed to load video metadata");
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
            `${file.name} exceeds 2 minutes limit (${Math.round(duration)}s). Skipping.`
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
      } catch (err: any) {
        console.error("Video drop error:", err);
        toast.error(`Failed to upload ${file.name}: ${err.message}`);
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
          } catch (err: any) {
            toast.error(`Failed to upload ${file.name}`);
          }
        })
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
        className={`relative border-2 border-dashed rounded-xl aspect-square flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
          dragOver
            ? "border-indigo-400 bg-indigo-50/40"
            : "border-gray-200 bg-gray-50/50 hover:border-indigo-200 hover:bg-gray-50"
        }`}
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
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <span className="text-[11px] font-medium text-gray-600 line-clamp-1">
              {uploadProgress || "Uploading media..."}
            </span>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center px-2">
              Add Photos or Video
            </span>
            <span className="text-[10px] text-gray-400 text-center px-2">
              Drag media or click to browse (videos &lt; 2 mins)
            </span>
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
    </>
  );
}
