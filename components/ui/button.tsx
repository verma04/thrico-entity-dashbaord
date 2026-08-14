import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-2xs",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-2xs",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        micro: "h-6 px-2 text-[11px] font-semibold rounded gap-1 [&_svg]:size-3",
        slim: "h-7 px-2.5 text-xs font-medium rounded-md gap-1.5 [&_svg]:size-3.5",
        sm: "h-7 px-2.5 text-xs font-medium rounded-md gap-1.5 [&_svg]:size-3.5",
        default: "h-8 px-3 text-xs font-medium rounded-md gap-1.5 [&_svg]:size-3.5",
        md: "h-8 px-3 text-xs font-medium rounded-md gap-1.5 [&_svg]:size-3.5",
        lg: "h-9 px-4 text-sm font-medium rounded-md gap-2 [&_svg]:size-4",
        large: "h-9 px-4 text-sm font-medium rounded-md gap-2 [&_svg]:size-4",
        icon: "h-8 w-8 rounded-md p-0 [&_svg]:size-4",
        "icon-sm": "h-7 w-7 rounded-md p-0 [&_svg]:size-3.5",
        "icon-xs": "h-6 w-6 rounded p-0 [&_svg]:size-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Spinner = () => (
  <svg
    className="animate-spin mr-2 h-4 w-4 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    
    // When asChild is true, we must provide only a single child to the Slot component.
    // If we're loading and asChild is true, we prioritize rendering the original children 
    // but the spinner logic should probably be handled by the consumer's child element.
    const content = asChild ? children : (
      <>
        {loading && <Spinner />}
        {children}
      </>
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
