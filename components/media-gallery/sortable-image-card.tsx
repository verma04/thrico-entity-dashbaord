"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Pencil,
  Trash2,
  MessageCircle,
  Play,
  Loader2,
  AlertCircle,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface MediaGalleryImageItem {
  id: string;
  url?: string | null;
  thumbnailUrl?: string | null;
  optimizedUrl?: string | null;
  caption?: string | null;
  fileName?: string | null;
  type?: "IMAGE" | "VIDEO" | string;
  status?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | string;
  errorMessage?: string | null;
  duration?: number | null;
  commentCount?: number | null;
  order?: number | null;
  [key: string]: unknown;
}

export function SortableImageCard({
  image,
  onDelete,
  onViewComments,
  onEditCaption,
  isSelectionMode,
  isSelected,
  onToggleSelect,
}: {
  image: MediaGalleryImageItem;
  albumId?: string;
  onDelete: (id: string) => void;
  onViewComments: (id: string) => void;
  onEditCaption: (image: MediaGalleryImageItem) => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}) {
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id,
    disabled: isSelectionMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.6 : 1,
  };

  const isVideo = image.type === "VIDEO";
  const isPending = image.status === "PENDING" || image.status === "PROCESSING";
  const isFailed = image.status === "FAILED";

  // Resolve best image URL
  const rawUrl = image.thumbnailUrl || image.optimizedUrl || image.url;
  const displayUrl = rawUrl?.startsWith("http")
    ? rawUrl
    : `https://cdn.thrico.network/${rawUrl?.replace(/^\//, "")}`;

  const videoPlaybackUrl = image.optimizedUrl || image.url;
  const fullVideoUrl = videoPlaybackUrl?.startsWith("http")
    ? videoPlaybackUrl
    : `https://cdn.thrico.network/${videoPlaybackUrl?.replace(/^\//, "")}`;

  const formatDuration = (sec: number | null | undefined) => {
    if (!sec) return "";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "relative group aspect-square rounded-[10px] overflow-hidden border transition-all select-none",
          isSelected
            ? "border-[#303030] dark:border-zinc-100 ring-2 ring-[#303030] dark:ring-zinc-100 shadow-2xs"
            : isFailed
              ? "border-destructive/40 bg-destructive/5"
              : "border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7] dark:bg-zinc-900",
          isSelectionMode ? "cursor-pointer" : "",
        )}
        onClick={() => {
          if (isSelectionMode && onToggleSelect) {
            onToggleSelect();
          } else if (isVideo && !isPending && !isFailed) {
            setShowVideoPreview(true);
          }
        }}
      >
        {/* Poster / Thumbnail Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayUrl}
          alt={image.caption ?? (isVideo ? "Gallery video" : "Gallery image")}
          className={cn(
            "w-full h-full object-cover transition-transform duration-200 group-hover:scale-105",
            isSelected && "scale-95",
            isPending && "opacity-60 blur-[1px]",
          )}
        />

        {/* Video Indicators */}
        {isVideo && (
          <>
            {/* Play Button Overlay (when ready) */}
            {!isPending && !isFailed && !isSelectionMode && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
                <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 shadow-lg">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>
            )}

            {/* Video Badge (top right) */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-semibold text-white">
              <Video className="w-3 h-3 text-indigo-400" />
              {image.duration ? formatDuration(image.duration) : "VIDEO"}
            </div>
          </>
        )}

        {/* Processing Indicator */}
        {isPending && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 p-2 text-center backdrop-blur-xs">
            <Loader2 className="w-6 h-6 text-amber-400 animate-spin mb-1" />
            <span className="text-[11px] font-bold text-white tracking-wide">
              {image.status === "PROCESSING" ? "Optimizing..." : "Processing..."}
            </span>
            <span className="text-[9.5px] text-amber-200/90 mt-0.5">
              Worker active
            </span>
          </div>
        )}

        {/* Failed Indicator */}
        {isFailed && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-red-950/85 p-2 text-center text-red-200">
            <AlertCircle className="w-6 h-6 text-red-400 mb-1" />
            <span className="text-[11px] font-bold text-white">Processing Failed</span>
            <span className="text-[9.5px] text-red-300 mt-0.5 line-clamp-2">
              {image.errorMessage || "Exceeded 2-min limit or format error"}
            </span>
          </div>
        )}

        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="absolute top-2 left-2 z-20">
            <div
              className={cn(
                "w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors shadow-2xs",
                isSelected
                  ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                  : "bg-white/90 dark:bg-zinc-900/90 border-[#d2d5d9] dark:border-zinc-700",
              )}
            >
              {isSelected && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-3 h-3 stroke-current stroke-2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Overlay on hover */}
        {!isSelectionMode && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-150 flex flex-col justify-between p-2">
            <div className="flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                {...attributes}
                {...listeners}
                className="p-1.5 rounded-md bg-white/20 backdrop-blur-sm text-white cursor-grab hover:bg-white/30 transition-colors"
                title="Drag to reorder"
              >
                <GripVertical className="w-4 h-4" />
              </button>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 bg-white/20 backdrop-blur-sm text-white hover:bg-white/40"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCaption(image);
                  }}
                  title="Edit caption"
                >
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 bg-white/20 backdrop-blur-sm text-white hover:bg-destructive/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(image.id);
                  }}
                  title="Delete media"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Caption + comments */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {image.caption && (
                <p className="text-white text-xs font-medium truncate mb-1 px-1">
                  {image.caption}
                </p>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6.5 px-2 text-[11px] bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 w-full justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewComments(image.id);
                }}
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                {image.commentCount ?? 0} comments
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Video Preview Dialog (Pattern C: Modal Dialog) */}
      {isVideo && (
        <Dialog open={showVideoPreview} onOpenChange={setShowVideoPreview}>
          <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-black border border-[#d2d5d9] dark:border-zinc-800 shadow-2xl rounded-xl">
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <div className="h-7 w-7 rounded-md bg-indigo-950/60 text-indigo-400 flex items-center justify-center border border-indigo-900/40 shrink-0">
                  <Video className="w-3.5 h-3.5" />
                </div>
                <div>
                  <DialogTitle className="text-xs font-bold text-white truncate">
                    {image.caption || "Video Preview"}
                  </DialogTitle>
                  <DialogDescription className="text-[10.5px] text-zinc-400">
                    High definition video stream
                  </DialogDescription>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowVideoPreview(false)}
                className="h-7 w-7 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src={fullVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
