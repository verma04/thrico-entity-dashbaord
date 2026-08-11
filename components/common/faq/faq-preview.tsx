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
    <div className="mt-4 ring-1 ring-zinc-200/50 rounded-[24px] bg-zinc-50/50 p-6 shadow-sm min-h-[400px]">
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          FAQ
        </h2>
        {faqItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <Search size={32} strokeWidth={1.5} className="mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Preview Data Empty
            </p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqItems.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-zinc-200/50 bg-white rounded-[12px] px-4 overflow-hidden transition-all data-[state=open]:ring-2 data-[state=open]:ring-zinc-100"
              >
                <AccordionTrigger className="text-[14px] font-medium text-zinc-900 hover:no-underline py-4 text-left leading-tight group">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[13px] text-zinc-500 font-medium leading-relaxed pb-5">
                  <div
                    className="prose prose-sm prose-zinc max-w-none"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};
