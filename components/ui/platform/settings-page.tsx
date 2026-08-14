"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, LucideIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FloatingSavePanel } from "./floating-save-panel";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { Skeleton } from "@/components/ui/skeleton";

export interface SettingsField {
  key: string;
  label: string;
  description: string;
  type?: "switch" | "text" | "number";
  section?: string;
  icon?: LucideIcon;
}

interface PlatformSettingsPageProps<T> {
  title: string;
  description: string;
  headerIcon?: LucideIcon;
  badge?: string;
  fields: SettingsField[];
  data: T | null | undefined;
  loading?: boolean;
  onSave: (settings: T) => Promise<void> | void;
  isSaving?: boolean;
  hideHeader?: boolean;
}

export function PlatformSettingsPage<T extends Record<string, any>>({
  title,
  description,
  headerIcon: HeaderIcon,
  badge,
  fields,
  data,
  loading,
  onSave,
  isSaving,
  hideHeader,
}: PlatformSettingsPageProps<T>) {
  const [settings, setSettings] = useState<T | null>(null);
  const [hasChanged, setHasChanged] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setSettings(data);
      setHasChanged(false);
    }
  }, [data]);

  const handleChange = (key: string, value: any) => {
    if (!settings) return;
    const next = { ...settings, [key]: value };
    setSettings(next as T);
    setSaved(false);
    setHasChanged(JSON.stringify(next) !== JSON.stringify(data));
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      await onSave(settings);
      setHasChanged(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
  };

  const handleReset = () => {
    if (data) {
      setSettings(data);
      setHasChanged(false);
      setSaved(false);
    }
  };

  const groupedFields = useMemo(() => {
    const groups: Record<string, SettingsField[]> = {};
    fields.forEach((f) => {
      const sec = f.section || "Governance & Parameters";
      if (!groups[sec]) groups[sec] = [];
      groups[sec].push(f);
    });
    return groups;
  }, [fields]);

  if (loading || !settings) {
    return (
      <div className="space-y-6 max-w-[1040px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1040px]">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-6">
            {/* Live Parameter State Sidebar */}
            <PolarisSidebarCard
              title="Active Parameters"
              badge="Live Status"
              icon={Sparkles}
            >
              <div className="space-y-1.5">
                {fields.map((f, idx) => {
                  const val = settings[f.key];
                  const displayVal =
                    typeof val === "boolean"
                      ? val
                        ? "Enabled"
                        : "Disabled"
                      : val || "Default";

                  return (
                    <PolarisSummaryRow
                      key={f.key}
                      label={f.label}
                      value={displayVal}
                      isLast={idx === fields.length - 1}
                    />
                  );
                })}
              </div>
            </PolarisSidebarCard>

            {/* Contextual Guidance */}
            <PolarisTipCard title="Governance Strategy">
              Balancing open member creation permissions with auto-approval protocols maintains ecosystem quality while encouraging community participation.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-6">
          {Object.entries(groupedFields).map(
            ([sectionName, sectionFields], si) => (
              <PolarisFormCard
                key={sectionName}
                step={si + 1}
                title={sectionName}
                description="Configure policy rules, automated processing, and member access permissions."
                badge="Policy"
              >
                <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {sectionFields.map((field) => (
                    <SettingRow
                      key={field.key}
                      field={field}
                      value={settings[field.key]}
                      onChange={(v) => handleChange(field.key, v)}
                      isDirty={
                        data ? settings[field.key] !== data[field.key] : false
                      }
                    />
                  ))}
                </div>
              </PolarisFormCard>
            ),
          )}

          {/* Floating Action Bar */}
          <FloatingSavePanel
            hasChanged={hasChanged}
            saved={saved}
            isSaving={isSaving}
            onSave={handleSave}
            onReset={handleReset}
            title="Save Protocol Changes"
            description="You have unsaved changes to this module configuration."
            buttonText="Save Protocols"
          />
        </div>
      </PolarisFormLayout>
    </div>
  );
}

// ── Internal Setting Row ──────────────────────────────────────────────────

function SettingRow({
  field,
  value,
  onChange,
  isDirty,
}: {
  field: SettingsField;
  value: any;
  onChange: (v: any) => void;
  isDirty: boolean;
}) {
  const { label, description, type = "switch", icon: Icon } = field;
  const id = `setting-${field.key}`;

  return (
    <div
      className={cn(
        "group flex items-center justify-between gap-6 px-4 py-3.5 transition-colors duration-150",
        isDirty
          ? "bg-zinc-900/[0.03] dark:bg-zinc-100/5"
          : "hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30",
      )}
    >
      {/* Left: icon + label + description */}
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="mt-0.5 w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 shrink-0">
            <Icon size={14} strokeWidth={2} />
          </div>
        )}
        <div className="min-w-0">
          <Label
            htmlFor={id}
            className="text-xs font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer flex items-center gap-1.5"
          >
            {label}
            {isDirty && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            )}
          </Label>
          <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium max-w-[440px]">
            {description}
          </p>
        </div>
      </div>

      {/* Right: control */}
      <div className="shrink-0">
        {type === "switch" && (
          <Switch
            id={id}
            checked={!!value}
            onCheckedChange={onChange}
          />
        )}
        {(type === "text" || type === "number") && (
          <Input
            id={id}
            type={type}
            value={value ?? ""}
            onChange={(e) =>
              onChange(
                type === "number" ? Number(e.target.value) : e.target.value,
              )
            }
            className="h-8 w-36 text-xs font-semibold rounded-lg border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
            placeholder="Enter value…"
          />
        )}
      </div>
    </div>
  );
}
