"use client";

import React from "react";
import { Plus, Minus, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ConditionGroup,
  ConditionRule,
  CONDITION_FIELDS,
  MODULE_CONDITION_FIELDS,
  OPERATORS,
  uid,
  CampaignModule,
} from "./types";

interface ConditionBuilderProps {
  groups: ConditionGroup[];
  onChange: (groups: ConditionGroup[]) => void;
  /** Pass the active campaign module so we show module-specific fields */
  module?: CampaignModule | "";
}

export function ConditionBuilder({ groups, onChange, module }: ConditionBuilderProps) {
  // Pick the right field list
  const fields =
    module && MODULE_CONDITION_FIELDS[module]
      ? MODULE_CONDITION_FIELDS[module]
      : CONDITION_FIELDS.map((f) => ({ ...f, group: "General" }));

  // Group fields by their group label for <optgroup> rendering
  const fieldGroups = fields.reduce<Record<string, typeof fields>>((acc, f) => {
    (acc[f.group] ??= []).push(f);
    return acc;
  }, {});

  const defaultField = fields[0]?.value ?? "user.city";

  // ── Mutations ─────────────────────────────────────────────────────────────
  const addGroup = () =>
    onChange([...groups, {
      id: uid(), logic: "AND",
      rules: [{ id: uid(), field: defaultField, operator: "equals", value: "" }],
    }]);

  const addRule = (gid: string) =>
    onChange(groups.map((g) =>
      g.id === gid
        ? { ...g, rules: [...g.rules, { id: uid(), field: defaultField, operator: "equals", value: "" }] }
        : g
    ));

  const updateRule = (gid: string, rid: string, patch: Partial<ConditionRule>) =>
    onChange(groups.map((g) =>
      g.id === gid
        ? { ...g, rules: g.rules.map((r) => r.id === rid ? { ...r, ...patch } : r) }
        : g
    ));

  const removeRule = (gid: string, rid: string) =>
    onChange(
      groups
        .map((g) => g.id === gid ? { ...g, rules: g.rules.filter((r) => r.id !== rid) } : g)
        .filter((g) => g.rules.length > 0)
    );

  const toggleLogic = (gid: string) =>
    onChange(groups.map((g) => g.id === gid ? { ...g, logic: g.logic === "AND" ? "OR" : "AND" } : g));

  const selBase = "bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 px-2 py-1.5 focus:outline-none focus:border-[#5B6CFF]/60 transition-colors";

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group.id} className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
          {/* Group header */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-amber-200/60">
            <button
              onClick={() => toggleLogic(group.id)}
              className={cn(
                "px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all",
                group.logic === "AND" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
              )}
            >
              {group.logic}
            </button>
            <span className="text-[11px] text-amber-700 font-medium">group</span>
            <div className="flex-1" />
            <span className="text-[10px] text-amber-600 font-semibold">
              {group.rules.length} rule{group.rules.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Rules */}
          <div className="p-3 space-y-2">
            {group.rules.map((rule, ri) => (
              <div key={rule.id} className="flex items-center gap-2">
                {/* AND/OR connector label */}
                {ri > 0 ? (
                  <span className="text-[10px] text-slate-500 font-bold w-6 text-center shrink-0">
                    {group.logic}
                  </span>
                ) : (
                  <div className="w-6 shrink-0" />
                )}

                {/* Field selector — grouped by module context */}
                <select
                  value={rule.field}
                  onChange={(e) => updateRule(group.id, rule.id, { field: e.target.value })}
                  className={`flex-1 min-w-0 ${selBase}`}
                >
                  {Object.entries(fieldGroups).map(([grp, flds]) => (
                    <optgroup key={grp} label={grp}>
                      {flds.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                {/* Operator */}
                <select
                  value={rule.operator}
                  onChange={(e) => updateRule(group.id, rule.id, { operator: e.target.value })}
                  className={selBase}
                >
                  {OPERATORS.map((op) => <option key={op} value={op}>{op}</option>)}
                </select>

                {/* Value */}
                <input
                  value={rule.value}
                  onChange={(e) => updateRule(group.id, rule.id, { value: e.target.value })}
                  placeholder="value"
                  className="w-20 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 px-2 py-1.5 focus:outline-none focus:border-[#5B6CFF]/60"
                />

                <button
                  onClick={() => removeRule(group.id, rule.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <Minus size={12} />
                </button>
              </div>
            ))}

            <button
              onClick={() => addRule(group.id)}
              className="flex items-center gap-1.5 text-[11px] text-[#5B6CFF] hover:text-[#4a5ce8] font-medium mt-1"
            >
              <PlusCircle size={12} /> Add rule
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addGroup}
        className="w-full border border-dashed border-slate-300 rounded-xl py-2.5 text-[12px] text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={13} /> Add condition group
      </button>
    </div>
  );
}
