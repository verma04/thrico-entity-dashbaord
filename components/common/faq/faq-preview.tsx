"use client";

import React from "react";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaqItem } from "./faq-types";

interface FaqPreviewProps {
  faqItems: FaqItem[];
}

export const FaqPreview = ({ faqItems }: FaqPreviewProps) => {
  return (
    <div className="space-y-3">
      {faqItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
          <Search size={24} strokeWidth={1.5} className="mb-2 opacity-40" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            No entries to preview
          </p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqItems.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 rounded-xl px-3.5 overflow-hidden transition-all shadow-xs"
            >
              <AccordionTrigger className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:no-underline py-3 text-left leading-snug">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed pb-3 pt-1 border-t border-zinc-100 dark:border-zinc-700/60">
                <div
                  className="prose prose-xs dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
