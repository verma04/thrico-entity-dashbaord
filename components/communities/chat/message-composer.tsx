"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link2,
  Smile,
  Paperclip,
  SendHorizontal,
  AtSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import EmojiPicker from "./emoji-picker";

interface MessageComposerProps {
  channelName: string;
  onSend: (content: string) => void;
  placeholder?: string;
  compact?: boolean;
}

export default function MessageComposer({
  channelName,
  onSend,
  placeholder,
  compact = false,
}: MessageComposerProps) {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setContent("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [content, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const insertEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const formatButtons = [
    { icon: Bold, label: "Bold", key: "bold" },
    { icon: Italic, label: "Italic", key: "italic" },
    { icon: Strikethrough, label: "Strikethrough", key: "strike" },
    { icon: Code, label: "Code", key: "code" },
    { icon: Link2, label: "Link", key: "link" },
  ];

  return (
    <div
      className={cn(
        "mx-4 mb-4 rounded-xl border transition-all duration-200",
        isFocused
          ? "border-primary/40 shadow-[0_0_0_1px_rgba(var(--primary-rgb,59,130,246),0.15)] bg-background"
          : "border-border/60 bg-muted/20 hover:border-border",
        compact && "mx-3 mb-3"
      )}
    >
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder || `Message #${channelName}`}
        rows={1}
        className={cn(
          "w-full resize-none bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 leading-relaxed",
          compact && "px-3 py-2.5 text-[13px]"
        )}
      />

      {/* Bottom toolbar */}
      <div
        className={cn(
          "flex items-center justify-between px-2 pb-2",
          compact && "px-1.5 pb-1.5"
        )}
      >
        {/* Left: formatting buttons */}
        <div className="flex items-center gap-0.5">
          {!compact &&
            formatButtons.map((btn) => (
              <Tooltip key={btn.key}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-1.5 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <btn.icon className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{btn.label}</TooltipContent>
              </Tooltip>
            ))}

          <div className="w-px h-4 bg-border/40 mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="p-1.5 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <AtSign className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Mention</TooltipContent>
          </Tooltip>

          <EmojiPicker onSelect={insertEmoji} side="top" align="start">
            <button
              type="button"
              className="p-1.5 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <Smile className="h-3.5 w-3.5" />
            </button>
          </EmojiPicker>

          {!compact && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="p-1.5 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Right: Send button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleSend}
              disabled={!content.trim()}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                content.trim()
                  ? "bg-[#007a5a] text-white hover:bg-[#148567] shadow-sm active:scale-95"
                  : "bg-muted/40 text-muted-foreground/30 cursor-not-allowed"
              )}
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Send message</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
