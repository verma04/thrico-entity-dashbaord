"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface EcosystemActionBarProps {
  children: React.ReactNode;
  className?: string;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
}

export function EcosystemActionBar({
  children,
  className,
  shadow = "sm",
}: EcosystemActionBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
        "p-2 rounded-[24px] bg-zinc-100/50 border border-zinc-200/60 ring-1 ring-white/50 shadow-inner-sm",
        className
      )}
    >
      <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {children}
      </div>
    </motion.div>
  );
}
