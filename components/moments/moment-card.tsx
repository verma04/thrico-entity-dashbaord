"use client";

import React from "react";
import { Video, Play, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Moment } from "@/graphql/actions/moments";
import { cn } from "@/lib/utils";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";

interface MomentCardProps {
  moment: Moment;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export const MomentCard: React.FC<MomentCardProps> = ({
  moment,
  onClick,
  onDelete,
}) => {
  const singularName = useModuleStore((state) => state.momentSingularName);
  const isPublished = moment?.status === "PUBLISHED";
  const creatorName =
    `${moment?.owner?.firstName ?? ""} ${moment?.owner?.lastName ?? ""}`.trim() ||
    "Unknown";
  const initials = creatorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden bg-zinc-950 cursor-pointer ring-1 ring-white/5 transition-all duration-300 hover:ring-white/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-0.5"
    >
      {/* Thumbnail Area */}
      <div className="aspect-9/16 relative overflow-hidden">
        {moment?.thumbnailUrl ? (
          <img
            src={getPreferredMediaUrl(moment.thumbnailUrl)}
            alt={moment?.caption ?? singularName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 gap-2">
            <Video className="h-8 w-8 text-zinc-700" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">
              No Thumbnail
            </span>
          </div>
        )}

        {/* Dark gradient overlay — always visible at bottom */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

        {/* Hover play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="h-11 w-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
            <Play className="h-4 w-4 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Status pill — top left */}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border",
              isPublished
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border-amber-500/30",
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                isPublished ? "bg-emerald-400" : "bg-amber-400",
              )}
            />
            {isPublished ? "Live" : "Draft"}
          </span>
        </div>

        {/* Action menu — top right */}
        <div
          className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/60 hover:text-white"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-52 p-1.5 rounded-xl border border-zinc-200/80 shadow-xl bg-white animate-in zoom-in-95 slide-in-from-top-1 duration-150"
            >
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                onClick={() => onDelete(moment?.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete {singularName.toLowerCase()}
              </button>
            </PopoverContent>
          </Popover>
        </div>

        {/* Bottom info bar — overlaid on image */}
        <div className="absolute bottom-0 inset-x-0 p-3">
          {/* Creator avatar + name */}
          {!moment?.owner ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 rounded-full border border-border/60">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                  EN
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-semibold text-white/90 leading-none truncate">
                  Entity
                </span>
              </div>
            </div>
          ) : (
            <UserProfileHoverCard user={moment.owner}>
              <div
                className="flex items-center gap-2 cursor-pointer group/creator"
                onClick={(e) => e.stopPropagation()}
              >
                <Avatar className="h-6 w-6 rounded-full border border-border/60">
                  <AvatarImage
                    src={
                      moment.owner.avatar
                        ? moment.owner.avatar.startsWith("http")
                          ? moment.owner.avatar
                          : `${process.env.NEXT_PUBLIC_CDN_URL}/${moment.owner.avatar}`
                        : ""
                    }
                    alt={`${moment.owner.firstName} ${moment.owner.lastName}`}
                  />
                  <AvatarFallback className="text-[10px] bg-muted text-black">
                    {moment.owner.firstName?.charAt(0)}
                    {moment.owner.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-semibold text-white/90 leading-none truncate group-hover/creator:text-white transition-colors">
                    {moment.owner.firstName} {moment.owner.lastName}
                  </span>
                </div>
              </div>
            </UserProfileHoverCard>
          )}
        </div>
      </div>

      {/* Caption below image */}
      {moment?.caption && (
        <div className="px-3 py-2.5 border-t border-white/5">
          <p className="text-[11px] font-medium text-zinc-400 line-clamp-1 leading-snug group-hover:text-zinc-300 transition-colors">
            {moment.caption}
          </p>
        </div>
      )}
    </div>
  );
};
