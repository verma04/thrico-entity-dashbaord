"use client";

import React, { useState } from "react";
import {
  Check, Plus, ExternalLink, Search, X,
  ChevronRight, Mail, Eye, LayoutTemplate,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock template data ────────────────────────────────────────────────────────
export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  previewColor: string;   // gradient/colour for the thumbnail
  lastEdited: string;
  tags: string[];
}

const TEMPLATE_CATEGORIES = ["All", "Welcome", "Promotional", "Newsletter", "Transactional", "Re-engagement"];

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "t-welcome-1",
    name: "Welcome — Community",
    category: "Welcome",
    description: "Greet new community members with a warm introduction",
    previewColor: "from-blue-400 to-indigo-600",
    lastEdited: "2 days ago",
    tags: ["Communities", "Onboarding"],
  },
  {
    id: "t-welcome-2",
    name: "Welcome — Platform",
    category: "Welcome",
    description: "Generic welcome email for new platform sign-ups",
    previewColor: "from-violet-400 to-purple-600",
    lastEdited: "1 week ago",
    tags: ["General"],
  },
  {
    id: "t-event-reminder",
    name: "Event Reminder",
    category: "Transactional",
    description: "Remind attendees 24 hours before their event",
    previewColor: "from-amber-400 to-orange-500",
    lastEdited: "3 days ago",
    tags: ["Events", "Reminder"],
  },
  {
    id: "t-job-alert",
    name: "Job Match Alert",
    category: "Transactional",
    description: "Notify candidates about matching job openings",
    previewColor: "from-yellow-400 to-amber-600",
    lastEdited: "5 days ago",
    tags: ["Jobs"],
  },
  {
    id: "t-newsletter",
    name: "Monthly Newsletter",
    category: "Newsletter",
    description: "Curated monthly digest of top platform activity",
    previewColor: "from-emerald-400 to-teal-600",
    lastEdited: "12 days ago",
    tags: ["Newsletter"],
  },
  {
    id: "t-re-engage",
    name: "Re-engagement Campaign",
    category: "Re-engagement",
    description: "Win back inactive members with a personal touch",
    previewColor: "from-rose-400 to-pink-600",
    lastEdited: "1 month ago",
    tags: ["Re-engagement"],
  },
  {
    id: "t-promo",
    name: "Promotional Offer",
    category: "Promotional",
    description: "Announce deals, launches, or limited-time offers",
    previewColor: "from-fuchsia-400 to-purple-600",
    lastEdited: "3 days ago",
    tags: ["Shop", "Promotional"],
  },
  {
    id: "t-survey-followup",
    name: "Survey Follow-up",
    category: "Transactional",
    description: "Thank users and share results after a survey",
    previewColor: "from-cyan-400 to-sky-600",
    lastEdited: "1 week ago",
    tags: ["Surveys"],
  },
];

