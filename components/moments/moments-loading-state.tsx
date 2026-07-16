"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export const MomentsLoadingState = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden bg-zinc-100 animate-pulse"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="aspect-9/16 bg-zinc-200/80" />
          <div className="px-3 py-2.5 border-t border-zinc-200/60 space-y-1.5">
            <div className="h-2.5 bg-zinc-200 rounded-full w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
};
