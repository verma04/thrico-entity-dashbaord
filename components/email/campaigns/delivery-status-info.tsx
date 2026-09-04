"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, HelpCircle, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmailStatusDetail {
  key: string;
  label: string;
  emoji: string;
  stageNumber: 1 | 2 | 3 | 4;
  stageName: string;
  stageColor: string;
  pillClass: string;
  dotClass: string;
  whatItMeans: string;
  whenItHappens: string;
  trackedFields?: string;
  actionNote?: string;
}

export const EMAIL_STATUS_MAP: Record<string, EmailStatusDetail> = {
  pending: {
    key: "pending",
    label: "Pending",
    emoji: "⏳",
    stageNumber: 1,
    stageName: "1. Preparation & Queueing",
    stageColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
    pillClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    dotClass: "bg-amber-500",
    whatItMeans: "The recipient has been added to the campaign list, but the sending process has not yet started.",
    whenItHappens: "When a campaign is created, scheduled, or recipients are being resolved from user filters/segments before processing.",
  },
  queued: {
    key: "queued",
    label: "Queued",
    emoji: "📦",
    stageNumber: 1,
    stageName: "1. Preparation & Queueing",
    stageColor: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800",
    pillClass: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
    dotClass: "bg-sky-500",
    whatItMeans: "The email payload (personalized HTML, tracking tokens, headers) has been prepared and pushed to the message queue (SQS / BullMQ).",
    whenItHappens: "The background worker is about to pick it up and dispatch it to AWS SES.",
  },
  sent: {
    key: "sent",
    label: "Sent",
    emoji: "🚀",
    stageNumber: 2,
    stageName: "2. Dispatch & Transmission",
    stageColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800",
    pillClass: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
    dotClass: "bg-indigo-500",
    whatItMeans: "The email was successfully dispatched from your backend server to AWS SES (or the email delivery gateway).",
    whenItHappens: "AWS SES accepted the email request and returned an sesMessageId. (Note: It has left your server, but has not yet confirmed arrival at the recipient's mailbox).",
    trackedFields: "sesMessageId, createdAt",
  },
  delivered: {
    key: "delivered",
    label: "Delivered",
    emoji: "✅",
    stageNumber: 2,
    stageName: "2. Dispatch & Transmission",
    stageColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    pillClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    dotClass: "bg-emerald-500",
    whatItMeans: "The recipient's mail provider (e.g., Gmail, Outlook, Yahoo) accepted the email and confirmed it was placed into the recipient's mailbox.",
    whenItHappens: "AWS SES receives a Send/Delivery confirmation from the destination mail server and sends a webhook to your backend.",
  },
  failed: {
    key: "failed",
    label: "Failed",
    emoji: "❌",
    stageNumber: 2,
    stageName: "2. Dispatch & Transmission",
    stageColor: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800",
    pillClass: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
    dotClass: "bg-red-500",
    whatItMeans: "The email could not be sent out from your system or AWS SES rejected the request before attempting delivery.",
    whenItHappens: "Internal sending errors, missing required template variables, API connection timeout, or SES account rate limit / suspension issues.",
  },
  opened: {
    key: "opened",
    label: "Opened",
    emoji: "👁️",
    stageNumber: 3,
    stageName: "3. User Engagement",
    stageColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
    pillClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    dotClass: "bg-blue-500",
    whatItMeans: "The recipient opened and viewed the email.",
    whenItHappens: "The hidden 1x1 transparent tracking pixel embedded in the email is loaded when the user opens the email in their client.",
    trackedFields: "Updates openCount, firstOpenedAt, and lastOpenedAt.",
  },
  clicked: {
    key: "clicked",
    label: "Clicked",
    emoji: "🖱️",
    stageNumber: 3,
    stageName: "3. User Engagement",
    stageColor: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
    pillClass: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
    dotClass: "bg-purple-500",
    whatItMeans: "The recipient clicked on one or more links inside the email.",
    whenItHappens: "The user clicks a tracked link, which routes through your redirect tracking endpoint before forwarding them to the destination URL.",
    trackedFields: "Updates clickCount, firstClickedAt, and lastClickedAt.",
  },
  bounced: {
    key: "bounced",
    label: "Bounced",
    emoji: "🚫",
    stageNumber: 4,
    stageName: "4. Delivery Issues & Suppression",
    stageColor: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
    pillClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    dotClass: "bg-rose-500",
    whatItMeans: "The email reached the recipient's mail server, but the server rejected it. (Permanent Hard Bounce or Transient Soft Bounce).",
    whenItHappens: "Destination SMTP server rejects delivery and sends bounce notification to SES.",
    trackedFields: "bouncedAt, bounceType, bounceReason. Permanent bounces are automatically added to the Suppression List.",
    actionNote: "Permanent bounces are automatically added to the Suppression List.",
  },
  complained: {
    key: "complained",
    label: "Complained",
    emoji: "⚠️",
    stageNumber: 4,
    stageName: "4. Delivery Issues & Suppression",
    stageColor: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700",
    pillClass: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700",
    dotClass: "bg-amber-600",
    whatItMeans: "The email was delivered, but the recipient clicked 'Report Spam' or 'Mark as Junk'.",
    whenItHappens: "The mailbox provider's Feedback Loop (FBL) notifies AWS SES, which triggers your webhook.",
    trackedFields: "complainedAt. The email is automatically added to the Suppression List to prevent future sends.",
    actionNote: "Automatically added to Suppression List to prevent sender reputation damage.",
  },
  unsubscribed: {
    key: "unsubscribed",
    label: "Unsubscribed",
    emoji: "🔕",
    stageNumber: 4,
    stageName: "4. Delivery Issues & Suppression",
    stageColor: "text-zinc-700 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700",
    pillClass: "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
    dotClass: "bg-zinc-500",
    whatItMeans: "The recipient clicked the 'Unsubscribe' link in the footer or email header.",
    whenItHappens: "The user confirms unsubscribe via the unsubscription page.",
    trackedFields: "unsubscribedAt. The email is added to the Suppression List (reason: 'unsubscribe').",
    actionNote: "Recipient opted out and will not receive future marketing broadcasts.",
  },
};

