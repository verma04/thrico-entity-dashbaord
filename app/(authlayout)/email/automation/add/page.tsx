"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Mail, Users, Repeat, Calendar,
  CheckCircle, Play, Clock, Globe, Hash, GitBranch, Zap, Info,
  Sparkles, Plus, LayoutTemplate, ExternalLink,
  Users2, Briefcase, ShoppingBag, ClipboardList, CalendarDays, Star,
  Cake, UserPlus, Trophy, UserX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CampaignSettings, CampaignStatus, CampaignFrequency,
  CampaignModule, CAMPAIGN_MODULES, MODULE_COLORS,
} from "@/components/email/automation/types";
import { BorderBeam } from "@/components/ui/border-beam";
import { toast } from "sonner";
import { withModulePermission } from "@/components/hoc/with-module-permission";

// ─── Campaign template definitions ────────────────────────────────────────────
interface CampaignTemplate {
  id: string;
  label: string;
  description: string;
  module: CampaignModule | "";
  frequency: CampaignFrequency;
  category: string;
  gradient: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  emailTemplateId?: string;       // links to email template if exists
  emailTemplateName?: string;
  nodes: number;                  // canvas complexity hint
  suggestedName: string;
  isMobileOnly?: boolean;
}

const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: "blank",
    label: "Blank Campaign",
    description: "Start from scratch with an empty canvas",
    module: "",
    frequency: "one-time",
    category: "General",
    gradient: "from-slate-100 to-slate-200",
    icon: <Plus size={22} className="text-muted-foreground" />,
    nodes: 0,
    suggestedName: "",
  },
  {
    id: "welcome-community",
    label: "Community Welcome",
    description: "Send a warm welcome email when a user joins a community",
    module: "Communities",
    frequency: "one-time",
    category: "Communities",
    gradient: "from-blue-400 to-indigo-600",
    icon: <Users2 size={22} className="text-white" />,
    badge: "Popular",
    badgeColor: "bg-blue-500",
    emailTemplateId: "t-welcome-1",
    emailTemplateName: "Welcome — Community",
    nodes: 3,
    suggestedName: "Welcome New Community Members",
    isMobileOnly: true,
  },
  {
    id: "job-applied",
    label: "Job Application Alert",
    description: "Notify recruiters and confirm receipt to applicants on job apply",
    module: "Jobs",
    frequency: "one-time",
    category: "Jobs",
    gradient: "from-amber-400 to-orange-500",
    icon: <Briefcase size={22} className="text-white" />,
    badge: "New",
    badgeColor: "bg-amber-500",
    emailTemplateId: "t-job-alert",
    emailTemplateName: "Job Match Alert",
    nodes: 4,
    suggestedName: "New Job Application Confirmation",
    isMobileOnly: true,
  },
  {
    id: "newsletter-monthly",
    label: "Monthly Newsletter",
    description: "Recurring monthly digest sent to all active platform members",
    module: "Communities",
    frequency: "recurring",
    category: "Newsletter",
    gradient: "from-emerald-400 to-teal-600",
    icon: <LayoutTemplate size={22} className="text-white" />,
    badge: "Popular",
    badgeColor: "bg-emerald-500",
    emailTemplateId: "t-newsletter",
    emailTemplateName: "Monthly Newsletter",
    nodes: 2,
    suggestedName: "Monthly Platform Digest",
    isMobileOnly: true,
  },
  {
    id: "re-engagement",
    label: "Re-engagement",
    description: "Win back members who haven't been active in 30+ days",
    module: "Communities",
    frequency: "recurring",
    category: "Marketing",
    gradient: "from-rose-400 to-pink-600",
    icon: <Zap size={22} className="text-white" />,
    emailTemplateId: "t-re-engage",
    emailTemplateName: "Re-engagement Campaign",
    nodes: 5,
    suggestedName: "Inactive Member Re-engagement",
    isMobileOnly: true,
  },
  // ── New templates ──────────────────────────────────────────────────
  {
    id: "birthday-wishes",
    label: "Birthday Wishes",
    description: "Automatically send a personalised birthday email on the member's birthday",
    module: "Users" as CampaignModule,
    frequency: "recurring",
    category: "Gamification",
    gradient: "from-pink-400 to-rose-500",
    icon: <Cake size={22} className="text-white" />,
    badge: "Popular",
    badgeColor: "bg-pink-500",
    emailTemplateId: "t-welcome-1",
    emailTemplateName: "Welcome — Community",
    nodes: 3,
    suggestedName: "Happy Birthday 🎂",
    isMobileOnly: true,
  },
  {
    id: "new-member-onboard",
    label: "New Member Onboarding",
    description: "Multi-step welcome sequence when someone joins the platform for the first time",
    module: "Users" as CampaignModule,
    frequency: "one-time",
    category: "Gamification",
    gradient: "from-sky-400 to-blue-600",
    icon: <UserPlus size={22} className="text-white" />,
    badge: "Popular",
    badgeColor: "bg-sky-500",
    emailTemplateId: "t-welcome-2",
    emailTemplateName: "Welcome — Platform",
    nodes: 5,
    suggestedName: "New Member Welcome Series",
    isMobileOnly: true,
  },
  {
    id: "gamification-milestone",
    label: "Achievement Unlocked",
    description: "Celebrate when a member earns a badge, levels up, or hits a points milestone",
    module: "Users" as CampaignModule,
    frequency: "one-time",
    category: "Gamification",
    gradient: "from-amber-400 to-yellow-500",
    icon: <Trophy size={22} className="text-white" />,
    nodes: 4,
    suggestedName: "Gamification Milestone Reward",
    isMobileOnly: true,
  },
  {
    id: "inactive-member",
    label: "Inactive Member Nudge",
    description: "Nudge members who haven't logged in or engaged in the last 30 days",
    module: "Users" as CampaignModule,
    frequency: "recurring",
    category: "Gamification",
    gradient: "from-slate-400 to-slate-600",
    icon: <UserX size={22} className="text-white" />,
    emailTemplateId: "t-re-engage",
    emailTemplateName: "Re-engagement Campaign",
    nodes: 4,
    suggestedName: "Inactive Member Win-back",
    isMobileOnly: true,
  },
];

