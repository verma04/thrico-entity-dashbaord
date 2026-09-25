"use client";

import React from "react";
import { CheckCheck } from "lucide-react";
import type { WhatsAppTemplateComponent } from "./types";

interface WhatsAppTemplatePreviewProps {
  components: WhatsAppTemplateComponent[];
  variables?: Record<string, string>;
  timeString?: string;
  className?: string;
}

export function WhatsAppTemplatePreview({
  components,
  variables = {},
  timeString = "12:00 PM",
  className = "",
}: WhatsAppTemplatePreviewProps) {
  const headerComp = components.find((c) => c.type === "HEADER");
  const bodyComp = components.find((c) => c.type === "BODY");
  const footerComp = components.find((c) => c.type === "FOOTER");
  const buttonComp = components.find((c) => c.type === "BUTTONS");

  // Replaces both {{1}} and {{var_name}}
  const interpolateText = (rawText?: string) => {
    if (!rawText) return "";
    return rawText.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match, varName) => {
      if (variables[varName] !== undefined) {
        return variables[varName];
      }
      return match;
    });
  };

  return (
    <div className={`w-full max-w-sm rounded-2xl bg-[#EFEAE2] dark:bg-zinc-800/80 p-4 shadow-inner ${className}`}>
      <div className="relative rounded-2xl rounded-tl-none bg-white dark:bg-zinc-900 p-3 shadow-md border border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 text-sm">
        {/* HEADER */}
        {headerComp && (
          <div className="font-semibold text-slate-800 dark:text-zinc-200 pb-1.5 border-b border-slate-100 dark:border-zinc-800 mb-2">
            {headerComp.format === "IMAGE" ? (
              <div className="h-32 bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-xs text-slate-400">
                [Header Image Preview]
              </div>
            ) : (
              interpolateText(headerComp.text)
            )}
          </div>
        )}

        {/* BODY */}
        {bodyComp && (
          <div className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-zinc-300">
            {interpolateText(bodyComp.text)}
          </div>
        )}

        {/* FOOTER */}
        {footerComp && footerComp.text && (
          <div className="mt-2 text-[11px] text-slate-400 dark:text-zinc-500">
            {footerComp.text}
          </div>
        )}

        {/* TIMESTAMP & TICKS */}
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-400 dark:text-zinc-500">
          <span>{timeString}</span>
          <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
        </div>
      </div>

      {/* QUICK REPLY / CTA BUTTONS */}
      {buttonComp?.buttons && buttonComp.buttons.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {buttonComp.buttons.map((btn, idx) => (
            <button
              key={idx}
              type="button"
              className="w-full rounded-xl bg-white dark:bg-zinc-900 py-2 text-center text-xs font-semibold text-[#00a884] dark:text-[#25d366] shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition border border-slate-100 dark:border-zinc-800 cursor-pointer"
            >
              {btn.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
