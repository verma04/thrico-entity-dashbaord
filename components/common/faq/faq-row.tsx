"use client";

import React from "react";
import { Edit, Trash2, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaqItem } from "./faq-types";

interface FaqRowProps {
  faq: FaqItem;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  dragHandleProps?: any;
}

export const FaqRow = ({
  faq,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  dragHandleProps,
}: FaqRowProps) => (
  <div className="group relative flex items-start gap-3 p-3.5 transition-all duration-200 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs">
    <div
      className="flex items-center text-zinc-400 cursor-grab active:cursor-grabbing hover:text-zinc-600 dark:hover:text-zinc-300 mt-1"
      {...dragHandleProps}
    >
      <GripVertical size={15} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-xs font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug">
        {faq.question}
      </h4>
      <div
        className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium line-clamp-1 mt-0.5"
        dangerouslySetInnerHTML={{
          __html: faq.answer.replace(/<[^>]*>/g, "").substring(0, 90) + "...",
        }}
      />
    </div>

    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all shrink-0">
      {onMoveUp && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMoveUp}
          className="h-7 w-7 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </Button>
      )}
      {onMoveDown && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMoveDown}
          className="h-7 w-7 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="h-7 w-7 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <Edit className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="h-7 w-7 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  </div>
);
