"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export type FixedInsetMotionVariant =
  | "slide-up"
  | "fade"
  | "fade-scale"
  | "slide-down"
  | "slide-right"
  | "slide-left"
  | "none";

const variantPresets: Record<
  FixedInsetMotionVariant,
  {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
  }
> = {
  "slide-up": {
    initial: { opacity: 0, y: "100%" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "100%" },
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  "fade-scale": {
    initial: { opacity: 0, scale: 0.96, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: 10 },
    transition: { duration: 0.25, ease: "easeInOut" },
  },
  "slide-down": {
    initial: { opacity: 0, y: "-100%" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "-100%" },
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  "slide-right": {
    initial: { opacity: 0, x: "100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100%" },
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  "slide-left": {
    initial: { opacity: 0, x: "-100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-100%" },
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  none: {
    initial: undefined,
    animate: undefined,
    exit: undefined,
    transition: undefined,
  },
};

export interface FixedInsetMotionContainerProps
  extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "exit" | "transition"> {
  /** Whether the container is open/visible. If undefined, container always renders (ideal for page layout routes). */
  open?: boolean;
  /** Callback fired when container requests close (e.g. Escape key press) */
  onClose?: () => void;
  /** Whether pressing Escape triggers onClose. Defaults to true if onClose is provided. */
  closeOnEscape?: boolean;
  /** Animation preset. Defaults to 'slide-up'. */
  variant?: FixedInsetMotionVariant;
  /** Custom initial animation state (overrides variant preset) */
  initial?: HTMLMotionProps<"div">["initial"];
  /** Custom animate state (overrides variant preset) */
  animate?: HTMLMotionProps<"div">["animate"];
  /** Custom exit animation state (overrides variant preset) */
  exit?: HTMLMotionProps<"div">["exit"];
  /** Custom animation transition (overrides variant preset) */
  transition?: HTMLMotionProps<"div">["transition"];
  /** Tailwind z-index class or custom value. Defaults to 'z-[100]'. */
  zIndex?: string;
  /** Whether the container enables vertical scrolling. Defaults to true. */
  scrollable?: boolean;
  /** Whether to lock document body scroll while active. Defaults to true. */
  lockBodyScroll?: boolean;
  /** Whether to show the top gradient accent line. Defaults to false. */
  showAccentLine?: boolean;
  /** Custom className for the top gradient accent line. */
  accentLineClassName?: string;
  /** Additional class names for the motion container. */
  className?: string;
  /** Inner content. */
  children?: React.ReactNode;
}

export const FixedInsetMotionContainer = React.forwardRef<
  HTMLDivElement,
  FixedInsetMotionContainerProps
>(function FixedInsetMotionContainer(
  {
    open,
    onClose,
    closeOnEscape = true,
    variant = "slide-up",
    initial,
    animate,
    exit,
    transition,
    zIndex = "z-[100]",
    scrollable = true,
    lockBodyScroll = true,
    showAccentLine = false,
    accentLineClassName,
    className,
    children,
    ...rest
  },
  ref,
) {
  const isControlled = open !== undefined;
  const isVisible = isControlled ? open : true;

  // Handle Escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && onClose && event.key === "Escape") {
        onClose();
      }
    },
    [closeOnEscape, onClose],
  );

  useEffect(() => {
    if (!isVisible) return;

    if (onClose && closeOnEscape) {
      window.addEventListener("keydown", handleKeyDown);
    }

    if (lockBodyScroll) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        if (onClose && closeOnEscape) {
          window.removeEventListener("keydown", handleKeyDown);
        }
        document.body.style.overflow = originalOverflow;
      };
    }

    return () => {
      if (onClose && closeOnEscape) {
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [isVisible, onClose, closeOnEscape, lockBodyScroll, handleKeyDown]);

  const preset = variantPresets[variant] || variantPresets["slide-up"];
  const motionInitial = initial !== undefined ? initial : preset.initial;
  const motionAnimate = animate !== undefined ? animate : preset.animate;
  const motionExit = exit !== undefined ? exit : preset.exit;
  const motionTransition = transition !== undefined ? transition : preset.transition;

  const content = (
    <motion.div
      ref={ref}
      initial={motionInitial}
      animate={motionAnimate}
      exit={motionExit}
      transition={motionTransition}
      className={cn(
        "fixed inset-0 bg-background",
        zIndex,
        scrollable ? "overflow-y-auto" : "overflow-hidden",
        className,
      )}
      {...rest}
    >
      {showAccentLine && (
        <div
          className={cn(
            "h-[2px] bg-gradient-to-r from-primary/80 via-primary/40 to-transparent shrink-0",
            accentLineClassName,
          )}
        />
      )}
      {children}
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isVisible ? content : null}
    </AnimatePresence>
  );
});

FixedInsetMotionContainer.displayName = "FixedInsetMotionContainer";

/* ─── Header Sub-component ──────────────────────────────────────────────── */
export interface FixedInsetMotionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sticky?: boolean;
  maxWidthClassName?: string;
  children: React.ReactNode;
}

export const FixedInsetMotionHeader = React.forwardRef<
  HTMLDivElement,
  FixedInsetMotionHeaderProps
>(function FixedInsetMotionHeader(
  {
    sticky = true,
    maxWidthClassName = "max-w-7xl mx-auto px-6",
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cn(
        "bg-background/80 backdrop-blur-xl border-b border-border/60 shrink-0",
        sticky && "sticky top-0 z-40",
        className,
      )}
      {...props}
    >
      <div className={maxWidthClassName}>{children}</div>
    </header>
  );
});

FixedInsetMotionHeader.displayName = "FixedInsetMotionHeader";

/* ─── Body Sub-component ────────────────────────────────────────────────── */
export interface FixedInsetMotionBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  maxWidthClassName?: string;
  children: React.ReactNode;
}

export const FixedInsetMotionBody = React.forwardRef<
  HTMLDivElement,
  FixedInsetMotionBodyProps
>(function FixedInsetMotionBody(
  {
    maxWidthClassName = "max-w-7xl mx-auto px-6 py-8",
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <main
      ref={ref}
      className={cn("w-full", maxWidthClassName, className)}
      {...props}
    >
      {children}
    </main>
  );
});

FixedInsetMotionBody.displayName = "FixedInsetMotionBody";

/* ─── Footer Sub-component ──────────────────────────────────────────────── */
export interface FixedInsetMotionFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sticky?: boolean;
  maxWidthClassName?: string;
  children: React.ReactNode;
}

export const FixedInsetMotionFooter = React.forwardRef<
  HTMLDivElement,
  FixedInsetMotionFooterProps
>(function FixedInsetMotionFooter(
  {
    sticky = true,
    maxWidthClassName = "max-w-7xl mx-auto px-6 py-4",
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <footer
      ref={ref}
      className={cn(
        "bg-background/80 backdrop-blur-xl border-t border-border/60 shrink-0",
        sticky && "sticky bottom-0 z-30",
        className,
      )}
      {...props}
    >
      <div className={maxWidthClassName}>{children}</div>
    </footer>
  );
});

FixedInsetMotionFooter.displayName = "FixedInsetMotionFooter";

/* ─── Compound Export & Aliases ─────────────────────────────────────────── */
export const FixedInsetMotionDiv = FixedInsetMotionContainer;
export const FixedMotionContainer = FixedInsetMotionContainer;

export const FixedInset = Object.assign(FixedInsetMotionContainer, {
  Header: FixedInsetMotionHeader,
  Body: FixedInsetMotionBody,
  Footer: FixedInsetMotionFooter,
});

export default FixedInsetMotionContainer;
