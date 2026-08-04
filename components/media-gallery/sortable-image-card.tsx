"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group aspect-square rounded-xl overflow-hidden border ${
        isSelected
          ? "border-indigo-500 ring-2 ring-indigo-500"
          : "border-gray-100"
      } bg-gray-50 transition-all ${isSelectionMode ? "cursor-pointer" : ""}`}
      onClick={() => {
        if (isSelectionMode && onToggleSelect) {
          onToggleSelect();
        }
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${process.env.NEXT_PUBLIC_CDN_URL}/${image.url}`}
        alt={image.caption ?? "Gallery image"}
        className={`w-full h-full object-cover transition-transform ${
          isSelected ? "scale-95" : ""
        }`}
      />

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

      {/* Overlay on hover (disabled in selection mode) */}
      {!isSelectionMode && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex flex-col justify-between p-2">
          <div className="flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              {...attributes}
              {...listeners}
              className="p-1.5 rounded-md bg-white/20 backdrop-blur-sm text-white cursor-grab"
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
  );
}
