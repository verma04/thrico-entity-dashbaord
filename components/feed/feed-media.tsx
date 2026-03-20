"use client";

import { getPreferredMediaUrl } from "@/lib/media-utils";
import { cn } from "@/lib/utils";

interface FeedMediaProps {
  media: { url: string }[];
}

export default function FeedMedia({ media }: FeedMediaProps) {
  if (!media || media.length === 0) return null;

  const displayCount = media.length;

  return (
    <div className={cn(
      "grid gap-1 mt-4 rounded-2xl overflow-hidden border border-zinc-100",
      displayCount === 1 ? "grid-cols-1" : "grid-cols-2"
    )}>
      {media.slice(0, 4).map((m, index) => (
        <div 
          key={index} 
          className={cn(
            "relative bg-zinc-100 animate-in fade-in duration-500",
            displayCount === 1 ? "pb-[56.25%]" : "pb-[100%]"
          )}
        >
          <img
            src={getPreferredMediaUrl(m.url)}
            alt={`Post media ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
            loading="lazy"
          />
          {index === 3 && displayCount > 4 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-white text-2xl font-black">+{displayCount - 4}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
