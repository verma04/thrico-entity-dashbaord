"use client";

import React from "react";
import { Mail, Sparkles, User, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmailTemplate } from "./types";

interface ContentRefinementProps {
  subject: string;
  setSubject: (subject: string) => void;
  selectedTemplate: EmailTemplate | null;
}

const MERGE_TAGS = [
  { label: "{{name}}", desc: "Full Name" },
  { label: "{{first_name}}", desc: "First Name" },
  { label: "{{email}}", desc: "Email Address" },
];

export function ContentRefinement({
  subject,
  setSubject,
  selectedTemplate,
}: ContentRefinementProps) {
  const insertMergeTag = (tag: string) => {
    setSubject(`${subject} ${tag}`.trim());
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="pb-2 border-b border-border/60">
        <h2 className="text-[14px] font-bold text-foreground">
          Subject Line &amp; Preview
        </h2>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Craft an engaging subject line and review the email client appearance.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 p-5 shadow-2xs space-y-5">
        {/* Subject input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-semibold text-foreground">
              Campaign Subject Line <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                Insert tag:
              </span>
              {MERGE_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => insertMergeTag(tag.label)}
                  title={tag.desc}
                  className="px-1.5 py-0.5 rounded-[3px] bg-[#f1f1f2] dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[10.5px] font-mono text-[#303030] dark:text-zinc-200 border border-border/60 transition-colors cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. 🚀 Welcome to our weekly community highlights!"
              className="h-[34px] rounded-[4px] border-[#8a8a8a] dark:border-zinc-700 text-[13px] font-medium bg-background text-foreground"
            />
          </div>

          <p className="text-[11px] text-muted-foreground">
            Clear, compelling subject lines achieve higher open rates and deliverability.
          </p>
        </div>

        {/* Live email preview */}
        {selectedTemplate && (
          <div className="space-y-2.5 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                Live Inbox Preview
              </label>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 font-medium rounded-[3px] text-muted-foreground"
              >
                Template: {selectedTemplate.name}
              </Badge>
            </div>

            <div className="border border-[#d2d5d9] dark:border-zinc-800 rounded-[8px] overflow-hidden shadow-2xs bg-white dark:bg-zinc-950">
              {/* Mail client toolbar */}
              <div className="bg-[#f6f6f7] dark:bg-zinc-900 px-3.5 py-2.5 border-b border-border/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="text-[11px] font-medium text-muted-foreground truncate max-w-xs">
                  {subject || "Subject Preview"}
                </div>
                <div className="text-[10px] text-muted-foreground shrink-0 font-mono">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              {/* Sender & Recipient Bar */}
              <div className="px-4 py-3 border-b border-border/50 bg-white dark:bg-zinc-900/50 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-bold text-foreground truncate">
                    {subject || (
                      <span className="text-muted-foreground font-normal italic">
                        [No subject line specified yet]
                      </span>
                    )}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[11px] text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">From:</span>{" "}
                    noreply (via Thrico Broadcast)
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">To:</span>{" "}
                    recipient@example.com
                  </div>
                </div>
              </div>

              {/* HTML Sandbox */}
              <div
                className="w-full bg-white dark:bg-zinc-900 overflow-hidden"
                style={{ height: "380px" }}
              >
                <iframe
                  srcDoc={
                    selectedTemplate.html
                      ? selectedTemplate.html
                          .replace(
                            /<title>[^<]*<\/title>/i,
                            `<title>${subject || selectedTemplate.name}</title>`
                          )
                          .replace(
                            /\{\{subject\}\}/gi,
                            subject || selectedTemplate.subject || ""
                          )
                      : "<div style='padding:40px;color:#94a3b8;font-family:sans-serif;text-align:center'>No HTML content in this template.</div>"
                  }
                  title="Template Preview"
                  className="w-full h-full border-none bg-white"
                  sandbox="allow-popups allow-popups-to-escape-sandbox"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

