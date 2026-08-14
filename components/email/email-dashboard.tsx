"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Globe,
  PaintBucket,
  Send,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  TrendingUp,
  Shield,
  RefreshCw,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useGetEmailOverview,
  useGetEmailDomain,
} from "@/graphql/actions/email";

/* ── Stat Card ───────────────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <Card className="border-border shadow-none">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className="text-lg font-semibold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Setup Step ──────────────────────────────────────────────────────────── */

function SetupStep({
  step,
  title,
  description,
  status,
  onClick,
}: {
  step: number;
  title: string;
  description: string;
  status: "complete" | "current" | "pending";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 w-full text-left px-3 py-3 rounded-lg border transition-all",
        status === "current"
          ? "border-primary/20 bg-primary/5"
          : "border-border bg-background hover:bg-muted/30",
      )}
    >
      <div
        className={cn(
          "h-7 w-7 rounded-md flex items-center justify-center shrink-0",
          status === "complete"
            ? "bg-emerald-50 text-emerald-600"
            : status === "current"
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
        )}
      >
        {status === "complete" ? (
          <CheckCircle2 className="h-3.5 w-3.5" />
        ) : (
          <span className="text-[10px] font-bold">{step}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">
          {title}
        </p>
        <p className="text-[10px] text-muted-foreground truncate">
          {description}
        </p>
      </div>
      <ArrowRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
    </button>
  );
}

/* ── Quick Link Card ─────────────────────────────────────────────────────── */

function QuickLinkCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-start gap-3 p-4 rounded-lg border border-border bg-background hover:bg-muted/30 transition-all text-left"
    >
      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-foreground">{title}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {description}
        </p>
      </div>
    </button>
  );
}

/* ── Main Dashboard ──────────────────────────────────────────────────────── */

export default function EmailDashboard() {
  const router = useRouter();
  const { data: overviewData, loading: overviewLoading } =
    useGetEmailOverview();
  const { data: emailData, loading: emailLoading } = useGetEmailDomain();
  const domainData = emailData?.getEmailDomain;

  if (overviewLoading || emailLoading || !overviewData) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="h-5 w-5 text-muted-foreground animate-spin" />
      </div>
    );
  }

  const { usage } = overviewData.getEmailOverview;
  const usagePercent = usage.usagePercent;
  const hasDomain = !!domainData;

  const setupSteps = [
    {
      step: 1,
      title: "Confirm Domain",
      description: `Send from @${domainData?.domain || "yourdomain.com"}`,
      route: "/settings/domains",
      status: hasDomain ? "complete" : "current",
    },
    {
      step: 2,
      title: "Design Templates",
      description: "Create branded email layouts",
      route: "/email/templates",
      status: "current",
    },
    {
      step: 3,
      title: "Send Emails",
      description: "Write and send to members",
      route: "/email/send",
      status: "pending",
    },
    {
      step: 4,
      title: "Track Stats",
      description: "Monitor performance",
      route: "/email/usage",
      status: usage.emailsSent > 0 ? "current" : "pending",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-in fade-in duration-500">
      {/* Alert */}
      {usagePercent >= 90 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="text-xs font-semibold flex-1">
            Usage Alert: You have used {Math.round(usagePercent)}% of your email
            quota.
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/email/usage")}
            className="h-7 text-[10px] border-red-200"
          >
            Add Credits
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Sent"
              value={usage.emailsSent.toLocaleString()}
              icon={BarChart3}
            />
            <StatCard
              label="Quota"
              value={usage.numberOfEmailsPerMonth.toLocaleString()}
              icon={TrendingUp}
            />
            <StatCard
              label="Remaining"
              value={usage.remaining.toLocaleString()}
              icon={Clock}
            />
            <Card className="border-border shadow-none">
              <CardContent className="p-4">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Used
                </p>
                <p className="text-lg font-semibold tracking-tight mt-0.5">
                  {Math.round(usagePercent)}%
                </p>
                <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      usagePercent > 90
                        ? "bg-red-500"
                        : usagePercent > 70
                          ? "bg-amber-500"
                          : "bg-foreground",
                    )}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Quick Access
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <QuickLinkCard
                icon={PaintBucket}
                title="Template Studio"
                description="Design and manage layouts"
                onClick={() => router.push("/email/templates")}
              />
              <QuickLinkCard
                icon={Globe}
                title="Domain Settings"
                description="DNS and deliverability"
                onClick={() => router.push("/settings/domains")}
              />
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recent Campaigns
            </h3>
            <Card className="border-border shadow-none">
              <CardContent className="py-10 flex flex-col items-center justify-center text-center">
                {usage.emailsSent === 0 ? (
                  <>
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground mb-3">
                      <Send className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-medium text-foreground">
                      No campaigns yet
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Click "New Campaign" to get started.
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Campaign history coming soon.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <Card className="border-border shadow-none">
            <CardHeader className="px-5 py-4 border-b border-border/50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Setup Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1.5">
              {setupSteps.map((s) => (
                <SetupStep
                  key={s.step}
                  step={s.step}
                  title={s.title}
                  description={s.description}
                  status={s.status as any}
                  onClick={() => router.push(s.route)}
                />
              ))}
            </CardContent>
            <div className="px-5 py-4 border-t border-border/50">
              <div className="flex gap-2 items-start">
                <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Our system automatically handles DKIM, SPF, and DMARC setups
                  for deliverability.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
