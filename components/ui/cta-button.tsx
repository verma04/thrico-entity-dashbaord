import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const ctaButtonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-md font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap shadow-2xs",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200",
        outline:
          "border border-border bg-transparent hover:bg-muted text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground shadow-none",
      },
      size: {
        micro: "h-6 px-2 text-[11px] rounded gap-1 [&_svg]:size-3",
        slim: "h-7 px-2.5 text-xs rounded-md gap-1.5 [&_svg]:size-3.5",
        sm: "h-7 px-2.5 text-xs rounded-md gap-1.5 [&_svg]:size-3.5",
        default: "h-8 px-3 text-xs rounded-md gap-1.5 [&_svg]:size-3.5",
        md: "h-8 px-3 text-xs rounded-md gap-1.5 [&_svg]:size-3.5",
        lg: "h-9 px-3.5 text-xs rounded-md gap-2 [&_svg]:size-4",
        icon: "h-8 w-8 p-0 rounded-md [&_svg]:size-3.5",
        "icon-sm": "h-7 w-7 p-0 rounded-md [&_svg]:size-3",
        "icon-xs": "h-6 w-6 p-0 rounded [&_svg]:size-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface CtaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ctaButtonVariants> {
  asChild?: boolean
}

const CtaButton = React.forwardRef<HTMLButtonElement, CtaButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(ctaButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
CtaButton.displayName = "CtaButton"

export { CtaButton, ctaButtonVariants }
