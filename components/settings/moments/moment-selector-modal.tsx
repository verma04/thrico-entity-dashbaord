/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetAllMoments, Moment } from "@/graphql/actions/moments";
import {
  Search,
  Check,
  Video,
  Play,
  X,
  Loader2,
  ArrowUp,
  ArrowDown,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MomentSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  selectedMomentIds: string[];
  onConfirm: (selectedIds: string[]) => void;
}

export function MomentSelectorModal({
  isOpen,
  onClose,
  title = "Curate Moments",
  description = "Select and order the moments that should appear in this collection.",
  selectedMomentIds = [],
  onConfirm,
}: MomentSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSelectedIds, setCurrentSelectedIds] = useState<string[]>(
    () => [...selectedMomentIds]
  );

  // Sync internal state whenever modal opens or selectedMomentIds prop changes
  React.useEffect(() => {
    if (isOpen) {
      setCurrentSelectedIds([...selectedMomentIds]);
      setSearchQuery("");
    }
  }, [isOpen, selectedMomentIds]);

  const { data, loading } = useGetAllMoments({
    pagination: { page: 1, limit: 100 },
  });

  const allMoments: Moment[] = useMemo(() => {
    return data?.getAllMoments?.data || [];
  }, [data]);

  const filteredMoments = useMemo(() => {
    if (!searchQuery.trim()) return allMoments;
    const q = searchQuery.toLowerCase().trim();
    return allMoments.filter((m) => {
      const matchCaption = m.caption?.toLowerCase().includes(q);
      const matchCreator =
        m.owner?.firstName?.toLowerCase().includes(q) ||
        m.owner?.lastName?.toLowerCase().includes(q);
      return matchCaption || matchCreator;
    });
  }, [allMoments, searchQuery]);

  const momentsMap = useMemo(() => {
    const map = new Map<string, Moment>();
    allMoments.forEach((m) => map.set(m.id, m));
    return map;
  }, [allMoments]);

  const handleToggleSelect = (momentId: string) => {
    setCurrentSelectedIds((prev) => {
      if (prev.includes(momentId)) {
        return prev.filter((id) => id !== momentId);
      } else {
        return [...prev, momentId];
      }
    });
  };

  const handleRemoveSelected = (momentId: string) => {
    setCurrentSelectedIds((prev) => prev.filter((id) => id !== momentId));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setCurrentSelectedIds((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= currentSelectedIds.length - 1) return;
    setCurrentSelectedIds((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleSave = () => {
    onConfirm(currentSelectedIds);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-[95vw] h-[85vh] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-xl border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-[#e1e3e5] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900/60 shrink-0">
          <div className="flex items-center justify-between pr-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-[16px] font-semibold text-[#303030] dark:text-zinc-100">
                  {title}
                </DialogTitle>
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                >
                  {currentSelectedIds.length} Selected
                </Badge>
              </div>
              <DialogDescription className="text-[12px] text-[#616161] dark:text-zinc-400">
                {description}
              </DialogDescription>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8c9196]" />
            <input
              type="text"
              placeholder="Search moments by caption or creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-[12.5px] h-8 pl-8 pr-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 placeholder:text-[#8c9196] focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </DialogHeader>

        {/* Selected Tray (if any selected) */}
        {currentSelectedIds.length > 0 && (
          <div className="p-3 border-b border-[#e1e3e5] dark:border-zinc-800 bg-indigo-50/30 dark:bg-indigo-950/20 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <Layers className="h-3 w-3" />
                Curated Sequence ({currentSelectedIds.length})
              </span>
              <button
                type="button"
                onClick={() => setCurrentSelectedIds([])}
                className="text-[10.5px] text-[#8c9196] hover:text-red-600 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {currentSelectedIds.map((id, idx) => {
                const moment = momentsMap.get(id);
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-[5px] bg-white dark:bg-zinc-800 border border-indigo-200 dark:border-indigo-900/50 shadow-2xs shrink-0 max-w-[220px]"
                  >
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 w-3.5 text-center shrink-0">
                      #{idx + 1}
                    </span>
                    {moment?.thumbnailUrl ? (
                      <img
                        src={moment.thumbnailUrl}
                        alt=""
                        className="h-6 w-6 rounded-[3px] object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-[3px] bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center shrink-0 text-[#8c9196]">
                        <Video className="h-3 w-3" />
                      </div>
                    )}
                    <span className="text-[11px] truncate text-[#303030] dark:text-zinc-200 flex-1">
                      {moment?.caption || "Untitled Moment"}
                    </span>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        title="Move earlier"
                        className="p-0.5 text-[#8c9196] hover:text-[#303030] disabled:opacity-30"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === currentSelectedIds.length - 1}
                        title="Move later"
                        className="p-0.5 text-[#8c9196] hover:text-[#303030] disabled:opacity-30"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSelected(id)}
                        title="Remove"
                        className="p-0.5 text-[#8c9196] hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Moments List Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-[#8c9196]">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              <span className="text-[12px]">Loading community moments...</span>
            </div>
          ) : filteredMoments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-1.5 text-center">
              <Video className="h-8 w-8 text-[#8c9196]/50 mb-1" />
              <span className="text-[13px] font-medium text-[#303030] dark:text-zinc-200">
                No moments found
              </span>
              <p className="text-[11px] text-[#8c9196] max-w-sm">
                {searchQuery
                  ? "Try searching with a different term."
                  : "No moments have been published yet in this entity."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredMoments.map((moment) => {
                const isSelected = currentSelectedIds.includes(moment.id);
                const selectedIndex = currentSelectedIds.indexOf(moment.id);

                return (
                  <div
                    key={moment.id}
                    onClick={() => handleToggleSelect(moment.id)}
                    className={cn(
                      "group relative rounded-[8px] border p-2.5 cursor-pointer transition-all flex flex-col justify-between gap-2.5",
                      isSelected
                        ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-500 shadow-xs"
                        : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-800/60 hover:border-indigo-300 dark:hover:border-zinc-700"
                    )}
                  >
                    {/* Media Thumbnail & Badge */}
                    <div className="relative aspect-video rounded-[6px] overflow-hidden bg-zinc-900 flex items-center justify-center">
                      {moment.thumbnailUrl ? (
                        <img
                          src={moment.thumbnailUrl}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-zinc-500 flex flex-col items-center gap-1">
                          <Play className="h-6 w-6 fill-zinc-500/40" />
                          <span className="text-[10px]">No thumbnail</span>
                        </div>
                      )}

                      {/* Selection Indicator Badge */}
                      <div className="absolute top-1.5 right-1.5">
                        {isSelected ? (
                          <div className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                            <Check className="h-3 w-3 stroke-[3px]" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-white/80 bg-black/30 backdrop-blur-xs group-hover:border-indigo-400 transition-colors" />
                        )}
                      </div>

                      {/* Index Badge */}
                      {isSelected && (
                        <div className="absolute bottom-1.5 left-1.5">
                          <Badge className="text-[9px] px-1.5 py-0 rounded-[3px] bg-indigo-900/90 text-white font-bold backdrop-blur-xs border-0">
                            #{selectedIndex + 1}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <p className="text-[12px] font-medium text-[#303030] dark:text-zinc-100 line-clamp-2 leading-[16px]">
                        {moment.caption || "Untitled Moment"}
                      </p>
                      <div className="flex items-center justify-between text-[10.5px] text-[#8c9196] pt-1 border-t border-[#e1e3e5]/50 dark:border-zinc-700/50">
                        <span className="truncate">
                          {moment.owner
                            ? `${moment.owner.firstName || ""} ${moment.owner.lastName || ""}`.trim() || "Member"
                            : "Member"}
                        </span>
                        <span>{moment.totalViews || 0} views</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-3 sm:p-4 border-t border-[#e1e3e5] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900/60 flex items-center justify-between sm:justify-between shrink-0">
          <span className="text-[11.5px] text-[#616161] dark:text-zinc-400">
            {currentSelectedIds.length} moment{currentSelectedIds.length === 1 ? "" : "s"} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-[12px] h-8"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="text-[12px] h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              Confirm Selection ({currentSelectedIds.length})
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
