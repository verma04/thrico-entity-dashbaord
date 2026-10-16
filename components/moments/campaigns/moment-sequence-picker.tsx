/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Film,
  Play,
  Trash2,
  Plus,
  Video,
  CheckCircle2,
} from "lucide-react";
import { Moment, useGetAllMoments } from "@/graphql/actions/moments";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { cn } from "@/lib/utils";

interface MomentSequencePickerProps {
  label: string;
  description: string;
  type: "INTRO" | "OUTRO";
  selectedMomentId: string | null;
  onSelectMoment: (moment: Moment | null) => void;
  disabled?: boolean;
}

function MomentThumbnailItem({ moment }: { moment: Moment }) {
  const [imgError, setImgError] = useState(false);
  const thumbUrl = !imgError && moment.thumbnailUrl ? getPreferredMediaUrl(moment.thumbnailUrl) : null;
  const videoUrl = moment.videoUrl ? getPreferredMediaUrl(moment.videoUrl) : null;

  if (thumbUrl) {
    return (
      <img
        src={thumbUrl}
        alt={moment.caption || "Moment"}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
      />
    );
  }

  if (videoUrl) {
    return (
      <video
        src={videoUrl}
        preload="metadata"
        muted
        playsInline
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 pointer-events-none"
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-indigo-950/40 text-zinc-500 gap-1">
      <Video className="h-6 w-6 text-indigo-400/60" />
      <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500">Video</span>
    </div>
  );
}

export function MomentSequencePicker({
  label,
  description,
  type,
  selectedMomentId,
  onSelectMoment,
  disabled = false,
}: MomentSequencePickerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, loading } = useGetAllMoments({
    pagination: { page: 1, limit: 50 },
  });

  const moments = data?.getAllMoments?.data || [];
  const selectedMoment = moments.find((m) => m.id === selectedMomentId);

  const filteredMoments = moments.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.caption?.toLowerCase().includes(q) ||
      m.owner?.firstName?.toLowerCase().includes(q) ||
      m.owner?.lastName?.toLowerCase().includes(q)
    );
  });

  const badgeColor =
    type === "INTRO"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";

  return (
    <div className="rounded-xl border border-border/70 p-4 bg-card/60 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("text-[10px] font-bold tracking-wider uppercase", badgeColor)}>
            {type} CLIP
          </Badge>
          <span className="text-xs font-semibold text-foreground">{label}</span>
        </div>
        {selectedMoment && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSelectMoment(null)}
            className="h-7 px-2 text-[11px] text-muted-foreground hover:text-destructive cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Remove
          </Button>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground leading-snug">
        {description}
      </p>

      {selectedMoment ? (
        <div className="group relative flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/30 transition-colors">
          <div className="relative h-16 w-12 rounded-md overflow-hidden bg-zinc-900 shrink-0 border border-border/40">
            <MomentThumbnailItem moment={selectedMoment} />
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
            >
              <Play className="h-4 w-4 fill-white" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-medium text-foreground truncate">
              {selectedMoment.caption || "Untitled Moment"}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
              {selectedMoment.owner && (
                <span>
                  {selectedMoment.owner.firstName} {selectedMoment.owner.lastName}
                </span>
              )}
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Selected
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="h-7 text-xs shrink-0 cursor-pointer"
          >
            Change
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setModalOpen(true)}
          disabled={disabled}
          className="w-full h-11 border-dashed border-border/80 hover:border-foreground/40 hover:bg-muted/30 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Select {type === "INTRO" ? "Intro" : "Outro"} Video from Moments
        </Button>
      )}

      {/* Moment Selection Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6">
          <DialogHeader className="pb-3 border-b border-border/60">
            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
              <Film className="h-4 w-4 text-indigo-500" />
              Select {type === "INTRO" ? "Intro" : "Outro"} Video
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Choose an existing published Moment from your community to use as the {type.toLowerCase()} clip.
            </DialogDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search moments by caption or creator..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-3 space-y-2 min-h-[300px]">
            {loading ? (
              <div className="py-16 text-center text-xs text-muted-foreground">
                Loading community moments...
              </div>
            ) : filteredMoments.length === 0 ? (
              <div className="py-16 text-center text-xs text-muted-foreground">
                No published moments found.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredMoments.map((moment) => {
                  const isSelected = moment.id === selectedMomentId;
                  return (
                    <div
                      key={moment.id}
                      onClick={() => {
                        onSelectMoment(moment);
                        setModalOpen(false);
                      }}
                      className={cn(
                        "group relative rounded-xl border overflow-hidden cursor-pointer transition-all p-2 bg-card hover:border-indigo-500/60 shadow-2xs flex flex-col gap-2",
                        isSelected
                          ? "border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-500/5"
                          : "border-border/60"
                      )}
                    >
                      <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-zinc-950">
                        <MomentThumbnailItem moment={moment} />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1 shadow-sm z-20">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-foreground line-clamp-1">
                          {moment.caption || "Untitled Moment"}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {moment.owner ? `${moment.owner.firstName} ${moment.owner.lastName}` : "Community"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Preview Modal */}
      {selectedMoment?.videoUrl && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-sm p-3 bg-black border-zinc-800">
            <video
              src={getPreferredMediaUrl(selectedMoment.videoUrl)}
              controls
              autoPlay
              className="w-full rounded-lg aspect-[9/16] object-cover bg-black"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
