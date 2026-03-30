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
        <h2 className="text-base font-semibold text-slate-900">Email Subject</h2>
        <p className="text-sm text-slate-500 mt-0.5">Set the subject line for your campaign.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-500">Subject line</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Welcome to our community!"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
          />
          <p className="text-xs text-slate-400">
            Use <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-xs">{"{{name}}"}</code> to personalize with recipient names.
          </p>
        </div>

        {selectedTemplate && (
          <div className="space-y-3 pt-4 border-t border-slate-50">
            <label className="text-xs font-medium text-slate-500">Template preview</label>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{selectedTemplate.name}</span>
                </div>
                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Selected
                </span>
              </div>
              <div className="bg-white w-full overflow-hidden" style={{ height: "420px" }}>
                <iframe
                  srcDoc={selectedTemplate.html}
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