const TEMPLATE_CATEGORIES = ["All", "General", "Communities", "Jobs", "Newsletter", "Marketing", "Gamification"];

// ─── Small reusable components ────────────────────────────────────────────────
function Chip({ active, onClick, children, color }: {
  active: boolean; onClick: () => void; children: React.ReactNode; color?: string;
}) {
  return (
    <button type="button" onClick={onClick}
      className={cn("px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all",
        active ? "text-white shadow-sm" : "bg-card text-muted-foreground border-border hover:border-border hover:text-foreground")}
      style={active ? { backgroundColor: color ?? "#5B6CFF", borderColor: color ?? "#5B6CFF" } : {}}>
      {children}
    </button>
  );
}

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{children}</label>
      {hint && (
        <div className="group relative">
          <Info size={11} className="text-muted-foreground cursor-help" />
          <div className="hidden group-hover:block absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 bg-primary/80 text-white text-[10px] px-2.5 py-1.5 rounded-lg z-50 shadow-lg">
            {hint}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Module gradient colours ───────────────────────────────────────────────────
const MODULE_GRADIENT: Record<string, string> = {
  Communities: "from-blue-400 to-indigo-600",
  Events:      "from-violet-400 to-purple-600",
  Jobs:        "from-amber-400 to-orange-500",
  Shop:        "from-fuchsia-400 to-purple-600",
  Listings:    "from-yellow-400 to-amber-500",
};

// ─── Campaign template card ───────────────────────────────────────────────────
function TemplateCard({ t, selected, onClick }: {
  t: CampaignTemplate;
  selected: boolean;
  onClick: () => void;
}) {
  const isBlank = t.id === "blank";
  return (
    <button onClick={onClick}
      className={cn("group relative text-left rounded-2xl border-2 p-3 transition-all duration-300",
        selected ? "border-[#5B6CFF] bg-indigo-50/40 shadow-xl shadow-[#5B6CFF]/10 scale-[1.02]"
                 : "border-border bg-card hover:border-border hover:shadow-md hover:-translate-y-0.5")}
    >
      {selected && <BorderBeam size={120} duration={4} colorFrom="#5B6CFF" colorTo="#9c40ff" />}

      {/* Thumbnail */}
      <div className="relative w-full aspect-3/2 rounded-xl overflow-hidden mb-3">
        {isBlank ? (
          <div className="absolute inset-0 bg-muted/50 border-2 border-dashed border-border flex flex-col items-center justify-center gap-2">
            <Plus size={18} className="text-muted-foreground" />
            <span className="text-[10px] font-semibold text-muted-foreground">Blank Canvas</span>
          </div>
        ) : (
          <>
            <div className={cn("absolute inset-x-0 top-0 h-[40%] bg-linear-to-br flex items-center justify-center", t.gradient)}>
              <div className="opacity-80">{t.icon}</div>
            </div>
            {/* Canvas preview - simulated nodes */}
            <div className="absolute inset-x-0 bottom-0 bg-card p-2 flex flex-col gap-1" style={{ height: "63%" }}>
              {Array.from({ length: Math.min(t.nodes, 3) }).map((_, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
                  <div className={cn("h-1.5 rounded-full bg-muted", i === 0 ? "w-3/4" : i === 1 ? "w-1/2" : "w-2/3")} />
                </div>
              ))}
              {t.emailTemplateName && (
                <div className="mt-auto flex items-center gap-1 pt-1 border-t border-border">
                  <Mail size={8} className="text-indigo-400 shrink-0" />
                  <span className="text-[8px] text-muted-foreground truncate">{t.emailTemplateName}</span>
                </div>
              )}
            </div>
          </>
        )}
        {/* Badge */}
        {t.badge && (
          <div className={cn("absolute top-2 right-2 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full", t.badgeColor)}>
            {t.badge}
          </div>
        )}
        {/* Selected tick */}
        {selected && (
          <div className="absolute top-2 left-2 h-5 w-5 rounded-full bg-[#5B6CFF] flex items-center justify-center">
            <CheckCircle size={11} className="text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-0.5">
        <p className="text-[12px] font-bold text-foreground leading-tight flex items-center gap-2">
          {t.label}
          {t.isMobileOnly && (
             <span className="inline-flex h-4 px-1.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[8px] font-bold uppercase tracking-wider items-center">Mobile</span>
          )}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">{t.description}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {t.module && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              {t.module}
            </span>
          )}
          {t.emailTemplateName && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-500 border border-indigo-100 flex items-center gap-1">
              <Mail size={7} /> Email incl.
            </span>
          )}
          {!isBlank && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              {t.nodes} nodes
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS: CampaignSettings = {
  name: "", status: "draft", frequency: "one-time",
  cronType: "weekly", cronDay: "MON", cronDate: 1,
  module: "", channelType: "email", targetUsers: "all", description: "",
};

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
const MONTH_DATES = Array.from({ length: 28 }, (_, i) => i + 1);

// ─── Main page ────────────────────────────────────────────────────────────────
function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [form, setForm] = useState<CampaignSettings>(DEFAULT_SETTINGS);
  const [category, setCategory] = useState("All");

  const update = <K extends keyof CampaignSettings>(key: K, val: CampaignSettings[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const canProceed = form.name.trim().length > 0 && form.module !== "";
  const inp = "w-full bg-card border border-border rounded-xl text-[13px] text-foreground px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5B6CFF]/20 focus:border-[#5B6CFF]/50 placeholder-slate-400 transition-all";

  // Apply template defaults when user picks one
  const applyTemplate = (t: CampaignTemplate) => {
    setSelectedTemplateId(t.id);
    if (t.id !== "blank") {
      setForm((p) => ({
        ...p,
        module:    t.module as CampaignModule | "",
        frequency: t.frequency,
        name:      t.suggestedName,
      }));
    }
  };

  const handleTemplateNext = () => {
    if (!selectedTemplateId) applyTemplate(CAMPAIGN_TEMPLATES[0]); // default blank
    setStep(1);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 1) setStep(0);
    else router.push("/email/automation");
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleLaunch = async () => {
    // Prepare data for database
    const input = {
      name:        form.name,
      status:      form.status,
      frequency:   form.frequency,
      module:      form.module,
      channelType: form.channelType,
      targetUsers: form.targetUsers,
      description: form.description,
      // Add cron config if recurring
      ...(form.frequency === "recurring" && {
        cronType: form.cronType,
        cronDay:  form.cronDay,
        cronDate: form.cronDate,
      })
    };

    setIsSaving(true);
    try {
      sessionStorage.setItem("campaign_draft", JSON.stringify(input));
      router.push("/email/automation/add/canvas");
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const selectedTemplate = CAMPAIGN_TEMPLATES.find((t) => t.id === selectedTemplateId) ?? null;
  const filteredTemplates = CAMPAIGN_TEMPLATES.filter((t) =>
    category === "All" || t.category === category
  );

  return (
    <div className="min-h-screen bg-muted/50 flex flex-col">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-4 px-8 py-4 bg-card/70 backdrop-blur-md border-b border-border shrink-0 sticky top-0 z-50">
        <button onClick={handleBack}
          className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-[#5B6CFF] transition-colors">
          <ChevronLeft size={14} /> Back
        </button>
        <div className="w-px h-4 bg-muted" />
        <div className="flex items-center gap-2">
          {[
            { label: "Template", step: 0 },
            { label: "Settings", step: 1 },
            { label: "Schedule & Users", step: 2 },
          ].map((s, i) => (
            <React.Fragment key={s.step}>
              {i > 0 && <ChevronRight size={11} className="text-muted-foreground" />}
              <span className={cn("text-[11px] font-bold", step === s.step ? "text-[#5B6CFF]" : "text-muted-foreground")}>
                {s.label}
              </span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex-1" />
        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((s) => (
            <div key={s} className={cn("h-1.5 rounded-full transition-all",
              s === step ? "w-6 bg-[#5B6CFF]" : s < step ? "w-3 bg-[#5B6CFF]/40" : "w-3 bg-muted")} />
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ────────── STEP 0: Template chooser ────────── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

              {/* Hero */}
              <div className="px-8 pt-10 pb-4 max-w-5xl mx-auto">
                <div className="flex items-start gap-3 mb-1">
                  <div className="h-9 w-9 rounded-xl bg-[#5B6CFF]/10 flex items-center justify-center shrink-0">
                    <Sparkles size={17} className="text-[#5B6CFF]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight leading-none">
                      Start with a template
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose a pre-built campaign workflow, or start from scratch.
                    </p>
                  </div>
                </div>
              </div>

              {/* Category pills */}
              <div className="px-8 pb-3 max-w-5xl mx-auto">
                <div className="flex gap-2 flex-wrap">
                  {TEMPLATE_CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className={cn("text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all",
                        category === cat
                          ? "bg-primary border-slate-900 text-white"
                          : "bg-card border-border text-muted-foreground hover:border-border hover:text-foreground")}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="px-8 pb-12 max-w-5xl mx-auto">
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                  }}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                >
                  {filteredTemplates.map((t) => (
                    <motion.div key={t.id} variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}>
                      <TemplateCard t={t}
                        selected={selectedTemplateId === t.id}
                        onClick={() => applyTemplate(t)} />
                    </motion.div>
                  ))}
                </motion.div>
                {filteredTemplates.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <LayoutTemplate size={32} className="text-slate-200 mb-3" />
                    <p className="text-muted-foreground font-medium">No templates in this category</p>
                    <button onClick={() => setCategory("All")} className="mt-3 text-[#5B6CFF] text-sm font-semibold hover:underline">
                      View all
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom action bar */}
              <div className="sticky bottom-0 bg-card border-t border-border px-8 py-4 flex items-center gap-4">
                {selectedTemplate && selectedTemplate.id !== "blank" ? (
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={cn("h-8 w-8 rounded-lg bg-linear-to-br flex items-center justify-center shrink-0", selectedTemplate.gradient)}>
                      <div className="scale-75 opacity-90">{selectedTemplate.icon}</div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-foreground truncate">{selectedTemplate.label}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {selectedTemplate.module && (
                          <span className="text-[10px] text-muted-foreground">{selectedTemplate.module}</span>
                        )}
                        {selectedTemplate.emailTemplateName && (
                          <span className="flex items-center gap-1 text-[10px] text-indigo-500 font-semibold">
                            <Mail size={9} /> {selectedTemplate.emailTemplateName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="flex-1 text-[12px] text-muted-foreground">
                    {selectedTemplateId ? "Starting from a blank canvas" : "No template selected — will use blank canvas"}
                  </p>
                )}
                <button onClick={handleTemplateNext}
                  className="flex items-center gap-2 h-10 px-6 rounded-xl bg-[#5B6CFF] hover:bg-[#4a5ce8] text-white text-[13px] font-bold transition-all shadow-md shadow-[#5B6CFF]/20">
                  {selectedTemplate && selectedTemplate.id !== "blank" ? "Use Template" : "Start from Scratch"}
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ────────── STEP 1: Campaign info ────────── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              className="flex-1 flex items-start justify-center py-12 px-8">
              <div className="w-full max-w-2xl space-y-6">

                {/* Template badge */}
                {selectedTemplate && selectedTemplate.id !== "blank" && (
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-indigo-100 bg-indigo-50">
                    <div className={cn("h-7 w-7 rounded-lg bg-linear-to-br flex items-center justify-center shrink-0", selectedTemplate.gradient)}>
                      <div className="scale-[0.6] opacity-90">{selectedTemplate.icon}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-[#5B6CFF] leading-none truncate">{selectedTemplate.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{selectedTemplate.description}</p>
                    </div>
                    {selectedTemplate.emailTemplateName && (
                      <a href="/email/templates" target="_blank"
                        className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 hover:text-indigo-700 shrink-0 whitespace-nowrap">
                        <Mail size={10} /> {selectedTemplate.emailTemplateName}
                        <ExternalLink size={8} />
                      </a>
                    )}
                  </div>
                )}

                <div>
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">Campaign Settings</h1>
                  <p className="text-sm text-muted-foreground mt-1">Define your campaign's basics before building the workflow.</p>
                </div>

                <div className="glass-card rounded-3xl p-8 space-y-6">

                  {/* Name */}
                  <div>
                    <FieldLabel>Campaign Name</FieldLabel>
                    <input className={inp} placeholder="e.g. Welcome New Members"
                      value={form.name} onChange={(e) => update("name", e.target.value)} autoFocus />
                  </div>

                  {/* Status */}
                  <div>
                    <FieldLabel hint="You can change this later">Status</FieldLabel>
                    <div className="flex gap-2 flex-wrap">
                      {([
                        { value: "draft",    label: "Draft",    color: "#94a3b8", icon: <Hash size={12} /> },
                        { value: "active", label: "Active", color: "#10B981", icon: <Play size={12} /> },
                        { value: "inactive", label: "Inactive", color: "#3B82F6", icon: <CheckCircle size={12} /> },
                      ] as { value: CampaignStatus; label: string; color: string; icon: React.ReactNode }[]).map((s) => (
                        <button key={s.value} type="button" onClick={() => update("status", s.value)}
                          className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[12px] font-semibold transition-all",
                            form.status === s.value ? "text-white shadow-sm" : "bg-card text-muted-foreground border-border hover:border-border")}
                          style={form.status === s.value ? { backgroundColor: s.color, borderColor: s.color } : {}}>
                          {s.icon} {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Module */}
                  <div>
                    <FieldLabel hint="Choose the Thrico module this campaign targets">Module</FieldLabel>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {CAMPAIGN_MODULES.map((mod) => (
                        <button key={mod.value} type="button" onClick={() => update("module", mod.value)}
                          className={cn("flex flex-col items-center gap-2 pt-3 pb-2.5 px-2 rounded-xl border text-center transition-all relative overflow-hidden",
                            form.module === mod.value ? "shadow-sm" : "bg-card border-border hover:border-border hover:bg-muted/50")}
                          style={form.module === mod.value ? { backgroundColor: `${mod.color}0e`, borderColor: mod.color } : {}}>
                          {mod.isMobileOnly && (
                            <div className="absolute top-0 right-0 p-1">
                              <Zap size={8} className="text-amber-500 fill-amber-500" />
                            </div>
                          )}
                          <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${mod.color}18`, color: mod.color }}>
                            {mod.icon}
                          </div>
                          <span className="text-[11px] font-semibold"
                            style={{ color: form.module === mod.value ? mod.color : "#64748b" }}>
                            {mod.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <FieldLabel>Description <span className="normal-case text-muted-foreground font-normal">(optional)</span></FieldLabel>
                    <textarea rows={2} className={`${inp} resize-none`}
                      placeholder="Short description of this campaign's purpose…"
                      value={form.description} onChange={(e) => update("description", e.target.value)} />
                  </div>
                </div>

                <button onClick={() => setStep(2)} disabled={!canProceed}
                  className="w-full h-11 bg-[#5B6CFF] hover:bg-[#4a5ce8] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-bold rounded-xl transition-all shadow-md shadow-[#5B6CFF]/20 flex items-center justify-center gap-2">
                  Continue <ChevronRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ────────── STEP 2: Schedule & Audience ────────── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              className="flex-1 flex items-start justify-center py-12 px-8">
              <div className="w-full max-w-2xl space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">Schedule & Audience</h1>
                  <p className="text-sm text-muted-foreground mt-1">Configure when to send and who receives this campaign.</p>
                </div>

                <div className="glass-card rounded-3xl p-8 space-y-8">


                  {/* Frequency */}
                  <div>
                    <FieldLabel hint="One-time sends once when the trigger fires. Recurring repeats on a schedule.">Frequency</FieldLabel>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { value: "one-time",  label: "One Time",  desc: "Sends once per trigger",  icon: <Play size={16} /> },
                        { value: "recurring", label: "Recurring", desc: "Repeats on a schedule",   icon: <Repeat size={16} /> },
                      ] as { value: CampaignFrequency; label: string; desc: string; icon: React.ReactNode }[]).map((opt) => (
                        <button key={opt.value} type="button" onClick={() => update("frequency", opt.value)}
                          className={cn("flex items-start gap-3 p-4 rounded-xl border text-left transition-all",
                            form.frequency === opt.value
                              ? "border-[#5B6CFF] bg-indigo-50 ring-1 ring-[#5B6CFF]/20"
                              : "border-border bg-card hover:border-border hover:bg-muted/50")}>
                          <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all",
                            form.frequency === opt.value ? "bg-[#5B6CFF] text-white" : "bg-muted text-muted-foreground")}>
                            {opt.icon}
                          </div>
                          <div>
                            <p className={cn("text-[13px] font-semibold",
                              form.frequency === opt.value ? "text-[#5B6CFF]" : "text-foreground")}>{opt.label}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{opt.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cron options */}
                  <AnimatePresence>
                    {form.frequency === "recurring" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 space-y-4">
                          <FieldLabel>Repeat Schedule</FieldLabel>
                          <div className="flex gap-2 flex-wrap">
                            {([
                              { value: "weekly",  label: "Weekly",  icon: <Calendar size={11} /> },
                              { value: "monthly", label: "Monthly", icon: <Hash size={11} /> },
                              { value: "custom",  label: "Custom",  icon: <Globe size={11} /> },
                            ] as { value: "weekly"|"monthly"|"custom"; label: string; icon: React.ReactNode }[]).map((t) => (
                              <Chip key={t.value} active={form.cronType === t.value} onClick={() => update("cronType", t.value)}>
                                <span className="flex items-center gap-1">{t.icon} {t.label}</span>
                              </Chip>
                            ))}
                          </div>
                          {form.cronType === "weekly" && (
                            <div>
                              <p className="text-[11px] text-muted-foreground mb-2 font-medium">Day of week</p>
                              <div className="flex gap-1.5 flex-wrap">
                                {WEEKDAYS.map((d) => (
                                  <Chip key={d} active={form.cronDay === d} onClick={() => update("cronDay", d)}>{d}</Chip>
                                ))}
                              </div>
                              <p className="text-[11px] text-indigo-500 mt-2 font-medium flex items-center gap-1">
                                <Clock size={11} /> Will run every {form.cronDay || "MON"} at midnight UTC
                              </p>
                            </div>
                          )}
                          {form.cronType === "monthly" && (
                            <div>
                              <p className="text-[11px] text-muted-foreground mb-2 font-medium">Day of month</p>
                              <div className="flex gap-1 flex-wrap">
                                {MONTH_DATES.map((d) => (
                                  <button key={d} type="button" onClick={() => update("cronDate", d)}
                                    className={cn("h-7 w-7 rounded-lg text-[11px] font-semibold transition-all border",
                                      form.cronDate === d
                                        ? "bg-[#5B6CFF] text-white border-[#5B6CFF]"
                                        : "bg-card text-muted-foreground border-border hover:border-border")}>
                                    {d}
                                  </button>
                                ))}
                              </div>
                              <p className="text-[11px] text-indigo-500 mt-2 font-medium flex items-center gap-1">
                                <Clock size={11} /> Will run on the {form.cronDate}
                                {form.cronDate === 1 ? "st" : form.cronDate === 2 ? "nd" : form.cronDate === 3 ? "rd" : "th"} of each month
                              </p>
                            </div>
                          )}
                          {form.cronType === "custom" && (
                            <div>
                              <p className="text-[11px] text-muted-foreground mb-2 font-medium">Cron expression</p>
                              <input className="w-full font-mono bg-card border border-border rounded-xl text-[12px] text-foreground px-3 py-2.5 focus:outline-none focus:border-[#5B6CFF]/50"
                                placeholder="0 9 * * 1  (every Monday 9 AM)" />
                              <p className="text-[11px] text-muted-foreground mt-1">
                                Format: <span className="font-mono text-muted-foreground">minute  hour  day-month  month  day-week</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Channel */}
                  <div>
                    <FieldLabel hint="More channel types coming soon">Channel Type</FieldLabel>
                    <div className="flex gap-2">
                      <button type="button"
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[#5B6CFF] bg-indigo-50 text-[#5B6CFF] text-[12px] font-bold ring-1 ring-[#5B6CFF]/20">
                        <Mail size={15} /> Email <CheckCircle size={13} className="ml-1 text-[#5B6CFF]" />
                      </button>
                      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-border bg-muted/50 text-muted-foreground text-[12px] font-semibold cursor-not-allowed select-none">
                        Push Notification <span className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded-md ml-1">Soon</span>
                      </div>
                    </div>
                  </div>

                  {/* Target Users */}
                  <div>
                    <FieldLabel hint="Choose which users enter this campaign">Target Users</FieldLabel>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "all",     label: "All Users",    desc: "Every member in the platform", icon: <Users size={16} /> },
                        { value: "segment", label: "User Segment", desc: "Filtered by conditions on canvas", icon: <GitBranch size={16} /> },
                      ].map((opt) => (
                        <button key={opt.value} type="button" onClick={() => update("targetUsers", opt.value)}
                          className={cn("flex items-start gap-3 p-4 rounded-xl border text-left transition-all",
                            form.targetUsers === opt.value
                              ? "border-[#5B6CFF] bg-indigo-50 ring-1 ring-[#5B6CFF]/20"
                              : "border-border bg-card hover:border-border hover:bg-muted/50")}>
                          <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                            form.targetUsers === opt.value ? "bg-[#5B6CFF] text-white" : "bg-muted text-muted-foreground")}>
                            {opt.icon}
                          </div>
                          <div>
                            <p className={cn("text-[13px] font-semibold",
                              form.targetUsers === opt.value ? "text-[#5B6CFF]" : "text-foreground")}>{opt.label}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{opt.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Campaign Summary</p>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                    {[
                      { label: "Template",  value: selectedTemplate?.label ?? "Blank" },
                      { label: "Name",      value: form.name || "—" },
                      { label: "Module",    value: form.module || "—" },
                      { label: "Frequency", value: form.frequency === "one-time" ? "One Time" : `Recurring (${
                        form.cronType === "weekly" ? `Every ${form.cronDay}` :
                        form.cronType === "monthly" ? `Day ${form.cronDate}` : "Custom cron"})` },
                      { label: "Channel",   value: "Email" },
                      { label: "Audience",  value: form.targetUsers === "all" ? "All Users" : "Segmented" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
                        <p className="text-[12px] text-foreground font-semibold mt-0.5 truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                  {/* Email template link */}
                  {selectedTemplate?.emailTemplateName && (
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Mail size={11} className="text-indigo-400" />
                        <span className="text-[11px] text-muted-foreground font-semibold">{selectedTemplate.emailTemplateName}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-500 border border-indigo-100">Email template linked</span>
                      </div>
                      <a href="/email/templates" target="_blank"
                        className="text-[10px] text-[#5B6CFF] hover:underline flex items-center gap-1 font-semibold">
                        View <ExternalLink size={9} />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)}
                    className="flex-1 h-11 bg-card border border-border hover:border-border text-muted-foreground text-[13px] font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                    <ChevronLeft size={14} /> Back
                  </button>
                  <button onClick={handleLaunch} disabled={isSaving}
                    className="flex-1 h-11 bg-[#5B6CFF] hover:bg-[#4a5ce8] text-white text-[13px] font-bold rounded-xl transition-all shadow-md shadow-[#5B6CFF]/20 flex items-center justify-center gap-2 disabled:opacity-50">
                    {isSaving ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Zap size={14} />
                    )}
                    {isSaving ? "Saving..." : "Open Canvas Builder"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export default withModulePermission(NewCampaignPage, "EMAIL", "canCreate");
