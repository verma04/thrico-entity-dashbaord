import React from "react";
import { cn } from "@/lib/utils";

export function FormFieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="h-4 w-24 bg-muted animate-pulse rounded" /> {/* label */}
      <div className="h-10 w-full bg-muted animate-pulse rounded" />{" "}
      {/* input */}
      <div className="h-3 w-32 bg-muted animate-pulse rounded" />{" "}
      {/* description/message */}
    </div>
  );
}
