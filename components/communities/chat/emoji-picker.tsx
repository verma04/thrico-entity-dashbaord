"use client";

import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EMOJI_CATEGORIES: Record<string, string[]> = {
  "Frequently Used": [
    "👍", "👎", "❤️", "🔥", "🎉", "😂", "😊", "🚀",
    "💯", "✅", "👀", "🙌", "💪", "🤔", "😅", "👋",
    "🎯", "📝", "⭐", "💡", "🤝", "✨", "🏆", "🥳",
  ],
  "Smileys": [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂",
    "🙂", "😊", "😇", "🥰", "😍", "🤩", "😘", "😜",
    "🤪", "😎", "🤓", "🧐", "😤", "😡", "🥺", "😢",
    "😭", "😱", "😳", "🤯", "🥴", "😴", "🤮", "🤧",
  ],
  "Gestures": [
    "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "✌️",
    "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇",
    "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏",
    "🙌", "👐", "🤲", "🤝", "🙏", "💪", "🫶", "❤️",
  ],
  "Objects": [
    "💻", "📱", "⌨️", "🖥️", "💡", "📝", "📌", "📎",
    "🔗", "📊", "📈", "📉", "🗂️", "📁", "🗄️", "🔒",
    "🔑", "🛠️", "⚙️", "🧪", "🔬", "🎨", "🎵", "📷",
    "🎬", "📡", "🔔", "📣", "📢", "💬", "💭", "🏷️",
  ],
  "Symbols": [
    "✅", "❌", "⭕", "❗", "❓", "‼️", "⚡", "🔥",
    "💥", "💫", "⭐", "🌟", "✨", "🎯", "🏆", "🥇",
    "🏅", "🎖️", "🚀", "🛡️", "⚔️", "🔔", "📌", "🔖",
    "❤️", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎",
  ],
};

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export default function EmojiPicker({
  onSelect,
  children,
  side = "top",
  align = "start",
}: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Frequently Used");

  const categories = useMemo(() => Object.keys(EMOJI_CATEGORIES), []);

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return EMOJI_CATEGORIES[activeCategory] || [];
    const query = search.toLowerCase();
    const all = Object.values(EMOJI_CATEGORIES).flat();
    // Basic search — in a real app you'd map emoji to keywords
    return [...new Set(all)].filter(() => query.length > 0).slice(0, 40);
  }, [search, activeCategory]);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        className="w-[340px] p-0 rounded-xl shadow-2xl border border-border/60 bg-popover overflow-hidden"
        sideOffset={8}
      >
        {/* Search */}
        <div className="p-2.5 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search emoji..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 text-sm bg-muted/50 border border-border/40 rounded-lg outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-colors placeholder:text-muted-foreground/50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        {!search && (
          <div className="flex gap-0.5 px-2 py-1.5 border-b border-border/30 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors",
                  activeCategory === cat
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Emoji grid */}
        <div className="p-2 h-[200px] overflow-y-auto">
          <div className="grid grid-cols-8 gap-0.5">
            {(search ? filteredEmojis : EMOJI_CATEGORIES[activeCategory] || []).map(
              (emoji, i) => (
                <button
                  key={`${emoji}-${i}`}
                  onClick={() => handleSelect(emoji)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-xl hover:bg-muted/80 active:scale-90 transition-all"
                >
                  {emoji}
                </button>
              )
            )}
          </div>
          {search && filteredEmojis.length === 0 && (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No emoji found
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
