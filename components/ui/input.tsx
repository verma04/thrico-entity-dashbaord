import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/50 selection:bg-primary selection:text-primary-foreground border-border flex h-8 w-full min-w-0 rounded-md border bg-background px-2.5 py-1 text-xs transition-all file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs hover:border-charcoal-40",
        "focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[2px] outline-none",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
