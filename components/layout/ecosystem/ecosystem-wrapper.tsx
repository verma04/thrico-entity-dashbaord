"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function EcosystemWrapper({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-6 px-4", className)} {...props}>
      {children}
    </div>
  );
}
