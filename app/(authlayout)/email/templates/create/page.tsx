"use client";

import React, { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TemplateBuilder from "@/components/email/template-builder";
import { useGetEmailTemplate } from "@/graphql/actions/email";
import {
  RefreshCw, ArrowLeft, Sparkles, LayoutTemplate, Plus,
  FileText, Mail, Bell, Briefcase, Users, Calendar,
  Star, ShoppingCart, ChevronRight, Check, Zap, Search,
  MousePointerClick, Eye,
} from "lucide-react";
import { STARTER_TEMPLATES } from "@/lib/email-templates";
import { cn } from "@/lib/utils";

// Map our chooser key → actual STARTER_TEMPLATES key
const STARTER_KEY_MAP: Record<string, keyof typeof STARTER_TEMPLATES> = {
  welcome:          "WELCOME",
  newsletter:       "NEWSLETTER",
  event_reminder:   "EVENT",
  community_digest: "NEWSLETTER",
  announcement:     "ANNOUNCEMENT",
  notification:     "ANNOUNCEMENT",
  re_engagement:    "WELCOME",
  promotional:      "ANNOUNCEMENT",
  survey_followup:  "NEWSLETTER",
  job_alert:        "WELCOME",
};

// ─── Starter Template Gallery ─────────────────────────────────────────────────
interface StarterEntry {
  key: string;
  label: string;
  description: string;
  category: string;
  accentColor: string;        // hex/HSL for thumbnail accent
  headerGradient: string;     // tailwind gradient classes
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: "blue" | "green" | "rose" | "amber";
  featured?: boolean;
  // Thumbnail detail lines
  lines?: Array<{ w: string; opacity?: number }>;
}

const STARTERS: StarterEntry[] = [
  {
    key: "blank",
    label: "Blank Canvas",
    description: "Start completely from scratch with an empty layout",
    category: "All",
    accentColor: "#94a3b8",
    headerGradient: "",
    icon: <Plus size={20} className="text-slate-400" />,
    lines: [],
  },
  {
    key: "welcome",
    label: "Welcome Email",
    description: "Warm onboarding email for new members joining your platform",
    category: "Onboarding",
    accentColor: "#4f46e5",
    headerGradient: "from-blue-500 via-indigo-500 to-violet-600",
    icon: <Mail size={16} className="text-white" />,
    badge: "Popular",
    badgeVariant: "blue",
    featured: true,
    lines: [
      { w: "w-3/5" }, { w: "w-full", opacity: 50 }, { w: "w-4/5", opacity: 50 },
      { w: "w-2/3", opacity: 50 },
    ],
  },
  {
    key: "newsletter",
    label: "Monthly Newsletter",
    description: "Curated digest of top platform activity and highlights",
    category: "Newsletter",
    accentColor: "#10b981",
    headerGradient: "from-emerald-400 via-teal-500 to-cyan-600",
    icon: <FileText size={16} className="text-white" />,
    badge: "Popular",
    badgeVariant: "green",
    featured: true,
    lines: [
      { w: "w-1/2" }, { w: "w-full", opacity: 50 }, { w: "w-full", opacity: 50 },
      { w: "w-3/4", opacity: 50 },
    ],
  },
  {
    key: "event_reminder",
    label: "Event Reminder",
    description: "Remind attendees 24 hours before their upcoming event",
    category: "Events",
    accentColor: "#7c3aed",
    headerGradient: "from-violet-500 via-purple-500 to-fuchsia-600",
    icon: <Calendar size={16} className="text-white" />,
    lines: [
      { w: "w-2/3" }, { w: "w-full", opacity: 50 }, { w: "w-5/6", opacity: 50 },
    ],
  },
  {
    key: "job_alert",
    label: "Job Match Alert",
    description: "Notify candidates about relevant new job openings",
    category: "Jobs",
    accentColor: "#d97706",
    headerGradient: "from-amber-400 via-orange-400 to-orange-500",
    icon: <Briefcase size={16} className="text-white" />,
    lines: [
      { w: "w-3/5" }, { w: "w-full", opacity: 50 }, { w: "w-4/5", opacity: 50 },
      { w: "w-1/2", opacity: 50 },
    ],
  },
  {
    key: "community_digest",
    label: "Community Digest",
    description: "Weekly highlights from your most active communities",
    category: "Communities",
    accentColor: "#0ea5e9",
    headerGradient: "from-cyan-400 via-sky-500 to-blue-600",
    icon: <Users size={16} className="text-white" />,
    lines: [
      { w: "w-1/2" }, { w: "w-full", opacity: 50 }, { w: "w-3/4", opacity: 50 },
    ],
  },
  {
    key: "re_engagement",
    label: "Re-engagement",
    description: "Win back inactive members with a personalized message",
    category: "Marketing",
    accentColor: "#e11d48",
    headerGradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    icon: <Zap size={16} className="text-white" />,
    badge: "New",
    badgeVariant: "rose",
    lines: [
      { w: "w-2/3" }, { w: "w-full", opacity: 50 }, { w: "w-5/6", opacity: 50 },
    ],
  },
  {
    key: "promotional",
    label: "Promotional Offer",
    description: "Announce deals, launches, or limited-time shop offers",
    category: "Shop",
    accentColor: "#a855f7",
    headerGradient: "from-fuchsia-500 via-purple-500 to-violet-600",
    icon: <ShoppingCart size={16} className="text-white" />,
    lines: [
      { w: "w-3/4" }, { w: "w-full", opacity: 50 }, { w: "w-2/3", opacity: 50 },
      { w: "w-full", opacity: 50 },
    ],
  },
  {
    key: "survey_followup",
    label: "Survey Follow-up",
    description: "Thank users and share key results from your survey",
    category: "Surveys",
    accentColor: "#ca8a04",
    headerGradient: "from-yellow-400 via-amber-400 to-orange-400",
    icon: <Star size={16} className="text-white" />,
    lines: [
      { w: "w-1/2" }, { w: "w-full", opacity: 50 }, { w: "w-5/6", opacity: 50 },
    ],
  },
  {
    key: "announcement",
    label: "Announcement",
    description: "Important platform announcements and product updates",
    category: "Marketing",
    accentColor: "#0f766e",
    headerGradient: "from-teal-500 via-emerald-500 to-green-600",
    icon: <Sparkles size={16} className="text-white" />,
    lines: [
      { w: "w-2/3" }, { w: "w-full", opacity: 50 }, { w: "w-3/4", opacity: 50 },
    ],
  },
  {
    key: "notification",
    label: "Notification Email",
    description: "Simple transactional notification for platform events",
    category: "Transactional",
    accentColor: "#475569",
    headerGradient: "from-slate-500 via-slate-600 to-slate-700",
    icon: <Bell size={16} className="text-white" />,
    lines: [
      { w: "w-2/3" }, { w: "w-full", opacity: 50 }, { w: "w-5/6", opacity: 50 },
    ],
  },
];

const SIDEBAR_CATEGORIES = [
  { key: "All", label: "All Templates", icon: <LayoutTemplate size={14} /> },
  { key: "Onboarding", label: "Onboarding", icon: <Mail size={14} /> },
  { key: "Newsletter", label: "Newsletter", icon: <FileText size={14} /> },
  { key: "Events", label: "Events", icon: <Calendar size={14} /> },
  { key: "Jobs", label: "Jobs & Careers", icon: <Briefcase size={14} /> },
  { key: "Communities", label: "Communities", icon: <Users size={14} /> },
  { key: "Marketing", label: "Marketing", icon: <Zap size={14} /> },
  { key: "Shop", label: "Shop & Commerce", icon: <ShoppingCart size={14} /> },
  { key: "Surveys", label: "Surveys", icon: <Star size={14} /> },
  { key: "Transactional", label: "Transactional", icon: <Bell size={14} /> },
];

const BADGE_STYLES: Record<string, string> = {
  blue:  "bg-indigo-100 text-indigo-700 border border-indigo-200",
  green: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  rose:  "bg-rose-100 text-rose-700 border border-rose-200",
  amber: "bg-amber-100 text-amber-700 border border-amber-200",
};

// ─── Rich email thumbnail ─────────────────────────────────────────────────────
function EmailThumbnail({
  starter,
  selected,
  onSelect,
}: {
  starter: StarterEntry;
  selected: boolean;
  onSelect: () => void;
}) {
  const isBlank = starter.key === "blank";

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer",
        "bg-white hover:shadow-lg hover:-translate-y-0.5",
        selected
          ? "border-indigo-500 shadow-md shadow-indigo-100 ring-2 ring-indigo-500/20"
          : "border-slate-200 hover:border-slate-300",
      )}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
    >
      {/* ── Email preview area ── */}
      <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
        {isBlank ? (
          /* Blank card */
          <div className="absolute inset-0 bg-linear-to-b from-slate-50 to-white flex flex-col items-center justify-center gap-3 border-b border-slate-100">
            <div className="h-12 w-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
              <Plus size={20} className="text-slate-400" />
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold text-slate-500">Blank Canvas</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Build from zero</div>
            </div>
          </div>
        ) : (
          /* Realistic email-style preview */
          <div className="absolute inset-0 bg-white flex flex-col border-b border-slate-100 overflow-hidden">
            {/* Email chrome strip */}
            <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-50 border-b border-slate-100 shrink-0">
              <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <div className="flex-1 mx-2 h-2.5 bg-white rounded border border-slate-200" />
            </div>

            {/* Gradient hero header */}
            <div className={cn(
              "bg-linear-to-br flex flex-col items-center justify-center shrink-0 px-3",
              starter.headerGradient,
            )} style={{ height: "36%" }}>
              <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mb-1.5">
                {starter.icon}
              </div>
              <div className="h-1.5 w-16 bg-white/70 rounded-full mb-1" />
              <div className="h-1 w-10 bg-white/40 rounded-full" />
            </div>

            {/* Body content */}
            <div className="flex-1 px-3 py-2.5 flex flex-col gap-1.5">
              {(starter.lines ?? []).map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full",
                    i === 0 ? "bg-slate-300" : "bg-slate-200",
                    line.w,
                  )}
                  style={line.opacity ? { opacity: line.opacity / 100 } : undefined}
                />
              ))}
              {/* CTA button mock */}
              <div className="mt-auto pt-1 flex justify-center">
                <div
                  className="h-4 w-20 rounded-md"
                  style={{ backgroundColor: starter.accentColor, opacity: 0.8 }}
                />
              </div>
            </div>

            {/* Footer strip */}
            <div className="px-3 py-2 border-t border-slate-100 flex flex-col gap-1 items-center">
              <div className="h-1 w-12 bg-slate-200 rounded-full" />
              <div className="h-1 w-8 bg-slate-100 rounded-full" />
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className="flex items-center gap-1.5 bg-white text-slate-900 text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-150"
          >
            <MousePointerClick size={12} />
            Use Template
          </button>
        </div>

        {/* Selected checkmark */}
        {selected && (
          <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm">
            <Check size={11} className="text-white" strokeWidth={3} />
          </div>
        )}

        {/* Badge */}
        {starter.badge && starter.badgeVariant && (
          <div className={cn(
            "absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md",
            BADGE_STYLES[starter.badgeVariant],
          )}>
            {starter.badge}
          </div>
        )}
      </div>

      {/* ── Card footer ── */}
      <div className="px-3 py-2.5">
        <p className="text-[12px] font-semibold text-slate-800 leading-tight truncate">{starter.label}</p>
        <p className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-2">{starter.description}</p>
      </div>
    </div>
  );
}

