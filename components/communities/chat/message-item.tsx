"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Smile,
  MessageSquare,
  Pencil,
  Trash2,
  MoreHorizontal,
  Check,
  X,
  Bookmark,
  Forward,
  Pin,
  Copy,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ChatMessage, ChatUser, Reaction } from "./chat-mock-data";
import { CURRENT_USER_ID } from "./chat-mock-data";
import EmojiPicker from "./emoji-picker";

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

// Consistent avatar colors based on user id
const AVATAR_COLORS = [
  "bg-rose-500/15 text-rose-700",
  "bg-blue-500/15 text-blue-700",
  "bg-emerald-500/15 text-emerald-700",
  "bg-violet-500/15 text-violet-700",
  "bg-amber-500/15 text-amber-700",
  "bg-cyan-500/15 text-cyan-700",
  "bg-pink-500/15 text-pink-700",
  "bg-teal-500/15 text-teal-700",
];

function getAvatarColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── Component ────────────────────────────────────────────────
interface MessageItemProps {
  message: ChatMessage;
  user: ChatUser;
  isGrouped: boolean; // If true, hide avatar/name (consecutive same-user)
  onReact: (messageId: string, emoji: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onDelete: (messageId: string) => void;
  onOpenThread: (messageId: string) => void;
}

export default function MessageItem({
  message,
  user,
  isGrouped,
  onReact,
  onEdit,
  onDelete,
  onOpenThread,
}: MessageItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const isOwn = message.userId === CURRENT_USER_ID;

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      editRef.current.selectionStart = editRef.current.value.length;
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    const trimmed = editContent.trim();
    if (trimmed && trimmed !== message.content) {
      onEdit(message.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  if (message.isDeleted) return null;

  return (
    <div
      className={cn(
        "group relative px-5 py-0.5 transition-colors duration-100",
        isHovered && "bg-[#f8f8f8] dark:bg-muted/30",
        isGrouped ? "mt-0" : "mt-2"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover action toolbar — floats above message */}
      {isHovered && !isEditing && (
        <div className="absolute -top-4 right-6 z-20 flex items-center bg-background border border-border/70 rounded-lg shadow-sm overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
          <EmojiPicker
            onSelect={(emoji) => onReact(message.id, emoji)}
            side="top"
            align="center"
          >
            <button className="p-1.5 hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors">
              <Smile className="h-4 w-4" />
            </button>
          </EmojiPicker>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onOpenThread(message.id)}
                className="p-1.5 hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Reply in thread</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1.5 hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors">
                <Bookmark className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Save</TooltipContent>
          </Tooltip>

          {isOwn && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Edit message</TooltipContent>
            </Tooltip>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Copy text
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pin className="mr-2 h-4 w-4" />
                Pin to channel
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Forward className="mr-2 h-4 w-4" />
                Forward message
              </DropdownMenuItem>
              {isOwn && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(message.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete message
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Message content */}
      <div className={cn("flex gap-3", isGrouped && "pl-12")}>
        {/* Avatar (shown only for first message in a group) */}
        {!isGrouped && (
          <Avatar className="h-9 w-9 mt-0.5 shrink-0">
            <AvatarFallback
              className={cn(
                "text-xs font-bold",
                getAvatarColor(user.id)
              )}
            >
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        )}

        <div className="flex-1 min-w-0">
          {/* Name + Timestamp (shown only for first in group) */}
          {!isGrouped && (
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-[13px] font-bold text-foreground hover:underline cursor-pointer">
                {user.name}
              </span>
              <span className="text-[11px] text-muted-foreground/60 font-medium">
                {formatTime(message.timestamp)}
              </span>
            </div>
          )}

          {/* Message body or edit mode */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                ref={editRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleEditKeyDown}
                className="w-full p-2.5 text-sm bg-background border border-primary/30 rounded-lg outline-none resize-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 leading-relaxed"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-[#007a5a] text-white rounded-md hover:bg-[#148567] transition-colors"
                >
                  <Check className="h-3 w-3" />
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/60 transition-colors"
                >
                  Cancel
                </button>
                <span className="text-[10px] text-muted-foreground/50 ml-auto">
                  Escape to cancel • Enter to save
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Grouped message shows time on hover */}
              <div className="relative">
                {isGrouped && isHovered && (
                  <span className="absolute -left-12 top-0.5 text-[10px] text-muted-foreground/50 font-medium w-10 text-right">
                    {formatTime(message.timestamp)}
                  </span>
                )}
                <p className="text-[15px] text-foreground/90 leading-[1.46] break-words whitespace-pre-wrap">
                  {message.content}
                  {message.edited && (
                    <span className="text-[11px] text-muted-foreground/40 ml-1.5">
                      (edited)
                    </span>
                  )}
                </p>
              </div>

              {/* Reactions */}
              {message.reactions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {message.reactions.map((reaction, idx) => (
                    <ReactionChip
                      key={`${reaction.emoji}-${idx}`}
                      reaction={reaction}
                      onToggle={() =>
                        onReact(message.id, reaction.emoji)
                      }
                    />
                  ))}
                  <EmojiPicker
                    onSelect={(emoji) =>
                      onReact(message.id, emoji)
                    }
                    side="top"
                    align="start"
                  >
                    <button className="h-6 px-2 rounded-full border border-border/50 border-dashed text-muted-foreground/40 hover:border-border hover:text-muted-foreground hover:bg-muted/30 transition-colors flex items-center justify-center">
                      <Smile className="h-3 w-3" />
                    </button>
                  </EmojiPicker>
                </div>
              )}

              {/* Thread indicator */}
              {message.threadCount && message.threadCount > 0 && (
                <button
                  onClick={() => onOpenThread(message.id)}
                  className="flex items-center gap-1.5 mt-1.5 text-[12px] font-semibold text-[#1264a3] hover:underline"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {message.threadCount}{" "}
                  {message.threadCount === 1 ? "reply" : "replies"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Reaction Chip ────────────────────────────────────────────
function ReactionChip({
  reaction,
  onToggle,
}: {
  reaction: Reaction;
  onToggle: () => void;
}) {
  const isActive = reaction.users.includes(CURRENT_USER_ID);

  return (
    <button
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1 h-6 px-2 rounded-full border text-xs font-medium transition-all duration-150 active:scale-95",
        isActive
          ? "bg-[#1264a3]/10 border-[#1264a3]/30 text-[#1264a3]"
          : "bg-muted/40 border-border/50 text-foreground/70 hover:bg-muted/60 hover:border-border"
      )}
    >
      <span className="text-sm leading-none">{reaction.emoji}</span>
      <span className="tabular-nums">{reaction.users.length}</span>
    </button>
  );
}
