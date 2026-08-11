import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaqItem } from "./faq-types";

interface FaqRowProps {
  faq: FaqItem;
  onEdit: () => void;
  onDelete: () => void;
}

export const FaqRow = ({ faq, onEdit, onDelete }: FaqRowProps) => (
  <div className="group relative flex items-start gap-4 p-4 transition-all duration-300 rounded-[16px] border border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-1">
        <h4 className="text-[14px] font-semibold tracking-tight text-zinc-900 leading-snug">
          {faq.question}
        </h4>
        <div className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-[9px] font-bold tracking-wider uppercase border border-zinc-200/50">
          ID: {faq.id.split("-")[1]?.substring(0, 4) || "X-00"}
        </div>
      </div>
      <div
        className="text-[13px] text-zinc-400 font-medium line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity"
        dangerouslySetInnerHTML={{
          __html: faq.answer.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
        }}
      />
    </div>

    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
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
