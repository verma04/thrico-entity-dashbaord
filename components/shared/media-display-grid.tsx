"use client";

import React from "react";
import { Video, FileText, Link as LinkIcon, Image as ImageIcon, ExternalLink } from "lucide-react";
import { getMediaUrl } from "@/utils/utils";

export interface MediaItem {
  id?: string;
  title?: string;
  url?: string;
  mediaType?: string;
  mediaFile?: string;
}

interface MediaDisplayGridProps {
  media: MediaItem[];
  columns?: 2 | 3;
  className?: string;
}

const getMediaIcon = (type?: string) => {
  switch (type?.toUpperCase()) {
    case "VIDEO":
      return <Video className="h-4 w-4" />;
    case "DOCUMENT":
      return <FileText className="h-4 w-4" />;
    case "LINK":
      return <LinkIcon className="h-4 w-4" />;
    default:
      return <ImageIcon className="h-4 w-4" />;
  }
};

export function MediaDisplayGrid({
  media,
  columns = 3,
  className = "",
}: MediaDisplayGridProps) {
  if (!media || media.length === 0) return null;

  const gridColsClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  }[columns];

  return (
    <div className={`grid gap-6 ${gridColsClass} ${className}`}>
      {media.map((item) => {
        const mediaSrc = item.url
          ? item.url.startsWith("http")
            ? item.url
            : (getMediaUrl(item.url) || "")
          : item.mediaFile
            ? item.mediaFile.startsWith("http")
              ? item.mediaFile
              : (getMediaUrl(item.mediaFile) || "")
            : null;

        const isImage = item.mediaType?.toUpperCase() === "IMAGE";

        return (
          <div
            key={item.id || item.url || item.title}
            className="group relative flex flex-col rounded-md overflow-hidden border border-border/40 bg-card hover:border-border transition-all"
          >
            {/* Thumbnail / Icon */}
            <div className="relative aspect-video bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
              {isImage && mediaSrc ? (
                <img
                  src={mediaSrc}
                  alt={item.title || "Media"}
                  className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground/40 h-full w-full">
                  {getMediaIcon(item.mediaType)}
                </div>
              )}

              {item.mediaType && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                  {getMediaIcon(item.mediaType)}
                  <span>{item.mediaType}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
              {item.title && (
                <h3 className="font-bold text-foreground line-clamp-2 mb-2 text-sm">
                  {item.title}
                </h3>
              )}

              {(item.url || item.mediaFile) && (
                <a
                  href={item.url || mediaSrc || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 mt-auto pt-3 border-t border-border/40"
                >
                  {item.mediaType?.toUpperCase() === "LINK"
                    ? "Visit Link"
                    : "View Media"}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
