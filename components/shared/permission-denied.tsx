"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowLeft,
  Lock,
  Copy,
  Check,
  Mail,
  Send,
  Users,
  Briefcase,
  Gift,
  ShoppingBag,
  Sparkles,
  Layers,
  Settings,
  FileText,
  ClipboardList,
  Globe,
  Activity,
  Shield,
  ExternalLink,
  Info,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserStore } from "@/store/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface PermissionDeniedProps {
  moduleKey?: string;
  title?: string;
  description?: string;
  action?: "canRead" | "canEdit" | "canCreate" | "canDelete" | string;
  requiredRole?: string;
  returnHref?: string;
  returnLabel?: string;
  compact?: boolean;
  className?: string;
  showContactAdmin?: boolean;
  customAction?: React.ReactNode;
}

// Module configuration dictionary for contextual display
const MODULE_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  moderation: {
    label: "Content Moderation",
    icon: ShieldAlert,
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  },
  ai_moderation: {
    label: "AI Moderation",
    icon: Sparkles,
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  },
  communities: {
    label: "Communities & Spaces",
    icon: Users,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  members: {
    label: "Members & Network",
    icon: Users,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  network: {
    label: "Members & Network",
    icon: Users,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  commerce: {
    label: "Commerce & Shopify",
    icon: ShoppingBag,
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  shopify: {
    label: "Shopify Store",
    icon: ShoppingBag,
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  rewards: {
    label: "Rewards & Loyalty",
    icon: Gift,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  settings: {
    label: "Workspace Settings",
    icon: Settings,
    color: "text-slate-500 bg-slate-500/10 border-slate-500/20",
  },
  reports: {
    label: "Reports & Analytics",
    icon: FileText,
    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  },
  surveys: {
    label: "Surveys & Feedback",
    icon: ClipboardList,
    color: "text-teal-500 bg-teal-500/10 border-teal-500/20",
  },
  jobs: {
    label: "Careers & Jobs",
    icon: Briefcase,
    color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
  },
  listing: {
    label: "Listings & Directory",
    icon: Layers,
    color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  },
  moments: {
    label: "Moments & Highlights",
    icon: Sparkles,
    color: "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/20",
  },
  website: {
    label: "Website Pages & Design",
    icon: Globe,
    color: "text-sky-500 bg-sky-500/10 border-sky-500/20",
  },
  auditlogs: {
    label: "Audit Logs",
    icon: Activity,
    color: "text-muted-foreground bg-muted border-border",
  },
};

function formatAction(action?: string): string {
  if (!action) return "View & Access";
  switch (action) {
    case "canRead":
      return "Read / View";
    case "canEdit":
      return "Edit & Modify";
    case "canCreate":
      return "Create & Publish";
    case "canDelete":
      return "Delete & Remove";
    default:
      return action;
  }
}

export function PermissionDenied({
  moduleKey = "module",
  title = "Permission Required",
  description,
  action,
  requiredRole,
  returnHref = "/",
  returnLabel = "Return to Dashboard",
  compact = false,
  className,
  showContactAdmin = true,
  customAction,
}: PermissionDeniedProps) {
  const user = useUserStore((state) => state.user);
  const [copied, setCopied] = useState(false);
  const [requestNote, setRequestNote] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const normalizedKey = moduleKey.toLowerCase().replace(/[-_]/g, "");
  const moduleMeta = MODULE_CONFIG[normalizedKey] || {
    label:
      moduleKey.charAt(0).toUpperCase() +
      moduleKey.slice(1).replace(/[-_]/g, " "),
    icon: Shield,
    color: "text-foreground/80 bg-muted/60 border-border/60",
  };

  const ModuleIcon = moduleMeta.icon;
  const userFullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Current User";
  const userRole = user?.role?.name || "Workspace Member";
  const targetRequiredRole = requiredRole || "Administrator / Super Admin";

  const defaultDescription =
    description ||
    `You don't currently have the required permissions to access the ${moduleMeta.label} module. Access is restricted by your organization's role policy.`;

  const requestTemplate = `Hi Administrator,\n\nI would like to request access to the "${moduleMeta.label}" module for my account:\n• Name: ${userFullName}\n• Email: ${user?.email || "N/A"}\n• Current Role: ${userRole}\n• Requested Action: ${formatAction(action)}\n${requestNote ? `• Note: ${requestNote}\n` : ""}\nThank you!`;

  const handleCopyRequest = () => {
    navigator.clipboard.writeText(requestTemplate);
    setCopied(true);
    toast.success("Access request template copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const mailtoLink = `mailto:?subject=${encodeURIComponent(
    `Access Request: ${moduleMeta.label} Module`,
  )}&body=${encodeURIComponent(requestTemplate)}`;

  // Compact banner variant for inline containers / widgets
  if (compact) {
    return (
      <div
        className={cn(
          "rounded-xl border border-rose-500/20 bg-gradient-to-r from-rose-500/5 via-card to-card p-4 sm:p-5 shadow-xs",
          className,
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <ShieldAlert className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">
                  {title}
                </h4>
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                >
                  Restricted
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-lg">
                {defaultDescription}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={returnHref}>
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Button>
            </Link>
            {showContactAdmin && (
              <Button
                size="sm"
                onClick={handleCopyRequest}
                className="h-8 text-xs gap-1.5"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Request Access"}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex min-h-[calc(100vh-14rem)] w-full items-center justify-center p-4 sm:p-8 overflow-hidden",
        className,
      )}
    >
      {/* Dynamic Ambient Background Illumination */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary soft radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full opacity-[0.06] dark:opacity-[0.12] blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--destructive) 0%, #f59e0b 45%, transparent 70%)",
          }}
        />

        {/* Delicate technical grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Soft diagonal highlight sweep */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent, transparent 15px, var(--foreground) 15px, var(--foreground) 16px)",
          }}
        />
      </div>

      {/* Main Container Card */}
      <div className="relative w-full max-w-xl rounded-3xl border border-border/80 dark:border-border/40 bg-card/85 backdrop-blur-xl p-6 sm:p-10 shadow-xl flex flex-col items-center text-center">
        {/* Multi-tier Security Crest Badge */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Animated Dashed Orbiting Ring */}
          <div className="absolute -inset-6 rounded-full border border-dashed border-destructive/25 dark:border-destructive/35 animate-[spin_35s_linear_infinite]" />

          {/* Outer Concentric Echo Ring */}
          <div className="absolute -inset-3 rounded-full border border-border/40 scale-105" />

          {/* Glow Halo */}
          <div
            className="absolute inset-0 rounded-2xl blur-xl opacity-30 dark:opacity-40 scale-125"
            style={{
              background:
                "linear-gradient(135deg, var(--destructive), #ea580c, #f59e0b)",
            }}
          />

          {/* Frosted Icon Box */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-b from-card to-muted/80 border border-border/80 shadow-md">
            <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/15 via-rose-500/10 to-amber-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="h-7 w-7" strokeWidth={1.9} />
            </div>

            {/* Micro Lock Overlay Pill */}
            <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border shadow-xs">
              <Lock className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 mb-4 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span className="text-[11px] font-bold tracking-wider uppercase text-rose-700 dark:text-rose-300">
            Access Restricted • 403
          </span>
        </div>

        {/* Header & Module Pill */}
        <div className="space-y-3 mb-6 max-w-md">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
          </div>

          {/* Module tag badge */}
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xs text-muted-foreground">Target Module:</span>
            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full shadow-2xs",
                moduleMeta.color,
              )}
            >
              <ModuleIcon className="h-3 w-3" />
              <span>{moduleMeta.label}</span>
            </Badge>
          </div>

          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-md mx-auto pt-1">
            {defaultDescription}
          </p>
        </div>

        {/* Security Scope & Diagnostic Matrix ("Series / Breakdown") */}
        <div className="w-full rounded-2xl border border-border/60 bg-muted/25 dark:bg-muted/15 p-4 sm:p-5 mb-8 text-left transition-all hover:border-border/90">
          <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-amber-500" />
              Security Scope & Credentials
            </span>
            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
              <Info className="h-3 w-3" /> RBAC Enforced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Account Info */}
            <div className="p-2.5 rounded-xl bg-card border border-border/40 shadow-2xs">
              <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
                Your Account
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                  {userFullName.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <span className="font-semibold text-foreground block truncate text-xs">
                    {userFullName}
                  </span>
                  <span className="text-[10px] text-muted-foreground block truncate">
                    {userRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Clearance Required */}
            <div className="p-2.5 rounded-xl bg-card border border-border/40 shadow-2xs">
              <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
                Required Clearance
              </span>
              <div className="flex items-center gap-1.5 text-foreground font-semibold">
                <Shield className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span className="text-xs truncate">{targetRequiredRole}</span>
              </div>
              <span className="text-[10px] text-muted-foreground block mt-0.5">
                Scope: {formatAction(action)}
              </span>
            </div>
          </div>

          {/* Quick Explanation Footer */}
          <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Need permission to view or manage this section?</span>
            <span className="text-foreground/80 font-medium">Contact Workspace Admin</span>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-md">
          {/* Primary Return Button */}
          <Link href={returnHref} className="w-full sm:flex-1">
            <Button
              className="w-full gap-2 h-9 text-xs font-semibold shadow-xs"
              size="default"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {returnLabel}
            </Button>
          </Link>

          {/* Request Access Dialog Workflow */}
          {showContactAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:flex-1 gap-2 h-9 text-xs font-semibold border-border hover:bg-muted/80"
                  size="default"
                >
                  <Send className="h-3.5 w-3.5 text-primary" />
                  Request Access
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <div>
                      <DialogTitle className="text-base font-bold">
                        Request Module Clearance
                      </DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground">
                        Send an access elevation request for {moduleMeta.label}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 py-2 text-xs">
                  {/* Request Preview Box */}
                  <div className="rounded-xl border border-border/70 bg-muted/40 p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Request Summary
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {moduleMeta.label}
                      </Badge>
                    </div>
                    <pre className="text-[11px] text-foreground/90 font-mono whitespace-pre-wrap leading-relaxed bg-background/60 p-2.5 rounded-lg border border-border/40">
                      {requestTemplate}
                    </pre>
                  </div>

                  {/* Optional Note Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-foreground">
                      Add a reason or context (optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Need to review reports for the weekly marketing audit..."
                      value={requestNote}
                      onChange={(e) => setRequestNote(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* Dialog Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyRequest}
                    className="w-full sm:flex-1 h-8 text-xs font-semibold gap-1.5"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied to Clipboard" : "Copy Message"}
                  </Button>

                  <a
                    href={mailtoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:flex-1"
                  >
                    <Button
                      type="button"
                      className="w-full h-8 text-xs font-semibold gap-1.5 shadow-xs"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Email Admin
                    </Button>
                  </a>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Optional Custom Action Slot */}
          {customAction}
        </div>

        {/* Secondary Directory & Roles Link */}
        <div className="mt-4 pt-3 border-t border-border/40 w-full flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <Link
            href="/settings/users/roles"
            className="hover:text-foreground inline-flex items-center gap-1 transition-colors font-medium text-[11px]"
          >
            <span>View Roles & Permissions</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </Link>
          <span className="text-border">•</span>
          <Link
            href="/settings/users"
            className="hover:text-foreground inline-flex items-center gap-1 transition-colors font-medium text-[11px]"
          >
            <span>Workspace Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
