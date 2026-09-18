"use client";

import * as React from "react";
import { Users, Briefcase, TrendingUp, TrendingDown, ArrowRight, BarChart3, Shield, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Attachment = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs transition-all hover:border-border hover:shadow-xs w-full max-w-md my-1.5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Attachment.displayName = "Attachment";

export const AttachmentMedia = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40 text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AttachmentMedia.displayName = "AttachmentMedia";

export const AttachmentContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex-1 min-w-0 space-y-1", className)} {...props}>
        {children}
      </div>
    );
  }
);
AttachmentContent.displayName = "AttachmentContent";

export const AttachmentTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h4
        ref={ref}
        className={cn("text-xs font-bold text-foreground leading-tight truncate", className)}
        {...props}
      >
        {children}
      </h4>
    );
  }
);
AttachmentTitle.displayName = "AttachmentTitle";

export const AttachmentDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-[11px] text-muted-foreground leading-snug line-clamp-2", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
AttachmentDescription.displayName = "AttachmentDescription";

export const AttachmentActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 pt-2 border-t border-border/40 text-[11px]", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AttachmentActions.displayName = "AttachmentActions";

/**
 * High-level dynamic widget renderer for Thrico AI tool results
 */
export function AgentWidgetAttachment({
  widget,
  onActionClick,
}: {
  widget: any;
  onActionClick?: (actionMsg: string) => void;
}) {
  if (!widget || !widget.type) return null;

  switch (widget.type) {
    case "community-card":
      return (
        <Attachment className="border-blue-500/20 bg-blue-500/5">
          <div className="flex items-start gap-3">
            <AttachmentMedia className="bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900">
              <Users className="h-4 w-4" />
            </AttachmentMedia>
            <AttachmentContent>
              <div className="flex items-center justify-between gap-2">
                <AttachmentTitle>{widget.name || "Community"}</AttachmentTitle>
                {widget.memberCount !== undefined && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-blue-600 border-blue-200">
                    {widget.memberCount} members
                  </Badge>
                )}
              </div>
              <AttachmentDescription>
                {widget.description || "Active community group"}
              </AttachmentDescription>
            </AttachmentContent>
          </div>
          {widget.communityId && (
            <AttachmentActions className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px] text-blue-600 hover:text-blue-700 hover:bg-blue-500/10 ml-auto gap-1"
                onClick={() => onActionClick?.(`Inspect community ${widget.communityId}`)}
              >
                <span>View Details</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </Button>
            </AttachmentActions>
          )}
        </Attachment>
      );

    case "job-card":
      return (
        <Attachment className="border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-start gap-3">
            <AttachmentMedia className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900">
              <Briefcase className="h-4 w-4" />
            </AttachmentMedia>
            <AttachmentContent>
              <div className="flex items-center justify-between gap-2">
                <AttachmentTitle>{widget.title || "Job Opening"}</AttachmentTitle>
                {widget.location && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-emerald-600 border-emerald-200">
                    {widget.location}
                  </Badge>
                )}
              </div>
              <AttachmentDescription>
                {widget.company ? `${widget.company} • ` : ""}
                {widget.description || "Career opportunity in community"}
              </AttachmentDescription>
            </AttachmentContent>
          </div>
        </Attachment>
      );

    case "metric-card":
      return (
        <Attachment className="border-border">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">
                {widget.title}
              </span>
              <strong className="text-base font-bold text-foreground block mt-0.5">
                {widget.value}
              </strong>
            </div>
            {widget.change && (
              <div
                className={cn(
                  "flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md",
                  widget.trend === "up"
                    ? "text-emerald-700 bg-emerald-500/10"
                    : widget.trend === "down"
                    ? "text-rose-700 bg-rose-500/10"
                    : "text-muted-foreground bg-muted"
                )}
              >
                {widget.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{widget.change}</span>
              </div>
            )}
          </div>
        </Attachment>
      );

    case "customer-360-card":
      return (
        <Attachment className="border-indigo-500/20 bg-indigo-500/5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-indigo-600" />
                <span className="text-xs font-bold text-foreground">Customer 360 Health</span>
              </div>
              <Badge className="bg-indigo-600 text-white text-[10px]">
                Score: {widget.healthScore ?? 85}/100
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] bg-background/60 p-2 rounded-lg border border-border/40">
              <div>
                <span className="text-muted-foreground block text-[9px]">RFM Segment</span>
                <strong className="font-semibold text-foreground">{widget.rfmSegment || "Loyal"}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[9px]">Total Spend</span>
                <strong className="font-semibold text-foreground">
                  {widget.totalSpend ? `₹${widget.totalSpend}` : "N/A"}
                </strong>
              </div>
            </div>
          </div>
        </Attachment>
      );

    case "table": {
      const rawColumns: any[] = Array.isArray(widget.columns) ? widget.columns : [];
      const normalizedColumns = rawColumns.map((col: any) => {
        if (typeof col === "object" && col !== null) {
          return {
            key: String(col.key || col.name || col.id || ""),
            label: String(col.label || col.title || col.name || col.key || ""),
          };
        }
        const str = String(col ?? "");
        return { key: str, label: str };
      });

      return (
        <div className="overflow-x-auto my-2 rounded-xl border border-border/70 bg-card p-2 text-xs w-full max-w-full">
          {widget.title && (
            <div className="px-2 py-1.5 font-bold text-xs text-foreground border-b border-border/40 mb-1 flex items-center justify-between">
              <span>{typeof widget.title === "string" ? widget.title : "Data Table"}</span>
              {widget.totalCount !== undefined && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-muted-foreground">
                  {widget.totalCount} total
                </Badge>
              )}
            </div>
          )}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-[10px] text-muted-foreground uppercase">
                {normalizedColumns.map((col, i) => (
                  <th key={i} className="p-2 font-bold">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(widget.rows) &&
                widget.rows.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/30">
                    {normalizedColumns.map((col, j) => {
                      const val =
                        row?.[col.key] ??
                        row?.[col.key.toLowerCase()] ??
                        row?.[col.label] ??
                        row?.[col.label.toLowerCase()] ??
                        "-";
                      const rendered =
                        typeof val === "object" && val !== null
                          ? (val.name || val.title || val.label || JSON.stringify(val))
                          : String(val ?? "-");
                      return (
                        <td key={j} className="p-2 text-foreground text-[11px] font-medium">
                          {rendered}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      );
    }

    case "survey-card": {
      const shareUrl = widget.shareUrl || widget.shortUrl;
      return (
        <Attachment className="border-indigo-500/20 bg-indigo-500/5">
          <div className="flex items-start gap-3">
            <AttachmentMedia className="bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-900">
              <CheckCircle className="h-4 w-4" />
            </AttachmentMedia>
            <AttachmentContent>
              <div className="flex items-center justify-between gap-2">
                <AttachmentTitle>{widget.title || "Community Survey"}</AttachmentTitle>
                {widget.status && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-indigo-600 border-indigo-200 uppercase font-semibold">
                    {widget.status}
                  </Badge>
                )}
              </div>
              <AttachmentDescription>
                {widget.description || "Interactive survey for community members"}
              </AttachmentDescription>
              {(widget.questionsCount !== undefined || widget.responsesCount !== undefined) && (
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1">
                  {widget.questionsCount !== undefined && (
                    <span>{widget.questionsCount} question{widget.questionsCount !== 1 ? "s" : ""}</span>
                  )}
                  {widget.responsesCount !== undefined && (
                    <span>{widget.responsesCount} response{widget.responsesCount !== 1 ? "s" : ""}</span>
                  )}
                </div>
              )}
            </AttachmentContent>
          </div>
          {shareUrl && (
            <AttachmentActions className="mt-2">
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="h-6 px-2.5 text-[10px] text-indigo-600 hover:text-indigo-700 hover:bg-indigo-500/10 rounded-md font-medium inline-flex items-center gap-1 ml-auto cursor-pointer"
              >
                <span>Open Survey</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </a>
            </AttachmentActions>
          )}
        </Attachment>
      );
    }

    case "poll-card": {
      const total = Number(widget.totalVotes || 0);
      const options = Array.isArray(widget.options) ? widget.options : [];
      return (
        <Attachment className="border-purple-500/20 bg-purple-500/5">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider block">
                  Community Poll
                </span>
                <AttachmentTitle className="mt-0.5">{widget.question || widget.title}</AttachmentTitle>
              </div>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-purple-600 border-purple-200 shrink-0">
                {total} vote{total !== 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="space-y-1.5 pt-1">
              {options.map((opt: any, oIdx: number) => {
                const votes = Number(opt.votes || 0);
                const pct = opt.percentage ?? (total > 0 ? Math.round((votes / total) * 100) : 0);
                const text = typeof opt === "string" ? opt : (opt.text || opt.option || `Option ${oIdx + 1}`);
                return (
                  <div key={oIdx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-foreground font-medium">{text}</span>
                      <span className="text-muted-foreground tabular-nums text-[10px] font-semibold">
                        {votes} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Attachment>
      );
    }

    case "funnel-chart":
      return (
        <Attachment className="max-w-md w-full">
          <div className="flex items-center gap-2 pb-2 border-b border-border/50 text-xs font-bold text-foreground">
            <BarChart3 className="h-3.5 w-3.5 text-indigo-600" />
            <span>{widget.title || "Conversion Funnel"}</span>
          </div>
          <div className="space-y-1.5 pt-2">
            {widget.steps?.map((step: any, idx: number) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground font-medium">{step.name}</span>
                  <span className="font-bold text-foreground">
                    {step.count} ({step.conversionRate}%)
                  </span>
                </div>
                <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(5, step.conversionRate))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Attachment>
      );

    default:
      return null;
  }
}
