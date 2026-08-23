"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { X, Plus } from "lucide-react";

export interface TagInputFieldProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInputField({
  tags,
  onChange,
  placeholder = "Add tags",
  className,
}: TagInputFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const startAdding = () => {
    setIsAdding(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <div
      className={cn(
        "min-h-[40px] p-1.5 rounded-[8px] border border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 flex flex-wrap items-center gap-1.5 focus-within:border-[#005bd3] dark:focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-[#005bd3] transition-all duration-150",
        className
      )}
      onClick={() => {
        if (!isAdding && tags.length === 0) {
          startAdding();
        }
      }}
    >
      {/* Active Tags */}
      {tags.map((tag, idx) => (
        <span
          key={`${tag}-${idx}`}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] bg-[#e4e5e7] dark:bg-zinc-800 text-[13px] font-medium text-[#303030] dark:text-zinc-200 border border-[#d2d5d9] dark:border-zinc-700 select-none animate-in fade-in-50 zoom-in-95 duration-100"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(idx);
            }}
            className="h-3.5 w-3.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-[#616161] hover:text-[#303030] dark:hover:text-white transition-colors cursor-pointer"
            aria-label={`Remove tag ${tag}`}
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}

      {/* Adding Input or + Add Tag Button */}
      {isAdding || tags.length === 0 ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) {
              handleAddTag(inputValue);
            }
            setIsAdding(false);
          }}
          placeholder={tags.length === 0 ? placeholder : "Type and press Enter"}
          className="flex-1 min-w-[100px] h-[26px] px-1 text-[13.5px] text-[#303030] dark:text-zinc-100 bg-transparent outline-none placeholder:text-[#8c9196]"
        />
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            startAdding();
          }}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] text-[12.5px] font-medium text-[#005bd3] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          <span>Add tag</span>
        </button>
      )}
    </div>
  );
}
