"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface EcosystemContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function EcosystemContainer({ children, className }: EcosystemContainerProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden min-h-[500px]",
        className
      )}
    >
      {children}
    </div>
  );
}
