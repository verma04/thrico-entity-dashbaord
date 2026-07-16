"use client";

import React from "react";
import { User, PlayCircle, X } from "lucide-react";
import { Moment } from "@/graphql/actions/moments";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface MomentPreviewDialogProps {
  moment: Moment | null;
  onClose: () => void;
}

export const MomentPreviewDialog: React.FC<MomentPreviewDialogProps> = ({
  moment,
  onClose,
}) => {
  const creatorName =
    `${moment?.owner?.firstName ?? ""} ${moment?.owner?.lastName ?? ""}`.trim() ||
    "Unknown Creator";
  const initials = creatorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dialog open={!!moment} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 overflow-hidden bg-black border-none rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] [&>button]:hidden">
        {moment && (
          <div className="relative flex flex-col">
            {/* Video / Thumbnail area */}
            <div className="relative aspect-9/16 bg-zinc-950 overflow-hidden">
              {moment.videoUrl ? (
                <video
                  src={getPreferredMediaUrl(moment.videoUrl)}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-zinc-900">
                  <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <PlayCircle className="h-8 w-8 text-white/20" />
                  </div>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
                    No Video Source
                  </p>
                </div>
              )}

              {/* Top gradient header */}
              <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-black/80 to-transparent pointer-events-none" />

              {/* Creator info & close button */}
              <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-[11px] font-bold text-white shadow-lg">
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <DialogTitle className="text-white text-[11px] font-bold leading-none mb-0.5">
                      {creatorName}
                    </DialogTitle>
                    {moment.caption && (
                      <p className="text-white/50 text-[10px] leading-none line-clamp-1 max-w-[160px]">
                        {moment.caption}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
