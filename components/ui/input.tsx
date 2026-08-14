import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground/50 selection:bg-primary selection:text-primary-foreground border-border flex w-full min-w-0 rounded-md border bg-background text-xs transition-all file:inline-flex file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 hover:border-border/80 focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[2px] outline-none aria-invalid:ring-destructive/20 aria-invalid:border-destructive shadow-2xs",
  {
    variants: {
      inputSize: {
        micro: "h-6 px-2 py-0.5 text-[11px] file:h-5 file:text-[10px]",
        slim: "h-7 px-2.5 py-1 text-xs file:h-5.5 file:text-xs",
        default: "h-8 px-2.5 py-1 text-xs md:text-xs file:h-6 file:text-xs",
        large: "h-9 px-3 py-1.5 text-sm file:h-7 file:text-xs",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

function Input({ className, type, inputSize, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ inputSize, className }))}
      {...props}
    />
  );
}

export { Input, inputVariants };
