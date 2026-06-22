"use client";

import React from "react";
import { X, Hash } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ChatMessage, ChatUser } from "./chat-mock-data";
import MessageComposer from "./message-composer";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────
function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-rose-500/15 text-rose-700",
  "bg-blue-500/15 text-blue-700",
  "bg-emerald-500/15 text-emerald-700",
  "bg-violet-500/15 text-violet-700",
  "bg-amber-500/15 text-amber-700",
  "bg-cyan-500/15 text-cyan-700",
];

function getAvatarColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── Component ────────────────────────────────────────────────
interface ThreadPanelProps {
  parentMessage: ChatMessage;
  users: Record<string, ChatUser>;
  onClose: () => void;
  onSendReply: (content: string) => void;
  channelName: string;
}

export default function ThreadPanel({
  parentMessage,
  users,
  onClose,
  onSendReply,
  channelName,
}: ThreadPanelProps) {
  const parentUser = users[parentMessage.userId];
  const replies = parentMessage.threadMessages || [];

  return (
    <div className="w-[380px] min-w-[380px] border-l border-border/50 flex flex-col h-full bg-background">
      {/* Header */}
      <div className="h-[52px] flex items-center justify-between px-4 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-foreground">Thread</h3>
          <span className="text-[12px] text-muted-foreground font-medium flex items-center gap-1">
            <Hash className="h-3 w-3" />
            {channelName}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Parent message */}
      <div className="px-4 py-4 border-b border-border/30">
        <div className="flex gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback
              className={cn(
                "text-xs font-bold",
                getAvatarColor(parentMessage.userId)
              )}
            >
              {parentUser ? getInitials(parentUser.name) : "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-[13px] font-bold text-foreground">
                {parentUser?.name || "Unknown"}
              </span>
              <span className="text-[11px] text-muted-foreground/60 font-medium">
                {formatTime(parentMessage.timestamp)}
              </span>
            </div>
            <p className="text-[15px] text-foreground/90 leading-[1.46] break-words whitespace-pre-wrap">
              {parentMessage.content}
            </p>
          </div>
        </div>
      </div>

      {/* Reply count */}
      {replies.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="flex-1 h-px bg-border/40" />
          <span className="text-[11px] font-semibold text-muted-foreground/60">
            {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </span>
          <div className="flex-1 h-px bg-border/40" />
        </div>
      )}

      {/* Thread replies */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {replies.map((reply) => {
          const replyUser = users[reply.userId];
          if (!replyUser) return null;

          return (
            <div key={reply.id} className="flex gap-3 py-2 group">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                  className={cn(
                    "text-[10px] font-bold",
                    getAvatarColor(reply.userId)
                  )}
                >
                  {getInitials(replyUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-[13px] font-bold text-foreground">
                    {replyUser.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground/60 font-medium">
                    {formatTime(reply.timestamp)}
                  </span>
                </div>
                <p className="text-[14px] text-foreground/85 leading-[1.46] break-words whitespace-pre-wrap">
                  {reply.content}
                </p>

                {/* Thread reply reactions */}
                {reply.reactions && reply.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {reply.reactions.map((reaction, idx) => (
                      <span
                        key={`${reaction.emoji}-${idx}`}
                        className="inline-flex items-center gap-1 h-5 px-1.5 rounded-full bg-muted/40 border border-border/50 text-[11px]"
                      >
                        <span>{reaction.emoji}</span>
                        <span className="tabular-nums text-muted-foreground">
                          {reaction.users.length}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Thread composer */}
      <MessageComposer
        channelName={channelName}
        onSend={onSendReply}
        placeholder={`Reply to thread...`}
        compact
      />
    </div>
  );
}
