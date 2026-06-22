"use client";

import React, { useRef, useEffect } from "react";
import type { ChatMessage, ChatUser } from "./chat-mock-data";
import MessageItem from "./message-item";

// ─── Helpers ──────────────────────────────────────────────────
function formatDateSeparator(ts: number): string {
  const date = new Date(ts);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function isSameDay(ts1: number, ts2: number): boolean {
  const d1 = new Date(ts1);
  const d2 = new Date(ts2);
  return d1.toDateString() === d2.toDateString();
}

// Check if messages are close enough in time to be grouped (< 5 min apart)
function isWithinGroupWindow(ts1: number, ts2: number): boolean {
  return Math.abs(ts2 - ts1) < 5 * 60 * 1000;
}

// ─── Component ────────────────────────────────────────────────
interface MessageListProps {
  messages: ChatMessage[];
  users: Record<string, ChatUser>;
  onReact: (messageId: string, emoji: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onDelete: (messageId: string) => void;
  onOpenThread: (messageId: string) => void;
}

export default function MessageList({
  messages,
  users,
  onReact,
  onEdit,
  onDelete,
  onOpenThread,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overscroll-contain"
    >
      <div className="py-4">
        {messages.map((msg, idx) => {
          if (msg.isDeleted) return null;

          const prevMsg = idx > 0 ? messages[idx - 1] : null;
          const showDateSep =
            !prevMsg || !isSameDay(prevMsg.timestamp, msg.timestamp);
          const isGrouped =
            !showDateSep &&
            prevMsg !== null &&
            prevMsg.userId === msg.userId &&
            isWithinGroupWindow(prevMsg.timestamp, msg.timestamp) &&
            !prevMsg.isDeleted;

          const user = users[msg.userId];
          if (!user) return null;

          return (
            <React.Fragment key={msg.id}>
              {/* Date separator */}
              {showDateSep && (
                <div className="flex items-center gap-3 px-5 my-5">
                  <div className="flex-1 h-px bg-border/50" />
                  <span className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wider bg-background px-3 py-1 rounded-full border border-border/50">
                    {formatDateSeparator(msg.timestamp)}
                  </span>
                  <div className="flex-1 h-px bg-border/50" />
                </div>
              )}

              <MessageItem
                message={msg}
                user={user}
                isGrouped={isGrouped}
                onReact={onReact}
                onEdit={onEdit}
                onDelete={onDelete}
                onOpenThread={onOpenThread}
              />
            </React.Fragment>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