export const STAGES_LIST = [
  {
    number: 1,
    title: "1. Preparation & Queueing",
    description: "Recipient list building, template compilation, and job queue dispatch.",
    statuses: ["pending", "queued"],
  },
  {
    number: 2,
    title: "2. Dispatch & Transmission",
    description: "Gateway transmission to AWS SES and delivery to recipient inbox servers.",
    statuses: ["sent", "delivered", "failed"],
  },
  {
    number: 3,
    title: "3. User Engagement (Positive)",
    description: "Direct member interactions, tracking pixel views, and URL clickthroughs.",
    statuses: ["opened", "clicked"],
  },
  {
    number: 4,
    title: "4. Delivery Issues & Suppression",
    description: "Server bounces, spam reports, and unsubscription suppression records.",
    statuses: ["bounced", "complained", "unsubscribed"],
  },
];

export function getStatusDetail(status?: string): EmailStatusDetail {
  if (!status) return EMAIL_STATUS_MAP.sent;
  const key = String(status).toLowerCase().trim();
  return (
    EMAIL_STATUS_MAP[key] || {
      key,
      label: status.charAt(0).toUpperCase() + status.slice(1),
      emoji: "ℹ️",
      stageNumber: 2,
      stageName: "Transmission",
      stageColor: "text-zinc-600 bg-zinc-100 border-zinc-200",
      pillClass: "bg-muted text-muted-foreground border-border",
      dotClass: "bg-muted-foreground",
      whatItMeans: `Recipient email delivery status: ${status}.`,
      whenItHappens: "Recorded during broadcast transmission.",
    }
  );
}

/**
 * Rich Delivery Status Badge with Hover Tooltip
 */
