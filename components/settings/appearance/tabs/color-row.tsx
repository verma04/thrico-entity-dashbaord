"use client";

import type React from "react";

interface ColorRowProps {
  label: string;
  description?: string;
  value: string;
  onChange: (val: string) => void;
}

export const ColorRow: React.FC<ColorRowProps> = ({
  label,
  description,
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 gap-3">
      <div className="relative shrink-0">
        <div
          className="h-7 w-7 rounded-md border border-border/50 overflow-hidden cursor-pointer shadow-2xs"
          style={{ backgroundColor: value || "#000000" }}
        >
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-[10.5px] text-muted-foreground/70">{description}</p>
        )}
      </div>
      <input
        type="text"
        value={(value || "").toUpperCase()}
        onChange={(e) => onChange(e.target.value)}
        className="w-[78px] h-6 text-[11px] font-mono text-center bg-muted/50 border border-border/40 text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30 px-1"
      />
    </div>
  );
};
