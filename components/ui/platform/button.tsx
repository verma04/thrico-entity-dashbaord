"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { LucideIcon, Loader2 } from "lucide-react";

interface PlatformButtonProps extends ButtonProps {
  icon?: LucideIcon;
  isLoading?: boolean;
}

export function PlatformButton({
  children,
  className,
  variant = "default",
  size = "default",
  icon: Icon,
  isLoading,
  ...props
}: PlatformButtonProps) {
  const baseStyles = "rounded-[10px] font-semibold transition-all active:scale-[0.98]";
  
  const variants = {
    default: "bg-primary hover:bg-primary/80 text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] border-b-2 border-zinc-950",
    secondary: "bg-muted hover:bg-muted text-foreground border border-border/50",
    ghost: "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
    outline: "bg-card hover:bg-muted/50 text-foreground border border-border/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
  };

  return (
    <Button
      variant={variant as any}
      size={size}
      className={cn(baseStyles, className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={2.5} />
      ) : Icon ? (
        <Icon className="mr-2 h-4 w-4 shrink-0" strokeWidth={2.5} />
      ) : null}
      {children}
    </Button>
  );
}

