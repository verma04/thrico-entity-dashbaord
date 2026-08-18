"use client";

import React from "react";
import {
  GripVertical,
  Pencil,
  Trash2,
  Star,
  LayoutGrid,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlbumCardCompactProps {
  album: any;
  onEdit: (album: any) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
  enableDrag?: boolean;
}

export function AlbumCardCompact({
  album,
  onEdit,
  onDelete,
  onClick,
  enableDrag = false,
}: AlbumCardCompactProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: album?.id, disabled: !enableDrag });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.6 : 1,
  };

  const coverUrl = album?.coverImage
    ? album.coverImage.startsWith("http")
      ? album.coverImage
      : `https://cdn.thrico.network/${album.coverImage}`
    : null;

  const imageCount = album?.imageCount ?? album?.imagesCount ?? album?.images?.length ?? 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
      onClick={() => onClick(album?.id)}
    >
      {/* Top status accent bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: album?.isFeatured ? "#f59e0b" : "#6366f1" }}
      />

      {/* ── Optional Cover Image Container ───────────────────────────────── */}
      {coverUrl ? (
        <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-muted/30 border-b border-border/40 shrink-0">
          <img
            src={coverUrl}
            alt={album?.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Top floating badges */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
            {album?.isFeatured && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow-2xs">
                <Star className="h-2.5 w-2.5 fill-white" />
                Featured
              </span>
            )}
          </div>

          {/* Top Right Action Menu */}
          <div
            className="absolute top-2 right-2 flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {enableDrag && (
              <button
                {...attributes}
                {...listeners}
                className="p-1 rounded bg-black/40 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-xs transition-colors cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-3.5 w-3.5" />
              </button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs rounded-md transition-colors"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 truncate">
                  {album?.title}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => onClick(album?.id)}
                  className="text-xs font-medium cursor-pointer gap-2 py-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  View Photos
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEdit(album)}
                  className="text-xs font-medium cursor-pointer gap-2 py-1.5"
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  Edit Album
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={() => onDelete(album?.id)}
                  className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-rose-600 dark:text-rose-400 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Album
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Bottom Left Photo Count Badge */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white font-mono text-[10px] font-bold border border-white/10">
            <LayoutGrid className="h-3 w-3 text-white/80" />
            <span>{imageCount} {imageCount === 1 ? "Photo" : "Photos"}</span>
          </div>
        </div>
      ) : (
        /* ── Clean Header (when no cover image exists) ──────────────────── */
        <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {album?.isFeatured && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Star className="h-2.5 w-2.5 fill-amber-500" />
                Featured
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-muted text-muted-foreground border border-border">
              <LayoutGrid className="h-2.5 w-2.5" />
              {imageCount} {imageCount === 1 ? "photo" : "photos"}
            </span>
          </div>

          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {enableDrag && (
              <button
                {...attributes}
                {...listeners}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-3.5 w-3.5" />
              </button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 truncate">
                  {album?.title}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => onClick(album?.id)}
                  className="text-xs font-medium cursor-pointer gap-2 py-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  View Photos
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEdit(album)}
                  className="text-xs font-medium cursor-pointer gap-2 py-1.5"
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  Edit Album
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={() => onDelete(album?.id)}
                  className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-rose-600 dark:text-rose-400 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Album
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3
            className="text-xs sm:text-sm font-semibold text-foreground leading-snug truncate group-hover:text-primary transition-colors"
            title={album?.title}
          >
            {album?.title}
          </h3>

          {album?.description && (
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
              {album?.description}
            </p>
          )}
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] text-muted-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onClick(album?.id)}
            className="h-6 text-[11px] font-medium gap-1 px-1.5 text-primary hover:text-primary hover:bg-primary/10"
          >
            <ExternalLink className="h-3 w-3" />
            Open Album
          </Button>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(album)}
              className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(album?.id)}
              className="h-6 w-6 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlbumCardCompact;
