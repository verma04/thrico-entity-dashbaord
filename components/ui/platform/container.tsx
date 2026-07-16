"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function PlatformContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-7xl mx-auto w-full px-6 py-10 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500", className)}>
      {children}
    </div>
  );
}

export function PlatformGrid({
  children,
  className,
  cols = 3,
  gap = "md",
}: {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 12;
  gap?: "sm" | "md" | "lg";
}) {
  const colStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 lg:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    12: "grid-cols-1 lg:grid-cols-12",
  };

  const gapStyles = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-10",
  };

  return (
    <div className={cn("grid", colStyles[cols], gapStyles[gap], className)}>
      {children}
    </div>
  );
}

