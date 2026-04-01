"use client";

import React, { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TemplateBuilder from "@/components/email/template-builder";
import { useGetEmailTemplate } from "@/graphql/actions/email";
import {
  RefreshCw, ArrowLeft, Sparkles, LayoutTemplate, Plus,
  FileText, Mail, Bell, Briefcase, Users, Calendar,
  Star, ShoppingCart, ChevronRight, Check, Zap,
} from "lucide-react";
import { STARTER_TEMPLATES } from "@/lib/email-templates";
import { cn } from "@/lib/utils";

// Map our chooser key → actual STARTER_TEMPLATES key
const STARTER_KEY_MAP: Record<string, keyof typeof STARTER_TEMPLATES> = {
  welcome:        "WELCOME",
  newsletter:     "NEWSLETTER",
  event_reminder: "EVENT",
  community_digest: "NEWSLETTER", // re-use newsletter layout
  announcement:   "ANNOUNCEMENT",
  notification:   "ANNOUNCEMENT",
  re_engagement:  "WELCOME",      // re-use welcome layout
  promotional:    "ANNOUNCEMENT",
  survey_followup:"NEWSLETTER",
  job_alert:      "WELCOME",
};

// ─── Starter Template Gallery ────────────────────────────────────────────────
interface StarterEntry {
  key: string;
  label: string;
  description: string;
  category: string;
  gradient: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

const STARTERS: StarterEntry[] = [
  {
    key: "blank",
    label: "Blank Template",
    description: "Start from scratch with a clean canvas",
    category: "General",
    gradient: "from-slate-100 to-slate-200",
    icon: <Plus size={24} className="text-slate-400" />,
  },
  {
    key: "welcome",
    label: "Welcome Email",
    description: "Greet new members with a warm introduction and next steps",
    category: "Onboarding",
    gradient: "from-blue-400 to-indigo-600",
    icon: <Mail size={24} className="text-white" />,
    badge: "Popular",
    badgeColor: "bg-blue-500",
  },
  {
    key: "event_reminder",
    label: "Event Reminder",
    description: "Remind attendees 24 hours before their event",
    category: "Events",
    gradient: "from-violet-400 to-purple-600",
    icon: <Calendar size={24} className="text-white" />,
  },
  {
    key: "newsletter",
    label: "Monthly Newsletter",
    description: "Curated digest of top platform activity and highlights",
    category: "Newsletter",
    gradient: "from-emerald-400 to-teal-600",
    icon: <FileText size={24} className="text-white" />,
    badge: "Popular",
    badgeColor: "bg-emerald-500",
  },
  {
    key: "job_alert",
    label: "Job Match Alert",
    description: "Notify candidates about relevant job openings",
    category: "Jobs",
    gradient: "from-amber-400 to-orange-500",
    icon: <Briefcase size={24} className="text-white" />,
  },
  {
    key: "community_digest",
    label: "Community Digest",
    description: "Weekly highlights from top communities",
    category: "Communities",
    gradient: "from-cyan-400 to-sky-600",
    icon: <Users size={24} className="text-white" />,
  },
  {
    key: "re_engagement",
    label: "Re-engagement",
    description: "Win back inactive members with a personal message",
    category: "Marketing",
    gradient: "from-rose-400 to-pink-600",
    icon: <Zap size={24} className="text-white" />,
    badge: "New",
    badgeColor: "bg-rose-500",
  },
  {
    key: "promotional",
    label: "Promotional Offer",
    description: "Announce deals, launches, or limited-time shop offers",
    category: "Shop",
    gradient: "from-fuchsia-400 to-purple-600",
    icon: <ShoppingCart size={24} className="text-white" />,
  },
  {
    key: "survey_followup",
    label: "Survey Follow-up",
    description: "Thank users and share survey results",
    category: "Surveys",
    gradient: "from-yellow-400 to-amber-500",
    icon: <Star size={24} className="text-white" />,
  },
  {
    key: "notification",
    label: "Notification Email",
    description: "Simple transactional notification for platform events",
    category: "Transactional",
    gradient: "from-slate-500 to-slate-700",
    icon: <Bell size={24} className="text-white" />,
  },
];

const CATEGORIES = ["All", "Onboarding", "Events", "Newsletter", "Jobs", "Communities", "Marketing", "Shop", "Surveys", "Transactional"];

// ─── Thumbnail mini-preview ───────────────────────────────────────────────────
function TemplateThumbnail({ starter, selected }: { starter: StarterEntry; selected: boolean }) {
  const isBlank = starter.key === "blank";
  return (
    <div className={cn(
      "relative w-full aspect-3/2 rounded-xl overflow-hidden transition-all",
      selected ? "ring-2 ring-[#5B6CFF] ring-offset-2" : "",
    )}>
      {isBlank ? (
        <div className="absolute inset-0 bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
          <Plus size={20} className="text-slate-300" />
          <span className="text-[10px] font-semibold text-slate-300">Blank Canvas</span>
        </div>
      ) : (
        <>
          {/* Gradient header */}
          <div className={cn("absolute inset-x-0 top-0 h-[38%] bg-linear-to-br flex items-center justify-center", starter.gradient)}>
            <div className="opacity-80">{starter.icon}</div>
          </div>
          {/* Body lines */}
          <div className="absolute inset-x-0 bottom-0 bg-white p-2 flex flex-col gap-1" style={{ height: "65%" }}>
            <div className="h-2 bg-slate-200 rounded-full w-2/3" />
            <div className="h-1.5 bg-slate-100 rounded-full w-full" />
            <div className="h-1.5 bg-slate-100 rounded-full w-5/6" />
            <div className="h-1.5 bg-slate-100 rounded-full w-3/4" />
            <div className="mt-auto flex justify-center">
              <div className="h-4 w-20 bg-slate-200 rounded-full" />
            </div>
          </div>
        </>
      )}

      {/* Badge */}
      {starter.badge && (
        <div className={cn("absolute top-2 right-2 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full", starter.badgeColor)}>
          {starter.badge}
        </div>
      )}

      {/* Selected tick */}
      {selected && (
        <div className="absolute top-2 left-2 h-5 w-5 rounded-full bg-[#5B6CFF] flex items-center justify-center">
          <Check size={10} className="text-white" />
        </div>
      )}
    </div>
  );
}

// ─── Chooser screen ───────────────────────────────────────────────────────────
function TemplateChooser({ onSelect }: { onSelect: (key: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [category, setCategory] = useState("All");

  const filtered = STARTERS.filter((s) =>
    category === "All" || s.category === category
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-8 py-4 bg-white border-b border-slate-200 shrink-0">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-[#5B6CFF] transition-colors"
        >
          <ArrowLeft size={13} /> Back
        </button>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex items-center gap-2">
          <LayoutTemplate size={14} className="text-[#5B6CFF]" />
          <span className="text-[13px] font-bold text-slate-800">Create Email Template</span>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => {
            if (selected) onSelect(selected);
            else onSelect("blank");
          }}
          disabled={false}
          className={cn(
            "flex items-center gap-2 h-9 px-5 rounded-xl text-[13px] font-bold transition-all",
            selected
              ? "bg-[#5B6CFF] hover:bg-[#4a5ce8] text-white shadow-md shadow-[#5B6CFF]/20"
              : "bg-slate-900 hover:bg-slate-800 text-white",
          )}
        >
          {selected ? (
            <>Use This Template <ChevronRight size={14} /></>
          ) : (
            <>Start from Scratch <Plus size={13} /></>
          )}
        </button>
      </div>

      {/* Hero */}
      <div className="px-8 pt-10 pb-6 max-w-5xl mx-auto w-full">
        <div className="flex items-start gap-3 mb-2">
          <div className="h-9 w-9 rounded-xl bg-[#5B6CFF]/10 flex items-center justify-center shrink-0">
            <Sparkles size={17} className="text-[#5B6CFF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Start with a template</h1>
            <p className="text-sm text-slate-500 mt-1">Choose a pre-built design to get started faster, or build from scratch.</p>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="px-8 pb-4 max-w-5xl mx-auto w-full">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all",
                category === cat
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 px-8 pb-12 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((starter) => (
            <button
              key={starter.key}
              onClick={() => setSelected(starter.key === selected ? null : starter.key)}
              className={cn(
                "text-left rounded-2xl border-2 p-3 transition-all hover:shadow-md",
                selected === starter.key
                  ? "border-[#5B6CFF] bg-indigo-50/50 shadow-md shadow-[#5B6CFF]/10"
                  : "border-slate-200 bg-white hover:border-slate-300",
              )}
            >
              <TemplateThumbnail starter={starter} selected={selected === starter.key} />
              <div className="mt-3 px-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-[12px] font-bold text-slate-800 flex-1 leading-tight">{starter.label}</p>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{starter.description}</p>
                <span className="inline-block mt-2 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {starter.category}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Empty category state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <LayoutTemplate size={32} className="text-slate-200 mb-3" />
            <p className="text-slate-500 font-medium">No templates in this category yet</p>
            <button onClick={() => setCategory("All")} className="mt-3 text-[#5B6CFF] text-sm font-semibold hover:underline">
              View all templates
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page entry point ─────────────────────────────────────────────────────────
function CreateTemplateContent() {
  const searchParams = useSearchParams();
  const id   = searchParams.get("id");
  const type = searchParams.get("type");

  const [chosenStarter, setChosenStarter] = useState<string | null>(
    // If we arrived via a type param or edit id, skip chooser
    id || type ? (type ?? "blank") : null
  );

  const { data, loading } = useGetEmailTemplate(id || "");

  const initialData = useMemo(() => {
    if (id && data?.getEmailTemplate) return data.getEmailTemplate;
    const starterKey = chosenStarter ?? type;
    if (starterKey && starterKey !== "blank") {
      // Map chooser key → STARTER_TEMPLATES key (handle both our keys and direct type param)
      const mappedKey = (STARTER_KEY_MAP[starterKey] ??
        (starterKey.toUpperCase() as keyof typeof STARTER_TEMPLATES));
      const starter = STARTER_TEMPLATES[mappedKey];
      if (starter) {
        return {
          id: "",
          name: starter.name,
          subject: starter.subject,
          json: JSON.stringify(starter.blocks),
          html: "",
          updatedAt: new Date().toISOString(),
        };
      }
    }
    return undefined;
  }, [id, data, type, chosenStarter]);

  // Loading for edit mode
  if (id && loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" strokeWidth={1.5} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Loading template…
          </p>
        </div>
      </div>
    );
  }

  // Show chooser if no starter selected yet (new template only)
  if (!id && !chosenStarter) {
    return <TemplateChooser onSelect={setChosenStarter} />;
  }

  return <TemplateBuilder id={id || undefined} initialData={initialData} />;
}

export default function CreateTemplatePage() {
  return (
    <Suspense fallback={
      <div className="h-full w-full flex items-center justify-center bg-slate-50">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" strokeWidth={1.5} />
      </div>
    }>
      <CreateTemplateContent />
    </Suspense>
  );
}
