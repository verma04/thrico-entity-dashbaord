"use client";

import React from "react";
import {
  Hash,
  Lock,
  Plus,
  ChevronDown,
  Search,
  PenSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { Channel } from "./chat-mock-data";

interface ChannelSidebarProps {
  channels: Channel[];
  activeChannelId: string;
  onSelectChannel: (channelId: string) => void;
  communityTitle?: string;
}

export default function ChannelSidebar({
  channels,
  activeChannelId,
  onSelectChannel,
  communityTitle,
}: ChannelSidebarProps) {
  const publicChannels = channels.filter((c) => !c.isPrivate);
  const privateChannels = channels.filter((c) => c.isPrivate);

  return (
    <div className="w-[260px] min-w-[260px] flex flex-col h-full bg-[#1a1d21] text-[#cfc3cf] select-none overflow-hidden">
      {/* Workspace header */}
      <div className="h-[52px] flex items-center justify-between px-4 border-b border-white/[0.08] shrink-0">
        <button className="flex items-center gap-1.5 group">
          <h2 className="text-[15px] font-bold text-white truncate max-w-[160px]">
            {communityTitle || "Community"}
          </h2>
          <ChevronDown className="h-3.5 w-3.5 text-white/60 group-hover:text-white transition-colors" />
        </button>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1.5 rounded-md hover:bg-white/[0.08] text-white/60 hover:text-white transition-colors">
              <PenSquare className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>New message</TooltipContent>
        </Tooltip>
      </div>

      {/* Search bar */}
      <div className="px-3 py-2.5 shrink-0">
        <button className="w-full flex items-center gap-2 px-3 py-[6px] rounded-md bg-white/[0.04] border border-white/[0.08] text-white/40 text-[13px] hover:bg-white/[0.06] hover:border-white/[0.12] transition-colors">
          <Search className="h-3.5 w-3.5" />
          Search channels
        </button>
      </div>

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-hide">
        {/* Public Channels */}
        <ChannelSection title="Channels" count={publicChannels.length}>
          {publicChannels.map((channel) => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              isActive={activeChannelId === channel.id}
              onClick={() => onSelectChannel(channel.id)}
            />
          ))}
        </ChannelSection>

        {/* Private Channels */}
        {privateChannels.length > 0 && (
          <ChannelSection title="Private" count={privateChannels.length}>
            {privateChannels.map((channel) => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                isActive={activeChannelId === channel.id}
                onClick={() => onSelectChannel(channel.id)}
                isPrivate
              />
            ))}
          </ChannelSection>
        )}

        {/* Direct Messages placeholder */}
        <ChannelSection title="Direct Messages" count={0}>
          <div className="px-3 py-3 text-[12px] text-white/25 italic">
            No direct messages yet
          </div>
        </ChannelSection>
      </div>

      {/* Add channel button */}
      <div className="px-3 py-3 border-t border-white/[0.06] shrink-0">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors">
          <Plus className="h-4 w-4" />
          Add Channel
        </button>
      </div>
    </div>
  );
}

// ─── Channel Section ──────────────────────────────────────────
function ChannelSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <div className="mt-3 first:mt-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 px-2 py-1 w-full group"
      >
        <ChevronDown
          className={cn(
            "h-3 w-3 text-white/40 transition-transform",
            !expanded && "-rotate-90"
          )}
        />
        <span className="text-[12px] font-semibold uppercase tracking-wider text-white/40 group-hover:text-white/60 transition-colors">
          {title}
        </span>
      </button>
      {expanded && <div className="mt-0.5">{children}</div>}
    </div>
  );
}

// ─── Channel Item ─────────────────────────────────────────────
function ChannelItem({
  channel,
  isActive,
  onClick,
  isPrivate = false,
}: {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
  isPrivate?: boolean;
}) {
  const hasUnread = channel.unreadCount > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-[5px] rounded-md text-[14px] transition-colors relative group",
        isActive
          ? "bg-[#1164a3] text-white"
          : hasUnread
            ? "text-white font-medium hover:bg-white/[0.06]"
            : "text-white/60 hover:bg-white/[0.06] hover:text-white/80"
      )}
    >
      {/* Left accent for active */}
      {isActive && (
        <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-white/50 rounded-r-full" />
      )}

      {isPrivate ? (
        <Lock className="h-3.5 w-3.5 shrink-0 opacity-70" />
      ) : (
        <Hash className="h-3.5 w-3.5 shrink-0 opacity-70" />
      )}

      <span className="truncate flex-1 text-left">{channel.name}</span>

      {hasUnread && !isActive && (
        <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#e8192c] text-white text-[10px] font-bold leading-none">
          {channel.unreadCount}
        </span>
      )}
    </button>
  );
}
