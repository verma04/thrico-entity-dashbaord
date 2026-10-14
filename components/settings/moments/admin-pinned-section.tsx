"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Pin, Eye, Plus, Film, ArrowUp, ArrowDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { Moment } from "@/graphql/actions/moments";

interface AdminPinnedSectionProps {
  pinnedMomentIds: string[];
  momentsByIdMap: Map<string, Moment>;
  onPreviewPinned: () => void;
  onOpenCuratePinned: () => void;
  onMovePinned: (index: number, direction: "up" | "down") => void;
  onRemovePinned: (id: string) => void;
}

export const AdminPinnedSection: React.FC<AdminPinnedSectionProps> = ({
  pinnedMomentIds,
  momentsByIdMap,
  onPreviewPinned,
  onOpenCuratePinned,
  onMovePinned,
  onRemovePinned,
}) => {
  return (
    <PolarisFormCard
      step={2}
      title="Admin Pinned Moments"
      description="Feature standout moments at the very top of the Discover feed. Members will see these clips highlighted with a pinned indicator."
      badge="Featured"
      badgeVariant="indigo"
      icon={Pin}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
              Featured Discover Stream Clips
            </span>
            <p className="text-[11px] text-[#616161] dark:text-zinc-400">
              {pinnedMomentIds.length} moment{pinnedMomentIds.length === 1 ? "" : "s"} currently pinned.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPreviewPinned}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Eye className="h-3 w-3" />
              <span>Preview Pinned</span>
            </button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onOpenCuratePinned}
              className="text-[12px] h-7 px-2.5 flex items-center gap-1.5"
            >
              <Plus className="h-3 w-3" />
              <span>Curate Moments</span>
            </Button>
          </div>
        </div>

        {pinnedMomentIds.length === 0 ? (
          <div className="p-4 rounded-[6px] border border-dashed border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 text-center">
            <Pin className="h-5 w-5 mx-auto text-[#8c9196] mb-1 opacity-70" />
            <p className="text-[12px] font-medium text-[#616161] dark:text-zinc-400">
              No moments currently pinned
            </p>
            <p className="text-[10.5px] text-[#8c9196]">
              Click &quot;Curate Moments&quot; above to feature clips on Discover.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {pinnedMomentIds.map((id, idx) => {
              const moment = momentsByIdMap.get(id);
              return (
                <div
                  key={id}
                  className="flex items-center justify-between p-2 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-800/80 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 w-4 text-center shrink-0">
                      #{idx + 1}
                    </span>
                    {moment?.thumbnailUrl ? (
                      <img
                        src={moment.thumbnailUrl}
                        alt=""
                        className="h-9 w-9 rounded-[4px] object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-[4px] bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center shrink-0 text-[#8c9196]">
                        <Film className="h-4 w-4" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-[#303030] dark:text-zinc-100 truncate">
                        {moment?.caption || "Untitled Moment"}
                      </p>
                      <span className="text-[10.5px] text-[#8c9196]">
                        {moment?.owner
                          ? `${moment.owner.firstName || ""} ${moment.owner.lastName || ""}`.trim() || "Member"
                          : "Member"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => onMovePinned(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 rounded text-[#616161] hover:text-[#303030] dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMovePinned(idx, "down")}
                      disabled={idx === pinnedMomentIds.length - 1}
                      className="p-1 rounded text-[#616161] hover:text-[#303030] dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemovePinned(id)}
                      className="p-1 rounded text-[#8c9196] hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      title="Unpin"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PolarisFormCard>
  );
};
