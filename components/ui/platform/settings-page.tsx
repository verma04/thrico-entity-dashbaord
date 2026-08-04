"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Save, RotateCcw, LucideIcon, Check } from "lucide-react";
import { PlatformContainer } from "./container";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FloatingSavePanel } from "./floating-save-panel";

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
      const sec = f.section || "General";
      if (!groups[sec]) groups[sec] = [];
      groups[sec].push(f);
    });
    return groups;
  }, [fields]);

  if (loading || !settings) {
    return (
      <PlatformContainer className="py-0">
        <div className="flex flex-col gap-8">
          {/* skeleton header */}
          {!hideHeader && (
            <div className="flex items-center gap-3 pb-6 border-b border-border ">
              <div className="w-9 h-9 rounded-xl bg-muted  animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-40 bg-muted  rounded-md animate-pulse" />
                <div className="h-3 w-64 bg-muted/50  rounded-md animate-pulse" />
              </div>
            </div>
          )}
          {/* skeleton rows */}
          <div className="max-w-2xl space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-[72px] rounded-xl border border-border  bg-muted/50/60  animate-pulse"
              />
            ))}
          </div>
        </div>
      </PlatformContainer>
    );
  }

  return (
    <PlatformContainer className="py-0">
      {/* ── Page Header ── */}

      <FloatingSavePanel
        hasChanged={hasChanged}
        saved={saved}
        isSaving={isSaving}
        onSave={handleSave}
        onReset={handleReset}
      />

      {/* ── Settings Sections ── */}
      <div
        className={cn("max-w-2xl space-y-10", !hideHeader ? "mt-2" : "mt-0")}
      >
        {Object.entries(groupedFields).map(
          ([sectionName, sectionFields], si) => (
            <motion.div
              key={sectionName}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: si * 0.06 }}
              className="space-y-3"
            >
              {/* Rows */}
              <div className="rounded-xl border border-border/60  bg-card  overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/50">
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
            </motion.div>
          ),
        )}
      </div>
    </PlatformContainer>
  );
}

// ── Internal Row Component ──────────────────────────────────────────────────

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
        "group flex items-center justify-between gap-6 px-5 py-4 transition-colors duration-150",
        isDirty
          ? "bg-amber-50/40 dark:bg-amber-900/20"
          : "hover:bg-muted/50/60 ",
      )}
    >
      {/* Left: icon + label + description */}
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="mt-0.5 w-7 h-7 rounded-lg bg-muted  border border-border/60  flex items-center justify-center text-muted-foreground  shrink-0 group-hover:bg-muted/50 dark:group-hover:bg-primary/80 group-hover:text-foreground dark:group-hover:text-muted-foreground transition-colors">
            <Icon size={13} strokeWidth={2} />
          </div>
        )}
        <div className="min-w-0">
          <Label
            htmlFor={id}
            className={cn(
              "text-[13.5px] font-medium leading-none cursor-pointer",
              isDirty
                ? "text-amber-700 dark:text-amber-500"
                : "text-foreground ",
            )}
          >
            {label}
            {isDirty && (
              <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-amber-400 align-middle translate-y-[-1px]" />
            )}
          </Label>
          <p className="mt-1 text-[12px] text-muted-foreground leading-relaxed font-normal max-w-[400px]">
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
            className="data-[state=checked]:bg-primary dark:data-[state=checked]:bg-muted data-[state=unchecked]:bg-muted dark:data-[state=unchecked]:bg-primary/80 [&>span]:"
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
            className="h-8 w-40 text-[13px] rounded-lg border-border  bg-card  focus-visible:ring-1 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-700 focus-visible:ring-offset-0 font-medium shadow-none "
            placeholder={`Enter value…`}
          />
        )}
      </div>
    </div>
  );
}
