"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  GitBranch,
  Plus,
  Settings2,
  Trash2,
  ChevronRight,
  Zap,
  ArrowRight,
  Layers,
  TrendingUp,
  Users,
  Mail,
  Play,
  Circle,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_CAMPAIGNS, MODULE_COLORS } from "./types";
import { useGetEmailCampaigns } from "@/graphql/actions/email";
import { Skeleton } from "@/components/ui/skeleton";

interface CampaignsListProps {
  onCreate?: () => void;
}

const STATUS_STYLE: Record<
  string,
  {
    pill: string;
    dot: string;
    label: string;
    accent: string;
    cardBorder: string;
  }
> = {
  released: {
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    label: "Released",
    accent: "bg-emerald-500",
    cardBorder: "border-emerald-200 hover:border-emerald-300",
  },
  draft: {
    pill: "bg-slate-50 text-slate-500 border border-slate-200",
    dot: "bg-slate-400",
    label: "Draft",
    accent: "bg-slate-300",
    cardBorder: "border-slate-200 hover:border-slate-300",
  },
  finished: {
    pill: "bg-blue-50 text-blue-600 border border-blue-200",
    dot: "bg-blue-400",
    label: "Finished",
    accent: "bg-blue-300",
    cardBorder: "border-blue-200 hover:border-blue-300",
  },
  // legacy
  active: {
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    label: "Active",
    accent: "bg-emerald-500",
    cardBorder: "border-emerald-200 hover:border-emerald-300",
  },
  paused: {
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
    label: "Paused",
    accent: "bg-amber-400",
    cardBorder: "border-amber-200 hover:border-amber-300",
  },
};



