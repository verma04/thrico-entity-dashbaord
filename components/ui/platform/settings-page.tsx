"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Save, RotateCcw, LucideIcon } from "lucide-react";
import { PlatformHeader } from "./header";
import { PlatformSection, PlatformCard } from "./card";
import { PlatformContainer } from "./container";
import { PlatformSettingRow, PlatformSectionLabel } from "./settings";
import { PlatformButton } from "./button";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

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
}

export function PlatformSettingsPage<T extends Record<string, any>>({
  title,
  description,
  headerIcon,
  badge,
  fields,
  data,
  loading,
  onSave,
  isSaving,
}: PlatformSettingsPageProps<T>) {
  const [settings, setSettings] = useState<T | null>(null);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data) {
      setSettings(data);
      setHasChanged(false);
    }
  }, [data]);

  const handleChange = (key: string, value: any) => {
    if (!settings) return;
    const next = { ...settings, [key]: value };
    setSettings(next);
    
    // Simple deep compare against initial data
    const isDirty = JSON.stringify(next) !== JSON.stringify(data);
    setHasChanged(isDirty);
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      await onSave(settings);
      setHasChanged(false);
    } catch (error) {
      // toast should be handled by the caller or here
    }
  };

  const handleReset = () => {
    if (data) {
      setSettings(data);
      setHasChanged(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-zinc-200" strokeWidth={1.5} />
          <p className="text-zinc-400 font-medium text-xs tracking-widest uppercase">Initializing Interface</p>
        </div>
      </div>
    );
  }

  // Group fields by section
  const groupedFields = fields.reduce((acc, field) => {
    const section = field.section || "General Configuration";
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {} as Record<string, SettingsField[]>);

  return (
    <PlatformContainer className="py-0">
      <PlatformHeader
        title={title}
        description={description}
        icon={headerIcon}
        badge={badge}
        actions={
          <AnimatePresence>
            {hasChanged && (
              <motion.div
                initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 10, filter: "blur(8px)" }}
                className="flex items-center gap-3"
              >
                <PlatformButton
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={isSaving}
                  icon={RotateCcw}
                >
                  Discard
                </PlatformButton>
                <PlatformButton
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  isLoading={isSaving}
                  icon={Save}
                >
                  Save Config
                </PlatformButton>
              </motion.div>
            )}
          </AnimatePresence>
        }
      />

      <div className="max-w-3xl space-y-10 mt-8">
        {Object.entries(groupedFields).map(([sectionName, sectionFields]) => (
          <PlatformSection
            key={sectionName}
            title={sectionName}
            className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
          >
            <PlatformSectionLabel>{sectionName.toUpperCase()}</PlatformSectionLabel>
            {sectionFields.map((field) => (
              <PlatformSettingRow
                key={field.key}
                label={field.label}
                description={field.description}
                type={field.type}
                value={settings[field.key]}
                onChange={(v) => handleChange(field.key, v)}
                icon={field.icon ? <field.icon size={16} /> : undefined}
                isDirty={data ? settings[field.key] !== data[field.key] : false}
              />
            ))}
          </PlatformSection>
        ))}

        <PlatformCard className="bg-zinc-50/50 border-dashed border-2 flex items-center justify-center py-12 text-zinc-400/60 group hover:bg-white hover:border-zinc-200 transition-all duration-500">
           <div className="flex flex-col items-center gap-2 cursor-pointer grayscale group-hover:grayscale-0 transition-all">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                 <Save size={16} className="text-zinc-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <p className="text-[11px] font-semibold tracking-wider uppercase opacity-70">Platform Ready</p>
           </div>
        </PlatformCard>
      </div>
    </PlatformContainer>
  );
}