// ─── Chooser screen ───────────────────────────────────────────────────────────
function TemplateChooser({ onSelect }: { onSelect: (key: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = STARTERS.filter((s) => {
    const matchCat = category === "All" || s.category === category || s.key === "blank";
    const q = search.toLowerCase();
    const matchSearch = !q || s.label.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = STARTERS.filter((s) => s.featured);

  return (
    <div className="h-full flex flex-col bg-[#f8f9fb] overflow-hidden">

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-6 py-3 bg-white border-b border-slate-200 shrink-0 z-10">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="w-px h-4 bg-slate-200" />

        {/* Step breadcrumb */}
        <div className="flex items-center gap-2 text-[12px]">
          <span className="flex items-center gap-1.5 font-semibold text-slate-900">
            <div className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
            Choose a template
          </span>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-400 flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
            Design & Edit
          </span>
        </div>

        <div className="flex-1" />

        {/* CTA */}
        <button
          onClick={() => onSelect(selected ?? "blank")}
          className={cn(
            "flex items-center gap-2 h-8 px-4 rounded-lg text-[12px] font-semibold transition-all duration-150",
            selected
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200"
              : "bg-slate-900 hover:bg-slate-800 text-white",
          )}
        >
          {selected ? (
            <>Use Template <ChevronRight size={13} /></>
          ) : (
            <>Start from Scratch <Plus size={13} /></>
          )}
        </button>
      </div>

      {/* ── Body: sidebar + content ──────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-52 shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
          <div className="px-4 pt-5 pb-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categories</p>
          </div>
          <nav className="flex flex-col px-2 pb-4 gap-0.5">
            {SIDEBAR_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium text-left transition-all",
                  category === cat.key
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <span className={cn(category === cat.key ? "text-indigo-500" : "text-slate-400")}>
                  {cat.icon}
                </span>
                {cat.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-7">

            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {category === "All" ? "All Templates" : category}
                </h1>
                <p className="text-[12.5px] text-slate-500 mt-1">
                  {filtered.length} template{filtered.length !== 1 ? "s" : ""} available
                  {selected && (
                    <span className="ml-2 text-indigo-600 font-semibold">
                      · 1 selected
                    </span>
                  )}
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search templates…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 h-8 text-[12px] bg-white border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 w-52 transition-all"
                />
              </div>
            </div>

            {/* Featured row (only on "All" with no search) */}
            {category === "All" && !search && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Star size={13} className="text-amber-500" />
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Featured</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {featured.map((s) => (
                    <div
                      key={s.key}
                      onClick={() => setSelected(s.key === selected ? null : s.key)}
                      className={cn(
                        "group relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 bg-white",
                        selected === s.key
                          ? "border-indigo-400 ring-2 ring-indigo-400/20 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 hover:shadow-sm",
                      )}
                    >
                      {/* Mini preview */}
                      <div className={cn(
                        "h-14 w-12 rounded-lg overflow-hidden shrink-0 bg-linear-to-br",
                        s.headerGradient,
                      )} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[13px] font-semibold text-slate-900">{s.label}</p>
                          {s.badge && s.badgeVariant && (
                            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", BADGE_STYLES[s.badgeVariant])}>
                              {s.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{s.description}</p>
                      </div>

                      {selected === s.key ? (
                        <div className="h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                          <Check size={11} className="text-white" strokeWidth={3} />
                        </div>
                      ) : (
                        <Eye size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Divider label */}
            {category === "All" && !search && (
              <div className="flex items-center gap-2 mb-4">
                <LayoutTemplate size={13} className="text-slate-400" />
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">All Templates</p>
              </div>
            )}

            {/* Template grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
                {filtered.map((s) => (
                  <EmailThumbnail
                    key={s.key}
                    starter={s}
                    selected={selected === s.key}
                    onSelect={() => {
                      if (s.key === "blank") { onSelect("blank"); return; }
                      setSelected(s.key === selected ? null : s.key);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                  <LayoutTemplate size={22} className="text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700">No templates found</p>
                <p className="text-xs text-slate-500 mt-1">Try a different search term or category</p>
                <button
                  onClick={() => { setSearch(""); setCategory("All"); }}
                  className="mt-3 text-indigo-600 text-xs font-semibold hover:text-indigo-700 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </main>
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
    id || type ? (type ?? "blank") : null
  );

  const { data, loading } = useGetEmailTemplate(id || "");

  const initialData = useMemo(() => {
    if (id && data?.getEmailTemplate) return data.getEmailTemplate;
    const starterKey = chosenStarter ?? type;
    if (starterKey && starterKey !== "blank") {
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

  if (id && loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#f8f9fb]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-7 w-7 text-indigo-500 animate-spin" strokeWidth={1.5} />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse">
            Loading template…
          </p>
        </div>
      </div>
    );
  }

  if (!id && !chosenStarter) {
    return <TemplateChooser onSelect={setChosenStarter} />;
  }

  return <TemplateBuilder id={id || undefined} initialData={initialData} />;
}

export default function CreateTemplatePage() {
  return (
    <Suspense fallback={
      <div className="h-full w-full flex items-center justify-center bg-[#f8f9fb]">
        <RefreshCw className="h-7 w-7 text-indigo-500 animate-spin" strokeWidth={1.5} />
      </div>
    }>
      <CreateTemplateContent />
    </Suspense>
  );
}