const FLOW_STEPS = [
  {
    icon: <Play size={14} />,
    label: "Trigger",
    desc: "When something happens",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
  {
    icon: <GitBranch size={14} />,
    label: "Condition",
    desc: "Only if this is true",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
  },
  {
    icon: <Zap size={14} />,
    label: "Action",
    desc: "Then do this",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
  },
];

export function CampaignsList({ onCreate }: CampaignsListProps) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const { data, loading } = useGetEmailCampaigns();
  const campaigns = data?.getEmailCampaigns || [];

  // Merge mock with real for demonstration if requested, but usually we just want real
  // Let's use real ones if they exist, otherwise show mock to not look empty during dev
  const displayCampaigns = campaigns.length > 0 ? campaigns : MOCK_CAMPAIGNS;

  const handleNew = () => router.push("/email/automation/add");
  const handleEdit = (id: string) => router.push(`/email/automation/edit/${id}`);

  const stats = [
    {
      label: "Active Campaigns",
      value: displayCampaigns.filter(
        (c) => c.status === "released",
      ).length.toString(),
      trend: "+2 this month",
      trendColor: "text-emerald-600",
      color: "text-emerald-600",
      bg: "bg-white border-emerald-100",
      icon: <Circle size={10} className="fill-emerald-500 text-emerald-500" />,
      subMetric: "Across 4 modules",
    },
    {
      label: "Total Audience",
      value: displayCampaigns.reduce(
        (s, c) => s + (("audience" in c) ? (c as any).audience : 0),
        0,
      ).toLocaleString(),
      trend: "+12.4%",
      trendColor: "text-emerald-600",
      color: "text-[#5B6CFF]",
      bg: "bg-white border-[#5B6CFF]/20",
      icon: <Users size={12} className="text-[#5B6CFF]" />,
      subMetric: "Total people",
    },
    {
      label: "Emails Sent (30d)",
      value: "14,820",
      trend: "+8.2%",
      trendColor: "text-emerald-600",
      color: "text-slate-800",
      bg: "bg-white border-slate-200",
      icon: <Mail size={12} className="text-slate-500" />,
      subMetric: "98.2% delivery rate",
    },
    {
      label: "Avg. Open Rate",
      value: "42.1%",
      trend: "-1.4%",
      trendColor: "text-rose-600",
      color: "text-amber-600",
      bg: "bg-white border-amber-100",
      icon: <TrendingUp size={12} className="text-amber-500" />,
      subMetric: "Industry avg: 18.2%",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Automated Emails
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Automatically send emails based on what happens in your community.
            </p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2.5 h-10 px-5 bg-[#5B6CFF] hover:bg-[#4a5ce8] text-white text-[13px] font-semibold rounded-xl transition-all shadow-md shadow-[#5B6CFF]/20 shrink-0"
          >
            <Plus size={15} /> New Campaign
          </button>
        </div>

        {/* ── How it works banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Layers size={13} className="text-[#5B6CFF]" />
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              How it works
            </p>
          </div>
          <div className="flex items-center gap-2">
            {FLOW_STEPS.map((step, i) => (
              <React.Fragment key={step.label}>
                <div
                  className={cn(
                    "flex-1 rounded-xl border p-3.5 flex items-start gap-3",
                    step.bg,
                  )}
                >
                  <div className={cn("mt-0.5 shrink-0", step.color)}>
                    {step.icon}
                  </div>
                  <div>
                    <p className={cn("text-[12px] font-bold", step.color)}>
                      {step.label}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <ArrowRight size={14} className="text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Example:{" "}
            <span className="text-slate-600 font-medium">
              User joins community
            </span>{" "}
            →{" "}
            <span className="text-slate-600 font-medium">
              User is from Pune
            </span>{" "}
            →{" "}
            <span className="text-slate-600 font-medium">
              Send welcome email
            </span>
          </p>
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              className={cn("rounded-2xl border p-5 shadow-sm bg-white", s.bg)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-100", s.bg)}>
                    {s.icon}
                  </div>
                  <p className="text-[11px] text-slate-500 font-bold tracking-tight uppercase">
                    {s.label}
                  </p>
                </div>
                {s.trend && (
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-100", s.trendColor)}>
                    {s.trend}
                  </span>
                )}
              </div>
              <div className="space-y-0.5">
                <p className={cn("text-2xl font-bold tracking-tight tabular-nums", s.color)}>
                  {s.value}
                </p>
                {s.subMetric && (
                  <p className="text-[10px] text-slate-400 font-medium leading-none">
                    {s.subMetric}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Campaigns ── */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Your Campaigns ({loading ? "..." : displayCampaigns.length})
          </p>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 w-full bg-white rounded-2xl border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : displayCampaigns.map((c, i) => {
            const st = STATUS_STYLE[c.status] || STATUS_STYLE.draft;
            const modColor = (MODULE_COLORS as any)[c.module] || "#6366F1";
            
            // Handle real fields vs mock fields
            let nodeCount = 0;
            if (c.canvasNodes) {
              try { nodeCount = JSON.parse(c.canvasNodes).length; } catch(e) {}
            } else if ("nodes" in c) {
              nodeCount = (c as any).nodes;
            }

            const triggerLabel = ("trigger" in c) ? (c as any).trigger : 
                                 (nodeCount > 0 && c.canvasNodes ? "Workflow Set" : "Trigger not set");
            const audienceCount = ("audience" in c) ? (c as any).audience : 0;
            const lastEditedLabel = c.updatedAt ? new Date(parseInt(c.updatedAt)).toLocaleDateString() : 
                                    (("lastEdited" in c) ? (c as any).lastEdited : "Recently");
            const cronLabel = ("cronLabel" in c) ? (c as any).cronLabel : 
                              (c.frequency === "recurring" ? (c.cronType || "Recurring") : null);

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onMouseEnter={() => setHoveredId(c.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "group flex items-center gap-4 pl-0 pr-5 py-5 rounded-2xl border bg-white hover:shadow-md transition-all cursor-pointer overflow-hidden",
                  st.cardBorder,
                )}
              >
                {/* Left accent bar */}
                <div
                  className={cn(
                    "self-stretch w-1 rounded-l-2xl shrink-0",
                    st.accent,
                  )}
                />

                {/* Icon */}
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${modColor}12`,
                    border: `1px solid ${modColor}30`,
                  }}
                >
                  <GitBranch size={16} style={{ color: modColor }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-[14px] font-semibold text-slate-800">
                      {c.name}
                    </p>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5",
                        st.pill,
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full inline-block",
                          st.dot,
                        )}
                      />
                      {st.label}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        color: modColor,
                        backgroundColor: `${modColor}14`,
                      }}
                    >
                      {c.module}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <p className="text-[11px] text-slate-400">
                      <span className="font-medium text-slate-600">Trigger:</span>{" "}
                      {triggerLabel}
                    </p>
                    <span className="text-slate-200">·</span>
                    {/* Frequency badge */}
                    <span className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1",
                      c.frequency === "recurring"
                        ? "bg-purple-50 text-purple-600 border border-purple-200"
                        : "bg-slate-50 text-slate-500 border border-slate-200"
                    )}>
                      {c.frequency === "recurring" ? <Repeat size={9} /> : <Play size={9} />}
                      {c.frequency === "recurring"
                        ? (cronLabel ?? "Recurring")
                        : "One Time"}
                    </span>
                    {/* Channel badge */}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1">
                      <Mail size={9} /> Email
                    </span>
                    <span className="text-slate-200">·</span>
                    <p className="text-[11px] text-slate-400">
                      {nodeCount} nodes · {audienceCount.toLocaleString()} users
                    </p>
                    <span className="text-slate-200">·</span>
                    <p className="text-[11px] text-slate-400">Edited {lastEditedLabel}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(c.id); }}
                    className="h-8 px-3 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Settings2 size={12} /> Edit
                  </button>
                  <button className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>

                <ChevronRight
                  size={15}
                  className="text-slate-300 group-hover:text-[#5B6CFF] transition-colors shrink-0"
                />
              </motion.div>
            );
          })}
        </div>

        {/* ── Empty prompt ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-dashed border-slate-200 p-8 text-center"
        >
          <div className="h-12 w-12 rounded-2xl bg-[#5B6CFF]/8 border border-[#5B6CFF]/15 flex items-center justify-center mx-auto mb-3">
            <Plus size={20} className="text-[#5B6CFF]" />
          </div>
          <p className="text-[13px] font-semibold text-slate-700">
            Create a new campaign
          </p>
          <p className="text-[12px] text-slate-400 mt-1">
            Drag triggers, conditions and actions onto the canvas to design your
            workflow.
          </p>
          <button
            onClick={handleNew}
            className="mt-4 inline-flex items-center gap-2 h-9 px-5 bg-[#5B6CFF] hover:bg-[#4a5ce8] text-white text-[12px] font-semibold rounded-xl transition-all"
          >
            <Play size={12} /> Start Building
          </button>
        </motion.div>
      </div>
    </div>
  );
}