// ─── Tiny template thumbnail ──────────────────────────────────────────────────
function TemplateThumbnail({
  template,
  size = "md",
}: {
  template: EmailTemplate;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-16" : "h-24";
  return (
    <div className={cn("w-full rounded-lg overflow-hidden relative", h)}>
      {/* Gradient top bar (simulating email header) */}
      <div className={cn("absolute inset-x-0 top-0 h-1/3 bg-linear-to-br", template.previewColor)} />
      {/* Body lines (simulating email content) */}
      <div className="absolute inset-x-0 bottom-0 bg-white border border-slate-100 rounded-b-lg p-1.5 flex flex-col gap-1"
        style={{ height: "70%" }}>
        <div className="h-1.5 bg-slate-200 rounded-full w-2/3" />
        <div className="h-1 bg-slate-100 rounded-full w-full" />
        <div className="h-1 bg-slate-100 rounded-full w-5/6" />
        <div className="h-1 bg-slate-100 rounded-full w-3/4" />
        <div className="mt-auto h-3 bg-slate-200 rounded w-1/2 self-center" />
      </div>
    </div>
  );
}

// ─── Main TemplatePicker component ────────────────────────────────────────────
interface TemplatePickerProps {
  value: string | null;
  onChange: (template: EmailTemplate | null) => void;
  /** If truthy, opens create flow in new tab */
  createHref?: string;
}

export function TemplatePicker({ value, onChange, createHref = "/email/templates/create" }: TemplatePickerProps) {
  const [open, setOpen]         = useState(false);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const [hovered, setHovered]   = useState<string | null>(null);

  const selected = EMAIL_TEMPLATES.find((t) => t.id === value) ?? null;

  const filtered = EMAIL_TEMPLATES.filter((t) => {
    const matchCat = category === "All" || t.category === category;
    const matchQ   = !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
                     t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchQ;
  });

  // ── Collapsed: show selected template or empty CTA ───────────────────────
  if (!open) {
    return (
      <div className="space-y-2">
        {selected ? (
          /* Selected state */
          <div className="rounded-xl border border-[#5B6CFF]/30 bg-indigo-50 overflow-hidden">
            <div className="px-3 pt-3">
              <TemplateThumbnail template={selected} size="sm" />
            </div>
            <div className="p-3">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-slate-800 truncate">{selected.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-2">{selected.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button onClick={() => setOpen(true)}
                    className="text-[10px] font-semibold text-[#5B6CFF] hover:text-[#4a5ce8] flex items-center gap-1 whitespace-nowrap">
                    Change
                  </button>
                  <button onClick={() => onChange(null)}
                    className="text-[10px] font-semibold text-rose-400 hover:text-rose-600 flex items-center gap-1 whitespace-nowrap">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <button onClick={() => setOpen(true)}
            className="w-full flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#5B6CFF]/40 hover:bg-indigo-50/30 transition-all group">
            <div className="h-10 w-10 rounded-xl bg-slate-100 group-hover:bg-[#5B6CFF]/10 flex items-center justify-center transition-all">
              <LayoutTemplate size={18} className="text-slate-400 group-hover:text-[#5B6CFF] transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-[12px] font-semibold text-slate-700 group-hover:text-[#5B6CFF] transition-colors">Choose a template</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Pick from your library or create a new one</p>
            </div>
          </button>
        )}

        {/* Create new link */}
        <a
          href={createHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[11px] text-[#5B6CFF] hover:text-[#4a5ce8] font-semibold px-1 transition-colors group"
        >
          <Plus size={12} />
          Create new template
          <ExternalLink size={10} className="opacity-50 group-hover:opacity-100 transition-opacity ml-auto" />
        </a>
      </div>
    );
  }

  // ── Open: template gallery picker ─────────────────────────────────────────
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      {/* Picker header */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-slate-100">
        <Mail size={13} className="text-[#5B6CFF] shrink-0" />
        <span className="text-[12px] font-bold text-slate-700 flex-1">Choose Template</span>
        <button onClick={() => setOpen(false)}
          className="h-6 w-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
          <X size={13} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pt-2.5">
        <div className="relative">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates…"
            autoFocus
            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 pl-7 pr-3 py-1.5 focus:outline-none focus:border-[#5B6CFF]/50"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-1 overflow-x-auto px-3 py-2 no-scrollbar">
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={cn(
              "shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all whitespace-nowrap",
              category === cat
                ? "bg-[#5B6CFF] border-[#5B6CFF] text-white"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300",
            )}>
            {cat}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="px-3 pb-3 max-h-[320px] overflow-y-auto space-y-2">
        {filtered.length === 0 ? (
          <p className="text-[11px] text-slate-400 text-center py-6">No templates match your search.</p>
        ) : (
          filtered.map((t) => {
            const isSelected = t.id === value;
            const isHovered  = hovered === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { onChange(t); setOpen(false); }}
                onMouseEnter={() => setHovered(t.id)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                  isSelected
                    ? "border-[#5B6CFF] bg-indigo-50 ring-1 ring-[#5B6CFF]/20"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                {/* Mini thumbnail */}
                <div className="w-[52px] shrink-0">
                  <TemplateThumbnail template={t} size="sm" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-semibold text-slate-800 truncate">{t.name}</p>
                    {isSelected && <Check size={11} className="text-[#5B6CFF] shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-2">{t.description}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      {t.category}
                    </span>
                    <span className="text-[9px] text-slate-400">{t.lastEdited}</span>
                  </div>
                </div>

                {/* Hover action */}
                {(isHovered || isSelected) && (
                  <div className="shrink-0">
                    {isSelected ? (
                      <div className="h-6 w-6 rounded-full bg-[#5B6CFF] flex items-center justify-center">
                        <Check size={11} className="text-white" />
                      </div>
                    ) : (
                      <ChevronRight size={13} className="text-slate-400" />
                    )}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Footer: create new */}
      <div className="border-t border-slate-100 px-3 py-2.5">
        <a
          href={createHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[11px] text-[#5B6CFF] hover:text-[#4a5ce8] font-semibold transition-colors group"
        >
          <Plus size={12} />
          Create a new template
          <ExternalLink size={10} className="opacity-50 group-hover:opacity-100 transition-opacity ml-auto" />
        </a>
      </div>
    </div>
  );
}
