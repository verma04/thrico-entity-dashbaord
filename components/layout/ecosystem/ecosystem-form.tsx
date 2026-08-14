"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface EcosystemFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
}

export function EcosystemForm({
  children,
  className,
  ...props
}: EcosystemFormProps) {
  return (
    <form
      className={cn(
        "bg-white dark:bg-black p-6 lg:p-8 rounded-3xl shadow-sm border border-border/40 text-foreground w-full",
        className,
      )}
      {...props}
    >
      {children}
    </form>
  );
}
