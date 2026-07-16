"use client";

import React from "react";
import { Mail } from "lucide-react";
import { EmailTemplate } from "./types";

interface ContentRefinementProps {
  subject: string;
  setSubject: (subject: string) => void;
  selectedTemplate: EmailTemplate | null;
}

export function ContentRefinement({ subject, setSubject, selectedTemplate }: ContentRefinementProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground">Email Subject</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Set the subject line for your campaign.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Subject line</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Welcome to our community!"
            className="w-full h-12 px-4 rounded-xl border border-border/50 bg-muted/30 text-sm font-medium text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
          />
          <p className="text-xs text-muted-foreground/80">
            Use <code className="bg-muted/50 text-foreground/90 px-1.5 py-0.5 rounded text-xs">{"{{name}}"}</code> to personalize with recipient names.
          </p>
        </div>

        {selectedTemplate && (
          <div className="space-y-3 pt-4 border-t border-slate-50">
            <label className="text-xs font-medium text-muted-foreground">Template preview</label>
            <div className="border border-border/50 rounded-2xl overflow-hidden">
              {/* Realistic email-client header — updates live as subject changes */}
              <div className="bg-card px-4 pt-4 pb-3 border-b border-border/50">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[13px] font-semibold text-foreground truncate">
                        {subject || <span className="text-muted-foreground/80 font-normal italic">No subject yet…</span>}
                      </span>
                      <span className="text-[11px] text-muted-foreground/80 shrink-0">
                        {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      From: <span className="font-medium text-foreground/90">noreply · via Thrico</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                      To: <span className="text-muted-foreground">recipient@example.com</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* HTML preview — subject injected live into srcDoc */}
              <div className="bg-card w-full overflow-hidden" style={{ height: "420px" }}>
                <iframe
                  srcDoc={
                    selectedTemplate.html
                      ? selectedTemplate.html
                          // Replace <title> with current subject
                          .replace(/<title>[^<]*<\/title>/i, `<title>${subject || selectedTemplate.name}</title>`)
                          // Replace {{subject}} merge tag
                          .replace(/\{\{subject\}\}/gi, subject || selectedTemplate.subject || "")
                      : "<div style='padding:40px;color:#94a3b8;font-family:sans-serif;text-align:center'>No HTML content</div>"
                  }
                  title="Template Preview"
                  className="w-full h-full border-none"
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
