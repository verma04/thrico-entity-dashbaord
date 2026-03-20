"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Settings2, 
  ToggleRight, 
  Type, 
  Hash,
} from "lucide-react";
import { 
  ModuleCard, 
  ModuleHeader, 
  ModuleStatusBar, 
  ModuleSectionLabel, 
  DirtyMarker 
} from "./module-ui-kit";

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

/* ─── Field Icon Component ─────────────────────────────────────────────── */
const FieldIcon = ({ type, active }: { type: string; active?: boolean }) => {
  const base = "w-8 h-8 rounded-lg transition-all duration-300 shrink-0 flex items-center justify-center";
  const activeStyles = active 
    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-50" 
    : "bg-zinc-100/80 text-zinc-400 group-hover/row:bg-zinc-200/80 group-hover/row:text-zinc-500";
  
  const iconProps = { size: 14, strokeWidth: 2.5 };

  switch (type) {
    case "switch": return <div className={cn(base, activeStyles)}><ToggleRight {...iconProps} /></div>;
    case "text": return <div className={cn(base, activeStyles)}><Type {...iconProps} /></div>;
    case "number": return <div className={cn(base, activeStyles)}><Hash {...iconProps} /></div>;
    default: return <div className={cn(base, activeStyles)}><Settings2 {...iconProps} /></div>;
  }
};

/* ─── Main Component ────────────────────────────────────────────────────── */
export function ModuleSettingsForm<T extends Record<string, any>>({
  title = "Settings",
  description = "Configure module settings",
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

  const handleToggle = (key: string) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    setHasChanged(JSON.stringify(newSettings) !== JSON.stringify(data || defaultValues));
  };

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

  const renderField = (field: SettingField) => {
    const type = field.type || "switch";
    const currentValue = settings[field.key];
    const isDirty = data ? settings[field.key] !== data[field.key] : false;

    return (
      <div
        key={field.key}
        className="group/row relative flex flex-col gap-4 p-5 transition-all duration-300 rounded-xl hover:bg-zinc-50/70 border border-transparent hover:border-zinc-100"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <FieldIcon type={type} active={!!currentValue} />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor={field.key} className="text-[14px] font-bold tracking-tight text-zinc-900 leading-none cursor-pointer">
                  {field.label}
                </Label>
                {isDirty && <DirtyMarker />}
              </div>
              <p className="text-[12px] text-zinc-400 font-medium max-w-[520px] leading-relaxed">
                {field.description}
              </p>
            </div>
          </div>
          {type === "switch" && (
            <div className="pt-0.5">
              <Switch
                id={field.key}
                checked={!!currentValue}
                onCheckedChange={() => handleToggle(field.key)}
                className="data-[state=checked]:bg-indigo-600 shadow-sm"
              />
            </div>
          )}
        </div>
        {(type === "text" || type === "number") && (
          <div className="pl-12">
            <div className="relative group/input max-w-sm">
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-indigo-500 transition-all duration-300 group-focus-within/input:h-4" />
              <Input
                id={field.key}
                type={type}
                value={settings[field.key] ?? (type === "number" ? 0 : "")}
                onChange={(e) => handleChange(field.key, type === "number" ? Number(e.target.value) : e.target.value)}
                className="h-10 bg-white border-zinc-200 text-[13.5px] rounded-[14px] focus-visible:ring-offset-0 focus-visible:ring-4 focus-visible:ring-indigo-500/5 focus-visible:border-indigo-500/30 transition-all font-medium py-1.5 px-4 shadow-sm"
                placeholder={`Set ${field.label.toLowerCase()}...`}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <ModuleCard>
      <ModuleHeader
        title={title}
        description={description}
        icon={<Settings2 size={24} strokeWidth={1.5} />}
        hasChanged={hasChanged}
        onSave={handleSave}
        onReset={handleReset}
        isLoading={isLoading}
      />
      
      <CardContent className="px-3 pt-4 pb-8">
        <div className="grid gap-2">
          {Object.entries(groupedFields).map(([section, sectionFields]) => (
            <div key={section} className="space-y-1">
              <ModuleSectionLabel>{section}</ModuleSectionLabel>
              <div className="space-y-0.5">
                {sectionFields.map((field, index) => (
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04 }}
                  >
                    {renderField(field)}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <ModuleStatusBar label="Module Configuration Synchronized" />
    </ModuleCard>
  );
}
