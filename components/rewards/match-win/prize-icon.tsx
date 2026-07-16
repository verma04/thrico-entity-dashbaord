"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "@/components/ui/lucide-icon";

interface PrizeIconProps {
  iconName: string;
  color?: string;
  className?: string;
}

export const PrizeIcon = ({ iconName, color, className }: PrizeIconProps) => {
  return (
    <LucideIcon
      name={iconName}
      style={{ color }}
      className={cn("h-6 w-6", className)}
    />
  );
};
