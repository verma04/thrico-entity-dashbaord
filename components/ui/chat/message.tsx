"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MessageContextValue {
  align: "start" | "end";
}

const MessageContext = React.createContext<MessageContextValue>({ align: "start" });

export function useMessage() {
  return React.useContext(MessageContext);
}

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end";
}

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className, align = "start", children, ...props }, ref) => {
    return (
      <MessageContext.Provider value={{ align }}>
        <div
          ref={ref}
          className={cn(
            "group relative flex w-full text-xs leading-relaxed",
            align === "end" ? "justify-end" : "justify-start gap-3",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </MessageContext.Provider>
    );
  }
);
Message.displayName = "Message";

export const MessageGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-1 w-full", className)} {...props}>
        {children}
      </div>
    );
  }
);
MessageGroup.displayName = "MessageGroup";

export const MessageAvatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-xl border text-xs font-semibold shadow-2xs mt-0.5 overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageAvatar.displayName = "MessageAvatar";

export const MessageContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { align } = useMessage();
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-1 w-full",
          align === "end"
            ? "items-end max-w-[85%] sm:max-w-[78%] ml-auto"
            : "items-start max-w-[90%] sm:max-w-[82%]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageContent.displayName = "MessageContent";

export const MessageHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 text-[11px] text-muted-foreground px-1 select-none", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageHeader.displayName = "MessageHeader";

export const MessageFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { align } = useMessage();
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-1.5 text-[11px] text-muted-foreground select-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 px-1 pt-0.5",
          align === "end" ? "justify-end" : "justify-start",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageFooter.displayName = "MessageFooter";
