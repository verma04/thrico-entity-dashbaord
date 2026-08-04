"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface EcosystemContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function EcosystemContainer({
  children,
  className,
}: EcosystemContainerProps) {
  return <div className={cn("mx-3", className)}>{children}</div>;
}
