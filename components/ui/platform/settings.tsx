"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface PlatformSettingRowProps {
  label: string;
  description: string;
  type?: "switch" | "text" | "number";
  value: any;
  onChange: (value: any) => void;
  icon?: React.ReactNode;
  isDirty?: boolean;
}

export function PlatformSettingRow({
  label,
  description,
  type = "switch",
  value,
  onChange,
  icon: Icon,
  isDirty,
}: PlatformSettingRowProps) {
  return (
    <div className="group/row flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 border-b border-border last:border-0 hover:bg-muted/50/40 transition-colors duration-200">
      <div className="flex gap-4">
        {Icon && (
          <div className="w-9 h-9 rounded-[10px] bg-muted/50 border border-border flex items-center justify-center text-muted-foreground shrink-0 group-hover/row:bg-card group-hover/row:text-muted-foreground transition-colors">
            {Icon}
          </div>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Label className="text-[14px] font-semibold text-foreground cursor-pointer">
              {label}
            </Label>
            {isDirty && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </div>
          <p className="text-[12.5px] text-muted-foreground font-medium max-w-[500px] leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-4">
        {type === "switch" && (
          <Switch
            checked={!!value}
            onCheckedChange={onChange}
            className="data-[state=checked]:bg-indigo-600 shadow-sm"
          />
        )}
        {(type === "text" || type === "number") && (
          <Input
            type={type}
            value={value ?? ""}
            onChange={(e) =>
              onChange(type === "number" ? Number(e.target.value) : e.target.value)
            }
            className="h-9 w-full sm:w-48 bg-card border-border text-sm rounded-[10px] focus-visible:ring-offset-0 focus-visible:ring-4 focus-visible:ring-indigo-500/5 focus-visible:border-indigo-500/30 transition-all font-medium py-1 px-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        )}
      </div>
    </div>
  );
}

export function PlatformSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 py-3 bg-muted/50/50 border-b border-border">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
        {children}
      </span>
    </div>
  );
}
