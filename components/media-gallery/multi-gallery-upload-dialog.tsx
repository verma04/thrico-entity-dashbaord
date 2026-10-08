"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Layers,
  Upload,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import {
  useGetMediaGalleryAlbums,
  useAddMediaGalleryImage,
  useAddMediaGalleryVideo,
  useGetMediaGalleryUploadUrl,
} from "@/graphql/actions/mediaGallery";
import { cn } from "@/lib/utils";

interface GalleryAlbum {
  id: string;
  title?: string | null;
  [key: string]: unknown;
}

interface MultiGalleryUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAlbumId?: string;
  onUploaded: () => void;
}

export function MultiGalleryUploadDialog({
  open,
  onOpenChange,
  currentAlbumId,
  onUploaded,
}: MultiGalleryUploadDialogProps) {
  const { data: albumsData } = useGetMediaGalleryAlbums();
  const allAlbums: GalleryAlbum[] = useMemo(
    () => albumsData?.getMediaGalleryAlbums || [],
    [albumsData],
  );

  const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>(
    currentAlbumId ? [currentAlbumId] : [],
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addImage] = useAddMediaGalleryImage(
    currentAlbumId || allAlbums[0]?.id || "",
  );
  const [addVideo] = useAddMediaGalleryVideo(
    currentAlbumId || allAlbums[0]?.id || "",
  );
  const [getUploadUrl] = useGetMediaGalleryUploadUrl();

  useEffect(() => {
    if (open) {
      if (currentAlbumId) {
        setSelectedAlbumIds((prev) =>
          prev.includes(currentAlbumId) ? prev : [currentAlbumId, ...prev],
        );
      } else if (allAlbums.length > 0) {
        setSelectedAlbumIds((prev) =>
          prev.length > 0 ? prev : [allAlbums[0].id],
        );
      }
    }
  }, [currentAlbumId, open, allAlbums]);

  const resetState = () => {
    setSelectedFiles([]);
    setCaption("");
    setUploading(false);
    setUploadProgress(null);
    setSelectedAlbumIds(currentAlbumId ? [currentAlbumId] : []);
  };

  const handleClose = () => {
    if (uploading) return;
    resetState();
    onOpenChange(false);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/"),
    );
    if (valid.length === 0) {
      toast.error("Please select image or video files.");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...valid]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAlbum = (id: string) => {
    if (id === currentAlbumId) return; // Keep current album selected
    setSelectedAlbumIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const uploadS3WithProgress = (url: string, file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response as string);
        } else {
          reject(new Error(`Upload failed HTTP ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(file);
    });
  };

  const handleUploadAll = async () => {
    if (selectedFiles.length === 0) return;
    const primaryId =
      currentAlbumId || (allAlbums.length > 0 ? allAlbums[0].id : "");
    const targetAlbumIds =
      selectedAlbumIds.length > 0
        ? selectedAlbumIds
        : primaryId
          ? [primaryId]
          : [];

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setUploadProgress(
        `Processing ${i + 1}/${selectedFiles.length}: ${file.name}`,
      );

      try {
        if (file.type.startsWith("video/")) {
          // Video: upload to S3 once, addVideo with albumIds
          const { data } = await getUploadUrl({
            variables: {
              input: {
                albumId: targetAlbumIds[0],
                fileName: file.name,
                fileType: file.type || "video/mp4",
              },
            },
          });
          if (!data?.getMediaGalleryUploadUrl) {
            throw new Error("Could not obtain S3 upload URL");
          }
          const { uploadUrl, fileUrl } = data.getMediaGalleryUploadUrl;
          await uploadS3WithProgress(uploadUrl, file);

          await addVideo({
            variables: {
              input: {
                albumId: targetAlbumIds[0],
                albumIds: targetAlbumIds,
                url: fileUrl,
                caption: caption.trim() || null,
              },
            },
          });
          successCount++;
        } else {
          // Image: addImage with albumIds (single upload across all galleries)
          await addImage({
            variables: {
              input: {
                albumId: currentAlbumId,
                albumIds: targetAlbumIds,
                imageUpload: file,
                caption: caption.trim() || null,
              },
            },
          });
          successCount++;
        }
      } catch (err: unknown) {
        toast.error(
          `Failed to upload ${file.name}: ${(err as Error)?.message}`,
        );
      }
    }

    if (successCount > 0) {
      toast.success(
        `Successfully uploaded ${successCount} media asset(s) across ${targetAlbumIds.length} galleries!`,
      );
      onUploaded();
      handleClose();
    } else {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 shadow-2xl rounded-xl bg-white dark:bg-zinc-900">
        {/* Header (Pattern C: Modal Dialog) */}
        <div className="p-5 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                Upload Photos & Media
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                Upload files to this album with optional multi-gallery distribution
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
          {/* File Picker / Dropzone */}
          <div
            className="border-2 border-dashed border-[#d2d5d9] dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-[#f9fafb]/50 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 rounded-xl p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/mp4,video/quicktime,video/webm"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                Drop images or videos here, or click to browse
              </p>
              <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5">
                Multiple files supported (JPG, PNG, WebP, MP4)
              </p>
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                  Files to Upload ({selectedFiles.length})
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFiles([])}
                  disabled={uploading}
                  className="text-[10.5px] text-destructive hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg border border-[#e1e3e5]/80 dark:border-zinc-800 bg-[#f9fafb]/80 dark:bg-zinc-800/50 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      {file.type.startsWith("video/") ? (
                        <Video className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      )}
                      <span className="truncate text-[#303030] dark:text-zinc-200 font-medium text-[11px]">
                        {file.name}
                      </span>
                    </div>
                    {!uploading && (
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-muted-foreground hover:text-destructive p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Target Galleries Selection */}
          {allAlbums.length > 1 && (
            <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.03] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                    Destination Galleries ({selectedAlbumIds.length} Selected)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedAlbumIds(
                        selectedAlbumIds.length === allAlbums.length
                          ? [currentAlbumId || ""]
                          : allAlbums.map((a) => a.id),
                      )
                    }
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                  >
                    {selectedAlbumIds.length === allAlbums.length
                      ? "Reset"
                      : "Select All"}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-snug">
                Assets are uploaded to S3 once. All chosen galleries will share this media without duplicating storage.
              </p>

              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pt-1">
                {allAlbums.map((alb) => {
                  const isCurrent = alb.id === currentAlbumId;
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
                      <span className="truncate max-w-[140px]">{alb.title}</span>
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

          {/* Optional Caption */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
              Shared Caption (Optional)
            </Label>
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption applied to uploaded items..."
              className="text-xs h-9"
              disabled={uploading}
            />
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2 text-xs text-foreground">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>{uploadProgress || "Uploading media across galleries..."}</span>
            </div>
          )}
        </div>

        {/* Footer (Pattern C: Modal Dialog) */}
        <div className="p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
          <div className="text-[11px] text-[#616161] dark:text-zinc-400">
            {selectedFiles.length > 0 && (
              <Badge
                variant="outline"
                className="text-[10px] font-mono px-1.5 py-0 border-border/80 text-muted-foreground"
              >
                {selectedFiles.length} file(s) → {selectedAlbumIds.length} galleries
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
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
              onClick={handleUploadAll}
              disabled={selectedFiles.length === 0 || uploading}
              className="h-8.5 px-4 text-xs font-medium bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs gap-1.5"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  Upload Photos ({selectedFiles.length})
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
