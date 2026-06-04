"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Users, RefreshCw, Briefcase, Calendar, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkflowNode, ConditionGroup, NODE_STYLES, NODE_ICONS, CampaignModule } from "./types";
import { ConditionBuilder } from "./condition-builder";
import { TemplatePicker, EmailTemplate } from "./template-picker";
import { getCommunities } from "@/graphql/actions/group";
import { useJobs } from "@/graphql/actions/jobs";
import { useGetAllUser } from "@/graphql/actions/membership/membership-queries";

interface ConfigPanelProps {
  node: WorkflowNode;
  onUpdate: (id: string, config: Record<string, any>) => void;
  onClose: () => void;
  /** Active campaign module — drives which condition fields are shown */
  module?: CampaignModule | "";
}

export function ConfigPanel({ node, onUpdate, onClose, module }: ConfigPanelProps) {
  const s = NODE_STYLES[node.type];
  const [config, setConfig] = useState(node.config);
  const [groups, setGroups] = useState<ConditionGroup[]>(
    config?.conditionGroups || [
      { id: "g1", logic: "AND", rules: [{ id: "r1", field: "user.city", operator: "equals", value: "" }] },
    ]
  );
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(
    config?.templateObj ?? null
  );

  const { data: communitiesData } = getCommunities({
    skip: module !== "Communities",
    variables: { input: { status: "APPROVED" } },
  });

  const { data: jobsData } = useJobs({
    skip: module !== "Jobs",
    variables: { input: { status: "APPROVED" } },
  });

  const { data: usersData } = useGetAllUser({
    status: "ALL",
    limit: 100,
  });

  const inp = "w-full bg-card border border-border rounded-xl text-[12px] text-foreground px-3 py-2.5 focus:outline-none focus:border-[#5B6CFF]/60 placeholder-slate-400 transition-colors";

  const handleSave = () => onUpdate(node.id, { ...config, conditionGroups: groups });

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 35 }}
      className="w-[320px] border-l border-border bg-card flex flex-col overflow-hidden shrink-0"
    >
      {/* Header */}
      <div className={cn("flex items-center gap-3 px-4 py-4 border-b border-border", s.headerBg)}>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", s.iconBg)}>
          <span className={s.iconColor}>{NODE_ICONS[node.type]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-foreground truncate">{node.label}</p>
          <span className={cn("text-[10px] font-bold tracking-wider", s.badgeText)}>{s.badgeLabel}</span>
        </div>
        <button
          onClick={onClose}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* ── Trigger ── */}
        {node.type === "trigger" && (
          <div className="space-y-3">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Trigger Event</label>
            <div className="p-3 rounded-xl border border-blue-200 bg-blue-50">
              <p className="text-[12px] font-semibold text-blue-800">{node.label}</p>
              <p className="text-[11px] text-blue-500 mt-1">Fires when this platform event occurs.</p>
            </div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Filter by Source</label>
            <select className={inp} value={config.source || ""} onChange={(e) => setConfig({ ...config, source: e.target.value })}>
              <option value="">All {module || "Sources"}</option>
              {module === "Communities" && communitiesData?.getCommunities?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
              {module === "Jobs" && jobsData?.getJob?.map((j: any) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
              {module === "Users" && usersData?.getAllUser?.data?.map((u: any) => (
                <option key={u.user.id} value={u.user.id}>{u.user.firstName} {u.user.lastName}</option>
              ))}
            </select>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Note / Label</label>
            <input placeholder="Add a note…" className={inp} value={config.description || ""} onChange={(e) => setConfig({ ...config, description: e.target.value })} />
          </div>
        )}

        {/* ── Condition ── */}
        {node.type === "condition" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Rule Builder</label>
              {module ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                  {module.toUpperCase()}
                </span>
              ) : (
                <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-md">ALL MODULES</span>
              )}
            </div>
            {!module && (
              <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-700">
                ⚠️ Select a module in Campaign Settings to see relevant condition fields.
              </div>
            )}
            <ConditionBuilder groups={groups} onChange={setGroups} module={module} />
          </div>
        )}

        {/* ── Action ── */}
        {node.type === "action" && (
          <div className="space-y-3">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Configure Action</label>

            {node.blockKey === "send-email-action" && (
              <>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Email Template</label>
                <TemplatePicker
                  value={selectedTemplate?.id ?? null}
                  onChange={(t) => {
                    setSelectedTemplate(t);
                    setConfig({ ...config, templateId: t?.id ?? null, templateObj: t });
                  }}
                  createHref="/email/templates/create"
                />
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mt-1">Subject Line</label>
                <input
                  placeholder={selectedTemplate ? `Re: ${selectedTemplate.name}` : "Enter subject line…"}
                  className={inp}
                  value={config.subject || ""}
                  onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                />
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">From Name</label>
                <input placeholder="e.g. Thrico Team" className={inp} value={config.fromName || ""} onChange={(e) => setConfig({ ...config, fromName: e.target.value })} />
              </>
            )}

            {node.blockKey === "send-notification" && (
              <>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Notification Title</label>
                <input placeholder="Title…" className={inp} value={config.title || ""} onChange={(e) => setConfig({ ...config, title: e.target.value })} />
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Message</label>
                <textarea rows={3} placeholder="Write notification message…" className={`${inp} resize-none`}
                  value={config.message || ""} onChange={(e) => setConfig({ ...config, message: e.target.value })} />
              </>
            )}

            {node.blockKey === "add-tag" && (
              <>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Tag Name</label>
                <input placeholder="e.g. vip-member, high-intent…" className={inp} value={config.tag || ""} onChange={(e) => setConfig({ ...config, tag: e.target.value })} />
                <p className="text-[11px] text-muted-foreground">This tag will be added to the matched user's profile.</p>
              </>
            )}

            {node.blockKey === "add-to-community" && (
              <>
                <div className="flex items-center gap-2 p-3 rounded-xl border border-blue-200 bg-blue-50">
                  <UserPlus size={13} className="text-blue-600 shrink-0" />
                  <p className="text-[11px] text-blue-700">User will be automatically added to the selected community.</p>
                </div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Select Community</label>
                <select className={inp} value={config.communityId || ""} onChange={(e) => setConfig({ ...config, communityId: e.target.value })}>
                  <option value="">Select community…</option>
                  <option value="c1">React Developers</option>
                  <option value="c2">Design Thinkers</option>
                  <option value="c3">Startup Founders</option>
                  <option value="c4">Product Managers</option>
                </select>
              </>
            )}

            {node.blockKey === "recommend-job" && (
              <>
                <div className="flex items-center gap-2 p-3 rounded-xl border border-amber-200 bg-amber-50">
                  <Briefcase size={13} className="text-amber-600 shrink-0" />
                  <p className="text-[11px] text-amber-700">Will recommend a relevant job to the user via notification or email.</p>
                </div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Job Filter</label>
                <select className={inp} value={config.jobFilter || ""} onChange={(e) => setConfig({ ...config, jobFilter: e.target.value })}>
                  <option value="">All jobs</option>
                  <option value="full-time">Full-Time Only</option>
                  <option value="part-time">Part-Time Only</option>
                  <option value="remote">Remote Only</option>
                </select>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Delivery Method</label>
                <select className={inp} value={config.delivery || ""} onChange={(e) => setConfig({ ...config, delivery: e.target.value })}>
                  <option value="notification">In-App Notification</option>
                  <option value="email">Email</option>
                  <option value="both">Both</option>
                </select>
              </>
            )}

            {node.blockKey === "recommend-event" && (
              <>
                <div className="flex items-center gap-2 p-3 rounded-xl border border-purple-200 bg-purple-50">
                  <Calendar size={13} className="text-purple-600 shrink-0" />
                  <p className="text-[11px] text-purple-700">Will recommend upcoming events relevant to the user.</p>
                </div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Event Category</label>
                <select className={inp} value={config.eventCategory || ""} onChange={(e) => setConfig({ ...config, eventCategory: e.target.value })}>
                  <option value="">All categories</option>
                  <option value="tech">Tech</option>
                  <option value="design">Design</option>
                  <option value="networking">Networking</option>
                  <option value="workshop">Workshop</option>
                </select>
              </>
            )}

            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Note</label>
            <input placeholder="Add a note…" className={inp} value={config.description || ""} onChange={(e) => setConfig({ ...config, description: e.target.value })} />
          </div>
        )}

        {/* ── Delay ── */}
        {node.type === "delay" && (
          <div className="space-y-3">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Wait Duration</label>
            <div className="flex gap-2">
              <input type="number" min={1}
                className="flex-1 bg-card border border-border rounded-xl text-[12px] text-foreground px-3 py-2.5 focus:outline-none focus:border-[#5B6CFF]/60"
                value={config.amount || 1}
                onChange={(e) => setConfig({ ...config, amount: e.target.value })} />
              <select
                className="bg-card border border-border rounded-xl text-[12px] text-foreground px-3 py-2.5 focus:outline-none focus:border-[#5B6CFF]/60"
                value={config.unit || "days"}
                onChange={(e) => setConfig({ ...config, unit: e.target.value })}>
                <option value="minutes">minutes</option>
                <option value="hours">hours</option>
                <option value="days">days</option>
                <option value="weeks">weeks</option>
              </select>
            </div>
            <div className="p-3 rounded-xl border border-purple-200 bg-purple-50">
              <p className="text-[12px] text-purple-700 font-medium">
                ⏱ Wait <span className="font-bold">{config.amount || 1} {config.unit || "days"}</span> before continuing to the next step.
              </p>
            </div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Delay Type</label>
            <select className={inp} value={config.delayType || "fixed"} onChange={(e) => setConfig({ ...config, delayType: e.target.value })}>
              <option value="fixed">Fixed wait</option>
              <option value="until-time">Until a specific time of day</option>
              <option value="until-event">Until next event date</option>
            </select>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
          <Users size={13} className="text-[#5B6CFF]" />
          <p className="text-[12px] text-muted-foreground flex-1">
            <span className="font-bold text-foreground">2,340 users</span> match this workflow
          </p>
          <RefreshCw size={11} className="text-muted-foreground" />
        </div>
        <button
          onClick={handleSave}
          className="w-full h-9 bg-[#5B6CFF] hover:bg-[#4a5ce8] text-white text-[12px] font-bold rounded-xl transition-all"
        >
          Save Configuration
        </button>
      </div>
    </motion.div>
  );
}
