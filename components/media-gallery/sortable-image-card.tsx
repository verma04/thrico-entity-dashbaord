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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SortableImageCard({
  image,
  albumId,
  onDelete,
  onViewComments,
  onEditCaption,
  isSelectionMode,
  isSelected,
  onToggleSelect,
}: {
  image: any;
  albumId: string;
  onDelete: (id: string) => void;
  onViewComments: (id: string) => void;
  onEditCaption: (image: any) => void;
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

  const formatDuration = (sec: number | null) => {
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
        className={`relative group aspect-square rounded-xl overflow-hidden border ${
          isSelected
            ? "border-indigo-500 ring-2 ring-indigo-500"
            : isFailed
            ? "border-red-200 bg-red-50/30"
            : "border-gray-100"
        } bg-gray-900 transition-all ${isSelectionMode ? "cursor-pointer" : ""}`}
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
          className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${
            isSelected ? "scale-95" : ""
          } ${isPending ? "opacity-60 blur-[1px]" : ""}`}
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
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-semibold text-white">
              <Video className="w-3 h-3 text-indigo-400" />
              {image.duration ? formatDuration(image.duration) : "VIDEO"}
            </div>
          </>
        )}

        {/* Processing Indicator */}
        {isPending && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 p-2 text-center">
            <Loader2 className="w-6 h-6 text-amber-400 animate-spin mb-1" />
            <span className="text-[11px] font-bold text-white tracking-wide">
              {image.status === "PROCESSING" ? "Optimizing..." : "Processing..."}
            </span>
            <span className="text-[9px] text-amber-200/90 mt-0.5">FFmpeg worker active</span>
          </div>
        )}

        {/* Failed Indicator */}
        {isFailed && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-red-950/80 p-2 text-center text-red-200">
            <AlertCircle className="w-6 h-6 text-red-400 mb-1" />
            <span className="text-[11px] font-bold text-white">Processing Failed</span>
            <span className="text-[9px] text-red-300 mt-0.5 line-clamp-2">
              {image.errorMessage || "Exceeded 2-min limit or format error"}
            </span>
          </div>
        )}

        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="absolute top-2 left-2 z-20">
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                isSelected
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white/80 border-gray-300"
              }`}
            >
              {isSelected && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-3 h-3 text-white stroke-current stroke-2"
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
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex flex-col justify-between p-2">
            <div className="flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                {...attributes}
                {...listeners}
                className="p-1.5 rounded-md bg-white/20 backdrop-blur-sm text-white cursor-grab hover:bg-white/30"
              >
                <GripVertical className="w-4 h-4" />
              </button>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 bg-white/20 backdrop-blur-sm text-white hover:bg-white/40"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCaption(image);
                  }}
                >
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 bg-white/20 backdrop-blur-sm text-white hover:bg-red-500/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(image.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Caption + comments */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {image.caption && (
                <p className="text-white text-xs font-medium truncate mb-1">
                  {image.caption}
                </p>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 w-full"
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

      {/* Video Preview Dialog */}
      {isVideo && (
        <Dialog open={showVideoPreview} onOpenChange={setShowVideoPreview}>
          <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-black border-zinc-800">
            <DialogHeader className="p-4 bg-zinc-900 border-b border-zinc-800">
              <DialogTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-400" />
                {image.caption || "Video Preview"}
              </DialogTitle>
            </DialogHeader>
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
