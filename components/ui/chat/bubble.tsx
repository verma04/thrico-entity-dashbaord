"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMessage } from "./message";

export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "muted" | "outline" | "ghost";
}

export const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
  ({ className, variant, children, ...props }, ref) => {
    const { align } = useMessage();

    // Default variant by role alignment if not explicitly provided
    const resolvedVariant = variant || (align === "end" ? "primary" : "muted");

    const variantStyles = {
      primary:
        "bg-[#1e1e24] text-white dark:bg-zinc-100 dark:text-zinc-900 border border-zinc-800/80 dark:border-zinc-300 shadow-xs rounded-2xl rounded-tr-xs",
      muted:
        "bg-card border border-border/75 text-card-foreground shadow-2xs rounded-2xl rounded-tl-xs",
      outline:
        "bg-background border border-border text-foreground shadow-2xs rounded-2xl",
      ghost:
        "bg-transparent text-foreground border-transparent",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl px-4 py-2.5 sm:px-4.5 sm:py-3 text-xs sm:text-[13px] leading-relaxed transition-all",
          variantStyles[resolvedVariant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Bubble.displayName = "Bubble";

export const BubbleGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5 w-full", className)} {...props}>
        {children}
      </div>
    );
  }
);
BubbleGroup.displayName = "BubbleGroup";

interface BubbleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  markdown?: boolean;
}

export const BubbleContent = React.forwardRef<HTMLDivElement, BubbleContentProps>(
  ({ className, markdown = false, children, ...props }, ref) => {
    if (markdown && typeof children === "string") {
      return (
        <div
          ref={ref}
          className={cn(
            "prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed break-words",
            "[&>p]:mb-2.5 [&>p:last-child]:mb-0",
            "[&>ul]:list-disc [&>ul]:pl-4 [&>ul]:my-2 [&>ul>li]:mb-1",
            "[&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:my-2 [&>ol>li]:mb-1",
            "[&>blockquote]:border-l-2 [&>blockquote]:border-indigo-500 [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:opacity-85",
            "[&>table]:w-full [&>table]:border-collapse [&>table]:my-2 [&>table]:text-[11px]",
            "[&>table_th]:border [&>table_th]:border-border [&>table_th]:p-1.5 [&>table_th]:bg-muted/50 [&>table_th]:font-semibold",
            "[&>table_td]:border [&>table_td]:border-border [&>table_td]:p-1.5",
            "[&>pre]:bg-zinc-900 [&>pre]:text-zinc-100 [&>pre]:p-3 [&>pre]:rounded-xl [&>pre]:my-2.5 [&>pre]:overflow-x-auto",
            "[&>code]:font-mono [&>code]:text-[11px] [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:bg-muted/70 [&>code]:border [&>code]:border-border/40 [&>code]:font-medium",
            className
          )}
          {...props}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children: codeChildren, ...codeProps }: any) {
                if (inline) {
                  return (
                    <code className={cn("bg-muted/70 text-foreground border border-border/40 px-1.5 py-0.5 rounded-md font-mono text-[11px] font-medium", className)} {...codeProps}>
                      {codeChildren}
                    </code>
                  );
                }
                return <CodeBlock code={String(codeChildren).replace(/\n$/, "")} className={className} />;
              },
            }}
          >
            {children}
          </ReactMarkdown>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("whitespace-pre-wrap break-words", className)} {...props}>
        {children}
      </div>
    );
  }
);
BubbleContent.displayName = "BubbleContent";

function CodeBlock({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code my-2 rounded-xl overflow-hidden border border-zinc-700/60 bg-zinc-950 text-zinc-100">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-400 font-mono">
        <span>{className?.replace("language-", "") || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-3 text-[11px] overflow-x-auto font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export const BubbleReactions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-1 mt-1 text-[10px] text-muted-foreground select-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BubbleReactions.displayName = "BubbleReactions";
