"use client";

import * as React from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MessageScrollerContextValue {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  bottomAnchorRef: React.RefObject<HTMLDivElement | null>;
  isAtBottom: boolean;
  setIsAtBottom: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToBottom: (options?: { smooth?: boolean }) => void;
  scrollToMessage: (messageId: string) => void;
}

const MessageScrollerContext = React.createContext<MessageScrollerContextValue | null>(null);

export function useMessageScroller() {
  const context = React.useContext(MessageScrollerContext);
  if (!context) {
    throw new Error("useMessageScroller must be used within a MessageScrollerProvider");
  }
  return context;
}

interface MessageScrollerProviderProps {
  children: React.ReactNode;
}

export function MessageScrollerProvider({ children }: MessageScrollerProviderProps) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const bottomAnchorRef = React.useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = React.useState(true);

  const scrollToBottom = React.useCallback((options: { smooth?: boolean } = { smooth: true }) => {
    const el = viewportRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: options.smooth ? "smooth" : "auto",
      });
    }
    bottomAnchorRef.current?.scrollIntoView({
      behavior: options.smooth ? "smooth" : "auto",
      block: "end",
    });
  }, []);

  const scrollToMessage = React.useCallback((messageId: string) => {
    const el = viewportRef.current;
    if (!el) return;
    const target = el.querySelector(`[data-message-id="${messageId}"]`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <MessageScrollerContext.Provider
      value={{
        viewportRef,
        bottomAnchorRef,
        isAtBottom,
        setIsAtBottom,
        scrollToBottom,
        scrollToMessage,
      }}
    >
      {children}
    </MessageScrollerContext.Provider>
  );
}

interface MessageScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  fade?: boolean;
}

export const MessageScroller = React.forwardRef<HTMLDivElement, MessageScrollerProps>(
  ({ className, fade = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col min-h-0 h-full w-full overflow-hidden bg-background",
          fade && "scroll-fade",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageScroller.displayName = "MessageScroller";

interface MessageScrollerViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  onScrollBottomChange?: (isAtBottom: boolean) => void;
  autoScroll?: boolean;
}

export const MessageScrollerViewport = React.forwardRef<HTMLDivElement, MessageScrollerViewportProps>(
  ({ className, children, onScroll, autoScroll = true, ...props }, forwardedRef) => {
    const { viewportRef, bottomAnchorRef, setIsAtBottom, isAtBottom } = useMessageScroller();

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        (viewportRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [viewportRef, forwardedRef]
    );

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const threshold = 80;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
      setIsAtBottom(atBottom);
      onScroll?.(e);
    };

    // Auto-scroll on content update when user is near bottom
    React.useEffect(() => {
      if (autoScroll && isAtBottom) {
        bottomAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, [children, autoScroll, isAtBottom, bottomAnchorRef]);

    // Initial mount auto-scroll
    React.useEffect(() => {
      if (autoScroll) {
        bottomAnchorRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
      }
    }, [autoScroll, bottomAnchorRef]);

    return (
      <div
        ref={setRefs}
        onScroll={handleScroll}
        className={cn(
          "flex-1 min-h-0 h-full overflow-y-auto overscroll-contain px-4 sm:px-6 py-6",
          className
        )}
        style={{ scrollBehavior: "auto" }}
        {...props}
      >
        {children}
        <div ref={bottomAnchorRef as any} className="h-px w-full shrink-0 pointer-events-none" />
      </div>
    );
  }
);
MessageScrollerViewport.displayName = "MessageScrollerViewport";

export const MessageScrollerContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-5 max-w-3xl mx-auto w-full", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageScrollerContent.displayName = "MessageScrollerContent";

interface MessageScrollerItemProps extends React.HTMLAttributes<HTMLDivElement> {
  messageId: string;
  scrollAnchor?: boolean;
}

export const MessageScrollerItem = React.forwardRef<HTMLDivElement, MessageScrollerItemProps>(
  ({ className, messageId, scrollAnchor, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-message-id={messageId}
        data-scroll-anchor={scrollAnchor ? "true" : undefined}
        className={cn("w-full transition-all", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageScrollerItem.displayName = "MessageScrollerItem";

interface MessageScrollerButtonProps extends React.ComponentProps<typeof Button> {
  threshold?: number;
}

export function MessageScrollerButton({
  className,
  children,
  ...props
}: MessageScrollerButtonProps) {
  const { scrollToBottom, isAtBottom } = useMessageScroller();

  if (isAtBottom) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      type="button"
      onClick={() => scrollToBottom({ smooth: true })}
      className={cn(
        "absolute bottom-4 right-8 z-20 shadow-md rounded-full px-3 py-1.5 h-8 gap-1.5 text-xs bg-background/95 backdrop-blur-xs border-border/80 hover:bg-accent transition-all animate-in fade-in slide-in-from-bottom-2 cursor-pointer",
        className
      )}
      {...props}
    >
      <ArrowDown className="h-3.5 w-3.5" />
      <span>{children || "Jump to bottom"}</span>
    </Button>
  );
}
