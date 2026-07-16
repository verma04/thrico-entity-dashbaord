"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Settings2, 
  RotateCcw,
  Save,
  Loader2
} from "lucide-react";
import { 
  PlatformCard, 
  PlatformSection 
} from "@/components/ui/platform/card";
import { PlatformHeader } from "@/components/ui/platform/header";
import { PlatformButton } from "@/components/ui/platform/button";
import { PlatformSettingRow, PlatformSectionLabel } from "@/components/ui/platform/settings";
import { PlatformContainer } from "@/components/ui/platform/container";

export interface SettingField {
  key: string;
  label: string;
  description: string;
  type?: "switch" | "text" | "number";
  section?: string;
}

interface ModuleSettingsFormProps<T extends Record<string, any>> {
  title?: string;
  description?: string;
  data?: T;
  fields: SettingField[];
  onSave: (data: T) => void;
  isLoading?: boolean;
  defaultValues?: Partial<T>;
}

export function ModuleSettingsForm<T extends Record<string, any>>({
  title = "Module Settings",
  description = "Configure and fine-tune your ecosystem parameters.",
  data,
  fields,
  onSave,
  isLoading,
  defaultValues = {},
}: ModuleSettingsFormProps<T>) {
  const [settings, setSettings] = useState<T>((data || defaultValues) as T);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data) {
      setSettings(data);
      setHasChanged(false);
    }
  }, [data]);

  const handleChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanged(JSON.stringify(newSettings) !== JSON.stringify(data || defaultValues));
  };

  const handleSave = () => {
    onSave(settings);
    setHasChanged(false);
  };

  const handleReset = () => {
    if (data) {
      setSettings(data);
      setHasChanged(false);
    }
  };

  const groupedFields = useMemo(() => {
    const groups: Record<string, SettingField[]> = {};
    fields.forEach(f => {
      const sec = f.section || "General Configuration";
      if (!groups[sec]) groups[sec] = [];
      groups[sec].push(f);
    });
    return groups;
  }, [fields]);

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-200" />
      </div>
    );
  }

  return (
    <PlatformContainer className="py-0">
      <PlatformHeader
        title={title}
        description={description}
        icon={Settings2}
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
                  disabled={isLoading}
                  icon={RotateCcw}
                >
                  Discard
                </PlatformButton>
                <PlatformButton
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  isLoading={isLoading}
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
          <PlatformSection key={sectionName} title={sectionName}>
            <PlatformSectionLabel>{sectionName.toUpperCase()}</PlatformSectionLabel>
            {sectionFields.map((field) => (
              <PlatformSettingRow
                key={field.key}
                label={field.label}
                description={field.description}
                type={field.type}
                value={settings[field.key]}
                onChange={(v) => handleChange(field.key, v)}
                isDirty={data ? settings[field.key] !== data[field.key] : false}
              />
            ))}
          </PlatformSection>
        ))}

        <PlatformCard className="bg-zinc-50/50 border-dashed border-2 flex items-center justify-center py-12 text-zinc-400 group hover:bg-white hover:border-zinc-200 transition-all duration-300">
           <div className="flex flex-col items-center gap-2 cursor-pointer grayscale group-hover:grayscale-0 transition-all">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                 <Settings2 size={16} />
              </div>
              <p className="text-[11px] font-semibold tracking-wider uppercase opacity-70">Configuration Active</p>
           </div>
        </PlatformCard>
      </div>
    </PlatformContainer>
  );
}

