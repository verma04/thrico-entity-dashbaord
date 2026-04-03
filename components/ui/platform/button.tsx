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
    default: "bg-zinc-900 hover:bg-zinc-800 text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] border-b-2 border-zinc-950",
    secondary: "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200/50",
    ghost: "hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900",
    outline: "bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
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

