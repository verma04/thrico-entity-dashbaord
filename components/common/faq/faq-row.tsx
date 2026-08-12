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

export const FaqRow = ({ faq, onEdit, onDelete, onMoveUp, onMoveDown, dragHandleProps }: FaqRowProps) => (
  <div className="group relative flex items-start gap-4 p-4 transition-all duration-300 rounded-[16px] border border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm">
    <div 
      className="flex items-center text-zinc-300 cursor-grab active:cursor-grabbing hover:text-zinc-500 mt-1"
      {...dragHandleProps}
    >
      <GripVertical size={16} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-1">
        <h4 className="text-[14px] font-semibold tracking-tight text-zinc-900 leading-snug">
          {faq.question}
        </h4>
      </div>
      <div
        className="text-[13px] text-zinc-400 font-medium line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity"
        dangerouslySetInnerHTML={{
          __html: faq.answer.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
        }}
      />
    </div>

    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
      {onMoveUp && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onMoveUp}
          className="h-8 w-8 text-zinc-400 hover:text-zinc-900"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
      {onMoveDown && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onMoveDown}
          className="h-8 w-8 text-zinc-400 hover:text-zinc-900"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="h-8 w-8 text-zinc-400 hover:text-zinc-900"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="h-8 w-8 text-zinc-400 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
