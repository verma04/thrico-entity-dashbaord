"use client";

import { useState, useEffect, useCallback } from "react";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedMediaProps {
  media: { url: string }[];
}

// Extract the dominant/average color from an image URL via canvas sampling
function useDominantColors(media: { url: string }[]) {
  const [colors, setColors] = useState<Record<number, string>>({});

  const extractColor = useCallback((imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) { resolve("rgba(120,120,120,0.15)"); return; }
          canvas.width = 8;
          canvas.height = 8;
          ctx.drawImage(img, 0, 0, 8, 8);
          const data = ctx.getImageData(0, 0, 8, 8).data;
          let r = 0, g = 0, b = 0, count = 0;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          resolve(`rgba(${r},${g},${b},0.22)`);
        } catch {
          resolve("rgba(120,120,120,0.15)");
        }
      };
      img.onerror = () => resolve("rgba(120,120,120,0.15)");
      img.src = imageUrl;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    media.forEach((m, idx) => {
      extractColor(getPreferredMediaUrl(m.url)).then((color) => {
        if (!cancelled) {
          setColors((prev) => ({ ...prev, [idx]: color }));
        }
      });
    });
    return () => { cancelled = true; };
  }, [media, extractColor]);

  return colors;
}

export default function FeedMedia({ media }: FeedMediaProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const bgColors = useDominantColors(media);

  if (!media || media.length === 0) return null;

  const totalCount = media.length;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % totalCount);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + totalCount) % totalCount);
    }
  };

  return (
    <>
      <div className="mt-3 overflow-hidden rounded-xl border border-border/60">
        {totalCount === 1 && (
          <div
            className="relative aspect-video max-h-[460px] w-full cursor-pointer overflow-hidden group/media"
            style={{ backgroundColor: bgColors[0] || "rgba(120,120,120,0.15)" }}
            onClick={() => setSelectedImageIndex(0)}
          >
            <img
              src={getPreferredMediaUrl(media[0].url)}
              alt="Post image"
              className="h-full w-full object-contain transition-transform duration-500 group-hover/media:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover/media:bg-black/10 flex items-center justify-center">
              <span className="opacity-0 group-hover/media:opacity-100 transition-opacity bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> View Photo
              </span>
            </div>
          </div>
        )}

        {totalCount === 2 && (
          <div className="grid grid-cols-2 gap-1">
            {media.slice(0, 2).map((m, index) => (
              <div
                key={index}
                className="relative aspect-4/3 cursor-pointer overflow-hidden group/media"
                style={{ backgroundColor: bgColors[index] || "rgba(120,120,120,0.15)" }}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={getPreferredMediaUrl(m.url)}
                  alt={`Post image ${index + 1}`}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover/media:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {totalCount === 3 && (
          <div className="grid grid-cols-2 gap-1">
            <div
              className="relative aspect-square sm:aspect-auto sm:row-span-2 cursor-pointer overflow-hidden group/media"
              style={{ backgroundColor: bgColors[0] || "rgba(120,120,120,0.15)" }}
              onClick={() => setSelectedImageIndex(0)}
            >
              <img
                src={getPreferredMediaUrl(media[0].url)}
                alt="Post image 1"
                className="h-full w-full object-contain transition-transform duration-500 group-hover/media:scale-105"
                loading="lazy"
              />
            </div>
            <div className="grid grid-rows-2 gap-1">
              {media.slice(1, 3).map((m, index) => (
                <div
                  key={index + 1}
                  className="relative aspect-4/3 cursor-pointer overflow-hidden group/media"
                  style={{ backgroundColor: bgColors[index + 1] || "rgba(120,120,120,0.15)" }}
                  onClick={() => setSelectedImageIndex(index + 1)}
                >
                  <img
                    src={getPreferredMediaUrl(m.url)}
                    alt={`Post image ${index + 2}`}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover/media:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {totalCount >= 4 && (
          <div className="grid grid-cols-2 gap-1">
            {media.slice(0, 4).map((m, index) => (
              <div
                key={index}
                className="relative aspect-4/3 cursor-pointer overflow-hidden group/media"
                style={{ backgroundColor: bgColors[index] || "rgba(120,120,120,0.15)" }}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={getPreferredMediaUrl(m.url)}
                  alt={`Post image ${index + 1}`}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover/media:scale-105"
                  loading="lazy"
                />
                {index === 3 && totalCount > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-xs text-white">
                    <span className="text-2xl font-bold">+{totalCount - 4}</span>
                    <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider">
                      More Photos
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Preview Dialog */}
      <Dialog
        open={selectedImageIndex !== null}
        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
      >
        <DialogContent
          className="max-w-4xl p-2 bg-black/95 border-border/20 text-white overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <div className="relative flex flex-col items-center justify-center min-h-[50vh] max-h-[85vh]">
            {selectedImageIndex !== null && (
              <img
                src={getPreferredMediaUrl(media[selectedImageIndex].url)}
                alt={`Preview ${selectedImageIndex + 1}`}
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              />
            )}

            {totalCount > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/30 text-white h-10 w-10 backdrop-blur-xs"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/30 text-white h-10 w-10 backdrop-blur-xs"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-full font-medium">
                  {(selectedImageIndex ?? 0) + 1} / {totalCount}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
