import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const ctaButtonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-md h-6 px-2.5 py-1 text-[11px] font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-[#202020] text-white hover:bg-[#202020]/90 shadow-sm",
        outline: "border border-border bg-transparent hover:bg-muted text-foreground shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CtaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ctaButtonVariants> {
  asChild?: boolean
}

const CtaButton = React.forwardRef<HTMLButtonElement, CtaButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(ctaButtonVariants({ variant: props.variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
CtaButton.displayName = "CtaButton"

export { CtaButton, ctaButtonVariants }