export function DeliveryStatusBadgeWithTooltip({
  status,
  className,
}: {
  status?: string;
  className?: string;
}) {
  const detail = getStatusDetail(status);

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border cursor-help transition-all hover:opacity-90 shadow-2xs",
              detail.pillClass,
              className
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", detail.dotClass)} />
            <span className="capitalize">{detail.label}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          className="max-w-[300px] p-3 rounded-lg bg-zinc-950 text-zinc-100 border border-zinc-800 shadow-xl space-y-2 text-left"
        >
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{detail.emoji}</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {detail.label}
              </span>
            </div>
            <span className="text-[9.5px] font-medium text-zinc-400 px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800">
              Stage {detail.stageNumber}
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <p className="text-zinc-300 leading-snug">
              <strong className="text-zinc-100 font-semibold">What it means:</strong> {detail.whatItMeans}
            </p>
            <p className="text-zinc-400 leading-snug pt-0.5">
              <strong className="text-zinc-200 font-semibold">When it happens:</strong> {detail.whenItHappens}
            </p>
            {detail.trackedFields && (
              <p className="text-[10px] text-zinc-400 pt-1 border-t border-zinc-800/60 font-mono">
                ⚡ {detail.trackedFields}
              </p>
            )}
            {detail.actionNote && (
              <p className="text-[10px] text-amber-400 pt-0.5 font-medium flex items-center gap-1">
                🛡️ {detail.actionNote}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Filter Pill with Status Definition Tooltip
 */
export function StatusFilterPillWithTooltip({
  statusKey,
  label,
  isActive,
  onClick,
}: {
  statusKey: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const detail = EMAIL_STATUS_MAP[statusKey.toLowerCase()];

  if (!detail || statusKey === "ALL") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "px-2.5 py-1 rounded-[4px] text-[11px] font-bold transition-all cursor-pointer",
          isActive
            ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
            : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        {label}
      </button>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            className={cn(
              "px-2.5 py-1 rounded-[4px] text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1",
              isActive
                ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
                : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <span>{detail.emoji}</span>
            <span>{label}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="max-w-[260px] p-2.5 bg-zinc-950 text-zinc-100 border border-zinc-800 shadow-lg text-[11px] space-y-1 rounded-md"
        >
          <p className="font-bold text-white flex items-center gap-1">
            {detail.emoji} {detail.label} <span className="text-[10px] text-zinc-400 font-normal">({detail.stageName})</span>
          </p>
          <p className="text-zinc-300 text-[10.5px] leading-tight">
            {detail.whatItMeans}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Full 4-Stage Delivery Status Lifecycle Guide (Popover Reference)
 */
export function DeliveryStatusLifecycleGuide() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-semibold border-border/60 bg-card hover:bg-muted/60 rounded-[4px] px-2.5 cursor-pointer text-muted-foreground hover:text-foreground shadow-2xs shrink-0"
        >
          <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
          Status Guide
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        className="w-[380px] sm:w-[460px] p-4 max-h-[80vh] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl space-y-4 text-left z-[200]"
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">
                Email Transmission &amp; Delivery Lifecycle
              </h4>
              <p className="text-[10.5px] text-muted-foreground">
                Complete guide to recipient states and engagement triggers
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {STAGES_LIST.map((stage) => (
            <div key={stage.number} className="space-y-2 border-b border-border/40 pb-3 last:border-none last:pb-0">
              <div>
                <h5 className="text-[11.5px] font-bold text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                  {stage.title}
                </h5>
                <p className="text-[10px] text-muted-foreground">
                  {stage.description}
                </p>
              </div>

              <div className="space-y-2 pl-3 border-l-2 border-border/60">
                {stage.statuses.map((key) => {
                  const item = EMAIL_STATUS_MAP[key];
                  if (!item) return null;
                  return (
                    <div key={key} className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">{item.emoji}</span>
                        <span className="font-bold text-[11px] text-foreground">
                          {item.label}
                        </span>
                        <span className={cn("text-[9px] px-1.5 py-0 rounded border font-semibold", item.pillClass)}>
                          {item.key}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-muted-foreground leading-snug">
                        <span className="text-foreground/80 font-medium">What it means:</span> {item.whatItMeans}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80 leading-snug">
                        <span className="text-foreground/70 font-medium">When it happens:</span> {item.whenItHappens}
                      </p>
                      {item.trackedFields && (
                        <p className="text-[9.5px] text-indigo-600 dark:text-indigo-400 font-mono pt-0.5">
                          ⚡ {item.trackedFields}
                        </p>
                      )}
                      {item.actionNote && (
                        <p className="text-[9.5px] text-amber-600 dark:text-amber-400 font-medium">
                          🛡️ {item.actionNote}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
